import { useState, useEffect } from 'react';
import api from '../services/api';
import LogoutButton from '../components/LogoutButton';

const DoctorDashboard = () => {
  const [tokens, setTokens] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedTokenId, setSelectedTokenId] = useState(null);
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  const fetchTokens = async () => {
    try {
      const response = await api.get('/display/display-tokens');
      setTokens(response.data);
    } catch {
      setError('Failed to fetch tokens');
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/tokens/departments');
      setDepartments(res.data);
    } catch {
      setError('Failed to load departments');
    }
  };

  const updateStatus = async (tokenId, status) => {
    try {
      await api.patch('/tokens/update-status', { tokenId, status });
      fetchTokens();
    } catch {
      setError('Failed to update status');
    }
  };

  const markAsDone = async (tokenId) => {
    try {
      await api.patch('/tokens/mark-done', { tokenId });
      fetchTokens();
    } catch {
      setError('Failed to mark token as done');
    }
  };

  const openUpdateModal = (tokenId) => {
    setSelectedTokenId(tokenId);
    setIsModalOpen(true);
    fetchDepartments();
  };

  const handleDepartmentUpdate = async () => {
    console.log("selectedDeptId:", selectedDeptId, typeof selectedDeptId);
    console.log("selectedTokenId:", selectedTokenId, typeof selectedTokenId);
  
    if (!selectedDeptId || !selectedTokenId) {
      alert("Please select a department");
      return;
    }
  
    try {
      const res = await api.patch('/tokens/update-department', {
        tokenId: selectedTokenId,
        newDepartmentId: selectedDeptId,
      });
  
      console.log("Dept update response:", res.data);
      setIsModalOpen(false);
      setSelectedDeptId('');
      setSelectedTokenId(null);
      fetchTokens();
    } catch (err) {
      console.error("Department update failed", err.response?.data || err.message);
      alert("Failed to update department");
    }
  };
  
  
  useEffect(() => {
    fetchTokens();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Doctor Dashboard</h2>
        
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Token</th>
              <th className="py-3 px-4 text-left">Room</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tokens.map((token) => (
                
              <tr key={token.id} className="hover:bg-gray-50">
                <td className="py-3 px-4">{token.token_code}</td>
                <td className="py-3 px-4">{token.room_number}</td>
                <td className="py-3 px-4">
                  <select
                    className="border rounded p-1"
                    value={token.status}
                    onChange={(e) => updateStatus(token.id, e.target.value)}
                  >
                    <option value="waiting">Waiting</option>
                    <option value="called">Called</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
                <td className="py-3 px-4 space-x-2">
                  <button
                    onClick={() => markAsDone(token.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Done
                  </button>
                  <button
                    onClick={() => openUpdateModal(token.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Update Dept
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Update Department</h3>
            <select
            className="w-full border p-2 rounded mb-4"
            value={selectedDeptId}
            onChange={(e) => {
            console.log("Selected value from dropdown:", e.target.value); // ✅ now valid
            setSelectedDeptId(Number(e.target.value));
            }}>
            <option value="">Select department</option>
            {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
            {dept.name}
            </option>
            ))}
            </select>

            <div className="flex justify-end gap-4">
              <button
                onClick={handleDepartmentUpdate}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
