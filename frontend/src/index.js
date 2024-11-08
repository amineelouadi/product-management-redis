import React from 'react';
import ReactDOM from 'react-dom/client';  // Import createRoot from react-dom/client
import App from './App';
import './index.css';  // If you have a CSS file for styles

// Get the root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Use createRoot to render the app
root.render(<App />);
