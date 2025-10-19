import React, { useState } from 'react';
import { Eye, EyeOff } from "lucide-react";
import { toast } from 'react-toastify';
import axios from 'axios';
import { backend_URL } from '../config/config.js';
import {useNavigate} from 'react-router-dom'

const Login = ({setIsLoggedIn}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false);
    // This function runs when the form is submitted
    const handleSubmit = async (e) => {
        setIsLoading(true);
        try {
            e.preventDefault();
            const response = await axios.post(backend_URL + '/api/auth/login', {email, password},  { withCredentials: true })
            if (response.data.success) {
                toast.success('Login successful!');
                setIsLoggedIn(true);
                navigate('/')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        }finally {
            // 3. Set loading back to false when the API call is finished
            setIsLoading(false);
        }
    };


    return (
        <div className='min-h-screen flex items-center justify-center w-full bg-gray-50'>
            <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md w-full'>
                <h1 className='text-2xl font-bold text-center mb-6'>Admin Panel</h1>

                <form onSubmit={handleSubmit}>
                    <div className='mb-4 min-w-72'>
                        <label className='block text-sm font-medium text-gray-700 mb-2' htmlFor='email'>Email</label>
                        <input
                            id='email'
                            name='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500'
                            type="email"
                            required
                            placeholder='admin@gmail.com'
                        />
                    </div>

                    <div className='mb-4 min-w-72 relative'>
                        <label className='block text-sm font-medium text-gray-700 mb-2' htmlFor='password'>Password</label>
                        <input
                            id='password'
                            name='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none pr-10 focus:ring-2 focus:ring-blue-500'
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder='Password'
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 mt-3 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                    </div>

                    <button
                        className='mt-4 w-full py-2 px-4 rounded-md text-white bg-black font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center disabled:bg-gray-500' 
                        type='submit'
                        disabled={isLoading} // Disable the button while loading
                    >
                        {isLoading ? (
                            // Simple spinner animation
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;