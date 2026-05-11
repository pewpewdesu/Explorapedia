import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTrip, addAttraction, removeAttraction } from '../api/trips';

export default function TripDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [fsqId, setFsqId] = useState('');
    const [error, setError] = useState('');
    const [addError, setAddError] = useState('');

    async function load() {
        try {
            const data = await getTrip(id);
            setTrip(data);
        } catch (e) { 
            console.error(e); 
            setError('Failed to load trip.')
        }
    }

    useEffect(() => { load(); }, [id]);

    async function handleAdd(e) {
        e.preventDefault();
        if (!fsqId) return;
        setAddError('');
        try {
            await addAttraction(id, { fsq_id: fsqId });
            setFsqId('');
            await load();
        } catch (e) { 
            console.error(e);
            setAddError('Failed to add attraction. Check the ID.');
         }
    }

    async function handleRemove(fsq_id) 
    {
        if (!confirm('Remove this attraction?')) return;
        try
        {
            await removeAttraction(id, fsq_id);
            await load();

        } catch (e) 
            {
                console.error(e);
            }
    }
        
    // Loading state
    if (!trip) return (
        <div className = "p-6 min-h-screen bg-gray-50 flex items-center justify-center">
            <p className = "text-gray-500">Loading trip...</p>
        </div>
    );

    //Error state
    if(error) return (
        <div className = "p-6 min-h-screen bg-gray-50">
            <p className = "text-red-500">{error}</p>
            <button
                onClick={() => navigate('/trips')}
                className = "mt-4 text-blue-600 hover:underline"
            >
                 Back to My Trip
            </button>
        </div>
    );

    const attractions = trip.attractions || [];

    return (
        <div className="p-6 min-h-screen bg-gray-50">

            {/* Back button */}
            <button 
                onClick = {() => navigate('/trips')}
                className = "text-blue-600 hover:underline text-sm mb-4 inline-block"
                >
                    Back to My Trips
            </button>

            {/* Trip header */}
            <div className = "mb-6">
                <h2 className = "text-2x1 font-bold">{trip.name}</h2>
                <p className = "text-gray-500 text-sm">{trip.city}</p>
                <p className = "text-gray-400 text-xs mt-1">
                    {attractions.length} {attractions.length === 1 ? 'attraction' : 'attractions'}
                </p>
            </div>

            {/* adding attraction form */}
            {/* <h2 className="text-2xl font-bold mb-4">{trip.name} — {trip.city}</h2> */}

            <form onSubmit={handleAdd} className="mb-4">
                <div className="flex gap-2 max-w-md">
                    <input value={fsqId} onChange={(e) => setFsqId(e.target.value)} placeholder="Foursquare place id (fsq_id)" className="p-2 border rounded flex-1" />
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">Add</button>
                </div>
                {addError && (
                    <p className = "text-red-500 text-sm mt-2">{addError}</p>
                )}
            </form>

            {/* Empty State */}
            {attractions.length === 0 ? (
                <div className = "bg-white rounded-x1 shadow p-12 text-center max-w-md">
                    <p className = "text-4x1 mb-3">🗺️</p>
                    <p className = "text-gray-500 font-medium">No attractions yet</p>
                    <p className = "text-gray-400 text-sm mt-1">
                        Add a Foursquare place ID to start building your itinerary
                    </p>
                </div> 
            ) : (
                <div className="space-y-3">
                    {attractions.map((a) => (
                        <div 
                            key={a.fsq_id || a.name} 
                            className="bg-white p-3 rounded shadow flex justify-between items-start">
                                <div>
                                    <div className="font-semibold">{a.name}</div>
                                    <div className="text-sm text-gray-600">{a.address}</div>
                                </div>
                                {a.categories?.length > 0 && (
                                    <div className = "text-xs text-blue-500 mt-1">
                                        {a.categories.join(', ')}
                                    </div>
                                )}
                                <button 
                                    onClick={() => handleRemove(a.fsq_id)} 
                                    className="text-red-600">Remove</button>       
                        </div>
                    ))}
                </div>
                )}
            </div>
    );
}
