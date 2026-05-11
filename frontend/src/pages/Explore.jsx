import { useEffect, useState } from "react";
import { searchAttractions } from "../api/attractions";

export default function Explore() {
  const [search, setSearch] = useState("");
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🌐 Search attractions by city through the backend/Foursquare
  useEffect(() => {
    const city = search.trim();

    if (!city) {
      setAttractions([]);
      setLoading(false);
      setError("");
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const results = await searchAttractions(city);
        setAttractions(results || []);
      } catch (err) {
        setError("Failed to fetch attractions.");
        setAttractions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">

      {/* Title */}
      <h1 className="text-4xl font-bold text-center mb-6">
        Explore Attractions 🌍
      </h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search a city like London or Paris"
          className="w-full max-w-md p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
      </div>

      {!search && (
        <p className="text-center text-gray-500 mb-6">
          Type a city to browse attractions.
        </p>
      )}

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500">Loading attractions...</p>
      )}

      {error && (
        <p className="text-center text-red-600 mb-4">{error}</p>
      )}

      {/* Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {attractions.map((item) => (
          <div
            key={item.fsq_id || item.id}
            className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl hover:-translate-y-1 transition"
          >
            <h2 className="text-xl font-bold text-gray-800">
              {item.name}
            </h2>

            <p className="text-gray-500">{item.location?.formatted_address || item.address || 'No address available'}</p>

            <div className="mt-3 text-sm text-gray-400">
              {item.categories?.[0]?.name || item.distance ? `Category: ${item.categories?.[0]?.name || 'Attraction'}${item.distance ? ` · ${Math.round(item.distance)}m away` : ''}` : 'Attraction'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
