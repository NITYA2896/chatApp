import { Users, User, Circle } from 'lucide-react';

function Sidebar({ users, selectedChat, onSelectChat }) {
  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      <div className="p-6 border-b border-gray-200 bg-white">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <MessageSquareIcon className="w-6 h-6 text-indigo-600" />
          ChatApp
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        <div>
          <button
            onClick={() => onSelectChat({ id: 'group', username: 'Group Chat', isGroup: true })}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
              selectedChat.isGroup ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <div className={`p-2 rounded-lg ${selectedChat.isGroup ? 'bg-indigo-200' : 'bg-gray-200'}`}>
              <Users className="w-5 h-5" />
            </div>
            <span className="font-semibold">Group Chat</span>
          </button>
        </div>

        <div>
           <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Online Users — {users.length}</h3>
           <div className="space-y-1">
            {users.map(user => (
              <button
                key={user.id}
                onClick={() => onSelectChat({ id: user.id, username: user.username, isGroup: false })}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                  selectedChat.id === user.id ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 p-2 rounded-full relative">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="font-medium truncate">{user.username}</span>
                </div>
                <Circle className="w-3 h-3 text-green-500 fill-current" />
              </button>
            ))}
            {users.length === 0 && (
              <p className="text-gray-500 text-sm italic px-3 mt-4">No other users online.</p>
            )}
           </div>
        </div>
      </div>
    </div>
  );
}

function MessageSquareIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  )
}

export default Sidebar;
