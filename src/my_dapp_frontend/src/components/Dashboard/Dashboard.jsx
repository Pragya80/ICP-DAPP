// Dashboard.jsx
function Dashboard() {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Supply Chain Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Products</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Orders</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Inventory</h3>
            <p className="text-3xl font-bold text-orange-600">0</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Revenue</h3>
            <p className="text-3xl font-bold text-purple-600">$0</p>
          </div>
        </div>
      </div>
    );
  }
  
  export default Dashboard;