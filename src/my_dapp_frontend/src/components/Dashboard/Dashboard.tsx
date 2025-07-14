import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getRoleString } from '@shared/types';
import backendService from '../../services/backendService';

const Dashboard: React.FC = () => {
  const { user, principalId } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [demoMessage, setDemoMessage] = useState('');

  const testBackendConnection = async () => {
    setLoading(true);
    setDemoMessage('');
    try {
      const products = await backendService.getProducts();
      setProducts(products);
      setDemoMessage(`✅ Backend connection successful! Found ${products.length} products.`);
    } catch (error) {
      console.error('Backend test failed:', error);
      setDemoMessage(`❌ Backend connection failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const createDemoProduct = async () => {
    setLoading(true);
    setDemoMessage('');
    try {
      const product = await backendService.createProduct(
        'Demo Product',
        'This is a demo product created to test the backend',
        99.99,
        10,
        'Electronics'
      );
      setDemoMessage(`✅ Demo product created successfully! ID: ${product.id}`);
      // Refresh products list
      const products = await backendService.getProducts();
      setProducts(products);
    } catch (error) {
      console.error('Create product failed:', error);
      setDemoMessage(`❌ Failed to create product: ${error}`);
    } finally {
      setLoading(false);
    }
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

        {/* Demo Backend Testing */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              🧪 Backend Demo Testing
            </h2>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <button
                  onClick={testBackendConnection}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Testing...' : 'Test Backend Connection'}
                </button>
                <button
                  onClick={createDemoProduct}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Demo Product'}
                </button>
              </div>
              
              {demoMessage && (
                <div className={`p-4 rounded-lg ${
                  demoMessage.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  {demoMessage}
                </div>
              )}

              {products.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Products in System:</h3>
                  <div className="space-y-2">
                    {products.map((product, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded border">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-600">{product.description}</div>
                        <div className="text-sm text-gray-500">
                          Price: ${product.price} | Quantity: {product.quantity} | Category: {product.category}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Role-specific Information */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Your Role: {getRoleString(user.role)}
            </h2>
            <div className="space-y-4">
              {user.role.Manufacturer && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Manufacturer Capabilities</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Create new products</li>
                    <li>• Transfer products to distributors</li>
                    <li>• View product history and tracking</li>
                    <li>• Manage product inventory</li>
                  </ul>
                </div>
              )}

              {user.role.Distributor && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-medium text-green-900 mb-2">Distributor Capabilities</h3>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Receive products from manufacturers</li>
                    <li>• Transfer products to retailers</li>
                    <li>• View product history and tracking</li>
                    <li>• Manage distribution inventory</li>
                  </ul>
                </div>
              )}

              {user.role.Retailer && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-medium text-purple-900 mb-2">Retailer Capabilities</h3>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• Receive products from distributors</li>
                    <li>• Sell products to customers</li>
                    <li>• View product history and tracking</li>
                    <li>• Manage retail inventory</li>
                  </ul>
                </div>
              )}

              {user.role.Customer && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="font-medium text-orange-900 mb-2">Customer Capabilities</h3>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• Browse available products</li>
                    <li>• Purchase products from retailers</li>
                    <li>• View product history and tracking</li>
                    <li>• Track purchased products</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 