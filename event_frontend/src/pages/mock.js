export const EVENTS = [
    {
        id: 1,
        title: "KTM Rock Fest",
        date: "Oct 26, 2026",
        time: "18:00",
        location: "Dasarath Stadium, KTM",
        category: "Concert",
        price: "1500",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=600",
        description: "The biggest rock festival in Kathmandu featuring top local and international bands.",
        tags: ["Music", "Rock", "Festival"],
        ticketTypes: [
            { id: 'gen', name: 'General Admission', price: 1500, desc: 'Standard entry to the ground' },
            { id: 'fan', name: 'Fanpit', price: 3000, desc: 'Front row experience standing' },
            { id: 'vip', name: 'VIP Seated', price: 5000, desc: 'Reserved seating with food included' }
        ]
    },
    {
        id: 2,
        title: "Patan Comedy Night",
        date: "Nov 02, 2026",
        time: "19:00",
        location: "Patan Durbar Square",
        category: "Comedy",
        price: "1000",
        image: "https://media.istockphoto.com/id/637268486/photo/patan.jpg?s=612x612&w=0&k=20&c=IHL_X9XMlTKCFjXMAdJTr3dLoJTN-Vvn5QsYfNtnkgc=",
        description: "A night of laughter with the best comedians in town at the historic Patan Durbar Square.",
        tags: ["Comedy", "Standup", "Nightlife"],
        ticketTypes: [
            { id: 'gen', name: 'Standard', price: 1000, desc: 'Entry to the show' },
            { id: 'front', name: 'Front Row', price: 2000, desc: 'Best view in the house' }
        ]
    },
    {
        id: 3,
        title: "Lalitpur Futsal League",
        date: "Nov 10, 2026",
        time: "10:00",
        location: "Lalitpur Futsal Arena",
        category: "Sports",
        price: "500",
        image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=600",
        description: "Cheer for your favorite teams in the intense Lalitpur Futsal League finals.",
        tags: ["Sports", "Futsal", "Tournament"],
        ticketTypes: [
            { id: 'reg', name: 'Regular', price: 500, desc: 'Entry to all matches' }
        ]
    },
    {
        id: 4,
        title: "Jazz at the Mandala",
        date: "Nov 15, 2026",
        time: "20:00",
        location: "Mandala Theater",
        category: "Music",
        price: "1200",
        image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&q=80&w=600",
        description: "Smooth jazz tunes in an intimate setting at Mandala Theater.",
        tags: ["Jazz", "Music", "Live"],
        ticketTypes: [
            { id: 'main', name: 'Main Hall', price: 1200, desc: 'Seating in the main theater' }
        ]
    },
    {
        id: 5,
        title: "Tech Summit Nepal",
        date: "Dec 01, 2026",
        time: "09:00",
        location: "Hyatt Regency, KTM",
        category: "Thinking",
        price: "5000",
        image: "https://images.unsplash.com/photo-1540575467063-17e6fc8c62d8?auto=format&fit=crop&q=80&w=600",
        description: "Join industry leaders and innovators at the premier tech conference in Nepal.",
        tags: ["Tech", "Conference", "Networking"],
        ticketTypes: [
            { id: 'full', name: 'Full Access', price: 5000, desc: 'Access to all sessions and workshops' },
            { id: 'stud', name: 'Student', price: 2500, desc: 'Valid student ID required' }
        ]
    },
    {
        id: 6,
        title: "Food & Wine Festival",
        date: "Dec 10, 2026",
        time: "12:00",
        location: "Bhrikutimandap",
        category: "Food",
        price: "Free",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600",
        description: "Taste the world's best cuisines and wines at this outdoor festival.",
        tags: ["Food", "Wine", "Festival"],
        ticketTypes: [
            { id: 'entry', name: 'Entry Pass', price: 0, desc: 'Admission to the festival grounds' }
        ]
    }
];
