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

// Hardcoded popular attractions fallback for major cities
const popularAttractions = {
    'london': [
        { id: 'london-1', fsq_id: 'london-1', name: 'Big Ben & Houses of Parliament', location: { formatted_address: 'Palace of Westminster, London' }, geocodes: { main: { latitude: 51.4995, longitude: -0.1248 } } },
        { id: 'london-2', fsq_id: 'london-2', name: 'Tower of London', location: { formatted_address: 'Tower of London, London' }, geocodes: { main: { latitude: 51.5055, longitude: -0.0754 } } },
        { id: 'london-3', fsq_id: 'london-3', name: 'Tower Bridge', location: { formatted_address: 'Tower Bridge, London' }, geocodes: { main: { latitude: 51.5055, longitude: -0.0754 } } },
        { id: 'london-4', fsq_id: 'london-4', name: 'British Museum', location: { formatted_address: 'British Museum, London' }, geocodes: { main: { latitude: 51.5194, longitude: -0.1270 } } },
        { id: 'london-5', fsq_id: 'london-5', name: 'Buckingham Palace', location: { formatted_address: 'Buckingham Palace, London' }, geocodes: { main: { latitude: 51.5007, longitude: -0.1418 } } },
        { id: 'london-6', fsq_id: 'london-6', name: 'Westminster Abbey', location: { formatted_address: 'Westminster Abbey, London' }, geocodes: { main: { latitude: 51.4954, longitude: -0.1271 } } },
        { id: 'london-7', fsq_id: 'london-7', name: 'London Eye', location: { formatted_address: 'London Eye, London' }, geocodes: { main: { latitude: 51.5033, longitude: -0.1195 } } },
        { id: 'london-8', fsq_id: 'london-8', name: 'National Gallery', location: { formatted_address: 'National Gallery, London' }, geocodes: { main: { latitude: 51.5090, longitude: -0.1284 } } },
        { id: 'london-9', fsq_id: 'london-9', name: 'Hyde Park', location: { formatted_address: 'Hyde Park, London' }, geocodes: { main: { latitude: 51.5074, longitude: -0.1652 } } },
        { id: 'london-10', fsq_id: 'london-10', name: 'St. Paul\'s Cathedral', location: { formatted_address: 'St. Paul\'s Cathedral, London' }, geocodes: { main: { latitude: 51.5138, longitude: -0.0984 } } },
    ],
    'paris': [
        { id: 'paris-1', fsq_id: 'paris-1', name: 'Eiffel Tower', location: { formatted_address: 'Eiffel Tower, Paris' }, geocodes: { main: { latitude: 48.8584, longitude: 2.2945 } } },
        { id: 'paris-2', fsq_id: 'paris-2', name: 'Louvre Museum', location: { formatted_address: 'Louvre Museum, Paris' }, geocodes: { main: { latitude: 48.8606, longitude: 2.3352 } } },
        { id: 'paris-3', fsq_id: 'paris-3', name: 'Notre-Dame Cathedral', location: { formatted_address: 'Notre-Dame Cathedral, Paris' }, geocodes: { main: { latitude: 48.8530, longitude: 2.3499 } } },
        { id: 'paris-4', fsq_id: 'paris-4', name: 'Arc de Triomphe', location: { formatted_address: 'Arc de Triomphe, Paris' }, geocodes: { main: { latitude: 48.8738, longitude: 2.2950 } } },
        { id: 'paris-5', fsq_id: 'paris-5', name: 'Sacré-Cœur Basilica', location: { formatted_address: 'Sacré-Cœur, Paris' }, geocodes: { main: { latitude: 48.8867, longitude: 2.3431 } } },
        { id: 'paris-6', fsq_id: 'paris-6', name: 'Versailles Palace', location: { formatted_address: 'Palace of Versailles, Paris' }, geocodes: { main: { latitude: 48.8047, longitude: 2.1200 } } },
        { id: 'paris-7', fsq_id: 'paris-7', name: 'Champs-Élysées', location: { formatted_address: 'Champs-Élysées, Paris' }, geocodes: { main: { latitude: 48.8699, longitude: 2.3073 } } },
        { id: 'paris-8', fsq_id: 'paris-8', name: 'Musée d\'Orsay', location: { formatted_address: 'Musée d\'Orsay, Paris' }, geocodes: { main: { latitude: 48.8601, longitude: 2.3266 } } },
        { id: 'paris-9', fsq_id: 'paris-9', name: 'Panthéon', location: { formatted_address: 'Panthéon, Paris' }, geocodes: { main: { latitude: 48.8462, longitude: 2.3465 } } },
        { id: 'paris-10', fsq_id: 'paris-10', name: 'Latin Quarter', location: { formatted_address: 'Latin Quarter, Paris' }, geocodes: { main: { latitude: 48.8489, longitude: 2.3469 } } },
    ],
    'tokyo': [
        { id: 'tokyo-1', fsq_id: 'tokyo-1', name: 'Tokyo Tower', location: { formatted_address: 'Tokyo Tower, Tokyo' }, geocodes: { main: { latitude: 35.6586, longitude: 139.7454 } } },
        { id: 'tokyo-2', fsq_id: 'tokyo-2', name: 'Senso-ji Temple', location: { formatted_address: 'Senso-ji Temple, Tokyo' }, geocodes: { main: { latitude: 35.7148, longitude: 139.7967 } } },
        { id: 'tokyo-3', fsq_id: 'tokyo-3', name: 'Shibuya Crossing', location: { formatted_address: 'Shibuya Crossing, Tokyo' }, geocodes: { main: { latitude: 35.6595, longitude: 139.7004 } } },
        { id: 'tokyo-4', fsq_id: 'tokyo-4', name: 'Tsukiji Market', location: { formatted_address: 'Tsukiji Market, Tokyo' }, geocodes: { main: { latitude: 35.6649, longitude: 139.7758 } } },
        { id: 'tokyo-5', fsq_id: 'tokyo-5', name: 'Meiji Shrine', location: { formatted_address: 'Meiji Shrine, Tokyo' }, geocodes: { main: { latitude: 35.6762, longitude: 139.7007 } } },
        { id: 'tokyo-6', fsq_id: 'tokyo-6', name: 'Shinjuku', location: { formatted_address: 'Shinjuku, Tokyo' }, geocodes: { main: { latitude: 35.6895, longitude: 139.7004 } } },
        { id: 'tokyo-7', fsq_id: 'tokyo-7', name: 'Imperial Palace', location: { formatted_address: 'Imperial Palace, Tokyo' }, geocodes: { main: { latitude: 35.6753, longitude: 139.7503 } } },
        { id: 'tokyo-8', fsq_id: 'tokyo-8', name: 'Harajuku', location: { formatted_address: 'Harajuku, Tokyo' }, geocodes: { main: { latitude: 35.6654, longitude: 139.7039 } } },
        { id: 'tokyo-9', fsq_id: 'tokyo-9', name: 'Mount Fuji', location: { formatted_address: 'Mount Fuji, Tokyo' }, geocodes: { main: { latitude: 35.3606, longitude: 138.7274 } } },
        { id: 'tokyo-10', fsq_id: 'tokyo-10', name: 'Akihabara', location: { formatted_address: 'Akihabara, Tokyo' }, geocodes: { main: { latitude: 35.6980, longitude: 139.7744 } } },
    ],
};

