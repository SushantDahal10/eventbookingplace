require('dotenv').config();
const supabase = require('./src/config/supabaseClient');

async function getBooking() {
    const { data, error } = await supabase
        .from('bookings')
        .select('id, user_id, status')
        .limit(1);

    if (error) console.error('Error:', error);
    else console.log('Booking:', data);
}

getBooking();
