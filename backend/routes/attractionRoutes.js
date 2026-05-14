const express = require('express');
const axios = require('axios');

const router = express.Router();
const catchAsyncErrors = require('../middleware/errorHandler');

function formatAddress(parts) {
    return parts.filter(Boolean).join(', ');
}

function normalizeFoursquarePlace(place) {
    return {
        id: place.fsq_id || place.id,
        fsq_id: place.fsq_id || place.id,
        name: place.name,
        location: place.location || {},
        geocodes: place.geocodes || {},
    };
}

function normalizeOsmPlace(element, city) {
    const lat = element.lat || element.center?.lat || null;
    const lon = element.lon || element.center?.lon || null;
    const address = formatAddress([
        element.tags?.name,
        element.tags?.['addr:housenumber'],
        element.tags?.['addr:street'],
        element.tags?.['addr:city'] || city,
    ]);

    return {
        id: `osm-${element.type}-${element.id}`,
        fsq_id: `osm-${element.type}-${element.id}`,
        name: element.tags?.name || element.tags?.tourism || 'Attraction',
        location: {
            formatted_address: address || city,
        },
        geocodes: {
            main: {
                latitude: lat,
                longitude: lon,
            },
        },
    };
}

async function searchWithOpenStreetMap(city) {
    const geoResponse = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
            format: 'jsonv2',
            q: city,
            limit: 1,
        },
        headers: {
            'User-Agent': 'Explorapedia/1.0',
        },
    });

    const geo = geoResponse.data?.[0];
    if (!geo) {
        return [];
    }

    const overpassQuery = `
        [out:json][timeout:25];
        (
          node(around:5000,${geo.lat},${geo.lon})["tourism"~"attraction|museum|gallery|zoo|theme_park|viewpoint"];
          way(around:5000,${geo.lat},${geo.lon})["tourism"~"attraction|museum|gallery|zoo|theme_park|viewpoint"];
          relation(around:5000,${geo.lat},${geo.lon})["tourism"~"attraction|museum|gallery|zoo|theme_park|viewpoint"];
        );
        out center 10;
    `;

    const overpassResponse = await axios.post(
        'https://overpass-api.de/api/interpreter',
        new URLSearchParams({ data: overpassQuery }).toString(),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Explorapedia/1.0',
            },
        }
    );

    const elements = overpassResponse.data?.elements || [];
    return elements.slice(0, 10).map((element) => normalizeOsmPlace(element, city));
}

router.get('/:city', catchAsyncErrors(async (req, res) => {
    const city = req.params.city.trim();

    if (!city) {
        return res.status(400).json({ error: 'City is required' });
    }

    try {
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

        const results = (response.data.results || []).map(normalizeFoursquarePlace);
        return res.json(results);
    } catch (error) {
        // Fallback to OpenStreetMap if Foursquare fails
        const results = await searchWithOpenStreetMap(city);
        return res.json(results);
    }
}));

module.exports = router;