import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaBed, FaBath, FaRulerCombined, FaHeart, FaRegHeart, FaMapMarkerAlt } from 'react-icons/fa';
import { addToWishlist, removeFromWishlist } from '../../redux/slices/wishlistSlice';

const PropertyCard = ({ property }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);
  
  // Check if property is in wishlist
  const isInWishlist = wishlist.some((item) => item._id === property._id);
  
  const handleWishlist = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }
    
    if (isInWishlist) {
      dispatch(removeFromWishlist(property._id));
    } else {
      dispatch(addToWishlist(property._id));
    }
  };
  
  // Format price with commas
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Property Image */}
      <div className="relative">
        <Link to={`/properties/${property._id}`}>
          <img
            src={property.images && property.images.length > 0 ? property.images[0].url : 'https://via.placeholder.com/400x300?text=No+Image'}
            alt={property.title}
            className="w-full h-56 object-cover"
          />
        </Link>
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          {isInWishlist ? (
            <FaHeart className="text-red-600 text-xl" />
          ) : (
            <FaRegHeart className="text-gray-600 text-xl" />
          )}
        </button>
        
        {/* Property Type Badge */}
        <div className="absolute bottom-3 left-3 bg-red-600 text-white px-3 py-1 rounded-md text-sm font-semibold">
          {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
        </div>
        
        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-md text-sm font-semibold">
            Featured
          </div>
        )}
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
        <div className="flex items-center text-gray-600 mb-3">
          <FaMapMarkerAlt className="mr-1" />
          <span className="text-sm truncate">
            {property.location.address}, {property.location.city}
          </span>
        </div>
        
        {/* Property Features */}
        <div className="flex items-center justify-between text-gray-600 border-t pt-3">
          {property.bedrooms !== undefined && (
            <div className="flex items-center">
              <FaBed className="mr-1" />
              <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
            </div>
          )}
          
          {property.bathrooms !== undefined && (
            <div className="flex items-center">
              <FaBath className="mr-1" />
              <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
            </div>
          )}
          
          <div className="flex items-center">
            <FaRulerCombined className="mr-1" />
            <span>{property.area} {property.areaUnit}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
