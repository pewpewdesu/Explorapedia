import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTrip, addToItinerary, editItineraryItem, removeItineraryItem, updateTripVisibility } from '../api/trips';
import { searchAttractions } from '../api/attractions';

export default function TripDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [fsqId, setFsqId] = useState('');
    const [error, setError] = useState('');
    const [addError, setAddError] = useState('');
    const [selectedDay, setSelectedDay] = useState(1);
    const [visibility, setVisibility] = useState('private');
    const [editingItemId, setEditingItemId] = useState(null);
    const [editingNotes, setEditingNotes] = useState('');
    const [editingTime, setEditingTime] = useState('');
    const [searchCity, setSearchCity] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState('');

    async function load() {
        try {
            const data = await getTrip(id);
            setTrip(data);
            setVisibility(data.visibility || 'private');
        } catch (e) {
            console.error(e);
            setError('Failed to load trip.');
        }
    }

    useEffect(() => { load(); }, [id]);

    async function handleAddItem(e) {
        e.preventDefault();
        if (!fsqId) return;
        setAddError('');
        try {
            await addToItinerary(id, selectedDay, { fsq_id: fsqId });
            setFsqId('');
            await load();
        } catch (e) {
            console.error(e);
            setAddError('Failed to add item. Check the Foursquare ID.');
        }
    }

    async function handleEditItem(dayNum, itemId) {
        try {
            await editItineraryItem(id, dayNum, itemId, {
                notes: editingNotes,
                time: editingTime,
            });
            setEditingItemId(null);
            await load();
        } catch (e) {
            console.error(e);
        }
    }

    async function handleRemoveItem(dayNum, itemId) {
        if (!confirm('Remove this item?')) return;
        try {
            await removeItineraryItem(id, dayNum, itemId);
            await load();
        } catch (e) {
            console.error(e);
        }
    }

    async function handleVisibilityChange(newVis) {
        try {
            setVisibility(newVis);
            await updateTripVisibility(id, newVis);
        } catch (e) {
            console.error(e);
        }
    }

    async function handleSearchAttractions(e) {
        e.preventDefault();

        const city = searchCity.trim();
        if (!city) {
            setSearchResults([]);
            return;
        }

        setSearchLoading(true);
        setSearchError('');

        try {
            const results = await searchAttractions(city);
            setSearchResults(results || []);
        } catch (e) {
            console.error(e);
            setSearchError('Failed to search attractions.');
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    }

    async function handleAddSearchResult(place) {
        try {
            setAddError('');

            const item = {
                fsq_id: place.fsq_id || place.id,
                name: place.name,
                address: place.location?.formatted_address || place.location?.address || place.address || null,
                lat: place.geocodes?.main?.latitude || null,
                lon: place.geocodes?.main?.longitude || null,
            };

            await addToItinerary(id, selectedDay, { item });
            await load();
        } catch (e) {
            console.error(e);
            setAddError('Failed to add attraction.');
        }
    }

    // Loading state
    if (!trip) return (
        <div className="p-6 min-h-screen bg-gray-50 flex items-center justify-center">
            <p className="text-gray-500">Loading trip...</p>
        </div>
    );

    // Error state
    if (error) return (
        <div className="p-6 min-h-screen bg-gray-50">
            <p className="text-red-500">{error}</p>
            <button
                onClick={() => navigate('/trips')}
                className="mt-4 text-blue-600 hover:underline"
            >
                Back to My Trips
            </button>
        </div>
    );

    // Calculate days
    const itinerary = trip.itinerary || [];
    const maxDay = itinerary.length > 0 ? Math.max(...itinerary.map(d => d.day)) : 1;
    const displayedDay = itinerary.find(d => d.day === selectedDay) || { day: selectedDay, items: [] };
    const dayItems = displayedDay.items || [];

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto">
                {/* Back button */}
                <button
                    onClick={() => navigate('/trips')}
                    className="text-blue-600 hover:underline text-sm mb-4 inline-block"
                >
                    ← Back to My Trips
                </button>

                {/* Trip header */}
                <div className="mb-6">
                    <h2 className="text-3xl font-bold">{trip.name}</h2>
                    <p className="text-gray-600">{trip.city}</p>
                    {trip.startDate && trip.endDate && (
                        <p className="text-sm text-gray-500">
                            {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                        </p>
                    )}
                </div>

                {/* Visibility selector */}
                <div className="mb-6 flex gap-3 items-center p-4 bg-white rounded shadow">
                    <label className="font-semibold">Share:</label>
                    <select
                        value={visibility}
                        onChange={(e) => handleVisibilityChange(e.target.value)}
                        className="p-2 border rounded"
                    >
                        <option value="private">🔒 Private (Only me)</option>
                        <option value="friends">👥 Friends Only</option>
                        <option value="public">🌍 Public (Everyone)</option>
                    </select>
                </div>

                {/* Day selector */}
                <div className="mb-6 flex gap-2 flex-wrap">
                    {[...Array(Math.max(maxDay, 1))].map((_, i) => {
                        const dayNum = i + 1;
                        return (
                            <button
                                key={dayNum}
                                onClick={() => setSelectedDay(dayNum)}
                                className={`px-4 py-2 rounded font-medium transition ${selectedDay === dayNum
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                Day {dayNum}
                            </button>
                        );
                    })}
                    <button
                        onClick={() => setSelectedDay(maxDay + 1)}
                        className="px-4 py-2 rounded bg-green-600 text-white font-medium hover:bg-green-700 transition"
                    >
                        + Add Day
                    </button>
                </div>

                {/* Add item form */}
                <div className="mb-6 bg-white p-4 rounded shadow space-y-4">
                    <form onSubmit={handleSearchAttractions}>
                        <h3 className="font-semibold mb-3">Search attractions for Day {selectedDay}</h3>
                        <div className="flex gap-2">
                            <input
                                value={searchCity}
                                onChange={(e) => setSearchCity(e.target.value)}
                                placeholder={trip.city ? `Search ${trip.city}` : 'Search a city like London'}
                                className="p-2 border rounded flex-1"
                            />
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
                                {searchLoading ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                        {searchError && (
                            <p className="text-red-500 text-sm mt-2">{searchError}</p>
                        )}
                    </form>

                    {searchResults.length > 0 && (
                        <div className="space-y-2">
                            {searchResults.map((place) => (
                                <div key={place.fsq_id || place.id} className="flex items-center justify-between gap-3 rounded border p-3">
                                    <div>
                                        <p className="font-medium">{place.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {place.location?.formatted_address || place.location?.address || 'No address available'}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleAddSearchResult(place)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm transition"
                                    >
                                        Add to Day {selectedDay}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleAddItem} className="border-t pt-4">
                        <h4 className="font-semibold mb-3">Advanced: add by Foursquare ID</h4>
                        <div className="flex gap-2">
                            <input
                                value={fsqId}
                                onChange={(e) => setFsqId(e.target.value)}
                                placeholder="Foursquare place id (fsq_id)"
                                className="p-2 border rounded flex-1"
                            />
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
                                Add
                            </button>
                        </div>
                        {addError && (
                            <p className="text-red-500 text-sm mt-2">{addError}</p>
                        )}
                    </form>
                </div>

                {/* Day items */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Day {selectedDay} Itinerary</h3>
                    {dayItems.length === 0 ? (
                        <div className="bg-white rounded shadow p-8 text-center">
                            <p className="text-4xl mb-2">📍</p>
                            <p className="text-gray-500 font-medium">No items yet</p>
                            <p className="text-gray-400 text-sm mt-1">Add a Foursquare place to start</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {dayItems.map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded shadow">
                                    {editingItemId === item.id ? (
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-sm font-medium">Time</label>
                                                <input
                                                    type="time"
                                                    value={editingTime}
                                                    onChange={(e) => setEditingTime(e.target.value)}
                                                    className="block w-full p-2 border rounded mt-1"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">Notes</label>
                                                <textarea
                                                    value={editingNotes}
                                                    onChange={(e) => setEditingNotes(e.target.value)}
                                                    placeholder="Add notes..."
                                                    className="block w-full p-2 border rounded mt-1"
                                                    rows="3"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEditItem(selectedDay, item.id)}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingItemId(null)}
                                                    className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm transition"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-lg">{item.name}</h4>
                                                <p className="text-sm text-gray-600">{item.address}</p>
                                                <div className="mt-2 space-y-1 text-sm">
                                                    {item.time && (
                                                        <p className="text-gray-700">⏰ {item.time}</p>
                                                    )}
                                                    {item.notes && (
                                                        <p className="text-gray-700">📝 {item.notes}</p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setEditingItemId(item.id);
                                                        setEditingTime(item.time || '');
                                                        setEditingNotes(item.notes || '');
                                                    }}
                                                    className="text-blue-600 hover:underline text-sm mt-2"
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveItem(selectedDay, item.id)}
                                                className="text-red-600 hover:text-red-800 font-medium"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
