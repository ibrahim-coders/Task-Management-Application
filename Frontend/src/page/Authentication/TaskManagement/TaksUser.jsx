import { useContext } from 'react';
import { AuthContext } from '../../../AuthContext/AuthPrvider';
import { useNavigate } from 'react-router-dom';

const TaksUser = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { signOuts } = useContext(AuthContext);

  const logout = () => {
    signOuts();
    navigate('/login');
  };

  return (
    <div className="flex  h-screen w-full ">
      <div className="w-96">
        <div className=" shadow-xl rounded-lg py-3">
          <div className="photo-wrapper p-2">
            <img
              className="w-20 h-20 rounded-full mx-auto"
              src={user?.photoURL || 'https://via.placeholder.com/100'}
              alt="User"
            />
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

            <div onClick={logout} className="text-center my-3">
              <button className="text-xl text-indigo-500 italic hover:underline hover:text-indigo-600 ">
                LogOut
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaksUser;
