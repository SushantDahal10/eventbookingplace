const supabase = require('../config/supabaseClient');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 10;

const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const { data, error } = await supabase
            .from('gate_staff')
            .insert([
                {
                    full_name: fullName,
                    email: email.toLowerCase(),
                    password_hash: passwordHash
                }
            ])
            .select()
            .single();

        if (error) {
            if (error.code === '23505') return res.status(400).json({ success: false, message: "Email already exists" });
            throw error;
        }

        res.status(201).json({ success: true, message: "Gate staff registered successfully" });

    } catch (error) {
        console.error("Gate Signup Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { data: staff, error } = await supabase
            .from('gate_staff')
            .select('*')
            .eq('email', email.toLowerCase())
            .single();

        if (error || !staff) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const match = await bcrypt.compare(password, staff.password_hash);
        if (!match) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        if (!staff.active) {
            return res.status(403).json({ success: false, message: "Account is inactive" });
        }

        const token = jwt.sign(
            { userId: staff.id, email: staff.email, role: 'gate' },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: "Login successful",
            token, // Gate app might use local storage for simple tokens
            user: {
                id: staff.id,
                fullName: staff.full_name,
                email: staff.email
            }
        });

    } catch (error) {
        console.error("Gate Login Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const validateToken = async (req, res) => {
    try {
        let { token, eventId } = req.body;

        if (!token) {
            return res.status(400).json({ success: false, message: "No token provided" });
        }

        token = token.trim(); // Cleanup scanned text

        // 1. Fetch QR token and join with its booking, booking_items, and ticket_tiers
        const { data: qrData, error: qrError } = await supabase
            .from('ticket_qr_tokens')
            .select(`
                *,
                bookings (
                    id,
                    transaction_id,
                    event_id,
                    users ( full_name ),
                    booking_items (
                        quantity,
                        ticket_tiers ( tier_name )
                    )
                )
            `)
            .eq('token', token)
            .single();

        if (qrError || !qrData) {
            return res.status(404).json({ success: false, message: "Invalid QR: Token not found" });
        }

        // 2. Strict Event Matching
        if (eventId && qrData.event_id !== eventId) {
            return res.status(400).json({
                success: false,
                message: "This ticket belongs to a different event"
            });
        }

        // 3. Usage validation
        if (qrData.status === 'exhausted' || qrData.total_used >= qrData.total_allowed) {
            return res.status(400).json({ success: false, message: "Ticket already fully used" });
        }

        // 4. Format detailed ticket info (Tier + Quantity)
        const tickets = qrData.bookings?.booking_items.map(item => ({
            tier: item.ticket_tiers?.tier_name || 'Ticket',
            quantity: item.quantity
        })) || [];

        res.json({
            success: true,
            data: {
                tokenId: qrData.id,
                bookingId: qrData.booking_id,
                transactionId: qrData.bookings?.transaction_id,
                customerName: qrData.bookings?.users?.full_name,
                totalAllowed: qrData.total_allowed,
                totalUsed: qrData.total_used,
                remaining: qrData.total_allowed - qrData.total_used,
                tickets: tickets
            }
        });

    } catch (error) {
        console.error("Token Validation Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const consumeToken = async (req, res) => {
    try {
        const { tokenId, count, staffId, eventId } = req.body;

        const { data: currentToken, error: fetchError } = await supabase
            .from('ticket_qr_tokens')
            .select('total_used, total_allowed, status')
            .eq('id', tokenId)
            .single();

        if (fetchError || !currentToken) return res.status(404).json({ success: false, message: "Token not found" });

        const newUsed = currentToken.total_used + count;
        if (newUsed > currentToken.total_allowed) {
            return res.status(400).json({ success: false, message: "Cannot admit more than booked tickets" });
        }

        // Automatically exhaust if all tickets are used
        const newStatus = newUsed === currentToken.total_allowed ? 'exhausted' : 'active';

        const { error: updateError } = await supabase
            .from('ticket_qr_tokens')
            .update({
                total_used: newUsed,
                status: newStatus
            })
            .eq('id', tokenId);

        if (updateError) throw updateError;

        // Log entry with correct staff_id (gate_staff)
        await supabase.from('entry_logs').insert({
            qr_token_id: tokenId,
            event_id: eventId,
            staff_id: staffId,
            entries_used: count
        });

        res.json({ success: true, message: `Entry recorded for ${count} person(s)` });

    } catch (error) {
        console.error("Token Consumption Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getAssignedEvents = async (req, res) => {
    try {
        // Updated: Show all events that have at least one booking
        const { data, error } = await supabase
            .from('bookings')
            .select(`
                event_id,
                events ( id, title, event_date, location )
            `)
            .neq('status', 'cancelled');

        if (error) throw error;

        // Extract unique events
        const eventMap = new Map();
        data.forEach(item => {
            if (item.events && !eventMap.has(item.events.id)) {
                eventMap.set(item.events.id, item.events);
            }
        });

        res.json({
            success: true,
            events: Array.from(eventMap.values())
        });

    } catch (error) {
        console.error("Get Events Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getEntryHistory = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { data, error } = await supabase
            .from('entry_logs')
            .select(`
                id, entries_used, created_at,
                ticket_qr_tokens ( token, bookings ( users ( full_name ) ) )
            `)
            .eq('event_id', eventId)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) throw error;

        res.json({
            success: true,
            history: data.map(item => ({
                id: item.id,
                count: item.entries_used,
                time: item.created_at,
                token: item.ticket_qr_tokens?.token,
                customer: item.ticket_qr_tokens?.bookings?.users?.full_name
            }))
        });
    } catch (error) {
        console.error("Get History Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    signup,
    login,
    validateToken,
    consumeToken,
    getAssignedEvents,
    getEntryHistory
};
