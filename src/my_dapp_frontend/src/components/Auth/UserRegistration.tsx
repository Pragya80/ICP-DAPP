import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '@shared/types';
import { UserRoles, getRoleString } from '@shared/types';

const UserRegistration: React.FC = () => {
  const { registerUser, isLoading, principalId, testMode } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    role: UserRoles.Manufacturer,
    email: '',
    company: ''
  });
  const [error, setError] = useState<string>('');

  // Test users for quick selection in test mode
  const testUsers = [
    { role: UserRoles.Manufacturer, name: 'Keerth Manufacturer', company: 'ABC Manufacturing Co.', email: 'keerth@abcmfg.com' },
    { role: UserRoles.Manufacturer, name: 'Anku Manufacturer', company: 'xyz Manufacturing Co.', email: 'anku@xyzmfg.com' },
    { role: UserRoles.Distributor, name: 'Pragya Distributor', company: 'XYZ Distribution Ltd.', email: 'pragya@xyzdist.com' },
    { role: UserRoles.Retailer, name: 'Vinit Retailer', company: 'QuickMart Stores', email: 'vinit@quickmart.com' },
    { role: UserRoles.Retailer, name: 'Vedant Retailer', company: 'QuickMart Stores', email: 'vedant@quickmart.com' },
    { role: UserRoles.Customer, name: 'Sharma ji Customer', company: 'Individual', email: 'sharma@email.com' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.name === 'role') {
      // Handle role selection
      const roleValue = e.target.value;
      let role: UserRole;
      switch (roleValue) {
        case 'manufacturer':
          role = UserRoles.Manufacturer;
          break;
        case 'distributor':
          role = UserRoles.Distributor;
          break;
        case 'retailer':
          role = UserRoles.Retailer;
          break;
        case 'customer':
          role = UserRoles.Customer;
          break;
        default:
          role = UserRoles.Manufacturer;
      }
      setFormData({
        ...formData,
        role
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleTestUserSelect = (testUser: typeof testUsers[0]) => {
    setFormData({
      name: testUser.name,
      role: testUser.role,
      email: testUser.email,
      company: testUser.company
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      const result = await registerUser(
        formData.name,
        formData.role,
        formData.email,
        formData.company
      );

      if (!result.success) {
        setError(result.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    }
  };

  // Get current role as string for display
  const getCurrentRoleString = () => {
    if (formData.role.Manufacturer) return 'manufacturer';
    if (formData.role.Distributor) return 'distributor';
    if (formData.role.Retailer) return 'retailer';
    if (formData.role.Customer) return 'customer';
    return 'manufacturer';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto h-12 w-12 text-center">
          <svg className="h-12 w-12 text-indigo-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Complete Your Registration
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {testMode ? 'Test Mode - Choose a role to get started quickly' : 'Set up your Supply Chain profile'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Test mode quick selector */}
          {testMode && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Test User Selection</h3>
              <div className="grid grid-cols-2 gap-2">
                {testUsers.map((testUser, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleTestUserSelect(testUser)}
                    className="text-left p-3 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors duration-200"
                  >
                    <div className="text-sm font-medium text-gray-900">{testUser.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{getRoleString(testUser.role)}</div>
                  </button>
                ))}
              </div>
              <div className="mt-3 text-center">
                <span className="text-xs text-gray-500">or fill the form manually below</span>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <p className="text-sm text-blue-700">
              <strong>Your Principal ID:</strong> {principalId}
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role in Supply Chain *
              </label>
              <select
                id="role"
                name="role"
                value={getCurrentRoleString()}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="manufacturer">Manufacturer</option>
                <option value="distributor">Distributor</option>
                <option value="retailer">Retailer</option>
                <option value="customer">Customer</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Choose your role in the supply chain
              </p>
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleInputChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Your company name (optional)"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="your.email@example.com (optional)"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Complete Registration
                  </>
                )}
              </button>
            </div>
          </form>

          {testMode && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-green-800 mb-2">Test Mode Benefits:</h4>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• No Internet Identity setup required</li>
                <li>• Instant registration and login</li>
                <li>• Perfect for testing supply chain flows</li>
                <li>• Switch between different user roles easily</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRegistration; 