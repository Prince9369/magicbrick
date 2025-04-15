import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getWishlist, removeFromWishlist } from '../../redux/slices/wishlistSlice';
import { FaTrash, FaSpinner, FaSearch } from 'react-icons/fa';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { wishlist, isLoading } = useSelector((state) => state.wishlist);
  
  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);
  
  const handleRemove = (propertyId) => {
    dispatch(removeFromWishlist(propertyId));
  };
  
  // Format price with commas
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Wishlist</h1>
      
      {wishlist.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FaSearch className="mx-auto text-gray-400 text-5xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-600 mb-6">
            Save properties you like to your wishlist for easy access later.
          </p>
          <Link
            to="/properties"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md inline-block"
          >
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((property) => (
            <div
              key={property._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Property Image */}
              <div className="relative">
                <Link to={`/properties/${property._id}`}>
                  <img
                    src={property.images && property.images.length > 0 ? property.images[0].url : 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={property.title}
                    className="w-full h-56 object-cover"
                  />
                </Link>
                
                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(property._id)}
                  className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300"
                  title="Remove from wishlist"
                >
                  <FaTrash className="text-red-600" />
                </button>
                
                {/* Property Type Badge */}
                <div className="absolute bottom-3 left-3 bg-red-600 text-white px-3 py-1 rounded-md text-sm font-semibold">
                  {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
                </div>
              </div>
              
              {/* Property Details */}
              <div className="p-4">
                {/* Price */}
                <div className="mb-2">
                  <span className="text-xl font-bold text-gray-800">₹{formatPrice(property.price)}</span>
                  {property.priceUnit === 'per sq ft' && <span className="text-sm text-gray-600">/sq.ft</span>}
                </div>
                
                {/* Title */}
                <Link to={`/properties/${property._id}`}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-red-600 transition-colors duration-300">
                    {property.title}
                  </h3>
                </Link>
                
                {/* Location */}
                <p className="text-gray-600 mb-3">
                  {property.location.address}, {property.location.city}
                </p>
                
                {/* Property Features */}
                <div className="flex items-center justify-between text-gray-600 border-t pt-3">
                  {property.bedrooms !== undefined && (
                    <div>
                      <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
                    </div>
                  )}
                  
                  {property.bathrooms !== undefined && (
                    <div>
                      <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
                    </div>
                  )}
                  
                  <div>
                    <span>{property.area} {property.areaUnit}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
