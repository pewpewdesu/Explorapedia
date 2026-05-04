import { Link } from 'react-router-dom'

export default function Login() 
{
    return(
        <div className = " flex items-center justify-center min-h-[80vh]">
            <div className = "bg-white rounded-2xl shadow-md p-8 w-full max-w-md">

            <h2 className = "text-2x1 font-bold text-gray-900 mb-6 text-center">
                Welcome Back
            </h2>

            <form className = "flex flex-col gap-4">
                <div className = "flex flex-col gap-1">
                    <label className ="text-sm font-medium text-gray-700">Username</label>
                    <input
                        type = "text"
                        placeholder="Enter your username"
                        className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-500'
                    />
                </div>

                <button 
                    type = "submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors mt-2"
                >
                    Log In
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
