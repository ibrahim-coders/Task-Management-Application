import { createContext, useEffect, useState } from 'react';

import axios from 'axios';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../Firebase/firebase.init';

export const AuthContext = createContext(null);
// eslint-disable-next-line react/prop-types
const AuthPrvider = ({ children }) => {
  const [user, setUser] = useState(null);
  console.log(user);
  const [loading, setLoading] = useState(true);
  const Provider = new GoogleAuthProvider();

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
    return signInWithPopup(auth, Provider);
  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  const reset = email => {
    return sendPasswordResetEmail(auth, email);
  };

  const update = (name, url) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: url,
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      if (currentUser) {
        axios
          .post('https://taskflow-server-ra21.onrender.com/jwt', {
            email: currentUser.email,
          })
          .then(data => {
            if (data.data.token) {
              localStorage.setItem('access-token', data.data.token);
            }
          })
          .catch(error => {
            console.error('Error fetching token:', error);
          });
      } else {
        localStorage.removeItem('access-token');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  const object = {
    UserRegister,

    user,
    setUser,
    loading,
    logout,
    googleLoging,
    loginUser,
    reset,
    update,
  };
  return <AuthContext.Provider value={object}>{children}</AuthContext.Provider>;
};

export default AuthPrvider;
