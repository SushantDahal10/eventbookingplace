const supabase = require('../config/supabaseClient');

/**
 * GET ALL EVENTS
 * Public endpoint to fetch all active events
 */
exports.getAllEvents = async (req, res) => {
    try {
        const { city, category } = req.query;
        let query = supabase
            .from('events')
            .select(`
                *,
                partners ( organization_name, official_email ),
                event_images ( * ),
                ticket_tiers ( available_quantity )
            `)
            .eq('status', 'active');

        if (city && city !== 'All') {
            query = query.ilike('city', `%${city}%`);
        }
        if (category && category !== 'All') {
            query = query.ilike('category', `%${category}%`);
        }

        // Filter valid events (future dates)
        const today = new Date().toISOString().split('T')[0];
        query = query.gte('event_date', today);

        const { data, error } = await query.order('event_date', { ascending: true });

        if (error) {
            console.error('Fetch Events Error:', error);
            return res.status(500).json({ success: false, message: 'Failed to fetch events' });
        }

        res.status(200).json({
            success: true,
            count: data.length,
            events: data
        });

    } catch (err) {
        console.error('Get All Events Error:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

/**
 * GET EVENT BY ID
 * Public endpoint to fetch a single event details
 */
exports.getEventById = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('events')
            .select(`
                *,
                partners ( organization_name, official_email, official_phone ),
                ticket_tiers ( * ),
                event_images ( * )
            `)
            .eq('id', id)
            .single();

        if (error || !data) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        res.status(200).json({
            success: true,
            event: data
        });

    } catch (err) {
        console.error('Get Event By ID Error:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
