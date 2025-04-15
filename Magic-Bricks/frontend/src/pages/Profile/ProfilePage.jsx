import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, changePassword } from '../../redux/slices/authSlice';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaSpinner, FaUpload } from 'react-icons/fa';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error, success } = useSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    profilePic: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        profilePic: user.profilePic || ''
      });
    }
  }, [user]);
  
  useEffect(() => {
    if (success) {
      if (activeTab === 'profile') {
        setSuccessMessage('Profile updated successfully');
      } else if (activeTab === 'password') {
        setSuccessMessage('Password changed successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
      
      // Clear success message after 3 seconds
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [success, activeTab]);
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const validateProfileForm = () => {
    const newErrors = {};
    
    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!profileData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(profileData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) return;
    
    let profilePic = profileData.profilePic;
    
    // Convert image to base64 if a new image is selected
    if (profileImage) {
      const reader = new FileReader();
      profilePic = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(profileImage);
      });
    }
    
    dispatch(updateProfile({
      name: profileData.name,
      phone: profileData.phone,
      profilePic
    }));
  };
  
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    dispatch(changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    }));
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>
        
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex -mb-px">
            <button
              className={`mr-8 py-4 text-sm font-medium ${
                activeTab === 'profile'
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Profile Information
            </button>
            <button
              className={`py-4 text-sm font-medium ${
                activeTab === 'password'
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('password')}
            >
              Change Password
            </button>
          </div>
        </div>
        
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {/* Profile Information Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleProfileSubmit}>
              {/* Profile Picture */}
              <div className="mb-6 flex flex-col items-center">
                <div className="relative mb-4">
                  <img
                    src={imagePreview || profileData.profilePic || 'https://via.placeholder.com/150'}
                    alt={profileData.name}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                  <label
                    htmlFor="profilePic"
                    className="absolute bottom-0 right-0 bg-red-600 text-white p-2 rounded-full cursor-pointer hover:bg-red-700"
                  >
                    <FaUpload />
                    <input
                      type="file"
                      id="profilePic"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500">Click the icon to upload a new profile picture</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className={`w-full pl-10 pr-3 py-2 border ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-1 focus:ring-red-600`}
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                
                {/* Email (Read-only) */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      readOnly
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>
                  <p className="text-gray-500 text-xs mt-1">Email cannot be changed</p>
                </div>
                
                {/* Phone */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      className={`w-full pl-10 pr-3 py-2 border ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-1 focus:ring-red-600`}
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                
                {/* Role (Read-only) */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
                    Account Type
                  </label>
                  <input
                    type="text"
                    id="role"
                    value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                  <p className="text-gray-500 text-xs mt-1">Account type cannot be changed</p>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" /> Updating...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Change Password Tab */}
        {activeTab === 'password' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handlePasswordSubmit}>
              {/* Current Password */}
              <div className="mb-4">
                <label htmlFor="currentPassword" className="block text-gray-700 text-sm font-bold mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={`w-full pl-10 pr-3 py-2 border ${
                      errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-red-600`}
                    placeholder="Enter your current password"
                  />
                </div>
                {errors.currentPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>
                )}
              </div>
              
              {/* New Password */}
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`w-full pl-10 pr-3 py-2 border ${
                      errors.newPassword ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-red-600`}
                    placeholder="Enter new password"
                  />
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
                )}
              </div>
              
              {/* Confirm New Password */}
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`w-full pl-10 pr-3 py-2 border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-red-600`}
                    placeholder="Confirm new password"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" /> Updating...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
