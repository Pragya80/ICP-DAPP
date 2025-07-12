import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getRoleString } from '@shared/types';

const Dashboard: React.FC = () => {
  const { user, principalId, testMode, switchTestPrincipal } = useAuth();

  const testUsers = [
    { role: 'manufacturer', name: 'Keerth Manufacturer', company: 'ABC Manufacturing Co.' },
    { role: 'manufacturer', name: 'Anku Manufacturer', company: 'xyz Manufacturing Co.' },
    { role: 'distributor', name: 'Pragya Distributor', company: 'XYZ Distribution Ltd.' },
    { role: 'retailer', name: 'Vinit Retailer', company: 'QuickMart Stores' },
    { role: 'retailer', name: 'Vedant Retailer', company: 'QuickMart Stores' },
    { role: 'customer', name: 'Sharma ji Customer', company: 'Individual' }
  ];

  const handleSwitchUser = (role: string) => {
    console.log('Switching to role:', role);
    switchTestPrincipal(role as any);
  };

  // Get current user's role as string for comparison
  const getCurrentRoleString = () => {
    if (!user) return '';
    return getRoleString(user.role).toLowerCase();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {user.name}!
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {getRoleString(user.role)} • {user.company || 'No company'}
              </p>
            </div>
            
            {/* Test Mode User Switcher */}
            {testMode && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">
                  🧪 Test Mode - Switch Users
                </h3>
                <div className="flex flex-wrap gap-2">
                  {testUsers.map((testUser) => (
                    <button
                      key={`${testUser.role}-${testUser.name}`}
                      onClick={() => handleSwitchUser(testUser.role)}
                      className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                        getCurrentRoleString() === testUser.role
                          ? 'bg-yellow-200 border-yellow-400 text-yellow-800'
                          : 'bg-white border-yellow-300 text-yellow-700 hover:bg-yellow-100'
                      }`}
                    >
                      {testUser.name}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-yellow-600 mt-2">
                  Click to switch to different test user roles
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Principal ID Display */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Your Identity Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Principal ID
                </label>
                <div className="mt-1 flex items-center space-x-2">
                  <code className="px-3 py-2 bg-gray-100 rounded text-sm font-mono text-gray-800 flex-1">
                    {principalId}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(principalId || '');
                    }}
                    className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-sm"
                  >
                    Copy
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Share this ID with others for product transfers
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {getRoleString(user.role)}
                  </span>
                </div>
              </div>

              {user.company && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <div className="mt-1">
                    <p className="text-sm text-gray-900">{user.company}</p>
                  </div>
                </div>
              )}

              {user.email && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1">
                    <p className="text-sm text-gray-900">{user.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                <h3 className="font-medium text-gray-900">Products</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Manage your products and inventory
                </p>
                <a
                  href="/products"
                  className="mt-3 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                >
                  View Products →
                </a>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                <h3 className="font-medium text-gray-900">Transfers</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Transfer products to other users
                </p>
                <a
                  href="/products"
                  className="mt-3 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Manage Transfers →
                </a>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                <h3 className="font-medium text-gray-900">Orders</h3>
                <p className="text-sm text-gray-500 mt-1">
                  View and manage orders
                </p>
                <a
                  href="/orders"
                  className="mt-3 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                >
                  View Orders →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Test Mode Info */}
        {testMode && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-lg font-medium text-green-800 mb-4">
                🧪 Test Mode Active
              </h2>
              <div className="space-y-3 text-sm text-green-700">
                <p>• You are currently in test mode - no Internet Identity required</p>
                <p>• Use the user switcher above to test different roles</p>
                <p>• All features work exactly the same as production</p>
                <p>• Perfect for testing the complete supply chain workflow</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 