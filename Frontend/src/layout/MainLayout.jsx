import { Outlet } from 'react-router-dom';
import TaksUser from '../page/Authentication/TaskManagement/TaksUser';
import { useState } from 'react';
import { MdMenu } from 'react-icons/md';

const MainLayout = () => {
  const [isOpen, setOpen] = useState(false);

  const handleMenu = () => setOpen(!isOpen);

  return (
    <>
      <h1 className="text-3xl font-semibold text-center mb-6 text-blue-500">
        Task Manager
      </h1>
      <div className="max-w-screen-xl mx-auto flex relative">
        {/* Mobile Menu Button */}
        <div className="absolute top-4 z-50 left-4 md:hidden ">
          <MdMenu
            onClick={handleMenu}
            className="text-2xl cursor-pointer text-blue-700"
          />
        </div>

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
            ${
              isOpen ? 'translate-x-0' : '-translate-x-full'
            } md:relative md:translate-x-0`}
        >
          <TaksUser handleMenu={handleMenu} />
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 w-full min-h-[calc(100vh)] pb-12 container mx-auto p-4 transition-all duration-300 ease-in-out ${
            isOpen ? 'opacity-10' : ''
          }`}
        >
          {/* Outlet for nested routes */}
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default MainLayout;
