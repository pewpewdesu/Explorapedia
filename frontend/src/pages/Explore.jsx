import { Link } from "react-router-dom";
export default function Explore() {
  
    const places = [
    { name: "Paris", desc: "City of Light" },
    { name: "New York", desc: "The Big Apple" },
    { name: "Tokyo", desc: "Modern meets tradition" },
    { name: "Dubai", desc: "Luxury city" },
  ];

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-6">Explore Destinations 🌍</h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {places.map((place, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl shadow hover:shadow-xl hover:-translate-y-1 transition"
          >
            <h3 className="font-bold text-lg">{place.name}</h3>
            <p className="text-gray-600">{place.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
