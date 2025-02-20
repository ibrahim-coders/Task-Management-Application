import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import Login from '../page/Authentication/Login';
import SignUp from '../page/Authentication/SignUp';
import ProtectRoutes from './ProtectRoutes';

const Router = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectRoutes>
            <MainLayout />
          </ProtectRoutes>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
};

export default Router;
