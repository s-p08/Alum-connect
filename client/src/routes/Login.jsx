import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, UserCircle, X } from 'lucide-react';
import { useUser } from '../context/UserContext';
import connectLogo from "../assets/connect_logo_black.svg";
import { useSidebarLayout } from '../hooks/useSidebarLayout'; 

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg w-full max-w-md p-6 m-4 z-10">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const { setUser, handleGoogleLogin } = useUser();

  // Visitor credentials
  const visitorCredentials = { 
    email: 'visitor@kuk.ac.in', 
    password: 'visitor' 
  };

  const [formData, setFormData] = useState({
    role: 'admin',
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previousValues, setPreviousValues] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate email domain (Bypass for admin role)
    if (formData.role !== 'admin' && !formData.email.endsWith('@kuk.ac.in')) {
      setError('Only @kuk.ac.in email addresses are allowed');
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_backend_URL}/auth/login`,
        formData,
        { withCredentials: true }
      );
      console.log('API Response:', res.data);

      localStorage.setItem('cachedUserProfile', JSON.stringify(res.data.user));
      setUser(res.data.user);

      const role = res.data.user.role.toLowerCase();
      if (role === 'admin') {
        navigate('/admin/announcements');
      } else if (role === 'visitor') {
        navigate('/announcements');
      } else {
        navigate('/announcements');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginClick = () => {
    window.location.href = `${import.meta.env.VITE_backend_URL}/auth/google`;
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    const oldRole = formData.role;
    
    if (oldRole === 'visitor' && newRole !== 'visitor') {
      // Switching from visitor to another role - restore previous values
      setFormData({
        role: newRole,
        email: previousValues.email,
        password: previousValues.password
      });
    } else if (oldRole !== 'visitor' && newRole === 'visitor') {
      // Switching to visitor - save current values and set visitor credentials
      setPreviousValues({
        email: formData.email,
        password: formData.password
      });
      
      setFormData({
        role: 'visitor',
        email: visitorCredentials.email,
        password: visitorCredentials.password
      });
    } else {
      // Just update the role
      setFormData(prev => ({
        ...prev,
        role: newRole
      }));
    }
    
    // Hide the password field when role changes to visitor
    if (newRole === 'visitor') {
      setShowPassword(false);
    }
  };

  useEffect(() => {
    // Get error from URL if any
    const urlParams = new URLSearchParams(window.location.search);
    const errorMessage = urlParams.get('error');
    if (errorMessage) {
      setError(decodeURIComponent(errorMessage));
      // Clear the error from URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img 
              src={connectLogo} 
              alt="AlumConnect Logo" 
              className="w-20 h-auto"
            />
          </div>
          <h2 className="text-2xl font-bold text-blue-700 mb-2">Welcome Back</h2>
          <p className="text-gray-500">Please sign in to continue</p>
          
          {/* Added visitor access note */}
          <div className="mt-3 py-2 px-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 font-medium">
            NOTE:- For Visitor Access, use <b>visitor@kuk.ac.in</b> / <b>visitor</b> or Select Visitor Role From the Drop Down.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <div className="relative">
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleRoleChange}
                className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-8 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="admin">Admin</option>
                <option value="alumni">Alumni</option>
                <option value="student">Student</option>
                <option value="visitor">Visitor</option>
              </select>
              <UserCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              disabled={formData.role === 'visitor'}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                disabled={formData.role === 'visitor'}
              />
              {formData.role !== 'visitor' && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-4"
          >
            Forgot Password?
          </button>
        </form>

        {/* Google Sign In */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-2 text-center text-sm text-gray-600">
              Please use your College email (@kuk.ac.in)
             </div>

          <button
            type="button"
            onClick={handleGoogleLoginClick}
            className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-500">
            Sign Up
          </Link>
        </div>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 mt-4 hover:bg-gray-100"
        >
          Back to Home
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Password Recovery
          </h3>
          <p className="text-gray-600 mb-6">
            Please contact your college admin or alumni cell for password recovery assistance.
          </p>
          <button
            onClick={() => setIsModalOpen(false)}
            className="inline-flex justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Understood
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Login;