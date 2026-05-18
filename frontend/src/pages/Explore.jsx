import { useEffect, useState } from "react";
import { searchAttractions } from "../api/attractions";

function getAttractionLinks(place) {
  const links = [];

  // Google Maps link
  if (place.geocodes?.main?.latitude && place.geocodes?.main?.longitude) {
    const mapsUrl = `https://www.google.com/maps?q=${place.geocodes.main.latitude},${place.geocodes.main.longitude}`;
    links.push({ type: 'maps', label: '📍 View on Google Maps', url: mapsUrl });
  } else if (place.location?.formatted_address) {
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(place.location.formatted_address)}`;
    links.push({ type: 'maps', label: '📍 View on Google Maps', url: mapsUrl });
  }

  // Website link (if available from Foursquare)
  if (place.website) {
    links.push({ type: 'website', label: '🌐 Visit Website', url: place.website });
  } else if (place.url) {
    links.push({ type: 'website', label: '🌐 Visit Website', url: place.url });
  }

  return links;
}

export default function Explore() {
  const [search, setSearch] = useState("");
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAttraction, setSelectedAttraction] = useState(null);

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
    <div className="min-h-screen bg-[#eef0fb] from-blue-50 via-white to-purple-50 p-8">

      {/* Title */}
      <h1 className="text-4xl font-bold text-center mb-6">
        Explore Attractions
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

      {/* Grid (search) */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {attractions.map((item) => (
          <div
            key={item.fsq_id || item.id}
            onClick={() => setSelectedAttraction(item)}
            className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl hover:-translate-y-1 transition cursor-pointer"
          >
            <h2 className="text-xl font-bold text-gray-800">
              {item.name}
            </h2>

            <p className="text-gray-500">{item.location?.formatted_address || item.address || 'No address available'}</p>

            <div className="mt-3 text-sm text-gray-400">
              {item.categories?.[0]?.name || item.distance ? `Category: ${item.categories?.[0]?.name || 'Attraction'}${item.distance ? ` · ${Math.round(item.distance)}m away` : ''}` : 'Attraction'}
            </div>

            <div className="mt-4">
              <p className="text-blue-600 text-sm font-medium">Click to view details →</p>
            </div>
          </div>
        ))}
      </div>

      {/* Attraction Details Modal */}
      {selectedAttraction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{selectedAttraction.name}</h2>
              <button
                onClick={() => setSelectedAttraction(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-gray-800">
                  {selectedAttraction.location?.formatted_address || selectedAttraction.address || 'No address available'}
                </p>
              </div>

              {selectedAttraction.categories?.[0]?.name && (
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="text-gray-800">{selectedAttraction.categories[0].name}</p>
                </div>
              )}

              {selectedAttraction.distance && (
                <div>
                  <p className="text-sm text-gray-500">Distance</p>
                  <p className="text-gray-800">{Math.round(selectedAttraction.distance)}m away</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {getAttractionLinks(selectedAttraction).map((link) => (
                <a
                  key={link.type}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-center font-medium"
                >
                  {link.label}
                </a>
              ))}
              {getAttractionLinks(selectedAttraction).length === 0 && (
                <p className="text-gray-500 text-sm text-center">No external links available for this attraction</p>
              )}
            </div>

            <button
              onClick={() => setSelectedAttraction(null)}
              className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* recommended grid */}
      {!search && (
        <div className="max-w 5xl mx-auto">
          <h2 className="text-xl font-bold mb-2">Recommended Places</h2>
          <p className="text-gray-400 text-sm mb-4">Popular destinations to inspire your next trip.</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: "Paris", country: "France", img: "https://images.unsplash.com/photo-1776706261290-7c53ead8e45c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDk1fEZ6bzN6dU9ITjZ3fHxlbnwwfHx8fHw%3D" },
              { name: "London", country: "England", img: "https://images.unsplash.com/photo-1776549821171-fd5b5d310f30?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDExN3xGem8zenVPSE42d3x8ZW58MHx8fHx8" },
              { name: "Sydney", country: "Austrailia", img: "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTf6k9YCySEZ7W91pfpkEPGSD7RDwTQ23ePfZAo3SPdBqMqUtoPKXKchQKi72oHRF8VQC9Jsq-PI54QYCxMAiFo-98&s=19" },
              { name: "Bangkok", country: "Thailand", img: "https://images.unsplash.com/photo-1773414001281-7e1cadd04a79?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDEyOHxGem8zenVPSE42d3x8ZW58MHx8fHx8" },
              { name: "New York", country: "USA", img: "https://plus.unsplash.com/premium_photo-1749200412744-df6cf06f0496?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDYyfEZ6bzN6dU9ITjZ3fHxlbnwwfHx8fHw%3D" },
              { name: "Tokyo", country: "Japan", img: "https://images.unsplash.com/photo-1775975405747-9b512d6e93a4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
            ].map((place) => (
              <div
                key={place.name}
                className="relative rounded-2xl overflow-hidden cursor-pointer group h-48"
              >
                <img
                  src={place.img}
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <p className="text-white font-bold text-lg">{place.name}</p>
                  <p className="text-gray-300 text-xs">{place.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
