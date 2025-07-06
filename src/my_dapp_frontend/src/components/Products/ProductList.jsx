import { useState } from "react";

function AddProductForm({ onClose, onAddProduct }) {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: "",
        status: "Available",
        manufacturer: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.name && formData.price && formData.category && formData.manufacturer) {
            const newProduct = {
                id: Date.now(), // Simple ID generation
                name: formData.name,
                price: parseFloat(formData.price),
                category: formData.category,
                status: formData.status,
                manufacturer: formData.manufacturer
            };
            onAddProduct(newProduct);
            onClose();
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Add New Product</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Home">Home</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Manufacturer</label>
                        <input
                            type="text"
                            name="manufacturer"
                            value={formData.manufacturer}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Available">Available</option>
                            <option value="Out of Stock">Out of Stock</option>
                        </select>
                    </div>
                    <div className="flex gap-2 pt-4">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Add Product
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProductList() {
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [products, setProducts] = useState([
        { id: 1, name: "Product 1", price: 100, category: "Electronics", status: "Available", manufacturer: "TechCorp" },
        { id: 2, name: "Product 2", price: 200, category: "Electronics", status: "Out of Stock", manufacturer: "MobileTech" },
        { id: 3, name: "Product 3", price: 300, category: "Electronics", status: "Available", manufacturer: "FashionCo" },
        { id: 4, name: "Product 4", price: 400, category: "Home", status: "Available", manufacturer: "HomeGoods" },
        { id: 5, name: "Product 5", price: 500, category: "Electronics", status: "Available", manufacturer: "AudioTech" },
    ]);

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddProduct = (newProduct) => {
        setProducts([...products, newProduct]);
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Products</h1>
                <button 
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Add New Product
                </button>
            </div>

            {/* Search Input */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search products by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Search Results Display */}
            <p className="mb-4 text-gray-600">
                {searchTerm ? `Searching for "${searchTerm}"` : "Showing all products"}
            </p>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <p className="text-gray-600">${product.price}</p>
                        <p className="text-sm text-gray-500">{product.category}</p>
                        <p className="text-sm text-gray-500">By {product.manufacturer}</p>
                        <span className={`inline-block px-2 py-1 rounded text-xs mt-2 ${
                            product.status === "Available" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                        }`}>
                            {product.status}
                        </span>
                    </div>
                ))}
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
            </div>

            {showAddForm && (
                <AddProductForm 
                    onClose={() => setShowAddForm(false)}
                    onAddProduct={handleAddProduct}
                />
            )}
        </div>
    );
}

export default ProductList;