import { useForm } from 'react-hook-form';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext/AuthPrvider';
import toast from 'react-hot-toast';

const Login = () => {
  const { googleLoging, loginUser } = useContext(AuthContext);
  const [errorMess, setErrorMess] = useState('');
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  const onSubmit = async data => {
    try {
      setErrorMess('');
      const result = await loginUser(data.email, data?.password);
      navigate('/');
      toast.success('Login Successfully');
      console.log(result);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setErrorMess('Email Address is not correct');
      } else if (error.code === 'auth/invalid-credential') {
        setErrorMess('Email Address is not correct');
      } else if (error.code === 'auth/too-many-requests') {
        setErrorMess('Password is not correct');
      } else {
        setErrorMess(error.message);
      }
    }
  };

  const handleLogin = async () => {
    try {
      const result = await googleLoging();
      console.log(result.user);
      toast.success('Account signup successfully');
      navigate('/');
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center text-sky-600">
          Log in to your account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block font-medium pb-2">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm ">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field with Show/Hide */}
          <div>
            <label className="block font-medium pb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', { required: 'Password is required' })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-2 text-sm text-gray-500"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <p className="text-red-400 p-2 text-sm">{errorMess}</p>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-center text-sm text-gray-600 mt-3">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-3 text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google Login Button */}
        <div className="w-full flex justify-center text-center items-center">
          <button
            onClick={handleLogin}
            className="w-full flex py-3 rounded-md transition items-center justify-center shadow-md border-2 border-gray-300 hover:bg-gray-100"
          >
            <img
              className="w-8 h-8 mr-2"
              src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
              alt="Google Icon"
            />
            <span>Continue With Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
