import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '@shared/types';
import { UserRoles, getRoleString } from '@shared/types';
import { 
  Package, 
  Users, 
  DollarSign, 
  TrendingUp,
  Factory,
  Truck,
  ShoppingCart,
  User
} from 'lucide-react';

const Dashboard = () => {
  const { user, backendService } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentActivity: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // For MVP, we'll use mock data
      setStats({
        totalProducts: 2,
        totalUsers: 1,
        totalRevenue: 1999.98,
        recentActivity: 3
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleString = (role: UserRole | undefined): string => {
    if (!role) return 'Unknown Role';
    return Object.keys(role)[0] || 'Unknown Role';
  };

  const getRoleIcon = (role: UserRole | undefined) => {
    const roleStr = getRoleString(role);
    switch (roleStr) {
      case 'Manufacturer':
        return <Factory className="h-8 w-8 text-blue-600" />;
      case 'Distributor':
        return <Truck className="h-8 w-8 text-green-600" />;
      case 'Retailer':
        return <ShoppingCart className="h-8 w-8 text-purple-600" />;
      case 'Customer':
        return <User className="h-8 w-8 text-orange-600" />;
      default:
        return <User className="h-8 w-8 text-gray-600" />;
    }
  };

  const getRoleColor = (role: UserRole | undefined) => {
    const roleStr = getRoleString(role);
    switch (roleStr) {
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.name}! Here's your supply chain overview.
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${getRoleColor(user?.role)}`}>
              {getRoleIcon(user?.role)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600">{getRoleString(user?.role)}</p>
              <p className="text-sm text-gray-500">User ID: {user?.user_principal?.toString().slice(0, 8)}...</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-100">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-orange-100">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recent Activity</p>
                <p className="text-2xl font-bold text-gray-900">{stats.recentActivity}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Package className="h-4 w-4 mr-2" />
              View Products
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Users className="h-4 w-4 mr-2" />
              View Orders
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 