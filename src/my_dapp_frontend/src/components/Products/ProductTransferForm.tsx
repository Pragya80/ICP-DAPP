import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import backendService, { type ProductTransferRequest } from '../../services/backendService';
import type { Product } from '@shared/types';
import { getRoleString } from '@shared/types';
import { ArrowRight, X, User } from 'lucide-react';

interface ProductTransferFormProps {
  product: Product;
  onClose: () => void;
  onTransferSuccess: (updatedProduct: Product) => void;
}

const ProductTransferForm = ({ product, onClose, onTransferSuccess }: ProductTransferFormProps) => {
  const { user, backendService } = useAuth();
  const [formData, setFormData] = useState({
    toPrincipal: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const userRole = getRoleString(user?.role);

  const getTransferTarget = () => {
    switch (userRole) {
      case 'Manufacturer':
        return 'Distributor';
      case 'Distributor':
        return 'Retailer';
      case 'Retailer':
        return 'Customer';
      default:
        return 'Next Party';
    }
  };

  const canTransfer = () => {
    return ['Manufacturer', 'Distributor', 'Retailer'].includes(userRole);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const transferRequest: ProductTransferRequest = {
        productId: product.id,
        toPrincipal: formData.toPrincipal,
        notes: formData.description || `Transfer from ${userRole} to ${getTransferTarget()}`
      };

      await backendService.transferProduct(transferRequest);
      
      // For now, we'll just close the form since transferProduct returns void
      // In a real app, you might want to fetch the updated product
      onTransferSuccess(product); // Pass the original product for now
      onClose();
    } catch (error) {
      setError('Transfer failed. Please check the principal ID and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!canTransfer()) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-red-600">Transfer Not Allowed</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-gray-600 mb-4">
            Only Manufacturers, Distributors, and Retailers can transfer products.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Transfer Product</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Product Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-600">{product.description}</p>
          <p className="text-xs text-gray-500 mt-1">ID: {product.id}</p>
        </div>

        {/* Transfer Direction */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-700">{userRole}</div>
            <div className="text-xs text-gray-500">Current Owner</div>
          </div>
          <ArrowRight className="h-5 w-5 text-blue-600" />
          <div className="text-center">
            <div className="text-sm font-medium text-blue-600">{getTransferTarget()}</div>
            <div className="text-xs text-gray-500">New Owner</div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {getTransferTarget()} Principal ID *
            </label>
            <input
              type="text"
              name="toPrincipal"
              value={formData.toPrincipal}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter principal ID of the recipient"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ask the {getTransferTarget().toLowerCase()} for their principal ID from their dashboard
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Transfer Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Transfer from ${userRole} to ${getTransferTarget()}`}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Transferring...</span>
                </>
              ) : (
                <>
                  <ArrowRight className="h-4 w-4" />
                  <span>Transfer Product</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductTransferForm; 