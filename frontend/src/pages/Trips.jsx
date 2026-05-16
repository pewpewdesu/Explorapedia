import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listTrips, createTrip, deleteTrip } from '../api/trips';

export default function Trips() {
    const [trips, setTrips] = useState([]);
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');
    const [createSuccess, setCreateSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const navigate = useNavigate();

    async function load() {
        try {
            setLoading(true);
            setError('');
            const data = await listTrips();
            setTrips(data || []);
        } catch (e) {
            console.error(e);
            setError('Failed to load trips. Please refresh the page.');
            setTrips([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    async function handleCreate(e) {
        e.preventDefault();
        setError('');
        setCreateSuccess('');

        if (!name.trim() || !city.trim()) {
            setError('Please fill in trip name and city.');
            return;
        }

        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            setError('Start date must be before end date.');
            return;
        }

        try {
            setLoading(true);
            const res = await createTrip({ name, city, startDate, endDate });
            setCreateSuccess('✓ Trip created successfully!');
            setName('');
            setCity('');
            setStartDate('');
            setEndDate('');
            if (res?.tripId) navigate(`/trips/${res.tripId}`);
            else await load();
        } catch (e) {
            console.error(e);
            setError(e.response?.data?.message || 'Failed to create trip. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        if (!confirm('Delete this trip? This action cannot be undone.')) return;
        try {
            setDeleteError('');
            await deleteTrip(id);
            await load();
        } catch (e) {
            console.error(e);
            setDeleteError('Failed to delete trip. Please try again.');
        }
    }

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">✈️ My Trips</h2>

                <form onSubmit={handleCreate} className="mb-8 bg-white p-6 rounded shadow">
                    <h3 className="font-semibold text-lg mb-4">Create New Trip</h3>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}
                    {createSuccess && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            {createSuccess}
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Trip name"
                            required
                            className="p-2 border rounded"
                        />
                        <input
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="City"
                            required
                            className="p-2 border rounded"
                        />
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="p-2 border rounded"
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="p-2 border rounded"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating...' : 'Create Trip'}
                        </button>
                    </div>
                </form>

                {deleteError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {deleteError}
                    </div>
                )}

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {trips.map((t) => (
                        <div key={t._id} className="bg-white p-4 rounded shadow hover:shadow-lg transition">
                            <h3 className="font-bold text-lg">{t.name}</h3>
                            <p className="text-sm text-gray-600">{t.city}</p>
                            {t.startDate && t.endDate && (
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(t.startDate).toLocaleDateString()} - {new Date(t.endDate).toLocaleDateString()}
                                </p>
                            )}
                            <p className="text-xs text-gray-400 mt-2">
                                {t.visibility === 'public' ? '🌍 Public' : t.visibility === 'friends' ? '👥 Friends' : '🔒 Private'}
                            </p>
                            <div className="mt-4 flex gap-2">
                                <Link to={`/trips/${t._id}`} className="text-blue-600 hover:underline text-sm flex-1">
                                    Open
                                </Link>
                                <button onClick={() => handleDelete(t._id)} className="text-red-600 hover:underline text-sm">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {trips.length === 0 && (
                    <div className="bg-white rounded shadow p-12 text-center max-w-md mx-auto mt-8">
                        <p className="text-4xl mb-3">🗺️</p>
                        <p className="text-gray-500 font-medium">No trips yet</p>
                        <p className="text-gray-400 text-sm mt-1">Create your first trip to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
