import { Link } from "react-router-dom";
import {FaCompass, FaCalendarAlt, FaCamera } from 'react-icons/fa'

export default function Home(){  
  return (
    <div className = "min-h-screen bg-[#eef0fb] p-8">

      {/* Top section */}
      <div className = "text-center py-12">
        <h1 className = "text-4xl font-bold text-gray-900 mb-3">
          Welcome to <span className = "text-indigo-500">Explorapedia</span>
        </h1>

        <p className = "text-gray-500 text-lg mb-8">
          Discover places, plan trips, and share your adventures!
        </p>

        <div className = "flex justify-center">
          <Link
            to = "/explore"
            className = "bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-full font-medium transition-colors">
            Start Exploring
          </Link>
        </div>
      </div>

      {/* cards */}
      <div className = "grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        
        {/* Discover/Explore card */}
        <div className = "bg-white rounded-2xl p-5 shadow-sm border border-gray-300">
          <div className = "bg-indigo-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
            <FaCompass className = "text-indigo-500 text-xl" />
          </div>
          <h3 className = "font-bold text-xl mb-2">Discover</h3>
          <p className = "text-gray-500 text-sm mb-4">
            Uncover hidden gems and popular destinations curated specifically for you.
          </p>
          <img 
            src = "https://t4.ftcdn.net/jpg/00/65/48/25/360_F_65482539_C0ZozE5gUjCafz7Xq98WB4dW6LAhqKfs.jpg"
            alt = "Discover"
            className="w-full h-40 object-cover rounded-xl mb-4"
          />
          <Link to = "/explore" className = "text-indigo-500 text-sm font-medium hover:underline">
          Find places →
          </Link>

        </div>

        {/* Plan/trips card */}
        <div className = "bg-white rounded-2xl p-5 shadow-sm border border-gray-300">
          <div className = "bg-indigo-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
            <FaCalendarAlt className = "text-indigo-500 text-xl"/>
          </div>
          <h3 className = "font-bold text-xl mb-2">Plan</h3>
          <p className = "text-gray-500 text-sm mb-4">
            Get started creating and organizing your trip itineraries.
          </p>
          <img
            src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop"
            alt = "Plan"
            className = "w-full h-40 object-cover rounded-xl mb-4"
          />
          <Link to = "/trips" className = "text-indigo-500 text-sm font-medium hover:underline">
          Start Planning →
          </Link>
        </div>

        {/* Sharing trips card */}
        <div className = "bg-white rounded-2xl p-5 shadow-sm border border-gray-300">
          <div className = "bg-indigo-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
            <FaCalendarAlt className = "text-indigo-500 text-xl"/>
          </div>
          <h3 className = "font-bold text-xl mb-2">Share</h3>
          <p className = "text-gray-500 text-sm mb-4">
            Connect with other travelers and share your experiences.
          </p>
          <img
            src = "https://images.unsplash.com/photo-1777891873941-ea5d0ee868af?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDI4fEZ6bzN6dU9ITjZ3fHxlbnwwfHx8fHw%3D"
            alt = "Share"
            className = "w-full h-40 object-cover rounded-xl mb-4"
          />
          <Link to = "/trips" className = "text-indigo-500 text-sm font-medium hover:underline">
          Connect Now →
          </Link>
        </div>

      </div>    
      {/* <div className="p-6 min-h-screen bg-gray-50">
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
      </div> */}
    </div>
  );
}

