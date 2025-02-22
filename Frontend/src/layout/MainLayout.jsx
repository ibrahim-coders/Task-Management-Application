import { Outlet } from 'react-router-dom';
import TaksUser from '../page/Authentication/TaskManagement/TaksUser';

const MainLayout = () => {
  return (
    <>
      <h1 className="text-3xl font-semibold text-center mb-6 text-blue-500 ">
        Task Manager
      </h1>
      <div className="max-w-screen-xl mx-auto flex ">
        <div className=" w-72">
          <TaksUser />
        </div>
        <div className="">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default MainLayout;
