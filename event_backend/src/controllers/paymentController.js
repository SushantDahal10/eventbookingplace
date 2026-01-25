const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/supabaseClient');

const initiateEsewaPayment = async (req, res) => {
    try {
        const { amount, serviceCharge, deliveryCharge, taxAmount, eventId, userId, quantity } = req.body;

        // Ensure values are numbers
        const p_amount = parseFloat(amount) || 0;
        const p_service_charge = parseFloat(serviceCharge) || 0;
        const p_delivery_charge = parseFloat(deliveryCharge) || 0;
        const p_tax_amount = parseFloat(taxAmount) || 0;

        const total_amount = p_amount + p_service_charge + p_delivery_charge + p_tax_amount;
        const price_per_ticket = quantity > 0 ? (p_amount / quantity) : 0;

        // Use transaction_id as per new schema (instead of transaction_uuid)
        const transaction_id = uuidv4();
        const product_code = process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST';
        const secret_key = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q';

        // 1. SAVE BOOKING TO DB (PENDING)
        // Schema: user_id, event_id, quantity, price_per_ticket, total_amount, transaction_id, status
        if (eventId && userId) {
            console.log('Inserting booking for user:', userId, 'Event:', eventId);

            const { error } = await supabase
                .from('bookings')
                .insert({
                    user_id: userId,
                    event_id: eventId,
                    quantity: quantity || 1,
                    price_per_ticket: price_per_ticket,
                    total_amount: total_amount,
                    transaction_id: transaction_id,
                    status: 'pending'
                });

            if (error) {
                console.error('Supabase Insert Error:', error);

                // If the error is UUID format related (mock data sending '1'), we might want to warn
                // but we return failure to frontend
                return res.status(500).json({ success: false, message: "Booking creation failed: " + error.message });
            } else {
                console.log('Booking inserted successfully (pending)');
            }
        } else {
            return res.status(400).json({ success: false, message: "Missing eventId or userId" });
        }

        // Signature Generation
        // Message format: "total_amount=100,transaction_uuid=11-201-13,product_code=EPAYTEST"
        // Note: eSewa might still expect 'transaction_uuid' parameter in the signature string even if our DB col is transaction_id
        // We will map transaction_id -> transaction_uuid for eSewa API compatibility
        const total_amount_str = total_amount.toString();
        const signatureString = `total_amount=${total_amount_str},transaction_uuid=${transaction_id},product_code=${product_code}`;

        console.log('--- eSewa Signature Debug ---');
        console.log(`Signature String: '${signatureString}'`);

        const hash = crypto.createHmac('sha256', secret_key)
            .update(signatureString)
            .digest('base64');

        console.log(`Generated Signature: '${hash}'`);
        console.log('-----------------------------');

        const paymentData = {
            amount: p_amount,
            tax_amount: p_tax_amount,
            total_amount: total_amount_str,
            transaction_uuid: transaction_id,
            product_code: product_code,
            product_service_charge: p_service_charge,
            product_delivery_charge: p_delivery_charge,
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
        console.error("eSewa Error:", error);
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
            // New schema: Join `users` and `events`
            const { data: booking, error: fetchError } = await supabase
                .from('bookings')
                .select(`
                    *,
                    users ( email, full_name ),
                    events ( title, event_date, location )
                `)
                .eq('transaction_id', decodedData.transaction_uuid)
                .single();

            if (!fetchError && booking) {
                console.log("--- Email Data Extraction ---");
                console.log("Booking ID:", booking.id);
                console.log("Registered User:", booking.users?.email);

                const emailService = require('../services/emailService');

                // Construct data structure expected by emailService
                const userName = booking.users?.full_name || "Valued Customer";
                // Phone is not in User/Booking table in new schema, leave empty
                const userPhone = "";

                // Construct pseudo-ticket list
                const tickets = [{
                    name: "Event Ticket", // Generic name as we don't have ticket types
                    price: booking.price_per_ticket,
                    quantity: booking.quantity
                }];

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
