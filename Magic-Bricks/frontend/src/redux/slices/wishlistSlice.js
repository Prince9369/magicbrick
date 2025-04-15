import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/wishlist';

const initialState = {
  wishlist: [],
  isLoading: false,
  error: null,
  success: false,
};

// Get user wishlist
export const getWishlist = createAsyncThunk(
  'wishlist/getWishlist',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        return thunkAPI.rejectWithValue('No token found');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(API_URL, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add property to wishlist
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (propertyId, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        return thunkAPI.rejectWithValue('No token found');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(`${API_URL}/${propertyId}`, {}, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Remove property from wishlist
export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (propertyId, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        return thunkAPI.rejectWithValue('No token found');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.delete(`${API_URL}/${propertyId}`, config);
      return { ...response.data, propertyId };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get wishlist
      .addCase(getWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishlist = action.payload.properties;
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.wishlist.push(action.payload.property);
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.wishlist = state.wishlist.filter(
          (property) => property._id !== action.payload.propertyId
        );
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { reset } = wishlistSlice.actions;
export default wishlistSlice.reducer;
