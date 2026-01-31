const supabase = require('../config/supabaseClient');
const emailService = require('../services/emailService');

// --- CONSTANTS ---

const INTENT = {
    GREETING: 'GREETING',
    MY_BOOKING: 'MY_BOOKING',
    EVENT_DETAILS: 'EVENT_DETAILS',
    PAYMENT_ISSUE: 'PAYMENT_ISSUE',
    REFUND: 'REFUND',
    ENTRY_INFO: 'ENTRY_INFO',
    VENUE_INFO: 'VENUE_INFO',
    ESCALATE: 'ESCALATE', // General Support/Fallback
    SOMETHING_ELSE: 'SOMETHING_ELSE', // New Static Info
    UNKNOWN: 'UNKNOWN'
};

const STATE = {
    GREETING: 'GREETING',            // Initial state
    INTENT_SELECTION: 'INTENT_SELECTION', // Waiting for user to pick a topic
    INTENT_FLOW: 'INTENT_FLOW',      // Inside a specific topic (Locked)
    RESOLUTION: 'RESOLUTION',        // Answer delivered
    FOLLOW_UP: 'FOLLOW_UP',          // "More queries?"
    END: 'END'
};

const PUBLIC_SUPPORT_EMAIL = 'support@nepalishows.com';
const ESCALATION_EMAIL = 'froshweek732@gmail.com';

