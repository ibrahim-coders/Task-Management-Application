import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import Login from '../page/Authentication/Login';
import SignUp from '../page/Authentication/SignUp';
import ProtectRoutes from './ProtectRoutes';
import ToDo from '../page/TaksList/ToDo';

import Complete from '../page/TaksList/Complete';
import TaskBoard from '../page/Authentication/TaskManagement/TaskBoard ';
import AllList from '../page/TaksList/AllList';

import Progress from '../page/TaksList/Progress';

const Router = () => {
  return (
    <Routes>
      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectRoutes>
            <MainLayout />
          </ProtectRoutes>
        }
      >
        <Route index element={<TaskBoard />} />
        <Route index element={<Progress />} />
        <Route path="to-do" element={<Progress />} />
        <Route path="progress" element={<ToDo />} />
        <Route path="complete" element={<Complete />} />
        <Route path="alltaks" element={<AllList />} />
      </Route>

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
};

export default Router;