async function searchWithOpenStreetMap(city) {
    try {
        const geoResponse = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                format: 'jsonv2',
                q: city,
                limit: 1,
            },
            headers: {
                'User-Agent': 'Explorapedia/1.0',
            },
            timeout: 8000,
        });

        const geo = geoResponse.data?.[0];
        if (!geo) {
            console.warn(`[OSM] No geocoding results for city: ${city}`);
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
                timeout: 30000, // Increased timeout for Overpass (can be slow)
            }
        );

        const elements = overpassResponse.data?.elements || [];
        console.log(`[OSM] Found ${elements.length} attractions for ${city}`);
        return elements.slice(0, 10).map((element) => normalizeOsmPlace(element, city));
    } catch (osmError) {
        console.error(`[OSM] Failed for city "${city}":`, osmError.message);
        // Fall back to hardcoded attractions for popular cities
        const cityLower = city.toLowerCase();
        if (popularAttractions[cityLower]) {
            console.log(`[Fallback] Using hardcoded attractions for ${city}`);
            return popularAttractions[cityLower];
        }
        return [];
    }
}

router.get('/:city', catchAsyncErrors(async (req, res) => {
    const city = req.params.city.trim();

    if (!city) {
        return res.status(400).json({ error: 'City is required' });
    }

    console.log(`[Attractions] Searching for attractions in ${city}...`);

    // Skip Foursquare (key is invalid) - go straight to OpenStreetMap
    const results = await searchWithOpenStreetMap(city);

    if (results.length === 0) {
        console.warn(`[Attractions] No results from OSM for city: ${city}`);
    } else {
        console.log(`[Attractions] Found ${results.length} attractions for ${city}`);
    }

    return res.json(results);
}));

module.exports = router;