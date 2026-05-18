import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listTrips, createTrip, deleteTrip } from '../api/trips';
import api from '../services/api';

export default function Trips() {
    const [trips, setTrips] = useState([]);
    const [sharedTrips, setSharedTrips] = useState([]);
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');
    const [createSuccess, setCreateSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [sharedTripsLoading, setSharedTripsLoading] = useState(false);
    const navigate = useNavigate();

    async function load() {
        try {
            setLoading(true);
            setError('');
            const data = await listTrips();
            setTrips(data || []);

            // Load shared trips from friends
            try {
                setSharedTripsLoading(true);
                const sharedData = await api.get('/trips/shared/friends/list');
                setSharedTrips(sharedData.data || []);
            } catch (e) {
                console.error('Failed to load shared trips:', e);
                setSharedTrips([]);
            } finally {
                setSharedTripsLoading(false);
            }
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
        <div className="p-6 min-h-screen bg-[#eef0fb]">
            <div className="max-w-4xl mx-auto">

                {/* header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Trips</h1>
                    <p className="text-gray-500 text-sm">Your journey starts here.</p>
                </div>

                {/* trip card */}
                <form onSubmit={handleCreate} className="mb-8 bg-white p-6 rounded-2xl shadow">
                    <p className="text-black text-medium mb-4">Create a trip...</p>

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


                    <div className="grid grid-cols-4 gap-3 mb-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-black">Trip name</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder=""
                                required
                                className="p-2 border rounded bg-gray-200"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-black">City</label>
                            <input
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder=""
                                required
                                className="p-2 border rounded bg-gray-200"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-black">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="p-2 border rounded bg-gray-200"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-black">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="p-2 border rounded bg-gray-200"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {loading ? 'Creating...' : '+ Create Trip'}
                        </button>
                    </div>
                </form>

                {deleteError && (
                    <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
                        {deleteError}
                    </div>
                )}

                {/* my trips */}
                <div className="mb-8">
                    <h2 className="font-bold text-lg mb-1">My Trips</h2>
                    <p className="text-gray-400 text-xs mb-4">View your personal trips.</p>

                    {trips.length === 0 ? (
                        <div className="bg-white rounded shadow p-12 text-center max-w-md mx-auto mt-8">
                            <p className="text-4xl mb-3">🗺️</p>
                            <p className="text-gray-500 font-medium">No trips yet</p>
                            <p className="text-gray-400 text-sm mt-1">Create your first trip to get started!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {trips.map((t) => (
                                <div key={t._id} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center text-2x1">

                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">{t.name}</p>
                                        <p className="text-gray-400 text-xs">
                                            {t.city}
                                            {t.startDate && t.endDate && (
                                                <> • {new Date(t.startDate).toLocaleDateString()} - {new Date(t.endDate).toLocaleDateString()}</>
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
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
                    )}
                </div>

                {/* shared trips */}
                <div className="mb-8">
                    <h2 className="font-bold text-lg mb-1">Shared Trips</h2>
                    <p className="text-gray-400 text-xs mb-4">Trips from your friends marked "Friends Only".</p>

                    {sharedTripsLoading ? (
                        <p className="text-gray-500 text-sm">Loading shared trips...</p>
                    ) : sharedTrips.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow p-12 text-center w-full">
                            <p className="text-gray-500 font-medium">No shared trips</p>
                            <p className="text-gray-400 text-sm mt-1">Your friends haven't shared any trips with you yet!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {sharedTrips.map((t) => (
                                <div key={t._id} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4">
                                    <div className=" w-full rounded-xl bg-purple-100 flex items-center justify-center text-2xl">
                                        🤝
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">{t.name}</p>
                                        <p className="text-gray-400 text-xs">
                                            {t.city}
                                            {t.startDate && t.endDate && (
                                                <> • {new Date(t.startDate).toLocaleDateString()} - {new Date(t.endDate).toLocaleDateString()}</>
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Link to={`/shared-trips/${t._id}`} className="text-blue-600 hover:underline text-sm">
                                            View
                                        </Link>
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
