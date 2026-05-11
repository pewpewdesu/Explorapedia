const API_BASE = import.meta.env.VITE_API_BASE || '';

function authHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

async function readJsonResponse(res) {
    const text = await res.text();
    return text ? JSON.parse(text) : null;
}

// Trip CRUD
export async function createTrip(payload) {
    const res = await fetch(`${API_BASE}/api/trips`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });
    return readJsonResponse(res);
}

export async function listTrips() {
    const res = await fetch(`${API_BASE}/api/trips`, { headers: authHeaders() });
    return readJsonResponse(res);
}

export async function getTrip(id) {
    const res = await fetch(`${API_BASE}/api/trips/${id}`, { headers: authHeaders() });
    return readJsonResponse(res);
}

export async function deleteTrip(id) {
    const res = await fetch(`${API_BASE}/api/trips/${id}`, { method: 'DELETE', headers: authHeaders() });
    return readJsonResponse(res);
}

// Itinerary management
export async function addToItinerary(tripId, dayNum, body) {
    const res = await fetch(`${API_BASE}/api/trips/${tripId}/itinerary/${dayNum}`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(body),
    });
    return readJsonResponse(res);
}

export async function editItineraryItem(tripId, dayNum, itemId, body) {
    const res = await fetch(`${API_BASE}/api/trips/${tripId}/itinerary/${dayNum}/${itemId}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(body),
    });
    return readJsonResponse(res);
}

export async function removeItineraryItem(tripId, dayNum, itemId) {
    const res = await fetch(`${API_BASE}/api/trips/${tripId}/itinerary/${dayNum}/${itemId}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    return readJsonResponse(res);
}

// Trip visibility / sharing
export async function updateTripVisibility(tripId, visibility) {
    const res = await fetch(`${API_BASE}/api/trips/${tripId}/visibility`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ visibility }),
    });
    return readJsonResponse(res);
}

// Public shared trips (no auth required)
export async function listPublicTrips(limit = 20, skip = 0) {
    const res = await fetch(`${API_BASE}/api/trips/shared/feed?limit=${limit}&skip=${skip}`);
    return readJsonResponse(res);
}

export async function getPublicTrip(id) {
    const res = await fetch(`${API_BASE}/api/trips/shared/${id}`);
    return readJsonResponse(res);
}
