import { useState, useEffect, memo, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { FaUser, FaSignOutAlt, FaHome, FaBuilding, FaHeart, FaEnvelope } from 'react-icons/fa';

// Memoized profile image component to prevent re-renders
const ProfileImage = memo(({ user }) => {
  // Use a placeholder image as fallback
  const placeholderImage = '/placeholder.png';

  // Memoize the image source to prevent re-renders
  const imageSrc = useMemo(() => {
    return user?.profilePicture || user?.profilePic || placeholderImage;
  }, [user?.profilePicture, user?.profilePic]);

  return (
    <img
      src={imageSrc}
      alt="Profile"
      className="w-8 h-8 rounded-full object-cover"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = placeholderImage;
      }}
      loading="eager" // Prioritize loading
      style={{ objectFit: 'cover' }} // Ensure consistent sizing
    />
  );
});

const Header = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Handle clicks outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    // Add event listener when menu is open
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Only log on initial mount, not on every auth state change
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Header component mounted');
    }
  }, []);

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
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600"
                >
                  <span>{user?.name}</span>
                  <ProfileImage user={user} />
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/dashboard"
                      className="flex px-4 py-2 text-gray-700 hover:bg-gray-100 items-center cursor-pointer"
                    >
                      <FaHome className="mr-2" /> Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="flex px-4 py-2 text-gray-700 hover:bg-gray-100 items-center cursor-pointer"
                    >
                      <FaUser className="mr-2" /> Profile
                    </Link>
                    {user?.role === 'seller' && (
                      <Link
                        to="/dashboard/properties"
                        className="flex px-4 py-2 text-gray-700 hover:bg-gray-100 items-center cursor-pointer"
                      >
                        <FaBuilding className="mr-2" /> My Properties
                      </Link>
                    )}
                    <Link
                      to="/dashboard/wishlist"
                      className="flex px-4 py-2 text-gray-700 hover:bg-gray-100 items-center cursor-pointer !z-50 relative"
                      style={{ pointerEvents: 'auto' }}
                    >
                      <FaHeart className="mr-2" /> Wishlist
                    </Link>
                    <Link
                      to="/dashboard/messages"
                      className="flex px-4 py-2 text-gray-700 hover:bg-gray-100 items-center cursor-pointer !z-50 relative"
                      style={{ pointerEvents: 'auto' }}
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
                      className="flex w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 items-center cursor-pointer !z-50 relative"
                      style={{ pointerEvents: 'auto' }}
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
          <div className="md:hidden mt-4 pb-4 z-50">
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
                    <ProfileImage user={user} />
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
});

export default Header;
