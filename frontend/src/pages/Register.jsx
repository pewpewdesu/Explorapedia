import { Link } from 'react-router-dom'

export default function Register() 
{ 
    return (
        <div className ="flex items-center justify-center min-h-[80vh]">
            <div className = "bg-white rounded-2x1 shadow-md p-8 w-full max-w-md">

                <h2 className = "text-2x1 font-bold text-gray-900 mb-6 text-center">
                    Create an Account
                </h2>

                <form className = "flex flex-col gap-4">
                    <div className = "flex flex-col gap-1">
                        <label className = "text-sm font-medium text-gray-700">Username</label>
                        <input 
                            type = "email"
                            placeHolder = "Enter your email"
                            className = "border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className = "flex flex-col gap-1">
                        <label className = "text-sm font-medium text-gray-700">Password</label>
                        <input
                        type = "password"
                        placeholder = "Choose a password"
                        className = "border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className = "flex flex-col gap-1">
                        <label className = "text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                        type = "password"
                        placeholder = "Repeat your password"
                        className = "border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type = "submit"
                        className = "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors mt-2"
                    >
                        Create Account
                    </button>
                </form>

                <p className = "text-center text-sm text-gray-500 mt-6">
                    Already have an account?{' '}
                    <Link to = "/login" className="text-blue-600 hover:underline font-medium">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    ) 
}
