import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext/AuthPrvider';

import PropTypes from 'prop-types';
import Spinner from '../components/Spinner';
const ProtectRoutes = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <Spinner />;
  if (user && user?.email) {
    return children;
  }
  return <Navigate to="/login" />;
};

ProtectRoutes.propTypes = {
  children: PropTypes.node.isRequired,
};
export default ProtectRoutes;
