import { Link } from "react-router-dom";

export default function Navbar() {
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

        {/* Adding Login/Register to Navbar */}
        <Link to = "/login" className = "hover:text-yellow-300 transition"> 
            Login
        </Link>
        <Link to = "/register" className = "hover:text-yellow-300 transition"> 
            Register
        </Link>

      </div>
    </nav>
  );
}
