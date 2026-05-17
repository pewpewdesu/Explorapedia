import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import Friends from './Friends'

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
        return <div className="text-center text-gray-600 p-8">Loading profile...</div>
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
        <div className="min-h-screen bg-[#eef0fb] p-8">
            <div className="max-w-6xl mx-auto flex gap-6">
                {/* Friends Section (Left) */}
                <div className="flex-1 min-w-0">
                    <Friends />
                </div>

                {/* Profile Section (Right) */}
                <div className="w-96">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-full flex flex-col">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h2>
                        <p className="text-gray-600 mb-6 text-sm">Manage your Explorapedia account.</p>

                        <div className="space-y-4 text-gray-800 flex-1">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Username</p>
                                <p className="text-lg font-semibold mt-1">{user?.username || '—'}</p>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Email</p>
                                <p className="text-lg mt-1 break-all">{user?.email || '—'}</p>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">User ID</p>
                                <p className="text-xs mt-1 break-all text-gray-600">{user?._id || localStorage.getItem('userId') || '—'}</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors mt-6"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}