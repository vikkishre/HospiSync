import { useState, useEffect } from 'react';
import { restock, getMedicines, getEquipment } from '../api/inventory';
import { FaPlusCircle } from 'react-icons/fa';

// Replace the component function only, rest logic stays same
const Restock = () => {
  const [formData, setFormData] = useState({
    item_id: '',
    item_type: 'medicine',
    item_name: '',
    quantity: '',
    department: '',
    source: ''
  });
  const [items, setItems] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = formData.item_type === 'medicine' ? await getMedicines() : await getEquipment();
        setItems(data);
      } catch (err) {
        console.error('Failed to load items', err);
      }
    };
    fetchItems();
  }, [formData.item_type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (e) => {
    const itemName = e.target.value;
    const selected = items.find(item => item.name === itemName);
    setFormData(prev => ({
      ...prev,
      item_name: itemName,
      item_id: selected?.id || ''
    }));
    setSelectedUnit(formData.item_type === 'medicine' ? selected?.unit || '' : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await restock(formData);
      setMessage('Stock restocked successfully!');
      setFormData({
        item_id: '',
        item_type: 'medicine',
        item_name: '',
        quantity: '',
        department: '',
        source: ''
      });
      setSelectedUnit('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to restock');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <div className="p-3 rounded-full bg-green-100 mr-4">
          <FaPlusCircle className="text-green-500 text-xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Restock Inventory</h2>
      </div>

      {message && <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg">{message}</div>}
      {error && <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Item Type</label>
          <select
            name="item_type"
            value={formData.item_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="medicine">Medicine</option>
            <option value="equipment">Equipment</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
          <select
            name="name"
            value={formData.name}
            onChange={handleItemChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select item</option>
            {items.map(item => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          {selectedUnit && <p className="text-sm text-gray-500 mt-1">Unit: {selectedUnit}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
          <input
            type="text"
            name="source"
            value={formData.source}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          Restock
        </button>
      </form>
    </div>
  );
};

export default Restock;
