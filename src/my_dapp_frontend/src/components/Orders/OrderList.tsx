import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Activity, Calendar, User, ArrowRight } from 'lucide-react';
import type { ProductEvent } from '@shared/types';

const OrderList = () => {
  const { user, backendService } = useAuth();
  const [events, setEvents] = useState<ProductEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      // For MVP, we'll use the product IDs from your backend test
      const productIds = [
        "1752079778958811317f",
        "1752079812719587336f"
      ];

      const allEvents = [];
      
      for (const productId of productIds) {
        try {
          const productEvents = await backendService.getProductEvents(productId);
          allEvents.push(...productEvents);
        } catch (error) {
          console.log(`No events for product ${productId}`);
        }
      }

      setEvents(allEvents);
    } catch (error) {
      setError('Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'Created':
        return <Activity className="h-4 w-4 text-blue-600" />;
      case 'Transferred':
        return <ArrowRight className="h-4 w-4 text-green-600" />;
      case 'Sold':
        return <User className="h-4 w-4 text-purple-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'Created':
        return 'bg-blue-100 text-blue-800';
      case 'Transferred':
        return 'bg-green-100 text-green-800';
      case 'Sold':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Supply Chain Events</h1>
          <p className="mt-2 text-gray-600">
            Track all product movements and transactions
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Events List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Events</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {events.length > 0 ? (
              events.map((event, index) => (
                <div key={index} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${getEventColor(event.event_type)}`}>
                        {getEventIcon(event.event_type)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {event.event_type} - {event.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          Product ID: {event.product_id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(Number(event.timestamp)).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        From: {event.from_user.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-600">
                  Events will appear here as products are created, transferred, and sold.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Product Event Lookup */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lookup Product Events</h3>
          <div className="flex space-x-4">
            <input
              type="text"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              placeholder="Enter product ID"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={async () => {
                if (selectedProductId) {
                  try {
                    const productEvents = await backendService.getProductEvents(selectedProductId);
                    setEvents(productEvents);
                  } catch (error) {
                    setError('No events found for this product');
                  }
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;