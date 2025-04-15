# Magic Bricks Clone

A full-stack web application that replicates the core features of Magic Bricks, a real estate platform.

## Project Structure

The project is organized with separate frontend and backend directories:

> **Note:** There might be a deprecated `frontend` folder inside the `backend` directory that can be safely ignored. Due to permission issues with Windows, it might be difficult to delete this folder. The active frontend code is in the root-level `frontend` directory.

```
Magic-Bricks/
├── backend/           # Node.js and Express backend
│   ├── config/        # Configuration files
│   ├── controllers/   # Route controllers
│   ├── data/          # Seed data
│   ├── middleware/    # Custom middleware
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   ├── utils/         # Utility functions
│   ├── .env           # Environment variables
│   ├── package.json   # Backend dependencies
│   └── server.js      # Main server file
│
└── frontend/          # React frontend
    ├── public/        # Static files
    ├── src/           # Source code
    │   ├── assets/    # Images and other assets
    │   ├── components/# Reusable components
    │   ├── pages/     # Page components
    │   ├── redux/     # Redux store and slices
    │   └── utils/     # Utility functions
    ├── package.json   # Frontend dependencies
    └── vite.config.js # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm start
   ```
2. Start the frontend development server:
   ```
   cd ../frontend
   npm run dev
   ```
3. Open your browser and navigate to `http://localhost:5173`

## Features

- User authentication (register, login, profile management)
- Property listings with search and filter functionality
- Property details with images and maps
- Wishlist for saving favorite properties
- Real-time chat between users and property owners
- User dashboard for managing properties and messages

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Socket.io for real-time communication

### Frontend
- React
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests
- Socket.io client for real-time features
- Mapbox for maps

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_SERVICE=your_email_service
EMAIL_USER=your_email_user
EMAIL_PASSWORD=your_email_password
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

## License

This project is licensed under the MIT License.
