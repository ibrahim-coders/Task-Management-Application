import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import PropTypes from 'prop-types';
import { createContext, useEffect, useState } from 'react';
import { auth } from '../Firebase/firebase.init';
import axios from 'axios';
export const AuthContext = createContext();

const AuthPrvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const provider = new GoogleAuthProvider();
  console.log(user);
  const UserRegister = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  //google login

  const googleLoging = () => {
    setLoading(true);
    return signInWithPopup(auth, provider);
  };

  // Update Profile
  const updateUserProfiles = (name, photo) => {
    const user = auth.currentUser;
    if (user) {
      return updateProfile(user, {
        displayName: name,
        photoURL: photo,
      });
    } else {
      return Promise.reject(new Error('No user is currently logged in'));
    }
  };

  //signOut
  const signOuts = () => {
    setLoading(true);
    return signOut(auth);
  };
  //observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      if (currentUser?.email) {
        setUser(currentUser);
        try {
          await axios.post(
            `${import.meta.env.VITE_API_URL}/user/${currentUser?.email}`,
            {
              name: currentUser?.displayName,
              email: currentUser?.email,
              image: currentUser?.uid,
            }
          );
        } catch (error) {
          console.log(error);
        }
      }

      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  const authInfo = {
    user,
    loading,
    UserRegister,
    loginUser,
    googleLoging,
    updateUserProfiles,
    signOuts,
  };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

AuthPrvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default AuthPrvider;
