import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProperty, clearProperty } from '../../redux/slices/propertySlice';
import { addToWishlist, removeFromWishlist } from '../../redux/slices/wishlistSlice';
import { createConversation } from '../../redux/slices/chatSlice';
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaHeart,
  FaRegHeart,
  FaPhone,
  FaEnvelope,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { property, isLoading } = useSelector((state) => state.property);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);
  
  const [activeImage, setActiveImage] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: 'I am interested in this property. Please contact me.',
  });
  
  useEffect(() => {
    // Fetch property details
    dispatch(getProperty(id));
    
    // Clear property on component unmount
    return () => {
      dispatch(clearProperty());
    };
  }, [dispatch, id]);
  
  // Check if property is in wishlist
  const isInWishlist = wishlist.some((item) => item._id === id);
  
  // Format price with commas
  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  
  const handleWishlist = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }
    
    if (isInWishlist) {
      dispatch(removeFromWishlist(id));
    } else {
      dispatch(addToWishlist(id));
    }
  };
  
  const handleContactFormChange = (e) => {
    const { name, value } = e.target;
    setContactFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleContactFormSubmit = (e) => {
    e.preventDefault();
    // Submit contact form data
    console.log('Contact form submitted:', contactFormData);
    // Reset form and hide it
    setShowContactForm(false);
  };
  
  const handleStartChat = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }
    
    dispatch(createConversation({
      recipientId: property.owner._id,
      propertyId: property._id,
    }));
    
    // Redirect to messages page
    window.location.href = '/dashboard/messages';
  };
  
  const nextImage = () => {
    if (property?.images?.length > 0) {
      setActiveImage((prev) => (prev + 1) % property.images.length);
    }
  };
  
  const prevImage = () => {
    if (property?.images?.length > 0) {
      setActiveImage((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-red-600 text-4xl" />
      </div>
    );
  }
  
  if (!property) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Property not found</h2>
        <p className="text-gray-600 mb-8">The property you are looking for does not exist or has been removed.</p>
        <Link to="/properties" className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700">
          Browse Properties
        </Link>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="text-gray-600 hover:text-red-600">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <Link to="/properties" className="text-gray-600 hover:text-red-600">
                    Properties
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-gray-500">{property.title}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        
        {/* Property Title and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{property.title}</h1>
            <div className="flex items-center text-gray-600">
              <FaMapMarkerAlt className="mr-1" />
              <span>
                {property.location.address}, {property.location.city}, {property.location.state} - {property.location.pincode}
              </span>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <button
              onClick={handleWishlist}
              className="flex items-center bg-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-50 mr-4"
            >
              {isInWishlist ? (
                <>
                  <FaHeart className="text-red-600 mr-2" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <FaRegHeart className="text-gray-600 mr-2" />
                  <span>Save</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => window.print()}
              className="bg-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-50"
            >
              Share
            </button>
          </div>
        </div>
        
        {/* Property Images and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Property Images */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Main Image */}
              <div className="relative h-96">
                <img
                  src={property.images && property.images.length > 0 ? property.images[activeImage].url : 'https://via.placeholder.com/800x600?text=No+Image'}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Image Navigation */}
                {property.images && property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                    >
                      <FaChevronLeft className="text-gray-800" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                    >
                      <FaChevronRight className="text-gray-800" />
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {property.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImage(index)}
                          className={`w-3 h-3 rounded-full ${
                            activeImage === index ? 'bg-red-600' : 'bg-white'
                          }`}
                        ></button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              {/* Thumbnail Images */}
              {property.images && property.images.length > 1 && (
                <div className="flex overflow-x-auto p-4 space-x-2">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden ${
                        activeImage === index ? 'ring-2 ring-red-600' : ''
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Property Description */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
            </div>
            
            {/* Property Features */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Features & Amenities</h2>
              
              {property.amenities && property.amenities.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No amenities listed for this property.</p>
              )}
            </div>
            
            {/* Property Location */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Location</h2>
              
              {/* Map placeholder - would be replaced with actual map component */}
              <div className="bg-gray-200 h-64 rounded-md flex items-center justify-center">
                <p className="text-gray-600">Map will be displayed here</p>
              </div>
              
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Address</h3>
                <p className="text-gray-700">
                  {property.location.address}, {property.location.city}, {property.location.state} - {property.location.pincode}
                </p>
              </div>
            </div>
          </div>
          
          {/* Property Sidebar */}
          <div className="lg:col-span-1">
            {/* Price Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-800">₹{formatPrice(property.price)}</span>
                {property.priceUnit === 'per sq ft' && <span className="text-gray-600">/sq.ft</span>}
              </div>
              
              <div className="flex justify-between items-center py-4 border-t border-b border-gray-200">
                <div className="flex items-center">
                  <FaRulerCombined className="text-gray-600 mr-2" />
                  <div>
                    <p className="text-gray-800 font-semibold">{property.area} {property.areaUnit}</p>
                    <p className="text-sm text-gray-600">Area</p>
                  </div>
                </div>
                
                {property.bedrooms !== undefined && (
                  <div className="flex items-center">
                    <FaBed className="text-gray-600 mr-2" />
                    <div>
                      <p className="text-gray-800 font-semibold">{property.bedrooms}</p>
                      <p className="text-sm text-gray-600">Bedrooms</p>
                    </div>
                  </div>
                )}
                
                {property.bathrooms !== undefined && (
                  <div className="flex items-center">
                    <FaBath className="text-gray-600 mr-2" />
                    <div>
                      <p className="text-gray-800 font-semibold">{property.bathrooms}</p>
                      <p className="text-sm text-gray-600">Bathrooms</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Property Details</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Property Type</span>
                    <span className="text-gray-800 font-medium">
                      {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Listing Type</span>
                    <span className="text-gray-800 font-medium">
                      For {property.listingType.charAt(0).toUpperCase() + property.listingType.slice(1)}
                    </span>
                  </li>
                  {property.furnishing && (
                    <li className="flex justify-between">
                      <span className="text-gray-600">Furnishing</span>
                      <span className="text-gray-800 font-medium">
                        {property.furnishing.charAt(0).toUpperCase() + property.furnishing.slice(1)}
                      </span>
                    </li>
                  )}
                  {property.constructionStatus && (
                    <li className="flex justify-between">
                      <span className="text-gray-600">Construction Status</span>
                      <span className="text-gray-800 font-medium">
                        {property.constructionStatus.charAt(0).toUpperCase() + property.constructionStatus.slice(1)}
                      </span>
                    </li>
                  )}
                  <li className="flex justify-between">
                    <span className="text-gray-600">Listed On</span>
                    <span className="text-gray-800 font-medium">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Owner/Agent Card */}
            {property.owner && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact {property.owner.role === 'agent' ? 'Agent' : 'Owner'}</h3>
                
                <div className="flex items-center mb-4">
                  <img
                    src={property.owner.profilePic || 'https://via.placeholder.com/60'}
                    alt={property.owner.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{property.owner.name}</p>
                    <p className="text-sm text-gray-600">
                      {property.owner.role === 'agent' ? 'Real Estate Agent' : 'Property Owner'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  {property.owner.phone && (
                    <a
                      href={`tel:${property.owner.phone}`}
                      className="flex items-center text-gray-700 hover:text-red-600"
                    >
                      <FaPhone className="mr-2" />
                      <span>{property.owner.phone}</span>
                    </a>
                  )}
                  
                  <a
                    href={`mailto:${property.owner.email}`}
                    className="flex items-center text-gray-700 hover:text-red-600"
                  >
                    <FaEnvelope className="mr-2" />
                    <span>{property.owner.email}</span>
                  </a>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={handleStartChat}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md"
                  >
                    Chat Now
                  </button>
                  
                  <button
                    onClick={() => setShowContactForm(!showContactForm)}
                    className="w-full bg-white border border-red-600 text-red-600 hover:bg-red-50 font-semibold py-2 px-4 rounded-md"
                  >
                    Contact {property.owner.role === 'agent' ? 'Agent' : 'Owner'}
                  </button>
                </div>
                
                {/* Contact Form */}
                {showContactForm && (
                  <form onSubmit={handleContactFormSubmit} className="mt-4 border-t pt-4">
                    <div className="mb-3">
                      <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={contactFormData.name}
                        onChange={handleContactFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-1">
                        Your Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={contactFormData.email}
                        onChange={handleContactFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-1">
                        Your Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={contactFormData.phone}
                        onChange={handleContactFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-1">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={contactFormData.message}
                        onChange={handleContactFormChange}
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
                        required
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Similar Properties */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Similar Properties</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* This would be populated with actual similar properties */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600">
                Similar properties will be displayed here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
