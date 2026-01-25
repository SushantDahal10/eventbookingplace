const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/supabaseClient');

const initiateEsewaPayment = async (req, res) => {
    try {
        const { bookingItems, eventId, userId } = req.body;

        if (!bookingItems || !Array.isArray(bookingItems) || bookingItems.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid booking items" });
        }
        if (!eventId || !userId) {
            return res.status(400).json({ success: false, message: "Missing eventId or userId" });
        }

        // 1. Fetch Tiers to validate prices and calculate total (Security)
        const tierIds = bookingItems.map(item => item.tierId);
        const { data: tiers, error: tierError } = await supabase
            .from('ticket_tiers')
            .select('*')
            .in('id', tierIds)
            .eq('event_id', eventId);

        if (tierError || !tiers) {
            return res.status(500).json({ success: false, message: "Failed to fetch ticket info" });
        }

        let calculatedTotal = 0;
        const validItems = [];

        // Validate each item
        for (const item of bookingItems) {
            const tier = tiers.find(t => t.id === item.tierId);
            if (!tier) {
                return res.status(400).json({ success: false, message: `Invalid tier ID: ${item.tierId}` });
            }
            if (tier.available_quantity < item.quantity) {
                return res.status(400).json({ success: false, message: `Not enough tickets for ${tier.tier_name}` });
            }

            const itemTotal = Number(tier.price) * item.quantity;
            calculatedTotal += itemTotal;

            validItems.push({
                tier_id: tier.id,
                quantity: item.quantity,
                price_per_ticket: tier.price,
                total_amount: itemTotal
            });
        }

        // Add service charge (mock logic, adjust as needed)
        // const serviceCharge = calculatedTotal * 0.05; // Example 5%
        // calculatedTotal += serviceCharge; 
        // For simplicity, let's say frontend passed total includes fees, but we should recalculate strict base.
        // We will stick to base ticket cost for now as strict total. 
        // If you need fees, add them here.

        const transaction_id = uuidv4();
        const product_code = process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST';
        const secret_key = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q';

        // 2. Insert Booking (Pending)
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .insert({
                user_id: userId,
                event_id: eventId,
                total_amount: calculatedTotal,
                transaction_id: transaction_id,
                status: 'pending'
            })
            .select()
            .single();

        if (bookingError) {
            console.error('Booking Insert Error:', bookingError);
            return res.status(500).json({ success: false, message: "Booking failed: " + bookingError.message });
        }

        // 3. Insert Booking Items
        const itemsToInsert = validItems.map(item => ({
            booking_id: booking.id,
            ...item
        }));

        const { error: itemsError } = await supabase
            .from('booking_items')
            .insert(itemsToInsert);

        if (itemsError) {
            console.error('Booking Items Insert Error:', itemsError);
            // Cleanup: delete booking if items fail (optional but good practice)
            await supabase.from('bookings').delete().eq('id', booking.id);
            return res.status(500).json({ success: false, message: "Booking items failed: " + itemsError.message });
        }

        // 4. Generate Signature
        const total_amount_str = calculatedTotal.toString();
        const signatureString = `total_amount=${total_amount_str},transaction_uuid=${transaction_id},product_code=${product_code}`;

        const hash = crypto.createHmac('sha256', secret_key)
            .update(signatureString)
            .digest('base64');

        const paymentData = {
            amount: calculatedTotal,
            tax_amount: 0,
            total_amount: total_amount_str,
            transaction_uuid: transaction_id,
            product_code: product_code,
            product_service_charge: 0,
            product_delivery_charge: 0,
            success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/success`,
            failure_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/failure`,
            signed_field_names: "total_amount,transaction_uuid,product_code",
            signature: hash,
        };

        res.json({
            success: true,
            paymentData
        });

    } catch (error) {
        console.error("eSewa Init Error:", error);
        res.status(500).json({ success: false, message: "Failed to initiate payment" });
    }
};

const verifyEsewaPayment = async (req, res) => {
    try {
        const { encodedData } = req.body;

        if (!encodedData) {
            return res.status(400).json({ success: false, message: "Missing encoded data" });
        }

        const decodedString = Buffer.from(encodedData, 'base64').toString('utf-8');
        const decodedData = JSON.parse(decodedString);

        console.log("--- eSewa Verify Debug ---");
        console.log("Decoded Data:", decodedData);
        // decodedData.transaction_uuid maps to our transaction_id

        if (decodedData.status !== 'COMPLETE') {
            return res.status(400).json({ success: false, message: "Payment status not complete" });
        }

        // Atomic update: Only update if status is NOT already paid
        // Schema status check: ('pending','paid','cancelled','refunded')
        const { data: updatedBookings, error } = await supabase
            .from('bookings')
            .update({ status: 'paid' })
            .eq('transaction_id', decodedData.transaction_uuid)
            .neq('status', 'paid')
            .select();

        if (error) {
            console.error("Database Update Error:", error);
            return res.status(500).json({ success: false, message: "Database update failed: " + error.message });
        }

        // If no rows were updated, it means it was already paid (or not found)
        if (!updatedBookings || updatedBookings.length === 0) {
            console.log("Booking already paid or not found, skipping email.");
            return res.json({ success: true, message: "Payment already processed" });
        }

        // --- SEND CONFIRMATION EMAIL ---
        try {
            // Fetch booking details with user email AND event details
            // New schema: Join `users`, `events`, and `booking_items`
            const { data: booking, error: fetchError } = await supabase
                .from('bookings')
                .select(`
                    *,
                    users ( email, full_name ),
                    events ( title, event_date, location ),
                    booking_items (
                        quantity,
                        total_amount,
                        ticket_tiers ( tier_name, price )
                    )
                `)
                .eq('transaction_id', decodedData.transaction_uuid)
                .single();

            if (!fetchError && booking) {
                console.log("--- Email Data Extraction ---");
                console.log("Booking ID:", booking.id);
                console.log("Registered User:", booking.users?.email);

                const emailService = require('../services/emailService');

                const userName = booking.users?.full_name || "Valued Customer";
                const userPhone = "";

                // Construct pseudo-ticket list from booking_items
                const tickets = booking.booking_items.map(item => ({
                    name: item.ticket_tiers?.tier_name || "Ticket",
                    price: item.ticket_tiers?.price || 0,
                    quantity: item.quantity
                }));

                const emailResult = await emailService.sendBookingConfirmation(booking.users.email, {
                    userName,
                    userPhone,
                    eventTitle: booking.events?.title || "Event",
                    eventDate: booking.events?.event_date,
                    eventLocation: booking.events?.location,
                    tickets,
                    totalAmount: booking.total_amount,
                    transactionUuid: booking.transaction_id
                });

                if (emailResult) {
                    console.log("SUCCESS: Booking confirmation email sent.");
                } else {
                    console.error("FAILURE: emailService returned null.");
                }
            } else {
                console.warn("Could not fetch booking details for email:", fetchError);
            }
        } catch (emailErr) {
            console.error("Failed to send confirmation email:", emailErr);
        }

        res.json({ success: true, message: "Payment verified and booking confirmed" });

    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ success: false, message: "Verification failed" });
    }
};

const getUserBookings = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        // Fetch bookings with event details
        const { data, error } = await supabase
            .from('bookings')
            .select(`
                *,
                events ( title, event_date, location )
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Fetch Bookings Error:", error);
            return res.status(500).json({ success: false, message: "Failed to fetch bookings" });
        }

        res.json({ success: true, bookings: data });

    } catch (error) {
        console.error("Get Bookings Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    initiateEsewaPayment,
    verifyEsewaPayment,
    getUserBookings
};
