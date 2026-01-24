const supabase = require('../config/supabaseClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const emailService = require('../services/emailService');

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const OTP_EXPIRY_MINUTES = 10;

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * REGISTER (Email + Password + OTP)
 */
exports.register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if user already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        // Instead of creating user, we create a signup session token
        const signupToken = jwt.sign(
            { fullName, email, passwordHash },
            JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Generate OTP
        const otpCode = generateOTP();
        const expiresAt = new Date(
            Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
        ).toISOString();

        // Cleanup old OTPs
        await supabase.from('otps').delete().eq('email', email);

        // Save OTP (user_id is null since user isn't created yet)
        const { error: otpError } = await supabase
            .from('otps')
            .insert([
                {
                    email,
                    code: otpCode,
                    purpose: 'verification',
                    expires_at: expiresAt
                }
            ]);

        if (otpError) throw otpError;

        // Send OTP email
        await emailService.sendOTP(email, otpCode);

        res.status(201).json({
            message: 'OTP sent to your email.',
            signupToken
        });

    } catch (err) {
        console.error('Register Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * VERIFY EMAIL OTP
 */
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp, signupToken } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }

        const { data: otpRecord, error } = await supabase
            .from('otps')
            .select('*')
            .eq('email', email)
            .eq('code', otp)
            .eq('purpose', 'verification')
            .gt('expires_at', new Date().toISOString())
            .single();

        if (error || !otpRecord) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        // Decode signup token to get user data
        let userData;
        try {
            userData = jwt.verify(signupToken, JWT_SECRET);
        } catch (err) {
            return res.status(400).json({ error: 'Invalid or expired signup session' });
        }

        if (userData.email !== email) {
            return res.status(400).json({ error: 'Email mismatch' });
        }

        // Create verified user
        const { error: createError } = await supabase
            .from('users')
            .insert([
                {
                    full_name: userData.fullName,
                    email,
                    password_hash: userData.passwordHash,
                    is_verified: true
                }
            ]);

        if (createError) throw createError;

        // Delete OTP
        await supabase.from('otps').delete().eq('id', otpRecord.id);

        res.status(201).json({ message: 'Email verified and account created successfully.' });

    } catch (err) {
        console.error('Verify OTP Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * LOGIN (Only verified users)
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (!user.is_verified) {
            return res.status(403).json({
                error: 'Email not verified. Please verify your account.'
            });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, role: 'user' },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                fullName: user.full_name,
                email: user.email
            }
        });

    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * LOGOUT
 */
exports.logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
};

/**
 * FORGOT PASSWORD (OTP)
 */
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const { data: user } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await supabase
            .from('otps')
            .delete()
            .eq('email', email)
            .eq('purpose', 'password_reset');

        const otpCode = generateOTP();
        const expiresAt = new Date(
            Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
        ).toISOString();

        await supabase.from('otps').insert([
            {
                user_id: user.id,
                email,
                code: otpCode,
                purpose: 'password_reset',
                expires_at: expiresAt
            }
        ]);

        await emailService.sendPasswordResetOTP(email, otpCode);

        res.status(200).json({
            message: 'Password reset OTP sent to your email.'
        });

    } catch (err) {
        console.error('Forgot Password Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * RESET PASSWORD
 */
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                error: 'Password must be at least 8 characters'
            });
        }

        const { data: otpRecord } = await supabase
            .from('otps')
            .select('*')
            .eq('email', email)
            .eq('code', otp)
            .eq('purpose', 'password_reset')
            .gt('expires_at', new Date().toISOString())
            .single();

        if (!otpRecord) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

        await supabase
            .from('users')
            .update({ password_hash: passwordHash })
            .eq('email', email);

        await supabase.from('otps').delete().eq('id', otpRecord.id);

        res.status(200).json({
            message: 'Password reset successfully.'
        });

    } catch (err) {
        console.error('Reset Password Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * RESEND VERIFICATION OTP
 */
exports.resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const { data: user } = await supabase
            .from('users')
            .select('id, is_verified')
            .eq('email', email)
            .single();

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.is_verified) {
            return res.status(400).json({ error: 'Email already verified' });
        }

        await supabase
            .from('otps')
            .delete()
            .eq('email', email)
            .eq('purpose', 'verification');

        const otpCode = generateOTP();
        const expiresAt = new Date(
            Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
        ).toISOString();

        await supabase.from('otps').insert([
            {
                user_id: user.id,
                email,
                code: otpCode,
                purpose: 'verification',
                expires_at: expiresAt
            }
        ]);

        await emailService.sendOTP(email, otpCode);

        res.status(200).json({ message: 'New OTP sent.' });

    } catch (err) {
        console.error('Resend OTP Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * GET CURRENT USER
 */
exports.getMe = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const { data: user } = await supabase
            .from('users')
            .select('id, full_name, email, is_verified')
            .eq('id', decoded.userId)
            .single();

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        res.status(200).json({
            user: {
                id: user.id,
                fullName: user.full_name,
                email: user.email
            }
        });

    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};
