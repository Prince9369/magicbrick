import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/properties';

const initialState = {
  properties: [],
  property: null,
  userProperties: [],
  isLoading: false,
  error: null,
  success: false,
  totalProperties: 0,
  pagination: {
    current: 1,
    pages: 1,
  },
};

// Get all properties with filters
export const getProperties = createAsyncThunk(
  'property/getProperties',
  async (filters, thunkAPI) => {
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value);
          }
        });
      }

      const response = await axios.get(`${API_URL}?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single property
export const getProperty = createAsyncThunk(
  'property/getProperty',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create property
export const createProperty = createAsyncThunk(
  'property/createProperty',
  async (propertyData, thunkAPI) => {
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

      const response = await axios.post(API_URL, propertyData, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update property
export const updateProperty = createAsyncThunk(
  'property/updateProperty',
  async ({ id, propertyData }, thunkAPI) => {
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

      const response = await axios.put(`${API_URL}/${id}`, propertyData, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete property
export const deleteProperty = createAsyncThunk(
  'property/deleteProperty',
  async (id, thunkAPI) => {
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

      await axios.delete(`${API_URL}/${id}`, config);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user properties
export const getUserProperties = createAsyncThunk(
  'property/getUserProperties',
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

      const response = await axios.get(`${API_URL}/user/properties`, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
    clearProperty: (state) => {
      state.property = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get properties
      .addCase(getProperties.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.properties = action.payload.properties;
        state.totalProperties = action.payload.total;
        state.pagination = action.payload.pagination;
      })
      .addCase(getProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get single property
      .addCase(getProperty.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.property = action.payload.property;
      })
      .addCase(getProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create property
      .addCase(createProperty.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.userProperties.push(action.payload.property);
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update property
      .addCase(updateProperty.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.property = action.payload.property;

        // Update in userProperties array
        const index = state.userProperties.findIndex(
          (property) => property._id === action.payload.property._id
        );

        if (index !== -1) {
          state.userProperties[index] = action.payload.property;
        }
      })
      .addCase(updateProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete property
      .addCase(deleteProperty.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.userProperties = state.userProperties.filter(
          (property) => property._id !== action.payload
        );
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get user properties
      .addCase(getUserProperties.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProperties = action.payload.properties;
      })
      .addCase(getUserProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { reset, clearProperty } = propertySlice.actions;
export default propertySlice.reducer;
