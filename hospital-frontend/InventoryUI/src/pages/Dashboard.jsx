import { useState, useEffect } from 'react';
import { getMedicines, getInventoryLogs, getEquipment } from '../api/inventory';
import { 
  FaPills, FaBoxOpen, FaArrowUp, FaArrowDown, FaHistory, FaExclamationTriangle, FaTools 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [medicines, setMedicines] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [medicinesData, equipmentData, logsData] = await Promise.all([
          getMedicines(),
          getEquipment(),
          getInventoryLogs()
        ]);
        setMedicines(medicinesData);
        setEquipment(equipmentData);
        setLogs(logsData.slice(0, 5));
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
        {error}
      </div>
    );
  }

  const totalMedicines = medicines.length;
  const totalEquipment = equipment.length;
  const lowStockMedicines = medicines.filter(m => m.stock < 10).length;
  const lowStockEquipment = equipment.filter(e => parseInt(e.quantity) < e.reorder_threshold).length;
  const recentConsumptions = logs.filter(log => log.change_type === 'consume').length;
  const recentRestocks = logs.filter(log => log.change_type === 'restock').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-500">Welcome back! Here's your inventory summary</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {(lowStockMedicines > 0 || lowStockEquipment > 0) && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center">
            <FaExclamationTriangle className="h-5 w-5 text-red-500 mr-3" />
            <div>
              {lowStockMedicines > 0 && (
                <h3 className="text-sm font-medium text-red-800">
                  {lowStockMedicines} medicine item{lowStockMedicines !== 1 ? 's' : ''} low on stock
                </h3>
              )}
              {lowStockEquipment > 0 && (
                <h3 className="text-sm font-medium text-red-800">
                  {lowStockEquipment} equipment item{lowStockEquipment !== 1 ? 's' : ''} low on stock
                </h3>
              )}
              <div className="mt-2 text-sm text-red-700">
                <Link to="/medicines" className="underline mr-4">Check medicines</Link>
                <Link to="/equipment" className="underline">Check equipment</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard 
          icon={<FaPills className="text-blue-500" />}
          title="Total Medicines"
          value={totalMedicines}
          linkTo="/medicines"
        />
        <StatCard 
          icon={<FaBoxOpen className="text-yellow-500" />}
          title="Low Stock Medicines"
          value={lowStockMedicines}
          linkTo="/medicines"
          danger={lowStockMedicines > 0}
        />
        <StatCard 
          icon={<FaTools className="text-indigo-500" />}
          title="Total Equipment"
          value={totalEquipment}
          linkTo="/equipment"
        />
        <StatCard 
          icon={<FaBoxOpen className="text-orange-500" />}
          title="Low Stock Equipment"
          value={lowStockEquipment}
          linkTo="/equipment"
          danger={lowStockEquipment > 0}
        />
        <StatCard 
          icon={<FaArrowDown className="text-red-500" />}
          title="Recent Consumptions"
          value={recentConsumptions}
          linkTo="/logs"
        />
        <StatCard 
          icon={<FaArrowUp className="text-green-500" />}
          title="Recent Restocks"
          value={recentRestocks}
          linkTo="/logs"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4">
            <Link to="/consume" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <FaArrowDown className="text-red-500 text-xl" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Consume Stock</h3>
                <p className="text-sm text-gray-500">Record medicine/equipment usage</p>
              </div>
            </Link>
            <Link to="/restock" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FaArrowUp className="text-green-500 text-xl" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Restock Inventory</h3>
                <p className="text-sm text-gray-500">Add new stock to inventory</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
            <Link to="/logs" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
              View all <FaHistory className="ml-1" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 capitalize">
                      {log.item_type}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {log.item_id}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                        log.change_type === 'consume'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {log.change_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {log.quantity}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, linkTo, danger = false }) => (
  <Link to={linkTo} className={`bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow ${danger ? 'border-l-4 border-red-500' : ''}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className={`text-2xl font-semibold ${danger ? 'text-red-600' : 'text-gray-900'}`}>
          {value}
        </p>
      </div>
      <div className="p-3 rounded-full bg-gray-100">{icon}</div>
    </div>
  </Link>
);

export default Dashboard;
