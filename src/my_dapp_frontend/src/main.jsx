import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';

// Ensure Tailwind CSS is loaded
console.log('Tailwind CSS should be loaded from index.scss');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
