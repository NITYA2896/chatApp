import { useState, useEffect, useRef } from 'react';
import { Send, Users, User } from 'lucide-react';

function ChatArea({ socket, currentUser, selectedChat, messages, onSendMessage }) {
  const [input, setInput] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  // Handle typing listener
  useEffect(() => {
    const handleTyping = ({ from, fromUsername, isGroup }) => {
      if (isGroup !== selectedChat.isGroup) return;
      if (!isGroup && from !== selectedChat.id) return;

      setTypingUsers(prev => {
        if (!prev.find(u => u.id === from)) {
          return [...prev, { id: from, username: fromUsername }];
        }
        return prev;
      });
    };

    const handleStopTyping = ({ from, isGroup }) => {
      if (isGroup !== selectedChat.isGroup) return;
      if (!isGroup && from !== selectedChat.id) return;
      setTypingUsers(prev => prev.filter(u => u.id !== from));
    };

    socket.on('typing', handleTyping);
    socket.on('stop_typing', handleStopTyping);

    return () => {
      socket.off('typing', handleTyping);
      socket.off('stop_typing', handleStopTyping);
    };
  }, [socket, selectedChat]);

  // Clear typing users when changing chat
  useEffect(() => {
    setTypingUsers([]);
    setInput('');
  }, [selectedChat.id]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    
    // Emit typing event
    socket.emit('typing', { to: selectedChat.id, isGroup: selectedChat.isGroup });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing', { to: selectedChat.id, isGroup: selectedChat.isGroup });
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      socket.emit('stop_typing', { to: selectedChat.id, isGroup: selectedChat.isGroup });
      setInput('');
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }
  };

  const getFormatTime = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date(timestamp));
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center p-6 border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className={`p-3 rounded-full mr-4 ${selectedChat.isGroup ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
          {selectedChat.isGroup ? <Users className="w-6 h-6" /> : <User className="w-6 h-6" />}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{selectedChat.username}</h2>
          <p className="text-sm text-gray-500">
            {selectedChat.isGroup ? 'Public group chat' : 'Private conversation'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
            <div className="bg-white p-6 rounded-full shadow-sm">
              <Send className="w-12 h-12" />
            </div>
            <p className="text-lg">No messages here yet... Start chatting!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.from === socket.id || msg.isSelf;
            
            return (
              <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-white shadow-sm ${isMe ? 'bg-indigo-500' : 'bg-gray-400'}`}>
                    {(isMe ? currentUser.username : msg.fromUsername).charAt(0).toUpperCase()}
                  </div>
                  
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-xs text-gray-400 mb-1 ml-1 mr-1">
                      {!isMe && `${msg.fromUsername} • `}{getFormatTime(msg.timestamp)}
                    </span>
                    <div className={`px-5 py-3 rounded-2xl shadow-sm ${
                      isMe 
                        ? 'bg-indigo-600 text-white rounded-br-sm' 
                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                    }`}>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        {typingUsers.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-500 text-sm px-4 py-2 rounded-full animate-pulse inline-block">
              {typingUsers.length === 1 
                ? `${typingUsers[0].username} is typing...`
                : `${typingUsers.length} people are typing...`}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex gap-4 max-w-5xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder={`Message ${selectedChat.isGroup ? 'Group...' : selectedChat.username}...`}
            className="flex-1 bg-gray-100 placeholder-gray-400 text-gray-700 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md flex-shrink-0"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatArea;
