import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaUserCircle, FaLock } from 'react-icons/fa'

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });
      const data = await res.json();
      if (res.status === 409) {
        setError('A user with this email/username already exists.');
        return;
      }
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      // Immediately log in and redirect
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      navigate(role === 'admin' ? '/admin' : '/student');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-blue-100 to-pink-100">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border-t-8 border-green-400">
        <div className="flex flex-col items-center mb-6">
          <FaUserPlus className="text-5xl text-green-500 mb-2" />
          <h2 className="text-3xl font-bold text-green-700 mb-1">Register</h2>
        </div>
        {error && <div className="mb-4 text-red-500 text-center font-semibold">{error}</div>}
        {success && <div className="mb-4 text-green-600 text-center font-semibold">{success}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Username</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400"><FaUserCircle /></span>
            <input type="text" className="w-full border rounded pl-10 pr-3 py-2 focus:ring-2 focus:ring-green-200" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Password</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400"><FaLock /></span>
            <input type="password" className="w-full border rounded pl-10 pr-3 py-2 focus:ring-2 focus:ring-green-200" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Role</label>
          <select className="w-full border rounded px-3 py-2" value={role} onChange={e => setRole(e.target.value)} required>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-2 rounded-lg shadow flex items-center justify-center gap-2 transition">
          <FaUserPlus /> Register
        </button>
        <div className="mt-4 text-center text-sm">
          Already have an account? <a href="/login" className="text-green-600 hover:underline">Login</a>
        </div>
      </form>
    </div>
  );
};

export default Register; 