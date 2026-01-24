const { createClient } = require('@supabase/supabase-js');
// require('dotenv').config(); // Loaded in server.js

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log('--- Supabase Client Init ---');
console.log('Supabase URL:', supabaseUrl);  // Debug log to confirm it's loaded
console.log('----------------------------');

if (!supabaseUrl || !supabaseKey) {
    console.error('Initial Supabase connection check: Missing SUPABASE_URL or SUPABASE_KEY variable.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
