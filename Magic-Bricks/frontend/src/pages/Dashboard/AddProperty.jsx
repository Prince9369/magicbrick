import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createProperty } from '../../redux/slices/propertySlice';
import { FaSpinner, FaUpload, FaTrash } from 'react-icons/fa';

const AddProperty = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.property);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    priceUnit: 'total',
    propertyType: '',
    listingType: 'sale',
    bedrooms: '',
    bathrooms: '',
    furnishing: 'unfurnished',
    constructionStatus: 'ready to move',
    area: '',
    areaUnit: 'sq ft',
    location: {
      address: '',
      city: '',
      state: '',
      pincode: '',
      coordinates: {
        type: 'Point',
        coordinates: [0, 0]
      }
    },
    amenities: [],
    images: []
  });
  
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  
  // List of amenities to choose from
  const amenitiesList = [
    'Parking', 'Swimming Pool', 'Gym', 'Garden', 'Security',
    'Power Backup', 'Lift', 'Club House', 'Children\'s Play Area',
    'Gated Community', 'Air Conditioning', 'WiFi', 'Furnished'
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleAmenityChange = (amenity) => {
    if (formData.amenities.includes(amenity)) {
      setFormData({
        ...formData,
        amenities: formData.amenities.filter(item => item !== amenity)
      });
    } else {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenity]
      });
    }
  };
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Preview images
    const newImagePreview = files.map(file => URL.createObjectURL(file));
    setImagePreview([...imagePreview, ...newImagePreview]);
    
    // Store files for upload
    setImageFiles([...imageFiles, ...files]);
  };
  
  const removeImage = (index) => {
    const newImageFiles = [...imageFiles];
    const newImagePreview = [...imagePreview];
    
    newImageFiles.splice(index, 1);
    newImagePreview.splice(index, 1);
    
    setImageFiles(newImageFiles);
    setImagePreview(newImagePreview);
  };
  
  const validateStep = (currentStep) => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.price) newErrors.price = 'Price is required';
      if (!formData.propertyType) newErrors.propertyType = 'Property type is required';
      if (!formData.area) newErrors.area = 'Area is required';
    } else if (currentStep === 2) {
      if (!formData.location.address.trim()) newErrors['location.address'] = 'Address is required';
      if (!formData.location.city.trim()) newErrors['location.city'] = 'City is required';
      if (!formData.location.state.trim()) newErrors['location.state'] = 'State is required';
      if (!formData.location.pincode.trim()) newErrors['location.pincode'] = 'Pincode is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(step)) return;
    
    // Convert image files to base64
    const imagePromises = imageFiles.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });
    });
    
    try {
      const images = await Promise.all(imagePromises);
      
      // Create property with images
      const propertyData = {
        ...formData,
        images
      };
      
      dispatch(createProperty(propertyData))
        .unwrap()
        .then(() => {
          navigate('/dashboard/properties');
        });
    } catch (error) {
      console.error('Error processing images:', error);
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Property</h1>
      
      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            step >= 1 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            1
          </div>
          <div className={`flex-1 h-1 mx-2 ${
            step >= 2 ? 'bg-red-600' : 'bg-gray-200'
          }`}></div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            step >= 2 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            2
          </div>
          <div className={`flex-1 h-1 mx-2 ${
            step >= 3 ? 'bg-red-600' : 'bg-gray-200'
          }`}></div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            step >= 3 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            3
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <div className="text-sm font-medium text-gray-700">Basic Details</div>
          <div className="text-sm font-medium text-gray-700">Location</div>
          <div className="text-sm font-medium text-gray-700">Images & Amenities</div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Details */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="col-span-2">
                  <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                    Property Title*
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-red-600`}
                    placeholder="e.g. 3 BHK Apartment in Koramangala"
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>
                
                {/* Description */}
                <div className="col-span-2">
                  <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                    Description*
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className={`w-full px-3 py-2 border ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-red-600`}
                    placeholder="Describe your property in detail"
                  ></textarea>
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>
                
                {/* Listing Type */}
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Listing Type*
                  </label>
                  <div className="flex">
                    <button
                      type="button"
                      className={`flex-1 py-2 px-4 text-center ${
                        formData.listingType === 'sale'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      } rounded-l-md focus:outline-none`}
                      onClick={() => setFormData({ ...formData, listingType: 'sale' })}
                    >
                      For Sale
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-2 px-4 text-center ${
                        formData.listingType === 'rent'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      } rounded-r-md focus:outline-none`}
                      onClick={() => setFormData({ ...formData, listingType: 'rent' })}
                    >
                      For Rent
                    </button>
                  </div>
                </div>
                
                {/* Property Type */}
                <div>
                  <label htmlFor="propertyType" className="block text-gray-700 text-sm font-bold mb-2">
                    Property Type*
                  </label>
                  <select
                    id="propertyType"
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.propertyType ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-red-600`}
                  >
                    <option value="">Select Property Type</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="plot">Plot</option>
                    <option value="commercial">Commercial</option>
                    <option value="office space">Office Space</option>
                    <option value="shop">Shop</option>
                  </select>
                  {errors.propertyType && <p className="text-red-500 text-xs mt-1">{errors.propertyType}</p>}
                </div>
                
                {/* Price */}
                <div>
                  <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
                    Price*
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${
                        errors.price ? 'border-red-500' : 'border-gray-300'
                      } rounded-l-md focus:outline-none focus:ring-1 focus:ring-red-600`}
                      placeholder="Enter price"
                    />
                    <select
                      name="priceUnit"
                      value={formData.priceUnit}
                      onChange={handleChange}
                      className="px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-1 focus:ring-red-600"
                    >
                      <option value="total">Total Price</option>
                      <option value="per sq ft">Per sq ft</option>
                    </select>
                  </div>
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>
                
                {/* Area */}
                <div>
                  <label htmlFor="area" className="block text-gray-700 text-sm font-bold mb-2">
                    Area*
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      id="area"
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${
                        errors.area ? 'border-red-500' : 'border-gray-300'
                      } rounded-l-md focus:outline-none focus:ring-1 focus:ring-red-600`}
                      placeholder="Enter area"
                    />
                    <select
                      name="areaUnit"
                      value={formData.areaUnit}
                      onChange={handleChange}
                      className="px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-1 focus:ring-red-600"
                    >
                      <option value="sq ft">sq ft</option>
                      <option value="sq m">sq m</option>
                      <option value="acres">acres</option>
                      <option value="hectares">hectares</option>
                    </select>
                  </div>
                  {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>}
                </div>
                
                {/* Bedrooms */}
                <div>
                  <label htmlFor="bedrooms" className="block text-gray-700 text-sm font-bold mb-2">
                    Bedrooms
                  </label>
                  <select
                    id="bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
                  >
                    <option value="">Select Bedrooms</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6+</option>
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
                    value={formData.bathrooms}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
                  >
                    <option value="">Select Bathrooms</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5+</option>
                  </select>
                </div>
                
                {/* Furnishing */}
                <div>
                  <label htmlFor="furnishing" className="block text-gray-700 text-sm font-bold mb-2">
                    Furnishing
                  </label>
                  <select
                    id="furnishing"
                    name="furnishing"
                    value={formData.furnishing}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
                  >
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
                    value={formData.constructionStatus}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
                  >
                    <option value="ready to move">Ready to Move</option>
                    <option value="under construction">Under Construction</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 2: Location */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Location Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Address */}
                <div className="col-span-2">
                  <label htmlFor="location.address" className="block text-gray-700 text-sm font-bold mb-2">
                    Address*
                  </label>
                  <input
                    type="text"
                    id="location.address"
                    name="location.address"
                    value={formData.location.address}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors['location.address'] ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-red-600`}
                    placeholder="Enter complete address"
                  />
                  {errors['location.address'] && (
                    <p className="text-red-500 text-xs mt-1">{errors['location.address']}</p>
                  )}
                </div>
                
                {/* City */}
                <div>
                  <label htmlFor="location.city" className="block text-gray-700 text-sm font-bold mb-2">
                    City*
                  </label>
                  <input
                    type="text"
                    id="location.city"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors['location.city'] ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-red-600`}
                    placeholder="Enter city"
                  />
                  {errors['location.city'] && (
                    <p className="text-red-500 text-xs mt-1">{errors['location.city']}</p>
                  )}
                </div>
                
                {/* State */}
                <div>
                  <label htmlFor="location.state" className="block text-gray-700 text-sm font-bold mb-2">
                    State*
                  </label>
                  <input
                    type="text"
                    id="location.state"
                    name="location.state"
                    value={formData.location.state}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors['location.state'] ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-red-600`}
                    placeholder="Enter state"
                  />
                  {errors['location.state'] && (
                    <p className="text-red-500 text-xs mt-1">{errors['location.state']}</p>
                  )}
                </div>
                
                {/* Pincode */}
                <div>
                  <label htmlFor="location.pincode" className="block text-gray-700 text-sm font-bold mb-2">
                    Pincode*
                  </label>
                  <input
                    type="text"
                    id="location.pincode"
                    name="location.pincode"
                    value={formData.location.pincode}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors['location.pincode'] ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-red-600`}
                    placeholder="Enter pincode"
                  />
                  {errors['location.pincode'] && (
                    <p className="text-red-500 text-xs mt-1">{errors['location.pincode']}</p>
                  )}
                </div>
                
                {/* Map placeholder */}
                <div className="col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Map Location
                  </label>
                  <div className="bg-gray-200 h-64 rounded-md flex items-center justify-center">
                    <p className="text-gray-600">Map will be displayed here</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Click on the map to set the exact location of your property
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Images & Amenities */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Images & Amenities</h2>
              
              {/* Image Upload */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Property Images
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <input
                    type="file"
                    id="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label htmlFor="images" className="cursor-pointer">
                    <FaUpload className="mx-auto text-gray-400 text-3xl mb-2" />
                    <p className="text-gray-700 mb-1">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </label>
                </div>
                
                {/* Image Previews */}
                {imagePreview.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreview.map((src, index) => (
                      <div key={index} className="relative">
                        <img
                          src={src}
                          alt={`Preview ${index + 1}`}
                          className="h-32 w-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Amenities */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Amenities
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {amenitiesList.map((amenity) => (
                    <div key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`amenity-${amenity}`}
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityChange(amenity)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`amenity-${amenity}`}
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Previous
              </button>
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ml-auto"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ml-auto flex items-center"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> Submitting...
                  </>
                ) : (
                  'Submit Property'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
