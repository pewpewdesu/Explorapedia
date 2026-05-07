import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listTrips, createTrip, deleteTrip } from '../api/trips';

export default function Trips() {
    const [trips, setTrips] = useState([]);
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
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
            const res = await createTrip({ name, city });
            setName('');
            setCity('');
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
            <h2 className="text-3xl font-bold mb-4">My Trips</h2>

            <form onSubmit={handleCreate} className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-xl">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Trip name" className="p-2 border rounded" />
                <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="p-2 border rounded" />
                <button className="bg-blue-600 text-white px-4 py-2 rounded">Create Trip</button>
            </form>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {trips.map((t) => (
                    <div key={t._id} className="bg-white p-4 rounded shadow">
                        <h3 className="font-bold text-lg">{t.name}</h3>
                        <p className="text-sm text-gray-600">{t.city}</p>
                        <div className="mt-3 space-x-2">
                            <Link to={`/trips/${t._id}`} className="text-blue-600 hover:underline">Open</Link>
                            <button onClick={() => handleDelete(t._id)} className="text-red-600 hover:underline">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
