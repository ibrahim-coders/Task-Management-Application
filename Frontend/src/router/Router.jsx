import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import Login from '../page/Authentication/Login';
import SignUp from '../page/Authentication/SignUp';
import ProtectRoutes from './ProtectRoutes';
import ToDo from '../page/TaksList/ToDo';
import Progress from '../page/TaksList/Progress';
import Complete from '../page/TaksList/Complete';

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
      <Route path="/to-do" element={<ToDo />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/complete" element={<Complete />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
};

export default Router;
