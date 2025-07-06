import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

function Login() {
  const { login, isLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState('customer');

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Supply Chain DApp</h2>
        
        <div className="text-center mb-6">
          <p className="text-gray-600 mb-4">
            Connect with Internet Identity to access the supply chain management system.
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select Your Role</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="customer">Customer</option>
            <option value="retailer">Retailer</option>
            <option value="distributor">Distributor</option>
            <option value="manufacturer">Manufacturer</option>
          </select>
        </div>
        
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {isLoading ? 'Connecting...' : 'Login with Internet Identity'}
        </button>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Don't have Internet Identity?{' '}
            <a 
              href="https://identity.ic0.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              Get one here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;