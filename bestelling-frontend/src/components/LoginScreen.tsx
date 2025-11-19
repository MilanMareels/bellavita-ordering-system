import { useState } from "react";
import type { LoginScreenProps } from "../types";
import { User } from "lucide-react";

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, error }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="min-h-svh bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8 border border-gray-700">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-600 p-4 rounded-full">
            <User size={40} className="text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center text-white mb-2">Gusto POS</h2>
        <p className="text-center text-gray-400 mb-8">Log in om te beginnen</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Gebruikersnaam</label>
            <input
              type="text"
              className="w-full bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 p-3 outline-none transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Wachtwoord</label>
            <input
              type="password"
              className="w-full bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 p-3 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="1234"
            />
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center">{error}</div>}

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition transform active:scale-95 shadow-lg">
            INLOGGEN
          </button>
        </form>
        <div className="mt-6 text-center text-xs text-gray-500">Demo: admin / 1234</div>
      </div>
    </div>
  );
};

export default LoginScreen;
