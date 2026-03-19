import { useState } from 'react';
import { MessageCircleDashed } from 'lucide-react';
import confetti from 'canvas-confetti';

function Login({ onLogin }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#6366f1', '#ec4899']
      });
      setTimeout(() => onLogin(name.trim()), 600);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Playful background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] p-10 w-full max-w-md transform transition-all hover:scale-[1.02] border border-white/50 relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-gradient-to-tr from-fuchsia-500 to-indigo-500 p-4 rounded-2xl mb-6 shadow-lg shadow-purple-500/30 animate-bounce">
            <MessageCircleDashed className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-indigo-600 tracking-tight text-center">
            ChatterBox 9000
          </h1>
          <p className="text-gray-500 mt-3 text-center font-medium">
            Where productivity goes to take a nap.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-2 group-focus-within:text-indigo-600 transition-colors">
              Your Totally Real Name
            </label>
            <div className="relative">
              <input
                id="username"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:ring-0 focus:border-indigo-500 bg-gray-50/50 outline-none transition-all text-gray-800 font-medium placeholder-gray-400"
                placeholder="e.g. Captain Chaos"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full relative overflow-hidden group bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] focus:ring-4 focus:ring-purple-300 transition-all duration-300 hover:-translate-y-1"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Beam Me In, Scotty!
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
