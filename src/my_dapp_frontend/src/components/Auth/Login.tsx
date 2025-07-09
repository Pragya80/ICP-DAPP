import { useAuth } from '../../contexts/AuthContext';
import { Package } from 'lucide-react';

function Login() {
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-2 rounded-lg bg-blue-100">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
            Supply Chain DApp
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Connect with Internet Identity to access the supply chain management system
          </p>
        </div>

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
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
              className="text-blue-600 hover:text-blue-800 font-medium"
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