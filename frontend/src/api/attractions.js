import api from '../services/api';

export async function searchAttractions(city) {
    const trimmedCity = city.trim();

    if (!trimmedCity) {
        return [];
    }

    const res = await api.get(`/attractions/${encodeURIComponent(trimmedCity)}`);
    return res.data;
}