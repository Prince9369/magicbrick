import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../../redux/slices/authSlice';

const AuthInitializer = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  useEffect(() => {
    // Check if we have a token but no user data or if we're already authenticated
    const token = localStorage.getItem('token');
    
    if (token && !isAuthenticated) {
      console.log('Token found, fetching current user...');
      dispatch(getCurrentUser());
    }
  }, [dispatch, isAuthenticated]);
  
  return null; // This component doesn't render anything
};

export default AuthInitializer;
