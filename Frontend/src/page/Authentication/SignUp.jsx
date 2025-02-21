import { useForm } from 'react-hook-form';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../../AuthContext/AuthPrvider';

const SignUp = () => {
  const navigate = useNavigate();
  const [errorMes, setErrorMess] = useState('');
  const { UserRegister, updateUserProfiles, googleLoging } =
    useContext(AuthContext);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);
  const onSubmit = async data => {
    setErrorMess('');
    try {
      const result = await UserRegister(data.email, data.password);
      const photoURL = data.image;
      await updateUserProfiles(data.firstName, photoURL);
      toast.success('Account signup successfully');
      navigate('/');
      console.log(result.user);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setErrorMess('Email already exists. Please try another email');
      } else {
        console.log(error.message);
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
    <div className="max-w-md mx-auto p-6  shadow-lg rounded-lg mt-20">
      <h2 className="text-2xl  font-bold mb-4 text-center text-sky-600">
        Welcome to Task Management
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-4">
          {/* First Name */}
          <div>
            <label className="block font-medium pb-2">First Name</label>
            <input
              {...register('firstName', { required: 'First name is required' })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm pt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block font-medium pb-2">Last Name</label>
            <input
              {...register('lastName', { required: 'Last name is required' })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm pt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>
        {/* Email */}
        <div>
          <label className="block font-medium pb-2">Email</label>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm pt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password with Toggle Visibility */}
        <div>
          <label className="block font-medium pb-2">Password</label>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
                  message: 'Must include uppercase, lowercase & number',
                },
              })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <p className="text-red-500 text-sm pt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block font-medium pb-2">Confirm Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('confirmPassword', {
                required: 'Confirm Password is required',
                validate: value =>
                  value === watch('password') || 'Passwords do not match',
              })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-2 text-sm text-gray-500"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm pt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        {errorMes && <p className="text-red-500 text-sm py-2">{errorMes}</p>}
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
      </form>
      <div className="flex justify-center items-center pt-4">
        <Link to="/login" className="text-center text-sm 0 mt-3   ">
          Already have an account?{' '}
          <span className="text-blue-600 hover:border-b-2">Log in</span>
        </Link>
      </div>
      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="px-3 text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <div className="w-full flex justify-center text-center items-center">
        <button
          onClick={handleLogin}
          className="w-full flex py-3 rounded-md transition items-center  justify-center shadow-md"
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
  );
};

export default SignUp;
