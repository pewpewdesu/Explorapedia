import { useEffect, useState } from "react";

export default function Explore() {
  const [search, setSearch] = useState("");
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🌐 Fetch real data (GeoDB Cities as “attractions base”)
  useEffect(() => {
    fetch(
      "https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=20",
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": "YOUR_API_KEY_HERE",
          "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setAttractions(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // 🔍 Filter search
  const filtered = attractions.filter((item) =>
    item.city.toLowerCase().includes(search.toLowerCase())
  );

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
          placeholder="Search attractions..."
          className="w-full max-w-md p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500">Loading attractions...</p>
      )}

      {/* Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl hover:-translate-y-1 transition"
          >
            <h2 className="text-xl font-bold text-gray-800">
              {item.city}
            </h2>

            <p className="text-gray-500">{item.country}</p>

            <div className="mt-3 text-sm text-gray-400">
              Population:{" "}
              {item.population?.toLocaleString() || "N/A"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
