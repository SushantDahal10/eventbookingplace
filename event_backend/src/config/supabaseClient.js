const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Initial Supabase connection check: Missing SUPABASE_URL or SUPABASE_KEY variable.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
