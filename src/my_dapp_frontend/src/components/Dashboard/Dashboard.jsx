import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Package, 
  Users, 
  TrendingUp, 
  Activity, 
  Factory, 
  Truck, 
  ShoppingCart, 
  User,
  DollarSign,
  Hash
} from 'lucide-react';
import ProductCreateForm from '../Products/ProductCreateForm';

const Dashboard = () => {
  const { user, backendService } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalEvents: 0,
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // In a real app, you'd have methods to get these stats
      // For now, we'll use placeholder data
      setStats({
        totalProducts: 2, // From your backend test
        totalUsers: 1, // From your backend test
        totalEvents: 2, // From your backend test
        recentActivity: [
          {
            id: 1,
            type: 'product_created',
            description: 'Laptop product created',
            timestamp: new Date().toISOString(),
            user: 'Test User'
          },
          {
            id: 2,
            type: 'user_registered',
            description: 'New manufacturer registered',
            timestamp: new Date().toISOString(),
            user: 'Test User'
          }
        ]
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Manufacturer':
        return <Factory className="h-5 w-5 text-blue-600" />;
      case 'Distributor':
        return <Truck className="h-5 w-5 text-green-600" />;
      case 'Retailer':
        return <ShoppingCart className="h-5 w-5 text-purple-600" />;
      case 'Customer':
        return <User className="h-5 w-5 text-orange-600" />;
      default:
        return <User className="h-5 w-5 text-gray-600" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Manufacturer':
        return 'bg-blue-100 text-blue-800';
      case 'Distributor':
        return 'bg-green-100 text-green-800';
      case 'Retailer':
        return 'bg-purple-100 text-purple-800';
      case 'Customer':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Supply Chain Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.name}! Here's your supply chain overview.
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${getRoleColor(user?.role)}`}>
                {getRoleIcon(user?.role)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600">Role: {user?.role}</p>
                <p className="text-sm text-gray-500">Principal: {user?.user_principal?.slice(0, 20)}...</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Member since</p>
              <p className="text-gray-900">
                {new Date(parseInt(user?.created_at) / 1000000).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Network Users</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalEvents}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Creation (for Manufacturers) */}
          {user?.role === 'Manufacturer' && (
            <div className="lg:col-span-1">
              <ProductCreateForm onProductCreated={loadDashboardData} />
            </div>
          )}

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Activity className="h-6 w-6 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md">
                  <div className="p-2 rounded-full bg-blue-100">
                    <Activity className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {stats.recentActivity.length === 0 && (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </div>
        </div>

        {/* Supply Chain Flow */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Supply Chain Flow</h3>
          <div className="flex items-center justify-center space-x-8">
            <div className="flex flex-col items-center space-y-2">
              <div className="p-3 rounded-full bg-blue-100">
                <Factory className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Manufacturer</p>
              <p className="text-xs text-gray-500">Creates products</p>
            </div>
            
            <div className="text-gray-400">→</div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className="p-3 rounded-full bg-green-100">
                <Truck className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Distributor</p>
              <p className="text-xs text-gray-500">Distributes products</p>
            </div>
            
            <div className="text-gray-400">→</div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className="p-3 rounded-full bg-purple-100">
                <ShoppingCart className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Retailer</p>
              <p className="text-xs text-gray-500">Sells to customers</p>
            </div>
            
            <div className="text-gray-400">→</div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className="p-3 rounded-full bg-orange-100">
                <User className="h-6 w-6 text-orange-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Customer</p>
              <p className="text-xs text-gray-500">Purchases products</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;