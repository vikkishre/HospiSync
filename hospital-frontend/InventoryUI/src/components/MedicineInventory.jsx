// src/components/MedicineInventory.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MedicineInventory.css';

const MedicineInventory = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get('/api/inventory/medicines');
        setMedicines(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch medicines');
        setLoading(false);
        console.error(err);
      }
    };

    fetchMedicines();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="medicine-inventory">
      <h2>Medicine Inventory</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Stock</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map(medicine => (
            <tr key={medicine.id}>
              <td>{medicine.id}</td>
              <td>{medicine.name}</td>
              <td>{medicine.description}</td>
              <td className={medicine.stock < 10 ? 'low-stock' : ''}>
                {medicine.stock}
              </td>
              <td>{new Date(medicine.last_updated).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedicineInventory;