import api from '../services/api';

// Simple in-memory cache for attractions
const attractionsCache = new Map();

export async function searchAttractions(city) {
    const trimmedCity = city.trim();

    if (!trimmedCity) {
        return [];
    }

    // Check cache first
    if (attractionsCache.has(trimmedCity)) {
        console.log(`[Cache] Returning cached results for ${trimmedCity}`);
        return attractionsCache.get(trimmedCity);
    }

    const res = await api.get(`/attractions/${encodeURIComponent(trimmedCity)}`, {
        timeout: 35000 // Increased to account for slow Overpass API
    });

    // Cache the results
    attractionsCache.set(trimmedCity, res.data);

    return res.data;
}