const supabase = require('../config/supabaseClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const emailService = require('../services/emailService');

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const OTP_EXPIRY_MINUTES = 10;

// Helper to generate 6 digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // 1. Check if user exists
        const { data: existingUser, error: checkError } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // 2. Hash Password
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        // 3. Create User (Unverified)
        const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert([
                { full_name: fullName, email, password_hash: passwordHash, is_verified: false }
            ])
            .select()
            .single();

        if (createError) throw createError;

        // 4. Generate OTP
        const otpCode = generateOTP();
        const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000).toISOString();

        // 5. Cleanup & Save OTP
        // First delete any existing OTPs for this email to save space (Cleanup)
        await supabase.from('otps').delete().eq('email', email);

        const { error: otpError } = await supabase
            .from('otps')
            .insert([
                {
                    user_id: newUser.id,
                    email: email,
                    code: otpCode,
                    purpose: 'verification',
                    expires_at: expiresAt
                }
            ]);

        if (otpError) throw otpError;

        // Send OTP via email
        await emailService.sendOTP(email, otpCode);

        res.status(201).json({
            message: 'Registration successful. OTP sent to your email.',
            userId: newUser.id
        });

    } catch (err) {
        console.error('Register Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }

        // 1. Check OTP in database
        const { data: otpRecord, error: otpFetchError } = await supabase
            .from('otps')
            .select('*')
            .eq('email', email)
            .eq('code', otp)
            .eq('purpose', 'verification')
            .gt('expires_at', new Date().toISOString()) // Check expiry
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (otpFetchError || !otpRecord) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        // 2. Mark User as Verified
        const { error: updateUserError } = await supabase
            .from('users')
            .update({ is_verified: true })
            .eq('email', email);

        if (updateUserError) throw updateUserError;

        // 3. Delete OTP (Used)
        await supabase.from('otps').delete().eq('id', otpRecord.id);

        res.status(200).json({ message: 'Email verified successfully. You can now login.' });

    } catch (err) {
        console.error('Verify OTP Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find User
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (userError || !user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // 2. Check Password
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // 3. Check Verification
        if (!user.is_verified) {
            return res.status(403).json({ error: 'Email not verified. Please verify your account.' });
        }

        // 4. Generate JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: 'user' }, // Role mock for now
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // 5. Set Cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in prod
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            message: 'Login successful',
            user: { id: user.id, fullName: user.full_name, email: user.email }
        });

    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        // 1. Check if user exists
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (userError || !user) {
            // Security: Don't reveal if user exists. Fake success or generic message.
            // But for dev, we can return success.
            return res.status(200).json({ message: 'If account exists, OTP sent.' });
        }

        // 2. Cleanup old reset OTPs
        await supabase.from('otps').delete().eq('email', email).eq('purpose', 'password_reset');

        // 3. Generate & Save OTP
        const otpCode = generateOTP();
        const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000).toISOString();

        const { error: otpError } = await supabase
            .from('otps')
            .insert([
                {
                    user_id: user.id,
                    email: email,
                    code: otpCode,
                    purpose: 'password_reset',
                    expires_at: expiresAt
                }
            ]);

        if (otpError) throw otpError;

        // 4. Send Email
        await emailService.sendPasswordResetOTP(email, otpCode);

        res.status(200).json({ message: 'Password reset OTP sent to your email.' });

    } catch (err) {
        console.error('Forgot Password Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }

        // 1. Verify OTP
        const { data: otpRecord, error: otpFetchError } = await supabase
            .from('otps')
            .select('*')
            .eq('email', email)
            .eq('code', otp)
            .eq('purpose', 'password_reset')
            .gt('expires_at', new Date().toISOString())
            .single();

        if (otpFetchError || !otpRecord) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        // 2. Hash New Password
        const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

        // 3. Update User Password
        const { error: updateError } = await supabase
            .from('users')
            .update({ password_hash: passwordHash })
            .eq('email', email);

        if (updateError) throw updateError;

        // 4. Cleanup used OTP
        await supabase.from('otps').delete().eq('id', otpRecord.id);

        res.status(200).json({ message: 'Password reset successfully. You can now login.' });

    } catch (err) {
        console.error('Reset Password Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id, is_verified')
            .eq('email', email)
            .single();

        if (userError || !user) return res.status(404).json({ error: 'User not found' });
        if (user.is_verified) return res.status(400).json({ error: 'Email already verified' });

        // Cleanup & Generate
        await supabase.from('otps').delete().eq('email', email).eq('purpose', 'verification');

        const otpCode = generateOTP();
        const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000).toISOString();

        const { error: otpError } = await supabase
            .from('otps')
            .insert([{
                user_id: user.id,
                email: email,
                code: otpCode,
                purpose: 'verification',
                expires_at: expiresAt
            }]);

        if (otpError) throw otpError;

        await emailService.sendOTP(email, otpCode);
        res.status(200).json({ message: 'New OTP sent to your email.' });

    } catch (err) {
        console.error('Resend OTP Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
