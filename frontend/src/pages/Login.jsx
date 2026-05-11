import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Login() 
{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => 
    {
        e.preventDefault();
        setError('');
        setLoading(true);

        try{
            const res = await api.post('/auth/login', { email, password});
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userId', res.data.userId);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Try again.');
        } finally {
            setLoading(false);
        }
    }
    return(
        <div className = " flex items-center justify-center min-h-[80vh]">
            <div className = "bg-white rounded-2xl shadow-md p-8 w-full max-w-md">

            <h2 className = "text-2x1 font-bold text-gray-900 mb-6 text-center">
                Welcome Back
            </h2>
            {/* error message? */}
            {error && (
                <div className = "bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit = {handleSubmit} className = "flex flex-col gap-4">
                <div className = "flex flex-col gap-1">
                    <label className ="text-sm font-medium text-gray-700">Email</label>
                    <input
                        type = "email"
                        value = {email}
                        onChange ={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-500'
                    />
                </div>

                <div className = "flex flex-col gap-1">
                    <label className = "text-sm font-medium text-gray-700">Password</label>
                    <input  
                        type = "password"
                        value = {password}
                        onChange = {(e) => setPassword(e.target.value)}
                        placeholder = "Enter your password"
                        required
                        className = "border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button 
                    type = "submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors mt-2 disabled:opacity-50"
                >
                    {loading ? 'Logging in...' : 'Log In'}
                </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:underline font-medium">
                    Sign up
                </Link>
            </p>
            </div>
        </div>
    )
}
