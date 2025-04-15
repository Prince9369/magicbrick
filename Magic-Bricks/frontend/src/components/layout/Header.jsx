import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { FaUser, FaSignOutAlt, FaHome, FaBuilding, FaHeart, FaEnvelope } from 'react-icons/fa';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Header component mounted, auth state:', { isAuthenticated, user });
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    console.log('Logging out...');
    dispatch(logout())
      .then(() => {
        console.log('Logout successful');
        navigate('/');
      })
      .catch((error) => {
        console.error('Logout failed:', error);
      });
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-red-600">Magic</span>
            <span className="text-2xl font-bold text-gray-800">Bricks</span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-red-600">
              Home
            </Link>
            <Link to="/properties" className="text-gray-700 hover:text-red-600">
              Properties
            </Link>
            {isAuthenticated && user?.role === 'seller' && (
              <Link to="/dashboard/properties/add" className="text-gray-700 hover:text-red-600">
                Add Property
              </Link>
            )}
            <Link to="/about" className="text-gray-700 hover:text-red-600">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-red-600">
              Contact
            </Link>
          </nav>

          {/* User Menu - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600"
                >
                  <span>{user?.name}</span>
                  <img
                    src={user?.profilePicture || user?.profilePic || 'https://via.placeholder.com/40'}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/40';
                    }}
                  />
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      to="/dashboard"
                      className="flex px-4 py-2 text-gray-700 hover:bg-gray-100 items-center"
                    >
                      <FaHome className="mr-2" /> Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="flex px-4 py-2 text-gray-700 hover:bg-gray-100 items-center"
                    >
                      <FaUser className="mr-2" /> Profile
                    </Link>
                    {user?.role === 'seller' && (
                      <Link
                        to="/dashboard/properties"
                        className="flex px-4 py-2 text-gray-700 hover:bg-gray-100 items-center"
                      >
                        <FaBuilding className="mr-2" /> My Properties
                      </Link>
                    )}
                    <Link
                      to="/dashboard/wishlist"
                      className="flex px-4 py-2 text-gray-700 hover:bg-gray-100 items-center"
                    >
                      <FaHeart className="mr-2" /> Wishlist
                    </Link>
                    <Link
                      to="/dashboard/messages"
                      className="flex px-4 py-2 text-gray-700 hover:bg-gray-100 items-center"
                    >
                      <FaEnvelope className="mr-2" /> Messages
                      {unreadCount > 0 && (
                        <span className="ml-2 bg-red-600 text-white text-xs rounded-full px-2 py-1">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 items-center"
                    >
                      <FaSignOutAlt className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-red-600 border border-gray-300 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-2">
              <Link
                to="/"
                className="text-gray-700 hover:text-red-600 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/properties"
                className="text-gray-700 hover:text-red-600 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Properties
              </Link>
              {isAuthenticated && user?.role === 'seller' && (
                <Link
                  to="/dashboard/properties/add"
                  className="text-gray-700 hover:text-red-600 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Add Property
                </Link>
              )}
              <Link
                to="/about"
                className="text-gray-700 hover:text-red-600 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-red-600 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2 mb-4 py-2 border-b border-gray-200">
                    <img
                      src={user?.profilePicture || user?.profilePic || 'https://via.placeholder.com/40'}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/40';
                      }}
                    />
                    <span className="font-medium">{user?.name}</span>
                  </div>
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-red-600 py-2 flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaHome className="mr-2" /> Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-red-600 py-2 flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaUser className="mr-2" /> Profile
                  </Link>
                  {user?.role === 'seller' && (
                    <Link
                      to="/dashboard/properties"
                      className="text-gray-700 hover:text-red-600 py-2 flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaBuilding className="mr-2" /> My Properties
                    </Link>
                  )}
                  <Link
                    to="/dashboard/wishlist"
                    className="text-gray-700 hover:text-red-600 py-2 flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaHeart className="mr-2" /> Wishlist
                  </Link>
                  <Link
                    to="/dashboard/messages"
                    className="text-gray-700 hover:text-red-600 py-2 flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaEnvelope className="mr-2" /> Messages
                    {unreadCount > 0 && (
                      <span className="ml-2 bg-red-600 text-white text-xs rounded-full px-2 py-1">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-700 hover:text-red-600 py-2 flex items-center"
                  >
                    <FaSignOutAlt className="mr-2" /> Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 mt-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-center text-gray-700 hover:text-red-600 border border-gray-300 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-center text-white bg-red-600 hover:bg-red-700 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
