import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle } from 'react-icons/fa'

export default function Navbar() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isAuthPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register'

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">Explorapedia</h1>
      
      {/* Showing nav parts only when logged in */}
      {token && !isAuthPage && (
    
        <div className="flex items-center space-x-4">
          <Link to="/home" className="hover:text-yellow-300 transition">
            Home
          </Link>
          <Link to="/explore" className="hover:text-yellow-300 transition">
            Explore
          </Link>
          <Link to="/trips" className="hover:text-yellow-300 transition">
            Trips
          </Link>

          <div className = "relative">
            <button 
              onClick = {() => setDropdownOpen(!dropdownOpen)}
              className ="w-8 h-8 rounded-full bg-white text indigo-600 font-bold flex items-center justify-center hover:opacity-90 transition"
              >
                <FaUserCircle size = {32} />
              </button>

              {dropdownOpen && (
                <div className = "absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-xl shadow-lg overflow-hidden z-50">
                  <Link
                    to = "/profile"
                    onClick = {() => setDropdownOpen(false)}
                    className = "block px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      Profile
                    </Link>
                    <button
                      onClick = {handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-500"
                    >
                      Logout
                    </button>
                </div>
              )}
          </div>

      </div>
      )}
    </nav>
  );
}
