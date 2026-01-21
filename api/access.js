import { TOKENS } from './_tokens.js';

export default function handler(req, res) {
    res.setHeader('Content-Type', 'application/json');

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { name, pin } = req.body;

        if (!name || !pin) {
            return res.status(400).json({ authorized: false, error: 'Missing name or pin' });
        }

        const normalizedName = name.toString().toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
            .trim();

        // Access Database (Mock)
        // Add variations of names to ensure easy access
        const ACCESS_DB = [
            { ids: ['g01'], names: ['papa', 'padre', 'eugenio'], pin: '0001' },
            { ids: ['g02'], names: ['diego', 'diego y familia', "hermano"], pin: '0002' },
            { ids: ['g03'], names: ['tia elsa', 'elsa'], pin: '0003' },
            { ids: ['g04'], names: ['mariana', 'mariana y familia'], pin: '1021' },
            { ids: ['g05'], names: ['zoe', 'zoe y familia', 'emi'], pin: '1225' },
            // g06, g07 available
            { ids: ['g08'], names: ['tio oscar', 'oscar'], pin: '1026' },
            { ids: ['g09'], names: ['eloscar', 'oscarin'], pin: '9999' },
            { ids: ['g11'], names: ['mama', 'madre', 'paty'], pin: '2000' },
            { ids: ['g12'], names: ['tio lalo', 'lalo', 'eduardo'], pin: '1212' },
            { ids: ['g13'], names: ['daniel', 'dani'], pin: '9999' },
            { ids: ['g14'], names: ['armando'], pin: '1225' },
            { ids: ['g15'], names: ['tia sandra', 'sandra', 'sandy'], pin: '1501' }
        ];

        // Find user
        const entry = ACCESS_DB.find(e => e.names.some(n => normalizedName === n || normalizedName.includes(n)));

        if (!entry) {
            return res.status(404).json({ authorized: false, error: 'NAME_NOT_FOUND' });
        }

        // Validate PIN
        if (pin !== entry.pin) {
            return res.status(401).json({ authorized: false, error: 'WRONG_PIN' });
        }

        // Get Gift ID (default to first one if multiple, though currently 1:1)
        const giftId = entry.ids[0];
        const token = TOKENS[giftId];

        if (!token) {
            return res.status(500).json({ authorized: false, error: 'SYSTEM_ERROR_NO_TOKEN' });
        }

        // Success
        return res.status(200).json({
            authorized: true,
            url: `/g/${giftId}?k=${token}`
        });

    } catch (error) {
        console.error("Access Error:", error);
        return res.status(500).json({ authorized: false, error: 'Internal Server Error' });
    }
}
