import { useState } from 'react';
import { MessageSquare } from 'lucide-react';

function Login({ onLogin }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 rounded-lg to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-indigo-100 p-3 rounded-full mb-4">
            <MessageSquare className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome</h1>
          <p className="text-gray-500 mt-2 text-center">Join the conversation. Enter a username to get started.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              id="username"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              placeholder="e.g. John Doe"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-colors"
          >
            Join Chat
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
