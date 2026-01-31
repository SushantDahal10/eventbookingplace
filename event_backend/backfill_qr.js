const supabase = require('./src/config/supabaseClient');

/**
 * BACKFILL SCRIPT
 * Run this once to generate QR tokens for all existing PAID bookings.
 */
async function backfillQR() {
    console.log("Starting backfill...");

    // 1. Fetch all paid bookings that don't have a QR token yet
    const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
            id, transaction_id, event_id,
            booking_items ( quantity )
        `)
        .eq('status', 'paid');

    if (error) {
        console.error("Fetch error:", error);
        return;
    }

    console.log(`Found ${bookings.length} paid bookings. Checking for missing tokens...`);

    for (const booking of bookings) {
        // Check if token exists
        const { data: existing } = await supabase
            .from('ticket_qr_tokens')
            .select('id')
            .eq('booking_id', booking.id)
            .single();

        if (!existing) {
            const totalAllowed = booking.booking_items.reduce((sum, item) => sum + item.quantity, 0);

            const { error: insError } = await supabase
                .from('ticket_qr_tokens')
                .insert({
                    booking_id: booking.id,
                    event_id: booking.event_id,
                    token: booking.transaction_id,
                    total_allowed: totalAllowed,
                    status: 'active'
                });

            if (insError) {
                console.error(`Error inserting for booking ${booking.id}:`, insError.message);
            } else {
                console.log(`Generated token for Booking: ${booking.transaction_id}`);
            }
        }
    }

    console.log("Backfill complete!");
}

backfillQR();
