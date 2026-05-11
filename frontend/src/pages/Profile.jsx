import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Profile() {
    const [user, setUser] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (!token) {
            navigate('/login')
            return
        }

        const loadProfile = async () => {
            try {
                const res = await api.get('/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                setUser(res.data)
            } catch (err) {
                setError(err.response?.data?.message || 'Unable to load profile.')
            } finally {
                setLoading(false)
            }
        }

        loadProfile()
    }, [navigate])

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        navigate('/login')
    }

    if (loading) {
        return <div className="text-center text-gray-600">Loading profile...</div>
    }

    if (error) {
        return (
            <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile</h2>
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
                    {error}
                </div>
                <button
                    type="button"
                    onClick={handleLogout}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                    Go to Login
                </button>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h2>
            <p className="text-gray-600 mb-6">Manage your Explorapedia account.</p>

            <div className="space-y-4 text-gray-800">
                <div>
                    <p className="text-sm font-medium text-gray-500">Username</p>
                    <p className="text-lg">{user?.username || '—'}</p>
                </div>

                <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-lg">{user?.email || '—'}</p>
                </div>

                <div>
                    <p className="text-sm font-medium text-gray-500">User ID</p>
                    <p className="text-sm break-all">{user?._id || localStorage.getItem('userId') || '—'}</p>
                </div>
            </div>

            <div className="mt-8 flex gap-3">
                <button
                    type="button"
                    onClick={() => navigate('/trips')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                    My Trips
                </button>
                <button
                    type="button"
                    onClick={handleLogout}
                    className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                    Logout
                </button>
            </div>
        </div>
    )
}