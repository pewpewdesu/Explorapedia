import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPublicTrip } from '../api/trips';

export default function SharedTripDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [error, setError] = useState('');
    const [selectedDay, setSelectedDay] = useState(1);

    async function load() {
        try {
            const data = await getPublicTrip(id);
            setTrip(data);
        } catch (e) {
            console.error(e);
            setError('Trip not found or is private');
        }
    }

    useEffect(() => { load(); }, [id]);

    if (error) return (
        <div className="p-6 min-h-screen bg-gray-50">
            <p className="text-red-500">{error}</p>
            <button
                onClick={() => navigate('/shared-trips')}
                className="mt-4 text-blue-600 hover:underline"
            >
                Back to Shared Trips
            </button>
        </div>
    );

    if (!trip) return (
        <div className="p-6 min-h-screen bg-gray-50 flex items-center justify-center">
            <p className="text-gray-500">Loading trip...</p>
        </div>
    );

    const itinerary = trip.itinerary || [];
    const maxDay = itinerary.length > 0 ? Math.max(...itinerary.map(d => d.day)) : 1;
    const displayedDay = itinerary.find(d => d.day === selectedDay) || { day: selectedDay, items: [] };
    const dayItems = displayedDay.items || [];

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto">
                {/* Back button */}
                <button
                    onClick={() => navigate('/shared-trips')}
                    className="text-blue-600 hover:underline text-sm mb-4 inline-block"
                >
                    ← Back to Shared Trips
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
                </div>

                {/* Day items */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Day {selectedDay} Itinerary</h3>
                    {dayItems.length === 0 ? (
                        <div className="bg-white rounded shadow p-8 text-center">
                            <p className="text-4xl mb-2">📍</p>
                            <p className="text-gray-500 font-medium">No items for this day</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {dayItems.map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded shadow">
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
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