// --- HELPER: FORMAT TIME ---
const formatDateTime = (dateString, timeString) => {
    if (!dateString) return { date: 'TBD', time: 'TBD' };
    const dateObj = new Date(dateString);
    let time = 'TBD';
    if (timeString) {
        // If start_time string exists (e.g. "14:30:00")
        const [h, m] = timeString.split(':');
        const dt = new Date();
        dt.setHours(h, m);
        time = dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else {
        // Fallback to derive from dateObj
        time = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }

    return {
        date: dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        time: time
    };
};

// --- HELPER: INTENT RESOLVER ---

const resolveIntent = (input, sessionState) => {
    const text = input.message ? input.message.toLowerCase() : '';
    const btnValue = input.intent; // If button clicked

    // Global Quit Commands
    if (text === 'quit' || text === 'cancel' || text === 'end chat') return 'END_CHAT';

    // 1. Button Clicks (Highest Priority)
    if (btnValue) {
        // Dynamic Payloads capture
        if (btnValue.startsWith('SHOW_BOOKING|')) return INTENT.MY_BOOKING;
        if (btnValue.startsWith('SHOW_EVENT|')) return INTENT.EVENT_DETAILS;

        // Map legacy/frontend button values to new INTENTs
        if (btnValue === 'BOOKING_STATUS' || btnValue === INTENT.MY_BOOKING) return INTENT.MY_BOOKING;
        if (btnValue === 'EVENT_DETAILS' || btnValue === INTENT.EVENT_DETAILS) return INTENT.EVENT_DETAILS;
        if (btnValue === 'PAYMENT_STATUS' || btnValue === INTENT.PAYMENT_ISSUE) return INTENT.PAYMENT_ISSUE;
        if (btnValue === 'REFUND_POLICY' || btnValue === 'REFUND' || btnValue === INTENT.REFUND) return INTENT.REFUND;
        if (btnValue === 'ENTRY_INFO' || btnValue === INTENT.ENTRY_INFO) return INTENT.ENTRY_INFO;
        if (btnValue === 'VENUE_INFO' || btnValue === INTENT.VENUE_INFO) return INTENT.VENUE_INFO;
        if (btnValue === 'CONTACT_SUPPORT' || btnValue === INTENT.ESCALATE) return INTENT.ESCALATE;
        if (btnValue === 'SOMETHING_ELSE' || btnValue === INTENT.SOMETHING_ELSE) return INTENT.SOMETHING_ELSE;
        if (btnValue === 'GREETING') return INTENT.GREETING; // Reset
    }

    // 2. Intent Locking
    if (sessionState.subState === 'WAITING_FOR_INPUT') {
        // Return current intent so handler can process the input
        return sessionState.currentIntent || INTENT.ESCALATE;
    }

    if (text.includes('booking') || text.includes('ticket')) return INTENT.MY_BOOKING;
    if (text.includes('refund') || text.includes('cancel')) return INTENT.REFUND;
    if (text.includes('pay') || text.includes('transaction') || text.includes('money')) return INTENT.PAYMENT_ISSUE;
    if (text.includes('event') || text.includes('show')) return INTENT.EVENT_DETAILS;
    if (text.includes('entry') || text.includes('qr') || text.includes('gate') || text.includes('id')) return INTENT.ENTRY_INFO;
    if (text.includes('venue') || text.includes('location') || text.includes('address')) return INTENT.VENUE_INFO;

    // "Something Else" keywords check
    if (text.includes('other') || text.includes('issue') || text.includes('help')) return INTENT.SOMETHING_ELSE;

    return INTENT.UNKNOWN;
};

// --- HANDLERS ---

const showMainMenu = (res) => {
    return res.json({
        message: "Hi! How can we help you today?",
        type: "options",
        options: [
            { label: "My Bookings", value: INTENT.MY_BOOKING },
            { label: "Event Details", value: INTENT.EVENT_DETAILS },
            { label: "Payment Issue", value: INTENT.PAYMENT_ISSUE },
            { label: "Cancel / Refund", value: INTENT.REFUND },
            { label: "Entry Guidelines", value: INTENT.ENTRY_INFO },
            { label: "Venue Info", value: INTENT.VENUE_INFO },
            { label: "Other Issue", value: INTENT.SOMETHING_ELSE }
        ],
        newState: {
            state: STATE.INTENT_SELECTION,
            currentIntent: null,
            subState: null,
            selectedBookingId: null,
            selectedEventId: null
        }
    });
};

const handleMyBooking = async (req, res, sessionState, userEmail) => {
    if (!userEmail) return res.json({ message: "Please log in to view your bookings.", newState: sessionState });

    // Explicit Context logic: default to NULL to force list unless ID provided
    let bookingId = null;

    if (req.body.intent && req.body.intent.startsWith('SHOW_BOOKING|')) {
        bookingId = req.body.intent.split('|')[1];
    }

    if (bookingId) {
        // Fetch specific booking (REMOVED start_time)
        const { data: booking, error } = await supabase
            .from('bookings')
            .select(`
                *,
                events (title, event_date, location),
                booking_items (quantity, ticket_tiers (tier_name))
            `)
            .eq('id', bookingId)
            .single();

        if (error || !booking) {
            console.log("Booking Fetch Error:", error);
            return res.json({
                message: "Booking details not found. Please try selecting again.",
                newState: { ...sessionState, selectedBookingId: null }
            });
        }

        const ticketInfo = booking.booking_items?.map(item =>
            `- ${item.ticket_tiers?.tier_name || 'Ticket'} × ${item.quantity}`
        ).join('\n');

        const { date, time } = formatDateTime(booking.events?.event_date, null);

        const msg = `**Booking Summary**

**Event Name:**
${booking.events?.title}

**Event Date:**
${date}

**Tickets Purchased:**
${ticketInfo}

**Total Amount Paid:**
Rs. ${booking.total_amount}

**Booking Status:**
${booking.status.toUpperCase()}

**Next Steps:**
Your booking is confirmed.
You can view your ticket QR code from:
**My Bookings** → **View Ticket**`;

        return res.json({
            message: msg,
            type: "options",
            options: [
                { label: "View Other Bookings", value: INTENT.MY_BOOKING },
                { label: "Cancel This Booking", value: INTENT.REFUND },
                { label: "Main Menu", value: INTENT.GREETING }
            ],
            newState: {
                ...sessionState,
                state: STATE.FOLLOW_UP,
                currentIntent: INTENT.MY_BOOKING,
                selectedBookingId: bookingId // Correctly persist ID
            }
        });

    } else {
        // List Bookings
        const { data: bookings } = await supabase
            .from('bookings')
            .select('id, status, events(title, event_date)')
            .eq('user_id', (await supabase.from('users').select('id').eq('email', userEmail).single()).data?.id)
            .order('created_at', { ascending: false });

        if (!bookings || bookings.length === 0) {
            return res.json({
                message: "You don't have any bookings yet.",
                newState: { ...sessionState, state: STATE.FOLLOW_UP }
            });
        }

        // List bookings (no grouping)
        return res.json({
            message: "Here are your recent bookings. Select one to view details:",
            type: "options",
            options: bookings.slice(0, 5).map(b => {
                const { date } = formatDateTime(b.events?.event_date, null);
                return {
                    label: `${b.events?.title} (${date})`,
                    value: `SHOW_BOOKING|${b.id}`
                };
            }),
            newState: {
                ...sessionState,
                state: STATE.INTENT_FLOW,
                currentIntent: INTENT.MY_BOOKING,
                selectedBookingId: null // Force RESET
            }
        });
    }
};

const handleEventDetails = async (req, res, sessionState) => {
    let eventId = sessionState.selectedEventId;
    if (req.body.intent && req.body.intent.startsWith('SHOW_EVENT|')) {
        eventId = req.body.intent.split('|')[1];
    }

    if (eventId) {
        const { data: event } = await supabase
            .from('events')
            .select('*, ticket_tiers(*)')
            .eq('id', eventId)
            .single();

        if (!event) return res.json({ message: "Event not found.", newState: { ...sessionState, selectedEventId: null } });

        const tiersInfo = event.ticket_tiers?.map(t => `${t.tier_name} – Rs. ${t.price}`).join('\n');

        let status = 'Available';
        const avail = event.ticket_tiers?.reduce((acc, t) => acc + t.available_quantity, 0) || 0;
        if (avail === 0) status = 'Sold Out';

        const { date, time } = formatDateTime(event.event_date, null);

        const msg = `**Event Name:**
${event.title}

**Description:**
${event.description || 'No description available.'}

**Date & Time:**
${date} | ${time}

**Ticket Status:**
${tiersInfo}
Status: ${status}`;

        return res.json({
            message: msg,
            type: "options",
            options: [
                { label: "View Venue Info", value: INTENT.VENUE_INFO },
                { label: "Main Menu", value: INTENT.GREETING }
            ],
            newState: {
                ...sessionState,
                state: STATE.FOLLOW_UP,
                currentIntent: INTENT.EVENT_DETAILS,
                selectedEventId: eventId
            }
        });

    } else {
        const { data: events } = await supabase.from('events').select('id, title, event_date').gte('event_date', new Date().toISOString()).limit(10);
        // Deduplicate events by title for listing
        const uniqueEvents = Array.from(new Map(events.map(e => [e.title, e])).values()).slice(0, 5);

        return res.json({
            message: "Here are our upcoming events:",
            type: "options",
            options: uniqueEvents.map(e => ({
                label: e.title,
                value: `SHOW_EVENT|${e.id}`
            })),
            newState: { ...sessionState, state: STATE.INTENT_FLOW, currentIntent: INTENT.EVENT_DETAILS }
        });
    }
};

const handleVenueInfo = async (req, res, sessionState) => {
    // Simplified: No description, No ticket info.
    let eventId = sessionState.selectedEventId;

    if (!eventId && req.body.intent && req.body.intent.startsWith('SHOW_EVENT|')) {
        eventId = req.body.intent.split('|')[1];
    }

    if (!eventId) {
        return res.json({
            message: "Please select an event from the **Event Details** section first to view its venue information.",
            type: "options",
            options: [
                { label: "Go to Event Details", value: INTENT.EVENT_DETAILS },
                { label: "Main Menu", value: INTENT.GREETING }
            ],
            newState: sessionState
        });
    }

    const { data: event } = await supabase
        .from('events')
        .select('title, location, city, full_address')
        .eq('id', eventId)
        .single();

    if (!event) return res.json({ message: "Venue info not found.", newState: sessionState });

    const gates = ['Gate A', 'Gate B', 'Gate C'];
    const gate = gates[Math.floor(Math.random() * gates.length)];

    const msg = `**Venue Information**

**Event:**
${event.title}

**Location:**
${event.location}

**City:**
${event.city || 'Pokhara'}

**Address:**
${event.full_address || event.location}

**Entry Gate:**
${gate}`;

    return res.json({
        message: msg,
        type: "options",
        options: [
            { label: "Back to Event", value: INTENT.EVENT_DETAILS },
            { label: "Main Menu", value: INTENT.GREETING }
        ],
        newState: { ...sessionState, state: STATE.FOLLOW_UP, selectedEventId: eventId }
    });
};

const handleRefund = async (req, res, sessionState, userEmail) => {
    // 1. If Booking ID Selected (passed from My Bookings or persisted)
    if (sessionState.selectedBookingId) {
        const { data: booking } = await supabase
            .from('bookings')
            .select('*, events(event_date, title)')
            .eq('id', sessionState.selectedBookingId)
            .single();

        if (!booking) {
            return res.json({
                message: "I lost the booking context. Please select your booking again.",
                newState: { ...sessionState, selectedBookingId: null }
            });
        }

        const eventDate = new Date(booking.events?.event_date);
        const now = new Date();
        const hoursDiff = (eventDate - now) / (1000 * 60 * 60);

        if (hoursDiff < 48) {
            return res.json({
                message: `Online cancellation is no longer available for this booking.\n\nPlease email **${PUBLIC_SUPPORT_EMAIL}** with:\n- Your Booking ID\n- Reason for cancellation`,
                type: "options",
                options: [
                    { label: "Main Menu", value: INTENT.GREETING },
                    { label: "Close Chat", value: "END_CHAT" }
                ],
                newState: { ...sessionState, state: STATE.FOLLOW_UP }
            });
        } else {
            return res.json({
                message: `This booking is eligible for cancellation.\n\nYou can cancel this booking from:\n**My Bookings** → **View Ticket** → **Cancel Booking**.`,
                type: "options",
                options: [
                    { label: "Go to My Bookings", value: INTENT.MY_BOOKING },
                    { label: "Main Menu", value: INTENT.GREETING }
                ],
                newState: { ...sessionState, state: STATE.FOLLOW_UP }
            });
        }
    }

    // 2. Select Booking Logic
    if (!userEmail) return res.json({ message: "Please log in first.", newState: { ...sessionState, state: STATE.FOLLOW_UP } });

    const { data: bookings } = await supabase
        .from('bookings')
        .select('id, status, events(title, event_date)')
        .eq('user_id', (await supabase.from('users').select('id').eq('email', userEmail).single()).data?.id)
        .order('created_at', { ascending: false })
        .limit(5);

    return res.json({
        message: "Select a booking to cancel:",
        type: "options",
        options: bookings?.map(b => ({
            label: `Booking: ${b.events?.title} (${b.status})`,
            value: `SHOW_BOOKING|${b.id}`
        })) || [],
        newState: {
            ...sessionState,
            state: STATE.INTENT_FLOW,
            currentIntent: INTENT.MY_BOOKING
        }
    });
};

const handlePaymentIssue = async (req, res, sessionState, userEmail) => {
    // Phase 1: Check for pending bookings IF we are not already waiting for input
    if (sessionState.subState !== 'WAITING_FOR_INPUT') {
        const { data: pendingBookings } = await supabase
            .from('bookings')
            .select('*, events(title)')
            .eq('user_id', (await supabase.from('users').select('id').eq('email', userEmail).single()).data?.id)
            .eq('status', 'pending')
            .order('created_at', { ascending: false })
            .limit(3);

        if (pendingBookings && pendingBookings.length > 0) {
            // New Format: Block per booking
            const bookingBlocks = pendingBookings.map(b => `**Event Name:**\n${b.events?.title}\n\n**Amount:**\nRs. ${b.total_amount}\n\n**Payment Status:**\nPayment Failed`).join('\n\n---\n\n');

            const msg = `**Payment Issue Detected**\nWe found the following bookings with incomplete payment:\n\n${bookingBlocks}\n\n**Action Required:**\nPlease complete payment within 10 minutes to avoid cancellation.`;

            const latestPendingId = pendingBookings[0].id; // Context for potential escalation

            return res.json({
                message: msg,
                type: "options",
                options: [
                    { label: "Talk to Support", value: INTENT.ESCALATE },
                    { label: "My Bookings", value: INTENT.MY_BOOKING }
                ],
                newState: {
                    ...sessionState,
                    state: STATE.FOLLOW_UP,
                    selectedBookingId: latestPendingId // Store for context
                }
            });
        }

        // No pending bookings -> Static Informational Message (No Input)
        return res.json({
            message: `**Payment Issue**

We could not find any failed or incomplete transactions linked to your account.

If you are still facing a payment-related issue, please email our support team from your registered email address with the following details:
- Event name
- Booking ID (if available)
- Description of the issue

**Email:** ${PUBLIC_SUPPORT_EMAIL}

Our team will review your request and get back to you shortly.`,
            type: "options",
            options: [
                { label: "Main Menu", value: INTENT.GREETING },
                { label: "Close Chat", value: "END_CHAT" }
            ],
            newState: { ...sessionState, state: STATE.FOLLOW_UP }
        });
    }

    // Phase 2: User Input Received -> Email -> End
    // This calls shared escalation logic
    return handleSupportRequest(req, res, sessionState, userEmail);
};

const handleSupportRequest = async (req, res, sessionState, userEmail) => {
    // 1. Initial: Ask Input
    if (sessionState.subState !== 'WAITING_FOR_INPUT') {
        return res.json({
            message: "Please briefly describe your issue below.",
            type: "input_support_query",
            intent: INTENT.ESCALATE,
            newState: {
                ...sessionState,
                state: STATE.INTENT_FLOW,
                currentIntent: INTENT.ESCALATE,
                subState: 'WAITING_FOR_INPUT'
            }
        });
    }

    // 2. Got Input -> Email -> End
    const message = req.body.message;
    if (!message || message.trim().length === 0) {
        return res.json({ message: "Please describe your issue below.", type: "input_support_query", newState: sessionState });
    }

    // --- BUILD RICH PAYLOAD ---
    let bookingContext = null;
    let userContext = { full_name: 'Guest User', email: userEmail || 'Not Logged In' };

    // Fetch User Info
    if (userEmail) {
        const { data: user } = await supabase.from('users').select('full_name, email').eq('email', userEmail).single();
        if (user) userContext = user;
    }

    // Fetch Booking Info if available
    let bookingId = sessionState.selectedBookingId;
    if (bookingId) {
        const { data: booking } = await supabase
            .from('bookings')
            .select('id, total_amount, status, transaction_id, events(title, event_date)')
            .eq('id', bookingId)
            .single();
        if (booking) bookingContext = booking;
    }

    const timestamp = new Date().toLocaleString();
    const txnId = bookingContext ? (bookingContext.transaction_id || "Not generated") : "N/A";
    const amt = bookingContext ? `Rs. ${bookingContext.total_amount}` : "N/A";
    const evtName = bookingContext ? bookingContext.events?.title : "N/A";
    const evtDate = bookingContext ? new Date(bookingContext.events?.event_date).toDateString() : "N/A";
    const payStatus = bookingContext ? bookingContext.status : "N/A";
    const bookingStatus = bookingContext ? bookingContext.status.toUpperCase() : "N/A";
    const bId = bookingContext ? bookingContext.id : "N/A";

    // Rich Email Body (User Requested Template)
    // Rich HTML Email Body
    const emailBody = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #333; margin: 0; padding: 20px; }
            .container { background-color: #fff; max-width: 600px; margin: 0 auto; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden; }
            .header { background-color: #4F46E5; color: #fff; padding: 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 20px; }
            .content { padding: 30px; }
            .section { margin-bottom: 25px; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden; }
            .section-header { background-color: #f8fafc; padding: 10px 15px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
            .section-body { padding: 15px; background-color: #fff; }
            .row { display: flex; border-bottom: 1px solid #f1f5f9; padding: 8px 0; }
            .row:last-child { border-bottom: none; }
            .label { width: 140px; color: #64748b; font-size: 13px; font-weight: 600; flex-shrink: 0; }
            .value { color: #1e293b; font-size: 13px; font-weight: 500; }
            .message-box { background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 6px; color: #166534; font-size: 14px; line-height: 1.5; white-space: pre-wrap; }
            .footer { background-color: #f8fafc; padding: 15px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; }
            .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
            .badge-success { background-color: #dcfce7; color: #166534; }
            .badge-warning { background-color: #fef9c3; color: #854d0e; }
            .badge-error { background-color: #fee2e2; color: #991b1b; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Support Request</h1>
                <div style="font-size: 13px; opacity: 0.9; margin-top: 5px;">Via Web Chat</div>
            </div>
            
            <div class="content">
                <p style="margin-top: 0; margin-bottom: 20px; color: #4b5563;">Hello Support Team,<br>A user has raised a support request. Please find the details below.</p>

                <!-- User Details -->
                <div class="section">
                    <div class="section-header">User Details</div>
                    <div class="section-body">
                        <div class="row"><div class="label">Full Name</div><div class="value">${userContext.full_name}</div></div>
                        <div class="row"><div class="label">Email Address</div><div class="value"><a href="mailto:${userContext.email}" style="color: #4F46E5; text-decoration: none;">${userContext.email}</a></div></div>
                    </div>
                </div>

                <!-- Booking Details -->
                <div class="section">
                    <div class="section-header">Booking Context</div>
                    <div class="section-body">
                        <div class="row"><div class="label">Booking ID</div><div class="value" style="font-family: monospace;">${bId}</div></div>
                        <div class="row"><div class="label">Event Name</div><div class="value">${evtName}</div></div>
                        <div class="row"><div class="label">Event Date</div><div class="value">${evtDate}</div></div>
                        <div class="row"><div class="label">Booking Status</div><div class="value"><span class="badge ${bookingContext ? (bookingContext.status === 'confirmed' ? 'badge-success' : 'badge-warning') : ''}">${bookingStatus}</span></div></div>
                    </div>
                </div>

                <!-- Payment Details -->
                ${bookingContext ? `
                <div class="section">
                    <div class="section-header">Payment Information</div>
                    <div class="section-body">
                        <div class="row"><div class="label">Payment Status</div><div class="value">${payStatus}</div></div>
                        <div class="row"><div class="label">Transaction ID</div><div class="value" style="font-family: monospace;">${txnId}</div></div>
                        <div class="row"><div class="label">Amount Paid</div><div class="value">${amt}</div></div>
                    </div>
                </div>
                ` : ''}

                <!-- User Message -->
                <div class="section" style="border-color: #bbf7d0;">
                    <div class="section-header" style="background-color: #f0fdf4; color: #166534; border-bottom-color: #bbf7d0;">User Message</div>
                    <div class="section-body" style="background-color: #f0fdf4;">
                        <div class="message-box" style="border:none; padding:0; background:transparent;">${message}</div>
                    </div>
                </div>

                <div style="font-size: 13px; color: #64748b; margin-top: 20px;">
                    <strong>Source Information:</strong><br>
                    Platform: Web Chat (Authenticated)<br>
                    Time: ${timestamp}
                </div>
            </div>

            <div class="footer">
                NepaliShows Support Automation System<br>
                Please reply directly to the user to resolve this ticket.
            </div>
        </div>
    </body>
    </html>`;

    const emailSubject = `Support Request – Booking ID: ${bId}`;

    // Send to ESCALATION_EMAIL (froshweek732)
    // NOTE: This assumes ALL support escalations go to froshweek732 if they reach this block
    await sendFallbackEmail(emailBody, userEmail, emailSubject, ESCALATION_EMAIL);

    return res.json({
        message: "**Thank you for reaching out.**\n\nYour request has been shared with our support team.\nWe will contact you shortly regarding this issue.",
        type: "options",
        options: [
            { label: "Main Menu", value: INTENT.GREETING },
            { label: "Close Chat", value: "END_CHAT" }
        ],
        newState: { ...sessionState, state: STATE.FOLLOW_UP, subState: null }
    });
};

const handleSomethingElse = (req, res, sessionState) => {
    // Static Information Message
    return res.json({
        message: `For any issues not listed in the options above, please email our support team from your registered email address.

Include the following details in your email:
- Your full name
- Booking ID (if applicable)
- A brief description of the issue

**Email:** ${PUBLIC_SUPPORT_EMAIL}

Our team will review your request and get back to you shortly.`,
        type: "options",
        options: [
            { label: "Back to Menu", value: INTENT.GREETING },
            { label: "Close Chat", value: "END_CHAT" }
        ],
        newState: { ...sessionState, state: STATE.FOLLOW_UP }
    });
};

const handleEntryInfo = (req, res, sessionState) => {
    return res.json({
        message: `**Entry Guidelines**

1. Please present your valid QR code at the entry gate.
2. Each QR code is valid only for the number of attendees mentioned in the booking.
3. QR codes are non-transferable and can be scanned only once.`,
        type: "options",
        options: [{ label: "Back to Menu", value: INTENT.GREETING }],
        newState: { ...sessionState, state: STATE.FOLLOW_UP }
    });
};

// --- MAIN PROCESSOR ---

const processChat = async (req, res) => {
    try {
        const { message, intent: actionValue, userEmail } = req.body;

        let sessionState = req.body.sessionState || {
            state: STATE.GREETING,
            currentIntent: null,
            subState: null,
            selectedBookingId: null,
            selectedEventId: null
        };

        console.log("Processing Chat. Action:", actionValue, "Message:", message);

        // Global Quit Check
        if (actionValue === 'END_CHAT' || (message && ['quit', 'cancel', 'exit', 'end chat'].includes(message.toLowerCase()))) {
            return res.json({
                message: "Chat ended. Thank you!",
                type: "end_chat",
                newState: null
            });
        }

        if (actionValue === 'GREETING') return showMainMenu(res);

        let newIntent = resolveIntent({ message, intent: actionValue }, sessionState);

        if (newIntent === 'END_CHAT') {
            return res.json({ message: "Chat ended.", type: "end_chat", newState: null });
        }

        // State Machine Switch
        if (newIntent !== INTENT.UNKNOWN) {
            sessionState.currentIntent = newIntent;
            sessionState.state = STATE.INTENT_FLOW;
            if (sessionState.subState !== 'WAITING_FOR_INPUT' || newIntent !== sessionState.currentIntent) {
                sessionState.subState = null;
            }
        } else if (!sessionState.currentIntent) {
            // Fallback if no intent and no previous intent
            sessionState.currentIntent = INTENT.SOMETHING_ELSE;
            sessionState.state = STATE.INTENT_FLOW;
        }

        const activeIntent = sessionState.currentIntent;

        switch (activeIntent) {
            case INTENT.GREETING: return showMainMenu(res);
            case INTENT.MY_BOOKING: return handleMyBooking(req, res, sessionState, userEmail);
            case INTENT.EVENT_DETAILS: return handleEventDetails(req, res, sessionState);
            case INTENT.REFUND: return handleRefund(req, res, sessionState, userEmail);
            case INTENT.ENTRY_INFO: return handleEntryInfo(req, res, sessionState);
            case INTENT.VENUE_INFO: return handleVenueInfo(req, res, sessionState);
            case INTENT.PAYMENT_ISSUE: return handlePaymentIssue(req, res, sessionState, userEmail);
            case INTENT.ESCALATE: return handleSupportRequest(req, res, sessionState, userEmail);
            case INTENT.SOMETHING_ELSE: return handleSomethingElse(req, res, sessionState);
            default: return handleSupportRequest(req, res, sessionState, userEmail);
        }

    } catch (err) {
        console.error("Chat Error:", err);
        return res.status(500).json({ message: "An error occurred.", type: "text" });
    }
};

const sendFallbackEmail = async (message, userEmail, subject, targetEmail) => {
    try {
        await emailService.sendEmail(
            targetEmail || PUBLIC_SUPPORT_EMAIL,
            subject || 'Chat Support Request',
            message // Send as raw HTML
        );
        console.log(`[Email] Sent to ${targetEmail || PUBLIC_SUPPORT_EMAIL}`);
    } catch (e) { console.error("Email fail", e); }
};

module.exports = { processChat };
