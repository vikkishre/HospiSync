import { useState,useEffect } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('staff');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('api/admin/create-user', {
        username,
        password,
        role,
      });
      setMessage(`User ${response.data.user.username} created successfully`);
      setUsername('');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };
  useEffect(() => {
    console.log("AdminDashboard mounted");
  }, []);
  

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Create New User</h3>
        {message && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleCreateUser}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="w-full border rounded p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Role</label>
            <select
              className="w-full border rounded p-2"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="staff">Staff</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Create User
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;