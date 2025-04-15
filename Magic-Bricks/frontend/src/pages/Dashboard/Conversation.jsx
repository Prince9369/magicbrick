import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMessages, sendMessage, markAsRead } from '../../redux/slices/chatSlice';
import { FaSpinner, FaPaperPlane, FaArrowLeft, FaImage } from 'react-icons/fa';
import io from 'socket.io-client';

const Conversation = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { messages, currentConversation, isLoading } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const [messageText, setMessageText] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  // Connect to socket.io server
  useEffect(() => {
    // Use relative URL for socket connection when using proxy
    const newSocket = io(window.location.hostname === 'localhost' ? '' : undefined);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Join conversation room when socket and conversation ID are available
  useEffect(() => {
    if (socket && id) {
      socket.emit('joinConversation', id);

      // Listen for new messages
      socket.on('receiveMessage', (data) => {
        if (data.conversation === id && data.sender !== user._id) {
          dispatch(markAsRead(id));
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('receiveMessage');
      }
    };
  }, [socket, id, dispatch, user._id]);

  // Fetch messages when conversation ID changes
  useEffect(() => {
    if (id) {
      dispatch(getMessages(id));
      dispatch(markAsRead(id));
    }
  }, [dispatch, id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (messageText.trim()) {
      dispatch(sendMessage({
        conversationId: id,
        text: messageText.trim(),
      }));

      setMessageText('');
    }
  };

  // Find the other user in the conversation
  const otherUser = currentConversation?.participants.find(
    (participant) => participant._id !== user._id
  );

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-red-600 text-4xl" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white rounded-t-lg shadow-md p-4 flex items-center">
        <Link to="/dashboard/messages" className="mr-4 text-gray-600 hover:text-gray-800">
          <FaArrowLeft />
        </Link>

        {otherUser && (
          <div className="flex items-center">
            <img
              src={otherUser.profilePic || 'https://via.placeholder.com/40'}
              alt={otherUser.name}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">{otherUser.name}</h3>
              {currentConversation?.property && (
                <p className="text-xs text-gray-500">
                  Re: {currentConversation.property.title}
                </p>
              )}
            </div>
          </div>
        )}

        {currentConversation?.property && (
          <Link
            to={`/properties/${currentConversation.property._id}`}
            className="ml-auto text-sm text-red-600 hover:text-red-800"
          >
            View Property
          </Link>
        )}
      </div>

      {/* Messages */}
      <div className="flex-grow bg-gray-50 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message._id}
                className={`flex ${
                  message.sender === user._id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                    message.sender === user._id
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <p>{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === user._id ? 'text-red-100' : 'text-gray-500'
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white rounded-b-lg shadow-md p-4">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700 mr-2"
            title="Attach image (not implemented)"
          >
            <FaImage />
          </button>
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
          />
          <button
            type="submit"
            disabled={!messageText.trim()}
            className={`ml-2 p-2 rounded-full ${
              messageText.trim()
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Conversation;
