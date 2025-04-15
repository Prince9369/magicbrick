import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import {
  FaHome,
  FaBuilding,
  FaHeart,
  FaEnvelope,
  FaUser,
  FaPlus,
  FaChartBar,
  FaSignOutAlt,
} from 'react-icons/fa';

// Import dashboard components
import DashboardHome from './DashboardHome';
import MyProperties from './MyProperties';
import AddProperty from './AddProperty';
import EditProperty from './EditProperty';
import Wishlist from './Wishlist';
import Messages from './Messages';
import Conversation from './Conversation';

const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.chat);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Navigation items
  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <FaHome />,
      exact: true,
    },
    {
      name: 'My Properties',
      path: '/dashboard/properties',
      icon: <FaBuilding />,
      roles: ['seller', 'agent', 'admin'],
    },
    {
      name: 'Add Property',
      path: '/dashboard/properties/add',
      icon: <FaPlus />,
      roles: ['seller', 'agent', 'admin'],
    },
    {
      name: 'Wishlist',
      path: '/dashboard/wishlist',
      icon: <FaHeart />,
    },
    {
      name: 'Messages',
      path: '/dashboard/messages',
      icon: <FaEnvelope />,
      badge: unreadCount > 0 ? unreadCount : null,
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: <FaUser />,
    },
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role)
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar - Desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-10">
          <div className="flex flex-col flex-grow bg-white shadow-md pt-5 overflow-y-auto">
            <div className="px-4 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
            </div>

            <nav className="mt-5 flex-1 px-2 space-y-1">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md cursor-pointer ${
                    location.pathname === item.path
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                  {item.badge && (
                    <span className="ml-auto bg-red-600 text-white text-xs rounded-full px-2 py-1">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="group flex items-center px-4 py-3 text-sm font-medium rounded-md cursor-pointer text-gray-700 hover:bg-gray-50 hover:text-gray-900 w-full mt-4"
              >
                <span className="mr-3 text-lg"><FaSignOutAlt /></span>
                Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden bg-white shadow-md">
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-500 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
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
          {isMobileMenuOpen && (
            <nav className="px-2 pt-2 pb-4 space-y-1 bg-white">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md cursor-pointer ${
                    location.pathname === item.path
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                  {item.badge && (
                    <span className="ml-auto bg-red-600 text-white text-xs rounded-full px-2 py-1">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="group flex items-center px-4 py-3 text-sm font-medium rounded-md cursor-pointer text-gray-700 hover:bg-gray-50 hover:text-gray-900 w-full mt-4"
              >
                <span className="mr-3 text-lg"><FaSignOutAlt /></span>
                Logout
              </button>
            </nav>
          )}
        </div>

        {/* Main Content */}
        <div className="md:ml-64 flex-1">
          <main className="py-6 px-4 sm:px-6 md:px-8">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/properties" element={<MyProperties />} />
              <Route path="/properties/add" element={<AddProperty />} />
              <Route path="/properties/edit/:id" element={<EditProperty />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/messages/:id" element={<Conversation />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
