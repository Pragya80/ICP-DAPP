import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { Product, UserRole, ProductStatus } from '@shared/types';
import { UserRoles, ProductStatuses, getRoleString, getStatusString } from '@shared/types';
import { Plus, Package, Users, DollarSign, Calendar, ArrowRight, Copy, Check } from 'lucide-react';
import ProductAddForm from './ProductAddForm';
import ProductTransferForm from './ProductTransferForm';

const ProductList = () => {
  const { user, backendService } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const products = await backendService.getAllProducts();
      setProducts(products);
    } catch (error) {
      setError('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    setShowAddForm(false);
  };

  const handleTransferProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowTransferForm(true);
  };

  const handleTransferSuccess = (updatedProduct: Product) => {
    setProducts(prev => 
      prev.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
    setShowTransferForm(false);
    setSelectedProduct(null);
    // Reload products to get updated data
    loadProducts();
  };

  const copyProductId = async (productId: string) => {
    try {
      await navigator.clipboard.writeText(productId);
      setCopiedId(productId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = productId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedId(productId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const getRoleIcon = (role: UserRole | undefined) => {
    const roleStr = getRoleString(role);
    switch (roleStr) {
      case 'Manufacturer':
        return <Package className="h-4 w-4 text-blue-600" />;
      case 'Distributor':
        return <Users className="h-4 w-4 text-green-600" />;
      case 'Retailer':
        return <Users className="h-4 w-4 text-purple-600" />;
      case 'Customer':
        return <Users className="h-4 w-4 text-orange-600" />;
      default:
        return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (statusStr: string) => {
    switch (statusStr) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'OutOfStock':
        return 'bg-red-100 text-red-800';
      case 'Discontinued':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canTransferProduct = (product: Product) => {
    const userRole = getRoleString(user?.role);
    const userPrincipal = user?.user_principal?.toString();
    const productOwner = product.current_owner?.toString();
    
    // User must be the current owner and have transfer permissions
    return userPrincipal === productOwner && 
           ['Manufacturer', 'Distributor', 'Retailer'].includes(userRole);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="mt-2 text-gray-600">
                Manage your supply chain products
              </p>
            </div>
            {getRoleString(user?.role) === 'Manufacturer' && (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.description}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(getStatusString(product.status))}`}>
                    {getStatusString(product.status)}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">${product.price}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Quantity: {product.quantity}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Created: {new Date(Number(product.created_at)).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Product ID with Copy Button */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500">Category: {product.category}</span>
                    <span className="text-xs text-gray-500">
                      Owner: {product.current_owner?.toString().slice(0, 8)}...
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      ID: {product.id.slice(0, 12)}...
                    </span>
                    <button
                      onClick={() => copyProductId(product.id)}
                      className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                      title="Copy full product ID"
                    >
                      {copiedId === product.id ? (
                        <>
                          <Check className="h-3 w-3 text-green-600" />
                          <span className="text-green-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy ID</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Transfer Button */}
                {canTransferProduct(product) && (
                  <div className="mt-4">
                    <button
                      onClick={() => handleTransferProduct(product)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <ArrowRight className="h-4 w-4" />
                      <span>Transfer Product</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">
                {getRoleString(user?.role) === 'Manufacturer'
                  ? 'Start by adding your first product.'
                  : 'No products are available yet.'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddForm && (
        <ProductAddForm
          onClose={() => setShowAddForm(false)}
          onAddProduct={handleAddProduct}
        />
      )}

      {/* Transfer Product Modal */}
      {showTransferForm && selectedProduct && (
        <ProductTransferForm
          product={selectedProduct}
          onClose={() => {
            setShowTransferForm(false);
            setSelectedProduct(null);
          }}
          onTransferSuccess={handleTransferSuccess}
        />
      )}
    </div>
  );
};

export default ProductList;