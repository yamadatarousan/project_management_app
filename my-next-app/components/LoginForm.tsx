'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-10 p-6 bg-white border border-gray-200 rounded-xl shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>
      {error && <p className="text-red-500 mb-4 bg-red-50 p-3 rounded-md">{error}</p>}
      <div className="mb-5">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
          required
        />
      </div>
      <div className="mb-5">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password *
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
        } transition-colors duration-200`}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}