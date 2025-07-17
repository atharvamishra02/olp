import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaLock, FaSignInAlt } from 'react-icons/fa'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      // Navigate to dashboard based on selected role
      navigate(role === 'admin' ? '/admin' : '/student');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border-t-8 border-blue-400">
        <div className="flex flex-col items-center mb-6">
          <FaUserCircle className="text-5xl text-blue-500 mb-2" />
          <h2 className="text-3xl font-bold text-blue-700 mb-1">Sign In</h2>
        </div>
        {error && <div className="mb-4 text-red-500 text-center font-semibold">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Username</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400"><FaUserCircle /></span>
            <input type="text" className="w-full border rounded pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-200" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Password</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400"><FaLock /></span>
            <input type="password" className="w-full border rounded pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-200" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Role</label>
          <select className="w-full border rounded px-3 py-2" value={role} onChange={e => setRole(e.target.value)} required>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2 rounded-lg shadow flex items-center justify-center gap-2 transition">
          <FaSignInAlt /> Login
        </button>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account? <a href="/register" className="text-blue-600 hover:underline">Register</a>
        </div>
      </form>
    </div>
  );
};

export default Login; 