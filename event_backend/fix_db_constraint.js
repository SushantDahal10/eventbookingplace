const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const supabase = require('./src/config/supabaseClient');

const runMigration = async () => {
    try {
        const { error } = await supabase.rpc('run_sql', {
            sql: `
        ALTER TABLE otps DROP CONSTRAINT IF EXISTS otps_purpose_check;
        ALTER TABLE otps ADD CONSTRAINT otps_purpose_check CHECK (purpose = ANY (ARRAY['verification'::text, 'reset'::text, 'email_change'::text]));
      `
        });

        // Fallback if RPC not enabled/available: try direct query if user has privileges (unlikely for DDL but worth try or just log "Use Supabase UI")
        // Actually, usually Supabase JS client doesn't allow raw SQL unless via RPC.

        if (error) {
            console.error('RPC Error:', error);
            console.log("If RPC is not enabled, please run this SQL in your Supabase Dashboard SQL Editor:");
            console.log(`
        ALTER TABLE otps DROP CONSTRAINT IF EXISTS otps_purpose_check;
        ALTER TABLE otps ADD CONSTRAINT otps_purpose_check CHECK (purpose = ANY (ARRAY['verification'::text, 'reset'::text, 'email_change'::text]));
        `);
        } else {
            console.log('Migration successful via RPC!');
        }
    } catch (err) {
        console.error('Migration failed:', err);
    }
};

runMigration();
