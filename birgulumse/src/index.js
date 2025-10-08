import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from './lib/router';
import App from './App';
import { AuthProvider } from './lib/AuthContext';
import reportWebVitals from './reportWebVitals';
import './index.css';
import './styles/theme.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
