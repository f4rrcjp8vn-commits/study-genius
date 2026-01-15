import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ReactMarkdown from 'react-markdown'; // Ensure this is imported for types if needed, though used in components

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
