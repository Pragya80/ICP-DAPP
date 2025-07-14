// NOTE: This page is now a placeholder. Authentication is bypassed and this page is not used in the app.
import React from 'react';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-indigo-700 mb-4">No Login Required 🚀</h2>
        <p className="text-gray-700 mb-6">Authentication is <span className="font-semibold text-green-600">bypassed</span> for this demo. Enjoy exploring the DApp without wallet connection!</p>
        <div className="flex justify-center">
          <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">Demo Mode</span>
        </div>
      </div>
    </div>
  );
};

export default Login;