import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, UserCircle, Briefcase, GraduationCap, Mail, User } from 'lucide-react';
import connectLogo from "../assets/connect_logo_black.svg";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    branch: 'Computer Science',
    branchCode: 'CSE',
    batch: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const branches = [
    { name: 'Computer Science', code: 'CSE' },
    { name: 'Computer Science - AI/ML', code: 'CSA' },
    { name: 'Computer Science - Data Science', code: 'CSD' },
    { name: 'Computer Science - HCI & GT', code: 'CSH' },
    { name: 'Electronics and Communication Engineering', code: 'ECE' },
    { name: 'Electronics and Communication Engineering - IOT', code: 'ECI' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'branch') {
      const selectedBranch = branches.find(b => b.name === value);
      setFormData(prev => ({ 
        ...prev, 
        branch: value,
        branchCode: selectedBranch ? selectedBranch.code : prev.branchCode
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate email domain
    if (!formData.email.endsWith('@kuk.ac.in')) {
      setError('Only @kuk.ac.in email addresses are allowed');
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_backend_URL}/auth/register`,
        formData
      );
      navigate('/login?message=' + encodeURIComponent('Registration successful! Please login.'));
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img 
              src={connectLogo} 
              alt="AlumConnect Logo" 
              className="w-20 h-auto"
            />
          </div>
          <h2 className="text-2xl font-bold text-blue-700 mb-2">Create Account</h2>
          <p className="text-gray-500">Join the UIET KURUKSHETRA Community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Roll No / Batch (e.g. 2022)
              </label>
              <div className="relative">
                <input
                  name="batch"
                  type="text"
                  required
                  value={formData.batch}
                  onChange={handleChange}
                  placeholder="2022"
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              University Email (@kuk.ac.in)
            </label>
            <div className="relative">
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="yourname@kuk.ac.in"
                className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="student">Student</option>
                <option value="alumni">Alumni</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch
              </label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                {branches.map((b, i) => (
                  <option key={i} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 8 characters"
                className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
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
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
