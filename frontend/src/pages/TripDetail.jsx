import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTrip, addAttraction, removeAttraction } from '../api/trips';

export default function TripDetail() {
    const { id } = useParams();
    const [trip, setTrip] = useState(null);
    const [fsqId, setFsqId] = useState('');

    async function load() {
        try {
            const data = await getTrip(id);
            setTrip(data);
        } catch (e) { console.error(e); }
    }

    useEffect(() => { load(); }, [id]);

    async function handleAdd(e) {
        e.preventDefault();
        if (!fsqId) return;
        try {
            await addAttraction(id, { fsq_id: fsqId });
            setFsqId('');
            await load();
        } catch (e) { console.error(e); }
    }

    async function handleRemove(fsq_id) {
        if (!confirm('Remove this attraction?')) return;
        await removeAttraction(id, fsq_id);
        await load();
    }

    if (!trip) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <h2 className="text-2xl font-bold mb-4">{trip.name} — {trip.city}</h2>

            <form onSubmit={handleAdd} className="mb-4">
                <div className="flex gap-2 max-w-md">
                    <input value={fsqId} onChange={(e) => setFsqId(e.target.value)} placeholder="Foursquare place id (fsq_id)" className="p-2 border rounded flex-1" />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
                </div>
            </form>

            <div className="space-y-3">
                {(trip.attractions || []).map((a) => (
                    <div key={a.fsq_id || a.name} className="bg-white p-3 rounded shadow flex justify-between items-start">
                        <div>
                            <div className="font-semibold">{a.name}</div>
                            <div className="text-sm text-gray-600">{a.address}</div>
                        </div>
                        <div>
                            <button onClick={() => handleRemove(a.fsq_id)} className="text-red-600">Remove</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
