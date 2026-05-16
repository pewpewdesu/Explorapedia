import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Register() {
    const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
            setError('Please fill in all fields.');
            return;
        }

        if (form.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        if (form.password !== form.confirm) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            const res = await api.post('/auth/register',
                {
                    username: form.username,
                    email: form.email,
                    password: form.password
                });
            if (!res.data?.token || !res.data?.userId) {
                setError('Invalid server response. Please try again.');
                return;
            }
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userId', res.data.userId);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="bg-white rounded-2x1 shadow-md p-8 w-full max-w-md">

                <h2 className="text-2x1 font-bold text-gray-900 mb-6 text-center">
                    Create an Account
                </h2>

                {/* error message? */}
                {error && (
                    <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}


                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Choose a username"
                            required
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Choose a password"
                            required
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            name="confirm"
                            value={form.confirm}
                            onChange={handleChange}
                            placeholder="Repeat your password"
                            required
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline font-medium">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    )
}
