import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import axios from 'axios';
import './App.css';

// Import pages
import HomePage from './pages/Home/HomePage';
import PropertyListingPage from './pages/PropertyListing/PropertyListingPage';
import PropertyDetailsPage from './pages/PropertyDetails/PropertyDetailsPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ProfilePage from './pages/Profile/ProfilePage';

// Import components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import AuthInitializer from './components/common/AuthInitializer';

function App() {
  const [apiStatus, setApiStatus] = useState({
    isLoading: true,
    isError: false,
    errorMessage: ''
  });

  // Check API health on app load
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        // Set a timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await axios.get('/api/health', {
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.data.status === 'ok') {
          setApiStatus({
            isLoading: false,
            isError: false,
            errorMessage: ''
          });
        } else {
          setApiStatus({
            isLoading: false,
            isError: true,
            errorMessage: 'API is not responding correctly'
          });
        }
      } catch (error) {
        console.error('API health check failed:', error);
        setApiStatus({
          isLoading: false,
          isError: true,
          errorMessage: error.message || 'Failed to connect to the server'
        });
      }
    };

    checkApiHealth();
  }, []);

  // Show loading state
  if (apiStatus.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading application...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (apiStatus.isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Connection Error</h1>
          <p className="text-gray-600 mb-6">{apiStatus.errorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Main app
  return (
    <Provider store={store}>
      <Router>
        <AuthInitializer />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/properties" element={<PropertyListingPage />} />
              <Route path="/properties/:id" element={<PropertyDetailsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard/*" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
