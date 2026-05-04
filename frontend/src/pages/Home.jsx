import { Link } from "react-router-dom";
export default function Home(){  
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

