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
        <div className = "min-h-screen bg-[#eef0fb] p-8">
            <div className = "max-w-5xl mx-auto flex gap-6 h-[80vh]">

                {/* friends card */}
                <div className = "bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex-1 h-full relative">
                    <h2 className = "font-bold text-xl mb-1">Friends</h2>
                    <p className ="text-gray-500 text-sm mb-4">Your Friends</p>

                    {/* friend list goes here */}


                    <div className = "mt-6">
                        <p className = "text-sm font-medium mb-2">Add a Friend</p>
                        <div className = "flex gap-2">
                            <input
                                placeHolder = "Enter friend's email address..."
                                className = "border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                            <button className = "bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-bold transition-colors">
                                Add Friend
                            </button>
                        </div>
                    </div>
                </div>

                {/* Profile card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 w-1/3 h-full">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h2>
                    <p className="text-gray-600 mb-6">Manage your Explorapedia account.</p>

                    <div className="space-y-4 text-gray-800">
                        <div>
                            <p className="text-sm font-medium text-black">Username</p>
                            <p className="text-lg">{user?.username || '—'}</p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-black">Email</p>
                            <p className="text-lg flex">{user?.email || '—'}</p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-black">User ID</p>
                            <p className="text-sm break-all">{user?._id || localStorage.getItem('userId') || '—'}</p>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-3 relative">
                        
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-full font-medium transition-colors mt-auto flex justify-end"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}