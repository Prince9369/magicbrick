import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProperties, deleteProperty } from '../../redux/slices/propertySlice';
import { FaEdit, FaTrash, FaEye, FaPlus, FaSpinner } from 'react-icons/fa';

const MyProperties = () => {
  const dispatch = useDispatch();
  const { userProperties, isLoading } = useSelector((state) => state.property);
  
  useEffect(() => {
    dispatch(getUserProperties());
  }, [dispatch]);
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      dispatch(deleteProperty(id));
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-red-600 text-4xl" />
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Properties</h1>
        <Link
          to="/dashboard/properties/add"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Add Property
        </Link>
      </div>
      
      {userProperties.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No properties found</h3>
          <p className="text-gray-600 mb-6">
            You haven't listed any properties yet. Start by adding your first property.
          </p>
          <Link
            to="/dashboard/properties/add"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md inline-flex items-center"
          >
            <FaPlus className="mr-2" /> Add Property
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                    Type
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
                {userProperties.map((property) => (
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
                      </div>
                      <div className="text-sm text-gray-500">
                        For {property.listingType.charAt(0).toUpperCase() + property.listingType.slice(1)}
                      </div>
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
                      <div className="flex space-x-3">
                        <Link
                          to={`/properties/${property._id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Property"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          to={`/dashboard/properties/edit/${property._id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit Property"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(property._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Property"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProperties;
