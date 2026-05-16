import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

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
        <Link to="/trips" className="hover:text-yellow-300 transition">
          Trips
        </Link>
        <Link to="/friends" className="hover:text-yellow-300 transition">
          Friends
        </Link>
        <Link to="/shared-trips" className="hover:text-yellow-300 transition">
          Shared Trips
        </Link>

        {token ? (
          <>
            <Link to="/profile" className="hover:text-yellow-300 transition">
              Profile
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="hover:text-yellow-300 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-yellow-300 transition">
              Login
            </Link>
            <Link to="/register" className="hover:text-yellow-300 transition">
              Register
            </Link>
          </>
        )}

      </div>
    </nav>
  );
}
