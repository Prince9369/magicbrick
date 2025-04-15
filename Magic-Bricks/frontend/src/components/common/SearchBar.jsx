import { useState } from 'react';

const SearchBar = ({ onSearch, initialValues = {} }) => {
  const [searchParams, setSearchParams] = useState({
    listingType: initialValues.listingType || 'sale',
    city: initialValues.city || '',
    propertyType: initialValues.propertyType || '',
    minPrice: initialValues.minPrice || '',
    maxPrice: initialValues.maxPrice || '',
    bedrooms: initialValues.bedrooms || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit}>
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
                onClick={() => setSearchParams({ ...searchParams, listingType: 'sale' })}
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
                onClick={() => setSearchParams({ ...searchParams, listingType: 'rent' })}
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

          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none"
            >
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
