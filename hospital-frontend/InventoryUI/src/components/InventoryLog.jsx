// src/components/InventoryLogs.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './InventoryLogs.css';

const InventoryLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('/api/inventory/logs');
        setLogs(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch inventory logs');
        setLoading(false);
        console.error(err);
      }
    };

    fetchLogs();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="inventory-logs">
      <h2>Inventory Logs</h2>
      <div className="logs-container">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Item Type</th>
              <th>Item ID</th>
              <th>Change Type</th>
              <th>Quantity</th>
              <th>Department</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>{log.item_type}</td>
                <td>{log.item_id}</td>
                <td className={log.change_type === 'consume' ? 'consume' : 'restock'}>
                  {log.change_type}
                </td>
                <td>{log.quantity}</td>
                <td>{log.department}</td>
                <td>{log.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryLogs;