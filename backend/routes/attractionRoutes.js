const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/:city', async (req, res) => {
    try {
        const city = req.params.city;

        const response = await axios.get(
            'https://api.foursquare.com/v3/places/search',
            {
                headers: {
                    Authorization: process.env.FOURSQUARE_API_KEY,
                },
                params: {
                    near: city,
                    categories: '16000',
                    limit: 10,
                },
            }
        );

        res.json(response.data.results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch attractions' });
    }
});

module.exports = router;