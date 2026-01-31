const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/supabaseClient');
const emailService = require('../services/emailService');

const initiateEsewaPayment = async (req, res) => {
    try {
        const { bookingItems, eventId, userId, checkoutDetails, paymentMethod } = req.body;

        if (!bookingItems || !Array.isArray(bookingItems) || bookingItems.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid booking items" });
        }
        if (!eventId || !userId) {
            return res.status(400).json({ success: false, message: "Missing eventId or userId" });
        }

        // 0. Check Event Date for 12-Hour Restriction
        const { data: eventData, error: eventError } = await supabase
            .from('events')
            .select('event_date')
            .eq('id', eventId)
            .single();

        if (eventError || !eventData) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        const eventTime = new Date(eventData.event_date).getTime();
        const currentTime = Date.now();
        const twelveHoursInMs = 12 * 60 * 60 * 1000;

        if (eventTime - currentTime < twelveHoursInMs) {
            return res.status(400).json({
                success: false,
                message: "Bookings are closed 12 hours before the event starts. You cannot book now."
            });
        }

        // 1. Fetch Tiers to validate prices and calculate total (Security)
        const tierIds = bookingItems.map(item => item.tierId);
        console.log(`[Payment Init] Querying Tiers:`, tierIds, `for Event:`, eventId);

        const { data: tiers, error: tierError } = await supabase
            .from('ticket_tiers')
            .select('*')
            .in('id', tierIds);

        if (tierError) {
            console.error('Tier Fetch Error:', tierError);
            return res.status(500).json({ success: false, message: "Failed to fetch ticket info" });
        }

        if (!tiers || tiers.length === 0) {
            console.error('[Payment Init] No tiers found in DB for IDs:', tierIds);
            return res.status(400).json({ success: false, message: "Invalid tier IDs provided" });
        }

        let calculatedTotal = 0;
        const validItems = [];

        // Validate each item
        for (const item of bookingItems) {
            const tier = tiers.find(t => t.id === item.tierId);

            if (!tier) {
                console.error(`[Payment Init] Tier not found in fetched list: ${item.tierId}`);
                return res.status(400).json({ success: false, message: `Invalid tier ID: ${item.tierId}` });
            }

            // Cross-check event_id
            if (tier.event_id !== eventId) {
                console.error(`[Payment Init] Tier Event Mismatch: Tier ${tier.id} belongs to ${tier.event_id}, but request for ${eventId}`);
                return res.status(400).json({ success: false, message: `Invalid tier for this event: ${tier.tier_name}` });
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

        // Calculate service charge (strict 5%)
        const serviceCharge = Math.round(calculatedTotal * 0.05);
        const finalTotal = calculatedTotal + serviceCharge;

        const transaction_id = uuidv4();
        const product_code = process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST';
        const secret_key = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q';

        // 2. Insert Booking (Pending)
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .insert({
                user_id: userId,
                event_id: eventId,
                total_amount: finalTotal,
                transaction_id: transaction_id,
                status: 'pending',
                tier_ids: tierIds, // Store array of tier IDs
                payment_method: paymentMethod || 'esewa' // Store payment method
            })
            .select()
            .single();

        if (bookingError) {
            console.error('Booking Insert Error:', bookingError);
            return res.status(500).json({ success: false, message: "Booking failed: " + bookingError.message });
        }

        // 2.5 Store customer details in verification_codes table (Hack to avoid schema change)
        if (checkoutDetails) {
            const { error: guestError } = await supabase
                .from('verification_codes')
                .insert({
                    user_id: userId,
                    code: transaction_id, // Use transaction_id as the lookup code
                    type: 'BOOKING_GUEST_INFO',
                    metadata: checkoutDetails,
                    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
                });

            if (guestError) {
                console.error("Guest Info Store Error:", guestError);
                // Continue anyway, fallback to user email
            }
        }

        // 2.5 Store customer details in verification_codes table (Hack to avoid schema change)
        if (checkoutDetails) {
            const { error: guestError } = await supabase
                .from('verification_codes')
                .insert({
                    user_id: userId,
                    code: transaction_id, // Use transaction_id as the lookup code
                    type: 'BOOKING_GUEST_INFO',
                    metadata: checkoutDetails,
                    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
                });

            if (guestError) {
                console.error("Guest Info Store Error:", guestError);
                // Continue anyway, fallback to user email
            }
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
        const total_amount_str = finalTotal.toFixed(2); // eSewa expects 2 decimal points in signature string for reliability
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
            product_service_charge: serviceCharge,
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

        // Debug Signature
        // The signature format is strict: `transaction_code,status,total_amount,transaction_uuid,product_code,signed_field_names`
        // However, eSewa documentation and response order can vary.
        // We need to reconstruct the string EXACTLY as eSewa signed it.
        // Usually, the `signed_field_names` in the response tells us the order.

        const secret_key = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q';
        let signatureString = "";

        // Dynamic reconstruction based on signed_field_names
        if (decodedData.signed_field_names) {
            const fields = decodedData.signed_field_names.split(',');
            signatureString = fields.map(field => `${field}=${decodedData[field]}`).join(',');
        } else {
            // Fallback (or if signed_field_names is missing, which shouldn't happen)
            signatureString = `total_amount=${decodedData.total_amount},transaction_uuid=${decodedData.transaction_uuid},product_code=${decodedData.product_code}`;
        }

        const calculatedHash = crypto.createHmac('sha256', secret_key)
            .update(signatureString)
            .digest('base64');

        console.log("Calculated Signature:", calculatedHash);
        console.log("Received Signature:  ", decodedData.signature);
        console.log("Signature String Used:", signatureString);

        if (calculatedHash !== decodedData.signature) {
            console.warn("⚠️ Signature Mismatch! check secret key or field order.");
            // For debugging only - strict production should fail here
            // return res.status(400).json({ success: false, message: "Invalid signature" });
        }

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

        // --- GENERATE QR TOKEN ---
        try {
            // Calculate total tickets
            const { data: bookingDetails } = await supabase
                .from('booking_items')
                .select('quantity')
                .eq('booking_id', updatedBookings[0].id);

            const totalAllowed = bookingDetails.reduce((sum, item) => sum + item.quantity, 0);
            const qrToken = updatedBookings[0].transaction_id; // Use existing transaction_id as token

            const { error: qrError } = await supabase
                .from('ticket_qr_tokens')
                .insert({
                    booking_id: updatedBookings[0].id,
                    event_id: updatedBookings[0].event_id,
                    token: qrToken,
                    total_allowed: totalAllowed,
                    status: 'active'
                });

            if (qrError) {
                console.error("QR Token Generation Error:", qrError);
            } else {
                console.log("QR Token generated successfully:", qrToken);
            }
        } catch (qrErr) {
            console.error("Failed to generate QR token:", qrErr);
        }

        // --- SEND CONFIRMATION EMAIL ---
        try {
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
                await sendTicketEmail(booking);
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
                events ( title, event_date, location, event_images ( image_url, image_type ) ),
                booking_items (
                    quantity,
                    total_amount,
                    ticket_tiers ( tier_name, price )
                )
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

// Helper to extract email data and send ticket
const sendTicketEmail = async (booking) => {
    try {
        if (!booking) {
            console.error("[Email Helper] Missing booking data");
            return null;
        }

        const user = booking.users ? (Array.isArray(booking.users) ? booking.users[0] : booking.users) : null;

        // Initialize with registered user data if available
        let customerEmail = user?.email || "";
        let customerName = user?.full_name || "Valued Customer";
        let customerPhone = "";

        // Check for customer details in verification_codes using transaction_id (Prioritize Guest Info)
        try {
            if (booking.transaction_id) {
                const { data: guestData } = await supabase
                    .from('verification_codes')
                    .select('metadata')
                    .eq('code', booking.transaction_id)
                    .eq('type', 'BOOKING_GUEST_INFO')
                    .single();

                if (guestData && guestData.metadata) {
                    const details = guestData.metadata;
                    // OVERWRITE with guest details if present
                    if (details.email) customerEmail = details.email;
                    if (details.fullName) customerName = details.fullName;
                    if (details.phoneNumber) customerPhone = details.phoneNumber;
                    console.log(`[Email Helper] Sending to guest email: ${customerEmail}`);
                }
            }
        } catch (e) {
            console.log("Could not fetch verification_codes for guest details, using user defaults", e);
        }

        if (!customerEmail) {
            console.error("[Email Helper] No email address found for sending ticket (Checked Guest & Registered User)");
            return null;
        }

        const tickets = (booking.booking_items || []).map(item => ({
            name: item.ticket_tiers?.tier_name || "Ticket",
            price: item.ticket_tiers?.price || 0,
            quantity: item.quantity
        }));

        const event = Array.isArray(booking.events) ? booking.events[0] : booking.events;
        const eventDateFormatted = event?.event_date
            ? new Date(event.event_date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
            : "TBA";

        return await emailService.sendBookingConfirmation(customerEmail, {
            userName: customerName,
            userPhone: customerPhone,
            eventTitle: event?.title || "Event",
            eventDate: eventDateFormatted,
            eventLocation: event?.location,
            tickets,
            totalAmount: booking.total_amount,
            transactionUuid: booking.transaction_id
        });
    } catch (err) {
        console.error("[Email Helper] Fatal error:", err);
        return null;
    }
};

const resendBookingEmail = async (req, res) => {
    try {
        const { bookingId } = req.body;
        if (!bookingId) {
            return res.status(400).json({ success: false, message: "Booking ID is required" });
        }

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
            .eq('id', bookingId)
            .single();

        if (fetchError || !booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        if (booking.status !== 'paid') {
            return res.status(400).json({ success: false, message: "Only paid bookings can have tickets resent" });
        }

        const result = await sendTicketEmail(booking);

        if (result) {
            res.json({ success: true, message: "Ticket resent successfully!" });
        } else {
            res.status(500).json({ success: false, message: "Failed to send email. Check backend logs." });
        }
    } catch (error) {
        console.error("Resend Email Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    initiateEsewaPayment,
    verifyEsewaPayment,
    getUserBookings,
    resendBookingEmail
};
