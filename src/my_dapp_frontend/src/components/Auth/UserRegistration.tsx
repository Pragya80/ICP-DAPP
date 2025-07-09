import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole, UserRoles } from '../../types';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';

const UserRegistration = () => {
  const { registerUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    role: UserRoles.Manufacturer,
    email: '',
    company: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getRoleString = (role: UserRole): string => {
    return Object.keys(role)[0] || 'Unknown Role';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const result = await registerUser(
        formData.name,
        formData.role,
        formData.email,
        formData.company
      );

      if (result.success) {
        setSuccess('Registration successful! Welcome to the supply chain network.');
        setFormData({ name: '', role: UserRoles.Manufacturer, email: '', company: '' });
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Registering user...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-2 rounded-lg bg-blue-100">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
            Join the Supply Chain Network
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Register your role in the supply chain ecosystem
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your full name"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {Object.values(UserRoles).map((role) => (
                  <button
                    key={getRoleString(role)}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role }))}
                    className={`p-4 border rounded-lg text-left transition-all ${
                      getRoleString(formData.role) === getRoleString(role)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{getRoleString(role)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {getRoleString(role) === 'Manufacturer' && 'Create and produce products'}
                      {getRoleString(role) === 'Distributor' && 'Distribute products to retailers'}
                      {getRoleString(role) === 'Retailer' && 'Sell products to customers'}
                      {getRoleString(role) === 'Customer' && 'Purchase products'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="your@email.com"
              />
            </div>

            {/* Company Input */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Company
              </label>
              <input
                id="company"
                name="company"
                type="text"
                required
                value={formData.company}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your company name"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRegistration; 