import { Package } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="p-2 rounded-lg bg-blue-100">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-lg font-semibold text-gray-900">SupplyChain</span>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-600">
              © 2024 SupplyChain. Built on Internet Computer.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Secure, decentralized supply chain management
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;