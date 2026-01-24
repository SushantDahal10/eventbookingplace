require('dotenv').config();
const app = require('./src/app');
const supabase = require('./src/config/supabaseClient');
const port = process.env.PORT || 5000;
const cleanupInterval = process.env.OTP_CLEANUP_INTERVAL_MS || 3600000; // 1 hour

// Periodic Cleanup Job
setInterval(async () => {
    try {
        const { error } = await supabase
            .from('otps')
            .delete()
            .lt('expires_at', new Date().toISOString());

        if (error) console.error('Cleanup Job Error:', error.message);
        else console.log('[JOB] Cleaned up expired OTPs');
    } catch (err) {
        console.error('Cleanup Job Failed:', err);
    }
}, cleanupInterval);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
