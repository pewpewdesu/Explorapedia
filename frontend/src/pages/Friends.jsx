import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Friends() {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [searchError, setSearchError] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [addFriendLoading, setAddFriendLoading] = useState(false);

    // Load friends on mount
    useEffect(() => {
        loadFriends();
    }, []);

    async function loadFriends() {
        try {
            setLoading(true);
            setError('');
            const res = await api.get('/auth/friends/list');
            setFriends(res.data || []);
        } catch (err) {
            console.error(err);
            setError('Failed to load friends.');
        } finally {
            setLoading(false);
        }
    }

    async function handleSearchFriend(e) {
        e.preventDefault();
        setSearchError('');
        setSearchResult(null);

        if (!searchEmail.trim()) {
            setSearchError('Please enter an email address');
            return;
        }

        try {
            setSearchLoading(true);
            const res = await api.get(`/auth/search/${encodeURIComponent(searchEmail)}`);
            setSearchResult(res.data);
        } catch (err) {
            if (err.response?.status === 404) {
                setSearchError('User not found');
            } else if (err.response?.status === 400) {
                setSearchError(err.response?.data?.message || 'Cannot search this user');
            } else {
                setSearchError('Failed to search user');
            }
            setSearchResult(null);
        } finally {
            setSearchLoading(false);
        }
    }

    async function handleAddFriend(userId) {
        try {
            setAddFriendLoading(true);
            await api.post('/auth/friends/add', { email: searchEmail });
            // Clear search and reload friends
            setSearchEmail('');
            setSearchResult(null);
            await loadFriends();
        } catch (err) {
            console.error(err);
            setSearchError(err.response?.data?.message || 'Failed to add friend');
        } finally {
            setAddFriendLoading(false);
        }
    }

    return (
        <div className="flex flex-col gap-6 h-full">
            {/* Search Friend Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-lg mb-4">Add a Friend</h3>
                <form onSubmit={handleSearchFriend} className="flex gap-2 mb-4">
                    <input
                        type="email"
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                        placeholder="Enter friend's email address..."
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <button
                        type="submit"
                        disabled={searchLoading}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {searchLoading ? 'Searching...' : 'Search'}
                    </button>
                </form>

                {searchError && (
                    <div className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm mb-4">
                        {searchError}
                    </div>
                )}

                {searchResult && (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-sm">{searchResult.username}</p>
                                <p className="text-gray-500 text-xs">{searchResult.email}</p>
                            </div>
                            {searchResult.isAlreadyFriend ? (
                                <span className="text-green-600 text-sm font-medium">✓ Friends</span>
                            ) : (
                                <button
                                    onClick={() => handleAddFriend(searchResult._id)}
                                    disabled={addFriendLoading}
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {addFriendLoading ? 'Adding...' : 'Add Friend'}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Friends List Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex-1 overflow-y-auto">
                <h3 className="font-bold text-lg mb-4">Your Friends ({friends.length})</h3>

                {error && (
                    <div className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm mb-4">
                        {error}
                    </div>
                )}

                {loading ? (
                    <p className="text-gray-500 text-sm">Loading friends...</p>
                ) : friends.length === 0 ? (
                    <p className="text-gray-500 text-sm">No friends yet. Search and add a friend above!</p>
                ) : (
                    <div className="space-y-3">
                        {friends.map((friend) => (
                            <div key={friend._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-sm">{friend.username}</p>
                                    <p className="text-gray-500 text-xs">{friend.email}</p>
                                </div>
                                <span className="text-indigo-600 text-xs font-medium">👥</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
