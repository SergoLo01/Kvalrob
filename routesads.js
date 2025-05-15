const express = require('express');
const router = express.Router();
const Ad = require('../models/Ad');
const auth = require('../middleware/auth');

// Get all ads with filters
router.get('/', async (req, res) => {
    try {
        const { type, search, page = 1, limit = 10 } = req.query;

        let query = {};
        if (type) query.type = type;
        if (search) query.$text = { $search: search };

        const ads = await Ad.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('user', 'name avatar');

        const count = await Ad.countDocuments(query);

        res.json({
            ads,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new ad
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, type, location } = req.body;

        const ad = new Ad({
            title,
            description,
            type,
            user: req.user.id,
            location
        });

        await ad.save();
        res.status(201).json(ad);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get user's ads
router.get('/my-ads', auth, async (req, res) => {
    try {
        const ads = await Ad.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(ads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;