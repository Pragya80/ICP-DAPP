import { useState } from "react";

function ProductList() {
    const [search, setSearch] = useState("");

    const products = [
        {id: 1, name: "Product 1", price: 100, category: "Electronics", status: "Available"},
        {id: 2, name: "Product 2", price: 200, category: "Clothing", status: "Available"},
        {id: 3, name: "Product 3", price: 300, category: "Electronics", status: "Out of Stock"},
        {id: 4, name: "Product 4", price: 400, category: "Home", status: "Available"},
        {id: 5, name: "Product 5", price: 500, category: "Electronics", status: "Available"},
    ];

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Products</h1>
            
            {/* Search and Filters */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                
                <div>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">All Categories</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Home">Home</option>
                    </select>
                </div>
                
                <div>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">All Status</option>
                        <option value="Available">Available</option>
                        <option value="Out of Stock">Out of Stock</option>
                    </select>
                </div>
            </div>

            {/* Search Results Display */}
            <p className="mb-4 text-gray-600">
                {search ? `Searching for "${search}"` : "Showing all products"}
            </p>

            {/* Products List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <p className="text-gray-600">${product.price}</p>
                        <p className="text-sm text-gray-500">{product.category}</p>
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                            product.status === "Available" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                        }`}>
                            {product.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList;