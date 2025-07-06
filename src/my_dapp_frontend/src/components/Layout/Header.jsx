import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect, useRef } from "react";

function Header() {
  const { user, logout, updateUserRole } = useAuth();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowRoleDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleRoleChange = (newRole) => {
    updateUserRole(newRole);
    setShowRoleDropdown(false);
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
            <div className="text-right relative">
              <div className="text-sm font-medium">{user.name}</div>
              <div 
                className={`inline-block px-2 py-1 rounded text-xs font-medium ${getRoleColor(user.role)} cursor-pointer hover:opacity-80`}
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              >
                {getRoleDisplayName(user.role)} ▼
              </div>
              
              {/* Role Selection Dropdown */}
              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border" ref={dropdownRef}>
                  <div className="py-1">
                    <button
                      onClick={() => handleRoleChange('manufacturer')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Manufacturer
                    </button>
                    <button
                      onClick={() => handleRoleChange('distributor')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Distributor
                    </button>
                    <button
                      onClick={() => handleRoleChange('retailer')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Retailer
                    </button>
                    <button
                      onClick={() => handleRoleChange('customer')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Customer
                    </button>
                  </div>
                </div>
              )}
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