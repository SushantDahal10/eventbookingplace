const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const supabase = require('./src/config/supabaseClient');

async function testBookingFlow() {
    console.log("--- STARTING BOOKING FLOW VERIFICATION ---");

    // 1. SETUP: Create User, Event, Tier
    let userId, eventId, tierId;
    const timestamp = Date.now();

    try {
        // Create User
        const { data: user, error: userError } = await supabase
            .from('users')
            .insert({
                full_name: `Test User ${timestamp}`,
                email: `test${timestamp}@example.com`,
                password_hash: 'hash',
                is_verified: true
            })
            .select()
            .single();

        if (userError) throw new Error("User creation failed: " + userError.message);
        userId = user.id;
        console.log("1. Created User:", userId);

        // Create Partner (needed for event)
        const { data: partner, error: partnerError } = await supabase
            .from('partners')
            .insert({
                user_id: userId,
                organization_name: `Test Org ${timestamp}`,
                official_email: `org${timestamp}@example.com`,
                official_phone: '1234567890',
                status: 'approved'
            })
            .select()
            .single();

        if (partnerError) throw new Error("Partner creation failed: " + partnerError.message);
        console.log("2. Created Partner:", partner.id);

        // Create Event
        const { data: event, error: eventError } = await supabase
            .from('events')
            .insert({
                partner_id: partner.id,
                title: `Test Event ${timestamp}`,
                event_date: new Date().toISOString(),
                location: 'Test Location',
                tags: ['Sports', 'Futsal'],
                status: 'active'
            })
            .select()
            .single();

        if (eventError) throw new Error("Event creation failed: " + eventError.message);
        eventId = event.id;
        console.log("3. Created Event:", eventId);

        // Create Ticket Tier
        const { data: tier, error: tierError } = await supabase
            .from('ticket_tiers')
            .insert({
                event_id: eventId,
                tier_name: 'VIP',
                price: 1000,
                total_quantity: 10,
                available_quantity: 10
            })
            .select()
            .single();

        if (tierError) throw new Error("Tier creation failed: " + tierError.message);
        tierId = tier.id;
        console.log("4. Created Tier:", tierId);

        // Create Event Images
        const { error: imageError } = await supabase
            .from('event_images')
            .insert([
                { event_id: eventId, image_url: 'http://test.com/cover.jpg', image_type: 'cover' },
                { event_id: eventId, image_url: 'http://test.com/gallery1.jpg', image_type: 'gallery' }
            ]);

        if (imageError) throw new Error("Image creation failed: " + imageError.message);
        console.log("4.5. Created Images");

        // 2. TEST API: Get Event Details (Verify Images)
        console.log("5. Calling API GET /api/events/" + eventId);
        const eventResponse = await fetch('http://localhost:5000/api/events/' + eventId);
        const eventData = await eventResponse.json();

        if (eventData.success && eventData.event.event_images.length > 0) {
            console.log("GET Event Success. Images found:", eventData.event.event_images.length);
        } else {
            console.error("GET Event Failed or No Images:", eventData);
        }

        // 3. TEST API: Initiate Payment
        console.log("6. Calling API /api/payment/esewa/initiate...");
        const payload = {
            bookingItems: [
                { tierId: tierId, quantity: 2 }
            ],
            eventId: eventId,
            userId: userId
        };

        const response = await fetch('http://localhost:5000/api/payment/esewa/initiate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.success) {
            console.log("API Success:", data);

            // 3. VERIFY DB
            const { data: booking, error: fetchBookingError } = await supabase
                .from('bookings')
                .select('*, booking_items(*)')
                .eq('transaction_id', data.paymentData.transaction_uuid)
                .single();

            if (fetchBookingError) throw new Error("Fetch booking failed: " + fetchBookingError.message);

            console.log("6. Verified Booking in DB:", booking.id);
            console.log("   Total Amount:", booking.total_amount);
            console.log("   Items:", booking.booking_items.length);

            if (booking.total_amount == 2000 && booking.booking_items.length === 1) {
                console.log("SUCCESS: Test Passed!");
            } else {
                console.error("FAILURE: Data mismatch");
            }

        } else {
            console.error("API Failed:", data);
        }

    } catch (error) {
        console.error("TEST FAILED:", error.message);
    } finally {
        // Cleanup
        if (userId) await supabase.from('users').delete().eq('id', userId); // Cascade deletes logic? No, check schema.
        // Schema says:
        // partners ref users ON DELETE CASCADE
        // events ref partners ON DELETE CASCADE
        // tiers ref events ON DELETE CASCADE
        // bookings ref users ON DELETE CASCADE
        // So deleting USERS should clean up everything for this user.
        console.log("--- CLEANUP COMPLETE ---");
    }
}

testBookingFlow();
