import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Header() {
  const { user, logout } = useAuth();

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'manufacturer':
        return 'Manufacturer';
      case 'distributor':
        return 'Distributor';
      case 'retailer':
        return 'Retailer';
      case 'customer':
        return 'Customer';
      default:
        return 'Guest';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'manufacturer':
        return 'bg-blue-600';
      case 'distributor':
        return 'bg-green-600';
      case 'retailer':
        return 'bg-orange-600';
      case 'customer':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-bold text-sm">SC</span>
          </div>
          <Link to="/" className="text-xl font-bold hover:text-blue-200 transition-colors">
            Supply Chain DApp
          </Link>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          <Link to="/dashboard" className="hover:text-blue-200 transition-colors">Dashboard</Link>
          <Link to="/products" className="hover:text-blue-200 transition-colors">Products</Link>
          <Link to="/orders" className="hover:text-blue-200 transition-colors">Orders</Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          {user && (
            <div className="text-right">
              <div className="text-sm font-medium">{user.name}</div>
              <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getRoleColor(user.role)}`}>
                {getRoleDisplayName(user.role)}
              </div>
            </div>
          )}
          <button 
            onClick={logout}
            className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;