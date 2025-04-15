import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getProperties } from '../../redux/slices/propertySlice';
import PropertyCard from '../../components/property/PropertyCard';
import SearchBar from '../../components/common/SearchBar';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { properties, isLoading } = useSelector((state) => state.property);
  const [searchParams, setSearchParams] = useState({
    listingType: 'sale',
    city: '',
    propertyType: '',
  });

  useEffect(() => {
    // Fetch featured properties
    dispatch(getProperties({ featured: true, limit: 6 }));
  }, [dispatch]);

  const handleSearch = (params) => {
    navigate('/properties', { state: params });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-20">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80")', opacity: '0.5' }}></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Your Dream Property</h1>
            <p className="text-xl mb-8">
              Search from thousands of properties for sale and rent across India
            </p>
            
            {/* Search Bar */}
            <SearchBar onSearch={handleSearch} initialValues={searchParams} />
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Featured Properties</h2>
            <Link to="/properties" className="text-red-600 hover:text-red-700 font-semibold">
              View All Properties
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Magic Bricks</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Trusted Platform</h3>
              <p className="text-gray-600">
                India's most trusted property portal with verified listings and genuine owners.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Largest Selection</h3>
              <p className="text-gray-600">
                Browse through thousands of properties across all major cities in India.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick & Easy</h3>
              <p className="text-gray-600">
                Find your dream property quickly with our advanced search filters and tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Dream Home?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their perfect property with Magic Bricks.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/properties"
              className="px-6 py-3 bg-white text-red-600 font-semibold rounded-md hover:bg-gray-100"
            >
              Browse Properties
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 bg-red-700 text-white font-semibold rounded-md hover:bg-red-800"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
