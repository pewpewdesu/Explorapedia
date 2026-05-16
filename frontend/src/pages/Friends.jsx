import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Friends() {
    const navigate = useNavigate();
    const [friendTrips, setFriendTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newFriendEmail, setNewFriendEmail] = useState('');
    const [addFriendError, setAddFriendError] = useState('');
    const [addFriendSuccess, setAddFriendSuccess] = useState('');

    const token = localStorage.getItem('token');

    async function loadFriends() {
        try {
            setLoading(true);
            setError('');
            // Fetch trips shared with friends visibility
            const res = await api.get('/trips');
            const trips = res.data;

            // Filter trips that have friends visibility
            const friendSharedTrips = trips.filter(trip => trip.visibility === 'friends');
            setFriendTrips(friendSharedTrips);
        } catch (err) {
            console.error(err);
            setError('Failed to load friend trips.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        loadFriends();
    }, [token, navigate]);

    async function handleAddFriend(e) {
        e.preventDefault();
        setAddFriendError('');
        setAddFriendSuccess('');

        if (!newFriendEmail.trim()) {
            setAddFriendError('Please enter a friend\'s email');
            return;
        }

        try {
            // Note: This endpoint would need to be implemented on the backend
            // For now, we'll show a friendly message
            await api.post('/friends/add', { email: newFriendEmail });
            setAddFriendSuccess(`✓ Friend request sent to ${newFriendEmail}!`);
            setNewFriendEmail('');
            setTimeout(() => setAddFriendSuccess(''), 3000);
            await loadFriends();
        } catch (err) {
            console.error(err);
            // Show a helpful message if endpoint doesn't exist yet
            if (err.response?.status === 404) {
                setAddFriendError('Friend management feature coming soon! Make sure to share your trips with friends by setting visibility to "Friends Only".');
            } else {
                setAddFriendError('Failed to add friend. Please try again.');
            }
        }
    }

    if (!token) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">👥 Friends</h1>
                    <p className="text-gray-600">Connect with friends and see trips shared with you</p>
                </div>

                {/* Add Friend Section */}
                <div className="bg-white rounded shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Add a Friend</h2>
                    <form onSubmit={handleAddFriend} className="flex gap-2">
                        <input
                            type="email"
                            value={newFriendEmail}
                            onChange={(e) => setNewFriendEmail(e.target.value)}
                            placeholder="Enter friend's email address"
                            className="flex-1 p-2 border rounded"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                        >
                            Add Friend
                        </button>
                    </form>
                    {addFriendError && (
                        <p className="text-red-600 text-sm mt-2">{addFriendError}</p>
                    )}
                    {addFriendSuccess && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mt-2 text-sm">
                            {addFriendSuccess}
                        </div>
                    )}
                    <p className="text-gray-600 text-sm mt-4 italic">
                        💡 Tip: Share your trips with friends by setting trip visibility to "Friends Only" in your trip details.
                    </p>
                </div>

                {/* Trips Shared with Friends */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Trips Shared with Friends 🗺️</h2>

                    {loading ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : error ? (
                        <p className="text-red-600">{error}</p>
                    ) : friendTrips.length === 0 ? (
                        <div className="bg-white rounded shadow p-8 text-center">
                            <p className="text-gray-500 text-lg">No trips shared with friends yet</p>
                            <p className="text-gray-400 text-sm mt-2">
                                Create or edit a trip and set the visibility to "Friends Only" to share it
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {friendTrips.map((trip) => (
                                <div key={trip._id} className="bg-white rounded shadow hover:shadow-lg transition">
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {trip.name}
                                        </h3>
                                        <p className="text-gray-600 mb-4">📍 {trip.city}</p>
                                        {trip.startDate && trip.endDate && (
                                            <p className="text-sm text-gray-500 mb-4">
                                                {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                                            </p>
                                        )}
                                        <p className="text-sm text-gray-500 mb-4">
                                            {trip.itinerary?.reduce((sum, day) => sum + (day.items?.length || 0), 0) || 0} attractions planned
                                        </p>
                                        <button
                                            onClick={() => navigate(`/trips/${trip._id}`)}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                                        >
                                            View Trip Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Friends List Section (Placeholder) */}
                <div className="mt-12 bg-white rounded shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Your Friends</h2>
                    <div className="text-center py-8">
                        <p className="text-gray-500 mb-2">👨‍👩‍👧‍👦 Friend list coming soon!</p>
                        <p className="text-gray-400 text-sm">
                            Full friend management features will be available in the next update.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
