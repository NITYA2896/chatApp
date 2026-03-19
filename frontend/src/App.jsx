import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const socket = io(BACKEND_URL, {
  autoConnect: false
});

function App() {
  const [username, setUsername] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState({ id: 'group', username: 'Group Chat', isGroup: true });
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('users_list', (usersList) => {
      // remove self from list
      const others = usersList.filter(u => u.id !== socket.id);
      setUsers(others);
    });

    socket.on('private_message', (msg) => {
      setMessages(prev => [...prev, { ...msg, isGroup: false }]);
    });

    socket.on('group_message', (msg) => {
      setMessages(prev => [...prev, { ...msg, isGroup: true }]);
    });

    return () => {
      socket.off('users_list');
      socket.off('private_message');
      socket.off('group_message');
    };
  }, []);

  const handleLogin = (name) => {
    socket.connect();
    socket.emit('register', name);
    setUsername(name);
  };

  const sendMessage = (text) => {
    if (selectedChat.isGroup) {
      socket.emit('group_message', { text });
    } else {
      socket.emit('private_message', { to: selectedChat.id, text });
      // Add message to own state
      setMessages(prev => [...prev, { from: socket.id, fromUsername: username, text, timestamp: Date.now(), isGroup: false, isSelf: true, to: selectedChat.id }]);
    }
  };

  if (!username) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-800">
      <Sidebar 
        users={users} 
        socketId={socket.id}
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
      />
      <div className="flex-1 flex flex-col bg-white">
        <ChatArea 
          socket={socket}
          currentUser={{ id: socket.id, username }}
          selectedChat={selectedChat}
          messages={messages.filter(m => 
            m.isGroup === selectedChat.isGroup && 
            (m.isGroup || m.from === selectedChat.id || m.to === selectedChat.id)
          )}
          onSendMessage={sendMessage}
        />
      </div>
    </div>
  );
}

export default App;
