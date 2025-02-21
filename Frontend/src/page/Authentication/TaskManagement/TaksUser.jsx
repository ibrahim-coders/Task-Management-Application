import { useContext } from 'react';
import { AuthContext } from '../../../AuthContext/AuthPrvider';
import { NavLink, useNavigate } from 'react-router-dom';
import { MdAddPhotoAlternate } from 'react-icons/md';
const TaksUser = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { signOuts } = useContext(AuthContext);

  const logout = () => {
    signOuts();
    navigate('/login');
  };

  // const handlePhotoChange = (async) => {

  // }
  return (
    <div className="flex flex-col h-screen w-full box-shadow rounded-lg ">
      <div className="w-full">
        <div className=" py-3">
          <div className="photo-wrapper p-2 flex justify-center items-center ">
            {user?.photoURL ? (
              <div className="relative rounded-full border border-sky-600">
                <img
                  className="w-20 h-20  rounded-full"
                  src={user.photoURL}
                  alt="User"
                />
                <MdAddPhotoAlternate
                  className=" absolute bottom-4  right-2 text-sky-600  cursor-pointer"
                  size={18}
                />
              </div>
            ) : (
              <div className="rounded-full border border-sky-600 w-20 h-20 relative">
                <MdAddPhotoAlternate
                  className=" absolute bottom-4  right-2 text-sky-600 cursor-pointer"
                  size={20}
                />
              </div>
            )}
          </div>

          <div className="p-2">
            <h3 className="text-center text-xl text-gray-900 font-medium leading-8">
              {user?.displayName || 'User Name'}
            </h3>
            <div className="text-center  text-xs font-semibold">
              <p>Web Developer</p>
            </div>

            <p className="px-2 py-2 flex justify-center text-center items-center text-sm">
              ID: {user?.uid?.slice(-8)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:gap-6 px-3">
        <h2 className="text-blue-500 text-xl md:text-2xl text-start py-2 font-bold">
          Task List
        </h2>

        <nav className="flex flex-col gap-2 ">
          <NavLink
            to="/to-do"
            className={({ isActive }) =>
              isActive
                ? 'text-white font-semibold border-l-4 bg-green-500 pl-3 py-2  rounded-md'
                : 'text-white font-semibold bg-em bg-blue-500  hover:bg-green-600 pl-3   rounded-md hover:text-gray-200 transition-all py-2'
            }
          >
            To-Do
          </NavLink>

          <NavLink
            to="/progress"
            className={({ isActive }) =>
              isActive
                ? 'text-white font-semibold border-l-4 bg-green-500 pl-3 py-2  rounded-md'
                : 'text-white font-semibold bg-em bg-blue-500  hover:bg-green-600 pl-3   rounded-md hover:text-gray-200 transition-all py-2'
            }
          >
            Progress
          </NavLink>

          <NavLink
            to="/complete"
            className={({ isActive }) =>
              isActive
                ? 'text-white font-semibold border-l-4 bg-green-500pl-3 py-2  rounded-md'
                : 'text-white font-semibold bg-em bg-blue-500  hover:bg-green-600 pl-3   rounded-md hover:text-gray-200 transition-all py-2'
            }
          >
            Complete
          </NavLink>
          <NavLink
            to="/alltaks"
            className={({ isActive }) =>
              isActive
                ? 'text-white font-semibold border-l-4 bg-green-500 pl-3 py-2  rounded-md'
                : 'text-white font-semibold bg-em bg-blue-500  hover:bg-green-600 pl-3   rounded-md hover:text-gray-200 transition-all py-2'
            }
          >
            AllTaks
          </NavLink>

          <NavLink
            to="/login"
            onClick={logout}
            className={({ isActive }) =>
              isActive
                ? 'text-white font-semibold border-l-4 bg-green-500 pl-3 py-2  rounded-md'
                : 'text-white font-semibold bg-em bg-blue-500  hover:bg-green-600 pl-3   rounded-md hover:text-gray-200 transition-all py-2'
            }
          >
            LogOut
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default TaksUser;
