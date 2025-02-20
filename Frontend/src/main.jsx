import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import Router from './router/Router';
import AuthPrvider from './AuthContext/AuthPrvider';
import { Toaster } from 'react-hot-toast';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthPrvider>
        <Toaster position="top-right" />
        <Router />
      </AuthPrvider>
    </BrowserRouter>
  </StrictMode>
);
