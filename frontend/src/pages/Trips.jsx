import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listTrips, createTrip, deleteTrip } from '../api/trips';

export default function Trips() {
    const [trips, setTrips] = useState([]);
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const navigate = useNavigate();

    async function load() {
        try {
            const data = await listTrips();
            setTrips(data || []);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => { load(); }, []);

    async function handleCreate(e) {
        e.preventDefault();
        try {
            const res = await createTrip({ name, city, startDate, endDate });
            setName('');
            setCity('');
            setStartDate('');
            setEndDate('');
            if (res.tripId) navigate(`/trips/${res.tripId}`);
            else await load();
        } catch (e) { console.error(e); }
    }

    async function handleDelete(id) {
        if (!confirm('Delete this trip?')) return;
        await deleteTrip(id);
        await load();
    }

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">✈️ My Trips</h2>

                <form onSubmit={handleCreate} className="mb-8 bg-white p-6 rounded shadow">
                    <h3 className="font-semibold text-lg mb-4">Create New Trip</h3>
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
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
                            Create Trip
                        </button>
                    </div>
                </form>

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
