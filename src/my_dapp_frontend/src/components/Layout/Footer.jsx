// const Footer = () => {
//     return(
        
//         <footer class="fixed bottom-0 left-0 z-20 w-full p-4 bg-white border-t border-gray-200 shadow-sm md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 dark:border-gray-600">
//         <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2025 <a href="https://sharma.acmsscbs.in/" class="hover:underline">SharmaDapp™</a>. All Rights Reserved.
//         </span>
//         <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
//             <li>
//                 <a href="#" class="hover:underline me-4 md:me-6">About</a>
//             </li>
//             <li>
//                 <a href="#" class="hover:underline me-4 md:me-6">Privacy Policy</a>
//             </li>
//             <li>
//                 <a href="#" class="hover:underline me-4 md:me-6">Licensing</a>
//             </li>
//             <li>
//                 <a href="#" class="hover:underline">Contact</a>
//             </li>
//         </ul>
//     </footer>
//     )
// }

// export default Footer;


function Footer() {
    return (
      <footer className="bg-gray-900 text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">SC</span>
                </div>
                <h3 className="text-xl font-bold">Supply Chain DApp</h3>
              </div>
              <p className="text-gray-300 mb-4">
                A decentralized supply chain management system built on Internet Computer.
                Connect manufacturers, distributors, retailers, and customers seamlessly.
              </p>
              <div className="flex space-x-4">
                <span className="bg-blue-600 px-3 py-1 rounded-full text-xs font-medium">Version 1.0</span>
                <span className="bg-green-600 px-3 py-1 rounded-full text-xs font-medium">ICP Powered</span>
              </div>
            </div>
  
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Products</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Orders</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Tracking</a></li>
              </ul>
            </div>
  
            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Email: info@supplychain.com</li>
                <li>Support: support@supplychain.com</li>
                <li>Documentation</li>
              </ul>
            </div>
          </div>
  
          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2024 Supply Chain DApp. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  export default Footer;