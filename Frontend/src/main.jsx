import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import Login from './Login/Login.jsx';
import Register from './Register/Register.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Work from './Work/Work.jsx';

import AuthPrvider from './AuthContext/AuthPrvider.jsx';
import ProtectRoutes from './router/ProtectRoutes.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: (
          <ProtectRoutes>
            <Work />
          </ProtectRoutes>
        ),
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <Register />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthPrvider>
      {' '}
      <RouterProvider router={router} />
    </AuthPrvider>
  </StrictMode>
);
