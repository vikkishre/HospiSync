import { useNavigate} from 'react-router-dom';
import useAuth from '../hooks/useAuth';
//import { AuthContext } from '../context/AuthProvider';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
        <p className="mb-6 text-gray-600">
          You don't have permission to access this page.
          {auth?.role && (
            <span className="block mt-2">
              Your role: <span className="font-semibold capitalize">{auth.role}</span>
            </span>
          )}
        </p>
        <div className="flex flex-col space-y-3">
          <button
            onClick={handleGoBack}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Go Back
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Logout
          </button>
          {auth?.role === 'staff' && (
            <button
              onClick={() => navigate('/staff')}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              Go to Staff Dashboard
            </button>
          )}
          {auth?.role === 'doctor' && (
            <button
              onClick={() => navigate('/doctor')}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              Go to Doctor Dashboard
            </button>
          )}
          {auth?.role === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              Go to Admin Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;