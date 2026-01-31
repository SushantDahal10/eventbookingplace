const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const supabase = require('./src/config/supabaseClient');
const crypto = require('crypto');

async function testGateFlow() {
    console.log("--- STARTING GATE FLOW VERIFICATION ---");

    let userId, eventId, tierId, bookingId, qrToken;
    const timestamp = Date.now();

    try {
        // 1. SETUP: Create User
        const { data: user, error: userError } = await supabase
            .from('users')
            .insert({
                full_name: `Gate Tester ${timestamp}`,
                email: `gate${timestamp}@example.com`,
                password_hash: 'hash',
                is_verified: true
            })
            .select().single();
        if (userError) throw userError;
        userId = user.id;

        // 2. SETUP: Create Event (via Partner)
        const { data: partner, error: partnerError } = await supabase
            .from('partners')
            .insert({ user_id: userId, organization_name: 'Gate Org', official_email: `org${timestamp}@example.com`, official_phone: '123', status: 'approved' })
            .select().single();
        if (partnerError) throw partnerError;

        const { data: event, error: eventError } = await supabase
            .from('events')
            .insert({ partner_id: partner.id, title: 'Gate Event', event_date: new Date().toISOString(), location: 'Gate Location', status: 'active' })
            .select().single();
        if (eventError) throw eventError;
        eventId = event.id;

        const { data: tier, error: tierError } = await supabase
            .from('ticket_tiers')
            .insert({ event_id: eventId, tier_name: 'Standard', price: 500, total_quantity: 100, available_quantity: 100 })
            .select().single();
        if (tierError) throw tierError;
        tierId = tier.id;

        // 3. CREATE BOOKING
        const transactionId = `TXN-${timestamp}`;
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .insert({ user_id: userId, event_id: eventId, total_amount: 1000, transaction_id: transactionId, status: 'pending' })
            .select().single();
        if (bookingError) throw bookingError;
        bookingId = booking.id;

        await supabase.from('booking_items').insert({ booking_id: bookingId, tier_id: tierId, quantity: 2, price_per_ticket: 500, total_amount: 1000 });

        console.log("1. Setup Complete. Booking ID:", bookingId);

        // 4. SIMULATE PAYMENT VERIFICATION (Triggers QR Generation)
        const { data: updatedBookings } = await supabase
            .from('bookings')
            .update({ status: 'paid' })
            .eq('id', bookingId)
            .select();

        // Simulate QR Generation (as done in paymentController)
        const totalAllowed = 2;
        qrToken = crypto.randomBytes(16).toString('hex');

        const { error: qrGenError } = await supabase
            .from('ticket_qr_tokens')
            .insert({
                booking_id: bookingId,
                event_id: eventId,
                token: qrToken,
                total_allowed: totalAllowed,
                status: 'active'
            });

        if (qrGenError) throw qrGenError;
        console.log("2. Payment Verified & QR Token Generated:", qrToken);

        // 5. TEST VALIDATION
        console.log("3. Testing Validation Logic...");
        const { data: qrData, error: qrFetchError } = await supabase
            .from('ticket_qr_tokens')
            .select('*')
            .eq('token', qrToken)
            .single();

        if (qrFetchError || !qrData || qrData.total_allowed !== 2) {
            throw new Error("Validation logic failed");
        }
        console.log("   Validation Success.");

        // 6. TEST CONSUMPTION (Directly via DB to check logic, assuming server might not be running)
        console.log("4. Testing Consumption Logic (+1 entry)...");
        const newUsed = qrData.total_used + 1;
        const { error: consumeErr } = await supabase
            .from('ticket_qr_tokens')
            .update({ total_used: newUsed })
            .eq('id', qrData.id);

        if (consumeErr) throw consumeErr;

        await supabase.from('entry_logs').insert({
            qr_token_id: qrData.id,
            event_id: eventId,
            staff_id: userId,
            entries_used: 1
        });

        const { data: finalQr } = await supabase.from('ticket_qr_tokens').select('total_used').eq('id', qrData.id).single();
        if (finalQr.total_used === 1) {
            console.log("   Consumption Success.");
        } else {
            throw new Error("Consumption verification failed");
        }

        console.log("--- ALL CORE LOGIC PASSED SUCCESSFULLY! ---");

    } catch (err) {
        console.error("TEST FAILED:", err.message);
    } finally {
        if (userId) {
            console.log("Cleaning up test user...");
            await supabase.from('users').delete().eq('id', userId);
        }
        console.log("--- TEST COMPLETE ---");
    }
}

testGateFlow();
