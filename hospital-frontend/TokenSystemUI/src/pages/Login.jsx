import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const role = await login(username, password);
      navigate(`/${role}`);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        {error && <div className="text-red-600">{error}</div>}
        <input className="border p-2 w-full mb-3" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
        <input type="password" className="border p-2 w-full mb-3" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <button className="bg-green-600 text-white p-2 w-full rounded">Login</button>
      </form>
    </div>
  );
};

export default Login;
