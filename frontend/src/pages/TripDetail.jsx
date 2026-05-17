import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTrip, addToItinerary, editItineraryItem, removeItineraryItem, updateTripVisibility } from '../api/trips';
import { searchAttractions } from '../api/attractions';

function getAttractionLinks(place) {
    const links = [];

    // Google Maps link
    if (place.geocodes?.main?.latitude && place.geocodes?.main?.longitude) {
        const mapsUrl = `https://www.google.com/maps?q=${place.geocodes.main.latitude},${place.geocodes.main.longitude}`;
        links.push({ type: 'maps', label: '📍 View on Google Maps', url: mapsUrl });
    } else if (place.location?.formatted_address) {
        const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(place.location.formatted_address)}`;
        links.push({ type: 'maps', label: '📍 View on Google Maps', url: mapsUrl });
    }

    // Website link (if available from Foursquare)
    if (place.website) {
        links.push({ type: 'website', label: '🌐 Visit Website', url: place.website });
    } else if (place.url) {
        links.push({ type: 'website', label: '🌐 Visit Website', url: place.url });
    }

    return links;
}

export default function TripDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [fsqId, setFsqId] = useState('');
    const [error, setError] = useState('');
    const [addError, setAddError] = useState('');
    const [addSuccess, setAddSuccess] = useState('');
    const [selectedDay, setSelectedDay] = useState(1);
    const [visibility, setVisibility] = useState('private');
    const [editingItemId, setEditingItemId] = useState(null);
    const [editingNotes, setEditingNotes] = useState('');
    const [editingTime, setEditingTime] = useState('');
    const [searchCity, setSearchCity] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [selectedAttraction, setSelectedAttraction] = useState(null);

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
        setAddSuccess('');
        try {
            await addToItinerary(id, selectedDay, { fsq_id: fsqId });
            setFsqId('');
            setAddSuccess('✓ Attraction added to your itinerary!');
            await load();
            setTimeout(() => setAddSuccess(''), 3000);
        } catch (e) {
            console.error(e);
            setAddError('Failed to add item. Check the Foursquare ID.');
        }
    }

    async function handleEditItem(dayNum, itemId) {
        try {
            setAddError('');
            setAddSuccess('');
            await editItineraryItem(id, dayNum, itemId, {
                notes: editingNotes,
                time: editingTime,
            });
            setEditingItemId(null);
            setAddSuccess('✓ Item updated successfully!');
            await load();
            setTimeout(() => setAddSuccess(''), 3000);
        } catch (e) {
            console.error(e);
            setAddError('Failed to update item.');
        }
    }

    async function handleRemoveItem(dayNum, itemId) {
        if (!confirm('Remove this item?')) return;
        try {
            setAddError('');
            setAddSuccess('');
            await removeItineraryItem(id, dayNum, itemId);
            setAddSuccess('✓ Item removed from itinerary.');
            await load();
            setTimeout(() => setAddSuccess(''), 3000);
        } catch (e) {
            console.error(e);
            setAddError('Failed to remove item.');
        }
    }

    async function handleVisibilityChange(newVis) {
        try {
            setAddError('');
            setAddSuccess('');
            setVisibility(newVis);
            await updateTripVisibility(id, newVis);
            setAddSuccess('✓ Trip visibility updated!');
            setTimeout(() => setAddSuccess(''), 3000);
        } catch (e) {
            console.error(e);
            setVisibility(visibility); // Revert on error
            setAddError('Failed to update visibility.');
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
            setAddSuccess('');

            if (!place?.name) {
                setAddError('Invalid attraction data. Please try again.');
                return;
            }

            const item = {
                fsq_id: place.fsq_id || place.id,
                name: place.name,
                address: place.location?.formatted_address || place.location?.address || place.address || null,
                lat: place.geocodes?.main?.latitude || null,
                lon: place.geocodes?.main?.longitude || null,
            };

            await addToItinerary(id, selectedDay, { item });
            setAddSuccess('✓ Attraction added to your itinerary!');
            await load();
            setTimeout(() => setAddSuccess(''), 3000);
        } catch (e) {
            console.error(e);
            setAddError('Failed to add attraction. Please try again.');
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
        <>
            <div className="min-h-screen bg-[#eef0fb] p-8">
                <div className="max-w-4xl mx-auto">
                    {/* Back button */}
                    <button
                        onClick={() => navigate('/trips')}
                        className="text-indigo-500 hover:underline text-sm mb-4 inline-block"
                    >
                        ← Back to My Trips
                    </button>

                    {/* Trip header */}
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold">{trip.name}</h2>
                        <p className="text-gray-500">{trip.city}</p>
                        {trip.startDate && trip.endDate && (
                            <p className="text-sm text-gray-400">
                                {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                            </p>
                        )}
                    </div>

                    {/* Visibility selector */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700">Visibility:</label>
                        <select
                            value={visibility}
                            onChange={(e) => handleVisibilityChange(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-indigo-400"
                        >
                            <option value="private"> Private (Only me)</option>
                            <option value="friends"> Friends Only</option>
                            <option value="public"> Public (Everyone)</option>
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
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${selectedDay === dayNum
                                        ? 'bg-indigo-500 text-white'
                                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    Day {dayNum}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => setSelectedDay(maxDay + 1)}
                            className="px-4 py-2 rounded-lg bg-white border border-indigo-300 text-indigo-500 text-sm font-medium hover:bg-indigo-50 transition"
                        >
                            + Add Day
                        </button>
                    </div>

                    {/* Add item form */}
                    <div className="mb-6 bg-white p-4 rounded-lg shadow space-y-4">
                        {addSuccess && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                                {addSuccess}
                            </div>
                        )}
                        <div className = "bg-white rounded-2xl border border-gray-200 p-6 mb-6 space-y-4">
                            <form onSubmit={handleSearchAttractions}>
                                <h3 className="font-semibold text-grau-800 mb-3">Search attractions for Day {selectedDay}</h3>
                                <div className="flex gap-2">
                                    <input
                                        value={searchCity}
                                        onChange={(e) => setSearchCity(e.target.value)}
                                        placeholder={trip.city ? `Search ${trip.city}` : 'Search a city like London'}
                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    />
                                    <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                                        {searchLoading ? 'Searching...' : 'Search'}
                                    </button>
                                </div>
                                {searchError && (
                                    <p className="text-red-500 text-sm mt-2">{searchError}</p>
                                )}
                            </form>

                            {searchResults.length > 0 && (
                                <div className="space-y-2 border-t pt-4">
                                    {searchResults.map((place) => (
                                        <div
                                            key={place.fsq_id || place.id}
                                            className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-3 hover:bg-gray-50 cursor-pointer transition"
                                            onClick={() => setSelectedAttraction(place)}
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium">{place.name}</p>
                                                <p className="text-sm text-gray-400">
                                                    {place.location?.formatted_address || place.location?.address || 'No address available'}
                                                </p>
                                                <p className="text-xs text-indigo-400 mt-0.5">Click to view details</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAddSearchResult(place);
                                                }}
                                                className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs transition"
                                            >
                                                Add to Day {selectedDay}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <form onSubmit={handleAddItem} className="border-t pt-4">
                                <h4 className="font-semibold text-grau-800 mb-3">Advanced: add by Foursquare ID</h4>
                                <div className="flex gap-2">
                                    <input
                                        value={fsqId}
                                        onChange={(e) => setFsqId(e.target.value)}
                                        placeholder="Foursquare place id (fsq_id)"
                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    />
                                    <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors">
                                        Add
                                    </button>
                                </div>
                                {addError && (
                                    <p className="text-red-500 text-sm mt-2">{addError}</p>
                                )}
                            </form>
                        </div>
                    </div>
                    {/* Day items */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Day {selectedDay} Itinerary</h3>
                        {dayItems.length === 0 ? (
                            <div className="bg-white rounded-2xl border border=gray-200 p-12 text-center">
                                <p className="text-4xl mb-2">📍</p>
                                <p className="text-gray-500 font-medium">No items yet</p>
                                <p className="text-gray-400 text-sm mt-1">Search for attractions above to add to your itinerary</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {dayItems.map((item) => (
                                    <div key={item.id} className="bg-white rounded-2xl border border-gray-200 p-4">
                                        {editingItemId === item.id ? (
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-xs font-medium text-gray-600">Time</label>
                                                    <input
                                                        type="time"
                                                        value={editingTime}
                                                        onChange={(e) => setEditingTime(e.target.value)}
                                                        className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-medium text-gray-600">Notes</label>
                                                    <textarea
                                                        value={editingNotes}
                                                        onChange={(e) => setEditingNotes(e.target.value)}
                                                        placeholder="Add notes..."
                                                        className="block w-full p-2 border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                                        rows="3"
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEditItem(selectedDay, item.id)}
                                                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm transition"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingItemId(null)}
                                                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1.5 rounded-lg text-sm transition"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-lg">{item.name}</h4>
                                                    <p className="text-sm text-gray-400">{item.address}</p>
                                                    <div className="mt-2 space-y-1 text-sm">
                                                        {item.time && (
                                                            <p className="text-gray-600">⏰ {item.time}</p>
                                                        )}
                                                        {item.notes && (
                                                            <p className="text-gray-600">📝 {item.notes}</p>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            setEditingItemId(item.id);
                                                            setEditingTime(item.time || '');
                                                            setEditingNotes(item.notes || '');
                                                        }}
                                                        className="text-indigo-500 hover:underline text-sm mt-2"
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

            {/* Attraction Details Modal */}
            {selectedAttraction && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">{selectedAttraction.name}</h2>
                            <button
                                onClick={() => setSelectedAttraction(null)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div>
                                <p className="text-sm text-gray-500">Address</p>
                                <p className="text-gray-800">
                                    {selectedAttraction.location?.formatted_address || selectedAttraction.location?.address || 'No address available'}
                                </p>
                            </div>

                            {selectedAttraction.categories?.[0]?.name && (
                                <div>
                                    <p className="text-sm text-gray-500">Category</p>
                                    <p className="text-gray-800">{selectedAttraction.categories[0].name}</p>
                                </div>
                            )}

                            {selectedAttraction.distance && (
                                <div>
                                    <p className="text-sm text-gray-500">Distance</p>
                                    <p className="text-gray-800">{Math.round(selectedAttraction.distance)}m away</p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2 mb-4">
                            {getAttractionLinks(selectedAttraction).map((link) => (
                                <a
                                    key={link.type}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full bg-indigo-500 hover:bg-indifo-600 text-white px-4 py-2 rounded-lg transition text-center font-medium"
                                >
                                    {link.label}
                                </a>
                            ))}
                            {getAttractionLinks(selectedAttraction).length === 0 && (
                                <p className="text-gray-500 text-sm text-center">No external links available for this attraction</p>
                            )}
                        </div>

                        <button
                            onClick={() => setSelectedAttraction(null)}
                            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
