import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listPublicTrips } from '../api/trips';

export default function SharedTrips() {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    async function load() {
        try {
            setLoading(true);
            const data = await listPublicTrips(20, 0);
            setTrips(data || []);
        } catch (e) {
            console.error(e);
            setError('Failed to load shared trips');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    if (loading) return (
        <div className="p-6 min-h-screen bg-gray-50 flex items-center justify-center">
            <p className="text-gray-500">Loading shared trips...</p>
        </div>
    );

    if (error) return (
        <div className="p-6 min-h-screen bg-gray-50">
            <p className="text-red-500">{error}</p>
        </div>
    );

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">🌍 Explore Shared Trips</h2>
                <p className="text-gray-600 mb-6">Discover amazing trips from other travelers</p>

                {trips.length === 0 ? (
                    <div className="bg-white rounded shadow p-12 text-center">
                        <p className="text-4xl mb-3">✈️</p>
                        <p className="text-gray-500 font-medium">No public trips yet</p>
                        <p className="text-gray-400 text-sm mt-1">Be the first to share your adventure!</p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {trips.map((trip) => (
                            <Link
                                key={trip._id}
                                to={`/shared-trips/${trip._id}`}
                                className="bg-white rounded shadow hover:shadow-lg hover:-translate-y-1 transition p-4"
                            >
                                <h3 className="font-bold text-lg">{trip.name}</h3>
                                <p className="text-gray-600">{trip.city}</p>
                                {trip.itinerary && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        {trip.itinerary.length} day{trip.itinerary.length !== 1 ? 's' : ''}
                                    </p>
                                )}
                                <p className="text-xs text-blue-600 mt-3">View Trip →</p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
