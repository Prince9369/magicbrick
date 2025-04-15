import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/chat';

const initialState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  error: null,
  success: false,
  unreadCount: 0,
};

// Get user conversations
export const getConversations = createAsyncThunk(
  'chat/getConversations',
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

      const response = await axios.get(`${API_URL}/conversations`, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get conversation messages
export const getMessages = createAsyncThunk(
  'chat/getMessages',
  async (conversationId, thunkAPI) => {
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

      const response = await axios.get(`${API_URL}/conversations/${conversationId}/messages`, config);
      return { ...response.data, conversationId };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Send message
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ conversationId, text, attachments }, thunkAPI) => {
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

      const response = await axios.post(
        `${API_URL}/conversations/${conversationId}/messages`,
        { text, attachments },
        config
      );

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create or get conversation
export const createConversation = createAsyncThunk(
  'chat/createConversation',
  async ({ recipientId, propertyId }, thunkAPI) => {
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

      const response = await axios.post(
        `${API_URL}/conversations`,
        { recipientId, propertyId },
        config
      );

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Mark conversation as read
export const markAsRead = createAsyncThunk(
  'chat/markAsRead',
  async (conversationId, thunkAPI) => {
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

      const response = await axios.put(
        `${API_URL}/conversations/${conversationId}/read`,
        {},
        config
      );

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    },
    addMessage: (state, action) => {
      const { message } = action.payload;

      // Add message to messages array if it's for the current conversation
      if (state.currentConversation && message.conversation === state.currentConversation._id) {
        state.messages.push(message);
      }

      // Update last message in conversations list
      const conversationIndex = state.conversations.findIndex(
        (conv) => conv._id === message.conversation
      );

      if (conversationIndex !== -1) {
        state.conversations[conversationIndex].lastMessage = message;

        // If the message is not from the current user, increment unread count
        if (message.sender !== JSON.parse(localStorage.getItem('user'))._id) {
          state.conversations[conversationIndex].unreadCount += 1;
          state.unreadCount += 1;
        }

        // Move conversation to top of list
        const conversation = state.conversations[conversationIndex];
        state.conversations.splice(conversationIndex, 1);
        state.conversations.unshift(conversation);
      }
    },
    clearChat: (state) => {
      state.currentConversation = null;
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get conversations
      .addCase(getConversations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload.conversations;

        // Calculate total unread count
        state.unreadCount = state.conversations.reduce(
          (total, conv) => total + (conv.unreadCount || 0),
          0
        );
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get messages
      .addCase(getMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload.messages;

        // Update unread count for this conversation
        const conversationIndex = state.conversations.findIndex(
          (conv) => conv._id === action.payload.conversationId
        );

        if (conversationIndex !== -1) {
          const prevUnreadCount = state.conversations[conversationIndex].unreadCount || 0;
          state.conversations[conversationIndex].unreadCount = 0;
          state.unreadCount -= prevUnreadCount;
        }
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.messages.push(action.payload.message);

        // Update last message in conversations list
        const conversationIndex = state.conversations.findIndex(
          (conv) => conv._id === action.payload.message.conversation
        );

        if (conversationIndex !== -1) {
          state.conversations[conversationIndex].lastMessage = action.payload.message;

          // Move conversation to top of list
          const conversation = state.conversations[conversationIndex];
          state.conversations.splice(conversationIndex, 1);
          state.conversations.unshift(conversation);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create conversation
      .addCase(createConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.currentConversation = action.payload.conversation;

        // Add to conversations list if not already there
        const exists = state.conversations.some(
          (conv) => conv._id === action.payload.conversation._id
        );

        if (!exists) {
          state.conversations.unshift(action.payload.conversation);
        }
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Mark as read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const conversationIndex = state.conversations.findIndex(
          (conv) => conv._id === action.payload.conversationId
        );

        if (conversationIndex !== -1) {
          const prevUnreadCount = state.conversations[conversationIndex].unreadCount || 0;
          state.conversations[conversationIndex].unreadCount = 0;
          state.unreadCount -= prevUnreadCount;
        }
      });
  },
});

export const { reset, setCurrentConversation, addMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
