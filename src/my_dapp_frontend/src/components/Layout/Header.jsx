function Header() {
    return(
        <header className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">SC</span>
            </div>
            <h1 className="text-xl font-bold">Supply Chain DApp</h1>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-blue-200 transition-colors">Dashboard</a>
            <a href="#" className="hover:text-blue-200 transition-colors">Products</a>
            <a href="#" className="hover:text-blue-200 transition-colors">Orders</a>
          </nav>
          
          <div>
            <button className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition-colors">
              Login
            </button>
          </div>
        </div>
      </header>
    )
}

export default Header;