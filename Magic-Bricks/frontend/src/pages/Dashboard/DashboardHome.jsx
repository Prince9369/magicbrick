import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProperties } from '../../redux/slices/propertySlice';
import { getWishlist } from '../../redux/slices/wishlistSlice';
import { getConversations } from '../../redux/slices/chatSlice';
import { FaBuilding, FaHeart, FaEnvelope, FaEye, FaPlus } from 'react-icons/fa';

const DashboardHome = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { userProperties } = useSelector((state) => state.property);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { conversations, unreadCount } = useSelector((state) => state.chat);
  
  useEffect(() => {
    // Fetch user data
    if (user?.role === 'seller' || user?.role === 'agent' || user?.role === 'admin') {
      dispatch(getUserProperties());
    }
    dispatch(getWishlist());
    dispatch(getConversations());
  }, [dispatch, user]);
  
  // Calculate total property views
  const totalViews = userProperties.reduce((total, property) => total + property.views, 0);
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      {/* Welcome Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome back, {user?.name}!</h2>
        <p className="text-gray-600">
          Here's an overview of your activity on Magic Bricks.
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Properties Card */}
        {(user?.role === 'seller' || user?.role === 'agent' || user?.role === 'admin') && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FaBuilding className="text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">My Properties</p>
                <p className="text-2xl font-semibold text-gray-800">{userProperties.length}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to="/dashboard/properties"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View all properties
              </Link>
            </div>
          </div>
        )}
        
        {/* Wishlist Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <FaHeart className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Wishlist</p>
              <p className="text-2xl font-semibold text-gray-800">{wishlist.length}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/dashboard/wishlist"
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              View wishlist
            </Link>
          </div>
        </div>
        
        {/* Messages Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaEnvelope className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Messages</p>
              <p className="text-2xl font-semibold text-gray-800">
                {conversations.length}
                {unreadCount > 0 && (
                  <span className="ml-2 text-sm bg-red-600 text-white rounded-full px-2 py-1">
                    {unreadCount} new
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/dashboard/messages"
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              View messages
            </Link>
          </div>
        </div>
        
        {/* Views Card */}
        {(user?.role === 'seller' || user?.role === 'agent' || user?.role === 'admin') && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FaEye className="text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-semibold text-gray-800">{totalViews}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to="/dashboard/properties"
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                View property analytics
              </Link>
            </div>
          </div>
        )}
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(user?.role === 'seller' || user?.role === 'agent' || user?.role === 'admin') && (
            <Link
              to="/dashboard/properties/add"
              className="flex items-center p-4 bg-gray-50 rounded-md hover:bg-gray-100"
            >
              <FaPlus className="text-red-600 mr-3" />
              <span>Add New Property</span>
            </Link>
          )}
          <Link
            to="/properties"
            className="flex items-center p-4 bg-gray-50 rounded-md hover:bg-gray-100"
          >
            <FaBuilding className="text-blue-600 mr-3" />
            <span>Browse Properties</span>
          </Link>
          <Link
            to="/dashboard/messages"
            className="flex items-center p-4 bg-gray-50 rounded-md hover:bg-gray-100"
          >
            <FaEnvelope className="text-green-600 mr-3" />
            <span>Check Messages</span>
          </Link>
        </div>
      </div>
      
      {/* Recent Properties */}
      {(user?.role === 'seller' || user?.role === 'agent' || user?.role === 'admin') && userProperties.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Properties</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userProperties.slice(0, 5).map((property) => (
                  <tr key={property._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-md object-cover"
                            src={property.images && property.images.length > 0 ? property.images[0].url : 'https://via.placeholder.com/40'}
                            alt={property.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                            {property.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {property.location.city}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{property.price.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{property.priceUnit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {property.views}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        property.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {property.verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/properties/${property._id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                        View
                      </Link>
                      <Link to={`/dashboard/properties/edit/${property._id}`} className="text-indigo-600 hover:text-indigo-900">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {userProperties.length > 5 && (
            <div className="mt-4 text-right">
              <Link
                to="/dashboard/properties"
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                View all properties
              </Link>
            </div>
          )}
        </div>
      )}
      
      {/* Recent Messages */}
      {conversations.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Messages</h2>
          <div className="space-y-4">
            {conversations.slice(0, 3).map((conversation) => (
              <Link
                key={conversation._id}
                to={`/dashboard/messages/${conversation._id}`}
                className="block p-4 border rounded-md hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={conversation.participants[0]?.profilePic || 'https://via.placeholder.com/40'}
                      alt={conversation.participants[0]?.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {conversation.participants[0]?.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">
                        {conversation.lastMessage?.text || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-xs text-gray-500">
                      {new Date(conversation.updatedAt).toLocaleDateString()}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <span className="mt-1 bg-red-600 text-white text-xs rounded-full px-2 py-1">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {conversations.length > 3 && (
            <div className="mt-4 text-right">
              <Link
                to="/dashboard/messages"
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                View all messages
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
