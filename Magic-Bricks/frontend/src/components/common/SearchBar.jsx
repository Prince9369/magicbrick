import { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, initialValues = {}, isLoading = false }) => {
  const [searchParams, setSearchParams] = useState({
    listingType: initialValues.listingType || 'sale',
    keyword: initialValues.keyword || '',
    city: initialValues.city || '',
    state: initialValues.state || '',
    propertyType: initialValues.propertyType || '',
    minPrice: initialValues.minPrice || '',
    maxPrice: initialValues.maxPrice || '',
    bedrooms: initialValues.bedrooms || '',
    bathrooms: initialValues.bathrooms || '',
    minArea: initialValues.minArea || '',
    maxArea: initialValues.maxArea || '',
    furnishing: initialValues.furnishing || '',
    constructionStatus: initialValues.constructionStatus || '',
    featured: initialValues.featured || false,
    verified: initialValues.verified || false,
  });

  // Update search params when initialValues change
  useEffect(() => {
    setSearchParams({
      listingType: initialValues.listingType || searchParams.listingType,
      keyword: initialValues.keyword || searchParams.keyword,
      city: initialValues.city || searchParams.city,
      state: initialValues.state || searchParams.state,
      propertyType: initialValues.propertyType || searchParams.propertyType,
      minPrice: initialValues.minPrice || searchParams.minPrice,
      maxPrice: initialValues.maxPrice || searchParams.maxPrice,
      bedrooms: initialValues.bedrooms || searchParams.bedrooms,
      bathrooms: initialValues.bathrooms || searchParams.bathrooms,
      minArea: initialValues.minArea || searchParams.minArea,
      maxArea: initialValues.maxArea || searchParams.maxArea,
      furnishing: initialValues.furnishing || searchParams.furnishing,
      constructionStatus: initialValues.constructionStatus || searchParams.constructionStatus,
      featured: initialValues.featured || searchParams.featured,
      verified: initialValues.verified || searchParams.verified,
    });
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting search with params:', searchParams);
    onSearch(searchParams);
  };

  // Debug: Log search params when they change
  useEffect(() => {
    console.log('Search params updated:', searchParams);
  }, [searchParams]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit}>
        {/* Keyword Search */}
        <div className="mb-4">
          <input
            type="text"
            name="keyword"
            value={searchParams.keyword}
            onChange={handleChange}
            placeholder="Search by keyword, location, or property name"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Listing Type */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              I want to
            </label>
            <div className="flex">
              <button
                type="button"
                className={`flex-1 py-2 px-4 text-center ${
                  searchParams.listingType === 'sale'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                } rounded-l-md focus:outline-none`}
                onClick={() => {
                  setSearchParams({ ...searchParams, listingType: 'sale' });
                }}
              >
                Buy
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 text-center ${
                  searchParams.listingType === 'rent'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                } rounded-r-md focus:outline-none`}
                onClick={() => {
                  setSearchParams({ ...searchParams, listingType: 'rent' });
                }}
              >
                Rent
              </button>
            </div>
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={searchParams.city}
              onChange={handleChange}
              placeholder="Enter city"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
            />
          </div>

          {/* Property Type */}
          <div>
            <label htmlFor="propertyType" className="block text-gray-700 text-sm font-bold mb-2">
              Property Type
            </label>
            <select
              id="propertyType"
              name="propertyType"
              value={searchParams.propertyType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
            >
              <option value="">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="plot">Plot</option>
              <option value="commercial">Commercial</option>
              <option value="office space">Office Space</option>
              <option value="shop">Shop</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Price Range */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Price Range
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                name="minPrice"
                value={searchParams.minPrice}
                onChange={handleChange}
                placeholder="Min"
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
              />
              <input
                type="number"
                name="maxPrice"
                value={searchParams.maxPrice}
                onChange={handleChange}
                placeholder="Max"
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <label htmlFor="bedrooms" className="block text-gray-700 text-sm font-bold mb-2">
              Bedrooms
            </label>
            <select
              id="bedrooms"
              name="bedrooms"
              value={searchParams.bedrooms}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>

          {/* Bathrooms */}
          <div>
            <label htmlFor="bathrooms" className="block text-gray-700 text-sm font-bold mb-2">
              Bathrooms
            </label>
            <select
              id="bathrooms"
              name="bathrooms"
              value={searchParams.bathrooms}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* State */}
          <div>
            <label htmlFor="state" className="block text-gray-700 text-sm font-bold mb-2">
              State
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={searchParams.state}
              onChange={handleChange}
              placeholder="Enter state"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
            />
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
                value={searchParams.minArea}
                onChange={handleChange}
                placeholder="Min"
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
              />
              <input
                type="number"
                name="maxArea"
                value={searchParams.maxArea}
                onChange={handleChange}
                placeholder="Max"
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'} text-white font-bold py-2 px-4 rounded-md focus:outline-none flex justify-center items-center`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </>
              ) : 'Search'}
            </button>
          </div>
        </div>

        {/* Additional Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Furnishing */}
          <div>
            <label htmlFor="furnishing" className="block text-gray-700 text-sm font-bold mb-2">
              Furnishing
            </label>
            <select
              id="furnishing"
              name="furnishing"
              value={searchParams.furnishing}
              onChange={handleChange}
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
              value={searchParams.constructionStatus}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
            >
              <option value="">Any</option>
              <option value="under construction">Under Construction</option>
              <option value="ready to move">Ready to Move</option>
            </select>
          </div>

          {/* Checkboxes for Featured and Verified */}
          <div className="flex flex-col justify-end">
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={searchParams.featured}
                onChange={handleChange}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                Featured Properties Only
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="verified"
                name="verified"
                checked={searchParams.verified}
                onChange={handleChange}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="verified" className="ml-2 block text-sm text-gray-700">
                Verified Properties Only
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
//interview