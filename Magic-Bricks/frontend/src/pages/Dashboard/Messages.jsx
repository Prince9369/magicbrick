import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getConversations, markAsRead } from '../../redux/slices/chatSlice';
import { FaSpinner, FaEnvelope, FaSearch } from 'react-icons/fa';

const Messages = () => {
  const dispatch = useDispatch();
  const { conversations, isLoading } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    dispatch(getConversations());
  }, [dispatch]);
  
  // Filter conversations based on search term
  const filteredConversations = conversations.filter((conversation) => {
    const otherUser = conversation.participants.find(
      (participant) => participant._id !== user._id
    );
    
    return (
      otherUser?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.property?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  const handleConversationClick = (conversationId) => {
    // Mark conversation as read when clicked
    dispatch(markAsRead(conversationId));
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-red-600 text-4xl" />
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Messages</h1>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search conversations..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>
      
      {conversations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FaEnvelope className="mx-auto text-gray-400 text-5xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No messages yet</h3>
          <p className="text-gray-600 mb-6">
            When you contact property owners or agents, your conversations will appear here.
          </p>
          <Link
            to="/properties"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md inline-block"
          >
            Browse Properties
          </Link>
        </div>
      ) : filteredConversations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No results found</h3>
          <p className="text-gray-600">
            No conversations match your search. Try a different search term.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredConversations.map((conversation) => {
              // Find the other user in the conversation
              const otherUser = conversation.participants.find(
                (participant) => participant._id !== user._id
              );
              
              return (
                <Link
                  key={conversation._id}
                  to={`/dashboard/messages/${conversation._id}`}
                  className={`block p-4 hover:bg-gray-50 ${
                    conversation.unreadCount > 0 ? 'bg-red-50' : ''
                  }`}
                  onClick={() => handleConversationClick(conversation._id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={otherUser?.profilePic || 'https://via.placeholder.com/40'}
                        alt={otherUser?.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <div className="flex items-center">
                          <h3 className="text-sm font-medium text-gray-900">
                            {otherUser?.name}
                          </h3>
                          <span className="ml-2 text-xs text-gray-500">
                            {new Date(conversation.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        {conversation.property && (
                          <p className="text-xs text-gray-500">
                            Re: {conversation.property.title}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 truncate max-w-xs">
                          {conversation.lastMessage?.text || 'No messages yet'}
                        </p>
                      </div>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-red-600 text-white text-xs rounded-full px-2 py-1">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
