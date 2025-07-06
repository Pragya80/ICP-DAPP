function Homepage() {
    return (
      <div>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-5xl font-bold mb-6">
              Supply Chain Management
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              A decentralized supply chain solution built on Internet Computer. 
              Connect manufacturers, distributors, retailers, and customers seamlessly.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Get Started
            </button>
          </div>
        </div>

        {/* Features Section */}
<div className="py-16 bg-gray-50">
  <div className="container mx-auto px-6">
    <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Step 1 */}
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-xl">1</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">Manufacturer</h3>
        <p className="text-gray-600">Create and manage products in the supply chain</p>
      </div>

      {/* Step 2 */}
      <div className="text-center">
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-xl">2</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">Distributor</h3>
        <p className="text-gray-600">Purchase from manufacturers and supply to retailers</p>
      </div>

      {/* Step 3 */}
      <div className="text-center">
        <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-xl">3</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">Retailer</h3>
        <p className="text-gray-600">Purchase from distributors and sell to customers</p>
      </div>

      {/* Step 4 */}
      <div className="text-center">
        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-xl">4</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">Customer</h3>
        <p className="text-gray-600">Browse products and place orders with tracking</p>
      </div>
    </div>
  </div>
</div>


{/* Introduction Section */}
<div className="py-16">
  <div className="container mx-auto px-6">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-8">About Our Supply Chain DApp</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        <div>
          <h3 className="text-xl font-semibold mb-4">What We Do</h3>
          <p className="text-gray-600 mb-4">
            Our decentralized application revolutionizes supply chain management by providing 
            transparency, security, and efficiency through blockchain technology.
          </p>
          <p className="text-gray-600">
            Built on Internet Computer, we ensure data integrity and real-time tracking 
            across the entire supply chain network.
          </p>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-4">Key Benefits</h3>
          <ul className="text-gray-600 space-y-2">
            <li>• Transparent tracking from manufacturer to customer</li>
            <li>• Secure and immutable data storage</li>
            <li>• Real-time order status updates</li>
            <li>• Decentralized and tamper-proof system</li>
            <li>• Cost-effective supply chain management</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
      </div>
    );
  }


  export default Homepage;