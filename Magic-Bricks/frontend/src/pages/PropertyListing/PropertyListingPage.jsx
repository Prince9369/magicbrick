import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getProperties } from '../../redux/slices/propertySlice';
import PropertyCard from '../../components/property/PropertyCard';
import SearchBar from '../../components/common/SearchBar';
import { FaFilter, FaSort, FaSpinner } from 'react-icons/fa';

const PropertyListingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { properties, isLoading, pagination, totalProperties, error } = useSelector((state) => state.property);

  // Parse URL search params
  const getInitialFilters = () => {
    const searchParams = new URLSearchParams(location.search);
    const params = {};

    // Get all search parameters from URL
    for (const [key, value] of searchParams.entries()) {
      // Convert boolean strings to actual booleans
      if (value === 'true' || value === 'false') {
        params[key] = value === 'true';
      }
      // Convert numeric strings to numbers
      else if (!isNaN(value) && value !== '') {
        params[key] = Number(value);
      }
      // Keep strings as is
      else {
        params[key] = value;
      }
    }

    // Use location state as fallback, then default values
    return {
      listingType: params.listingType || (location.state?.listingType) || 'sale',
      keyword: params.keyword || (location.state?.keyword) || '',
      city: params.city || (location.state?.city) || '',
      state: params.state || (location.state?.state) || '',
      propertyType: params.propertyType || (location.state?.propertyType) || '',
      minPrice: params.minPrice || (location.state?.minPrice) || '',
      maxPrice: params.maxPrice || (location.state?.maxPrice) || '',
      bedrooms: params.bedrooms || (location.state?.bedrooms) || '',
      bathrooms: params.bathrooms || (location.state?.bathrooms) || '',
      minArea: params.minArea || (location.state?.minArea) || '',
      maxArea: params.maxArea || (location.state?.maxArea) || '',
      furnishing: params.furnishing || (location.state?.furnishing) || '',
      constructionStatus: params.constructionStatus || (location.state?.constructionStatus) || '',
      featured: params.featured || (location.state?.featured) || false,
      verified: params.verified || (location.state?.verified) || false,
      sort: params.sort || (location.state?.sort) || 'newest',
      page: params.page ? parseInt(params.page) : 1
    };
  };

  const initialState = getInitialFilters();
  const [filters, setFilters] = useState(initialState);
  const [sortBy, setSortBy] = useState(initialState.sort);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialState.page);
  const [isSearching, setIsSearching] = useState(false);

  // Update filters when URL changes
  useEffect(() => {
    const newFilters = getInitialFilters();
    setFilters(newFilters);
    setSortBy(newFilters.sort);
    setCurrentPage(newFilters.page);
  }, [location.search]);

  // Update URL with current search parameters
  const updateURL = (params) => {
    const searchParams = new URLSearchParams();

    // Add all non-empty parameters to URL
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });

    // Update URL without reloading the page
    navigate({
      pathname: location.pathname,
      search: searchParams.toString()
    }, { replace: true });
  };

  // Fetch properties when filters, sort, or page changes
  useEffect(() => {
    setIsSearching(true);

    // Fetch properties with filters
    const queryParams = {
      ...filters,
      page: currentPage,
      limit: 9,
      sort: sortBy,
    };

    // Update URL with current search parameters
    updateURL(queryParams);

    // Dispatch action to fetch properties
    dispatch(getProperties(queryParams))
      .unwrap()
      .then(() => {
        setIsSearching(false);
      })
      .catch(() => {
        setIsSearching(false);
      });
  }, [dispatch, filters, sortBy, currentPage]);

  // Reset search state when there's an error
  useEffect(() => {
    if (error) {
      setIsSearching(false);
    }
  }, [error]);

  const handleSearch = (searchParams) => {
    setFilters(searchParams);
    setSortBy(sortBy); // Keep current sort
    setCurrentPage(1); // Reset to first page on new search
    window.scrollTo(0, 0); // Scroll to top
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    window.scrollTo(0, 0); // Scroll to top when sorting changes
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Generate pagination buttons
  const renderPagination = () => {
    const pages = [];
    const totalPages = pagination.pages;

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md ${
          currentPage === 1
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        Prev
      </button>
    );

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      // Show first page, last page, and pages around current page
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-1 rounded-md ${
              currentPage === i
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {i}
          </button>
        );
      } else if (
        (i === currentPage - 2 && currentPage > 3) ||
        (i === currentPage + 2 && currentPage < totalPages - 2)
      ) {
        // Show ellipsis
        pages.push(
          <span key={i} className="px-3 py-1">
            ...
          </span>
        );
      }
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md ${
          currentPage === totalPages
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        Next
      </button>
    );

    return pages;
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {filters.listingType === 'sale' ? 'Properties for Sale' : 'Properties for Rent'}
          {filters.city && ` in ${filters.city}`}
          {filters.propertyType && ` - ${filters.propertyType.charAt(0).toUpperCase() + filters.propertyType.slice(1)}`}
        </h1>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} initialValues={filters} isLoading={isSearching} />
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center bg-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-50"
            >
              <FaFilter className="mr-2" />
              <span>Filters</span>
            </button>

            <div className="ml-4">
              <span className="text-gray-600">
                {totalProperties} {totalProperties === 1 ? 'property' : 'properties'} found
              </span>
            </div>
          </div>

          <div className="flex items-center">
            <label htmlFor="sortBy" className="mr-2 text-gray-600">
              Sort by:
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={handleSortChange}
              className="bg-white px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-red-600"
            >
              <option value="newest">Newest</option>
              <option value="price_low">Price (Low to High)</option>
              <option value="price_high">Price (High to Low)</option>
              <option value="area_low">Area (Small to Large)</option>
              <option value="area_high">Area (Large to Small)</option>
            </select>
          </div>
        </div>

        {/* Additional Filters (hidden by default) */}
        {showFilters && (
          <div className="bg-white p-4 rounded-md shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Additional Filters</h3>
            {/* Add more filters here */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Furnishing */}
              <div>
                <label htmlFor="furnishing" className="block text-gray-700 text-sm font-bold mb-2">
                  Furnishing
                </label>
                <select
                  id="furnishing"
                  name="furnishing"
                  value={filters.furnishing || ''}
                  onChange={(e) => setFilters({ ...filters, furnishing: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
                >
                  <option value="">Any</option>
                  <option value="unfurnished">Unfurnished</option>
                  <option value="semi-furnished">Semi-Furnished</option>
                  <option value="fully-furnished">Fully-Furnished</option>
                </select>
              </div>

              {/* Construction Status */}
              <div>
                <label htmlFor="constructionStatus" className="block text-gray-700 text-sm font-bold mb-2">
                  Construction Status
                </label>
                <select
                  id="constructionStatus"
                  name="constructionStatus"
                  value={filters.constructionStatus || ''}
                  onChange={(e) => setFilters({ ...filters, constructionStatus: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
                >
                  <option value="">Any</option>
                  <option value="under construction">Under Construction</option>
                  <option value="ready to move">Ready to Move</option>
                </select>
              </div>

              {/* Area Range */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Area Range (sq ft)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    name="minArea"
                    value={filters.minArea || ''}
                    onChange={(e) => setFilters({ ...filters, minArea: e.target.value })}
                    placeholder="Min"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                  <input
                    type="number"
                    name="maxArea"
                    value={filters.maxArea || ''}
                    onChange={(e) => setFilters({ ...filters, maxArea: e.target.value })}
                    placeholder="Max"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setFilters(initialFilters);
                  setShowFilters(false);
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 mr-2"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Property Listings */}
        {isLoading || isSearching ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <FaSpinner className="animate-spin text-red-600 text-4xl mx-auto mb-4" />
              <p className="text-gray-600">Searching for properties...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-xl font-semibold text-red-600 mb-2">Error loading properties</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => dispatch(getProperties({ ...filters, page: currentPage, limit: 9, sort: sortBy }))}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No properties found</h3>
            <p className="text-gray-600">
              Try adjusting your search filters to find more properties.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && properties.length > 0 && (
          <div className="flex justify-center mt-8 space-x-2">
            {renderPagination()}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyListingPage;
