import { useState, useEffect } from 'react';
import api from '../services/api';

const StaffDashboard = () => {
  const [departmentId, setDepartmentId] = useState('');
  const [departments, setDepartments] = useState([]);
  const [generatedToken, setGeneratedToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/tokens/departments'); // same endpoint used in DoctorDashboard
      setDepartments(res.data);
    } catch (err) {
      setError('Failed to load departments');
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!departmentId) {
      setError('Please select a department');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const response = await api.post('/tokens/generate-token', { department_id: departmentId });
      setGeneratedToken(response.data.token);
      console.log(response.data.token)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate token');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Staff Dashboard</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Generate Token</h3>
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleGenerate}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Department</label>
            <select
              className="w-full border rounded p-2"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className={`w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate Token'}
          </button>
        </form>

        {generatedToken && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
            <h4 className="text-lg font-semibold mb-2">Token Generated</h4>
            <p className="text-3xl font-bold">{generatedToken.token_code}</p>
            <p className="mt-2">Room: {generatedToken.room_number}</p>
            <p>Department: {generatedToken.department}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
