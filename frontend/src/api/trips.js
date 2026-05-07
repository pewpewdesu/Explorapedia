const API_BASE = import.meta.env.VITE_API_BASE || '';

function authHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

export async function createTrip(payload) {
    const res = await fetch(`${API_BASE}/api/trips`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });
    return res.json();
}

export async function listTrips() {
    const res = await fetch(`${API_BASE}/api/trips`, { headers: authHeaders() });
    return res.json();
}

export async function getTrip(id) {
    const res = await fetch(`${API_BASE}/api/trips/${id}`, { headers: authHeaders() });
    return res.json();
}

export async function addAttraction(tripId, body) {
    const res = await fetch(`${API_BASE}/api/trips/${tripId}/attractions`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(body),
    });
    return res.json();
}

export async function removeAttraction(tripId, fsq_id) {
    const res = await fetch(`${API_BASE}/api/trips/${tripId}/attractions/${fsq_id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    return res.json();
}

export async function deleteTrip(id) {
    const res = await fetch(`${API_BASE}/api/trips/${id}`, { method: 'DELETE', headers: authHeaders() });
    return res.json();
}
