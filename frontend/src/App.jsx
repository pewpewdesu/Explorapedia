import { Routes, Route, Link } from "react-router-dom";

// Navbar
function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">🌍 Explorapedia</h1>

      <div className="space-x-4">
        <Link to="/" className="hover:text-yellow-300 transition">
          Home
        </Link>
        <Link to="/explore" className="hover:text-yellow-300 transition">
          Explore
        </Link>
      </div>
    </nav>
  );
}

// Home
function Home() {
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-4xl font-bold mb-3">Welcome to Explorapedia</h2>
      <p className="text-gray-600 mb-8">
        Discover places, plan trips, and share your adventures ✈️
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="font-bold text-lg">Discover</h3>
          <p>Find top attractions in any city.</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="font-bold text-lg">Plan</h3>
          <p>Create and organize travel itineraries.</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="font-bold text-lg">Share</h3>
          <p>Collaborate with friends easily.</p>
        </div>
      </div>
    </div>
  );
}

// Explore
function Explore() {
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

// App
export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
      </Routes>
    </>
  );
}
