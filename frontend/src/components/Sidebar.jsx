import { Users, Circle, Laugh } from 'lucide-react';

function Sidebar({ users, selectedChat, onSelectChat }) {
  return (
    <div className="w-84 bg-white/80 backdrop-blur-md border-r border-indigo-100 flex flex-col h-full shadow-2xl z-20">
      <div className="p-6 bg-gradient-to-r relative overflow-hidden flex items-center gap-3">
        <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600/10 to-indigo-600/10"></div>
        <div className="bg-gradient-to-tr from-fuchsia-500 to-indigo-500 p-2 rounded-xl text-white shadow-lg animate-bounce-soft relative z-10">
          <Laugh className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-indigo-600 tracking-tight relative z-10 drop-shadow-sm">
          ChatterBox
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-3">Town Square</h3>
          <button
            onClick={() => onSelectChat({ id: 'group', username: 'The Chaos Room', isGroup: true })}
            className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] ${
              selectedChat.isGroup 
                ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 shadow-md ring-2 ring-indigo-500/20' 
                : 'hover:bg-gray-50 border-2 border-transparent'
            }`}
          >
            <div className={`p-3 rounded-xl shadow-inner ${selectedChat.isGroup ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
              <Users className="w-6 h-6" />
            </div>
            <div className="text-left">
              <span className="font-bold text-gray-800 block">The Chaos Room</span>
              <span className="text-xs text-indigo-500 font-semibold uppercase tracking-wider">Everyone</span>
            </div>
          </button>
        </div>

        <div>
           <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-3 flex items-center justify-between">
             <span>Online Humans</span>
             <span className="bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full text-[10px]">{users.length}</span>
           </h3>
           <div className="space-y-2">
            {users.map((user, i) => (
              <button
                key={user.id}
                style={{ animationDelay: `${i * 50}ms` }}
                onClick={() => onSelectChat({ id: user.id, username: user.username, isGroup: false })}
                className={`animate-pop-in opacity-0 w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                  selectedChat.id === user.id 
                    ? 'bg-gradient-to-r from-fuchsia-50 to-pink-50 border-2 border-fuchsia-200 shadow-md ring-2 ring-fuchsia-500/20' 
                    : 'hover:bg-gray-50 border-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white rounded-full p-0.5 shadow-sm">
                    <Circle className="w-3.5 h-3.5 text-green-500 fill-green-500" />
                  </div>
                  <span className={`font-bold truncate ${selectedChat.id === user.id ? 'text-fuchsia-700' : 'text-gray-700'}`}>{user.username}</span>
                </div>
              </button>
            ))}
            {users.length === 0 && (
              <div className="bg-gray-50 rounded-2xl p-6 text-center border-2 border-dashed border-gray-200 mt-2">
                <p className="text-gray-500 text-sm font-medium mt-2">Crickets... invite some friends!</p>
              </div>
            )}
           </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
