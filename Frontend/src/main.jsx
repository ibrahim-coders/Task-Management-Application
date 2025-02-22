import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import Router from './router/Router';
import AuthPrvider from './AuthContext/AuthPrvider';
import { Toaster } from 'react-hot-toast';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthPrvider>
        <Toaster position="top-right" />
        <DndProvider backend={HTML5Backend}>
          <Router />
        </DndProvider>
      </AuthPrvider>
    </BrowserRouter>
  </StrictMode>
);
