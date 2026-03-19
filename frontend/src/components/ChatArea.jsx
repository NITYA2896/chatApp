import { useState, useEffect, useRef } from 'react';
import { Send, SmilePlus, Laugh } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';

const popSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
popSound.volume = 0.4;

function ChatArea({ socket, currentUser, selectedChat, messages, onSendMessage }) {
  const [input, setInput] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const getAvatar = (seed) => `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${seed}`;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    // Play sound if last message is from someone else
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.from !== socket.id && !lastMsg.isSelf) {
        popSound.play().catch(e => console.log('Audio play prevented', e));
      }
    }
  }, [messages, typingUsers]);

  useEffect(() => {
    const handleTyping = ({ from, fromUsername, isGroup }) => {
      if (isGroup !== selectedChat.isGroup) return;
      if (!isGroup && from !== selectedChat.id) return;
      setTypingUsers(prev => prev.find(u => u.id === from) ? prev : [...prev, { id: from, username: fromUsername }]);
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

  useEffect(() => {
    setTypingUsers([]);
    setInput('');
  }, [selectedChat.id]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const getFormatTime = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date(timestamp));
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#f8f9ff] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none"></div>

      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-indigo-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            {selectedChat.isGroup ? (
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl text-white shadow-lg animate-bounce-soft">
                <Laugh className="w-8 h-8" />
              </div>
            ) : (
              <img src={getAvatar(selectedChat.username)} alt="Avatar" className="w-14 h-14 bg-pink-50 rounded-full border-2 border-indigo-100 shadow-md animate-bounce-soft" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">{selectedChat.username}</h2>
            <p className="text-sm font-semibold text-indigo-500 uppercase tracking-widest">
              {selectedChat.isGroup ? 'Public Town Square' : 'Secret Conversation'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-0 scrollbar-hide">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-pop-in">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-indigo-50 animate-bounce-soft">
              <SmilePlus className="w-20 h-20 text-indigo-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800">It's a bit too quiet here...</h3>
              <p className="text-gray-500 mt-2 font-medium">Say something funny, break the ice!</p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.from === socket.id || msg.isSelf;
            
            return (
              <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-pop-in`}>
                <div className={`flex max-w-[75%] ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
                  
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-xs font-bold text-gray-400 mb-1 px-1 tracking-wide">
                      {!isMe && `${msg.fromUsername} • `}{getFormatTime(msg.timestamp)}
                    </span>
                    <div className={`px-6 py-4 rounded-3xl shadow-md transform transition-transform hover:scale-[1.02] ${
                      isMe 
                        ? 'bg-gradient-to-br from-fuchsia-600 to-indigo-600 text-white rounded-br-sm' 
                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                    }`}>
                      <p className={`leading-relaxed font-medium ${isMe ? 'text-white' : 'text-gray-700'}`}>{msg.text}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        {typingUsers.length > 0 && (
          <div className="flex justify-start animate-pop-in">
            <div className="bg-white border border-gray-100 shadow-sm text-gray-500 font-semibold text-sm px-6 py-3 rounded-full flex items-center gap-3">
              <span className="flex gap-1">
                 <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                 <span className="w-2 h-2 bg-fuchsia-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                 <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
              </span>
              {typingUsers.length === 1 
                ? `${typingUsers[0].username} is plotting something...`
                : `${typingUsers.length} people are plotting...`}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 sm:p-6 bg-white/80 backdrop-blur-md border-t border-indigo-100 relative z-10 w-full">
        <form onSubmit={handleSubmit} className="flex gap-4 max-w-5xl mx-auto items-end">
          <TextareaAutosize
            minRows={1}
            maxRows={5}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={`Say something amazing to ${selectedChat.isGroup ? 'everyone' : selectedChat.username}...`}
            className="flex-1 bg-gray-50 placeholder-gray-400 text-gray-800 font-medium rounded-2xl px-6 py-4 border-2 border-transparent focus:outline-none focus:border-indigo-300 focus:bg-white focus:shadow-md transition-all resize-none shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="mb-1 bg-gradient-to-r hover:bg-gradient-to-l from-indigo-600 to-fuchsia-600 text-white p-4 rounded-2xl shadow-lg shadow-indigo-500/30 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex-shrink-0"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatArea;
