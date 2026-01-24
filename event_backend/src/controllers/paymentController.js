const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/supabaseClient');

const initiateEsewaPayment = async (req, res) => {
    try {
        const { amount, serviceCharge, deliveryCharge, taxAmount, eventDetails, userId } = req.body;

        // Ensure values are numbers
        const p_amount = parseFloat(amount) || 0;
        const p_service_charge = parseFloat(serviceCharge) || 0;
        const p_delivery_charge = parseFloat(deliveryCharge) || 0;
        const p_tax_amount = parseFloat(taxAmount) || 0;

        const total_amount = p_amount + p_service_charge + p_delivery_charge + p_tax_amount;

        const transaction_uuid = uuidv4();
        const product_code = process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST';
        const secret_key = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q';

        // 1. SAVE BOOKING TO DB (PENDING)
        if (eventDetails && userId) {
            console.log('Inserting booking for user:', userId);
            const { error } = await supabase
                .from('bookings')
                .insert({
                    user_id: userId,
                    event_title: eventDetails.title,
                    event_date: eventDetails.date,
                    event_location: eventDetails.location,
                    ticket_type: eventDetails.tickets, // Now expects JSON array: [{name, price, quantity}]
                    quantity: eventDetails.count,
                    total_amount: total_amount,
                    transaction_uuid: transaction_uuid,
                    status: 'PENDING'
                });

            if (error) {
                console.error('Supabase Insert Error:', error);
            } else {
                console.log('Booking inserted successfully (PENDING)');
            }
        }

        // Signature Generation
        // Message format: "total_amount=100,transaction_uuid=11-201-13,product_code=EPAYTEST"
        const total_amount_str = total_amount.toString(); // Ensure string
        const signatureString = `total_amount=${total_amount_str},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

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
            transaction_uuid: transaction_uuid,
            product_code: product_code,
            product_service_charge: p_service_charge,
            product_delivery_charge: p_delivery_charge,
            success_url: "http://localhost:5173/payment/success",
            failure_url: "http://localhost:5173/payment/failure",
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

        if (decodedData.status !== 'COMPLETE') {
            return res.status(400).json({ success: false, message: "Payment status not complete" });
        }

        const { error } = await supabase
            .from('bookings')
            .update({ status: 'COMPLETED' })
            .eq('transaction_uuid', decodedData.transaction_uuid);

        if (error) {
            console.error("Database Update Error:", error);
            return res.status(500).json({ success: false, message: "Database update failed" });
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

        const { data, error } = await supabase
            .from('bookings')
            .select('*')
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
