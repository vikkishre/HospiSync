import React, { useState } from 'react';

const alerts = [
  { type: 'code_blue', label: 'Code Blue', color: 'bg-blue-600' },
  { type: 'code_red', label: 'Code Red', color: 'bg-red-600' },
  { type: 'code_orange', label: 'Code Orange', color: 'bg-orange-500' },
  { type: 'code_green', label: 'Code Green', color: 'bg-green-600' },
];

export default function AlertDashboard() {
  const [status, setStatus] = useState('');

  const triggerAlert = async (alertType) => {
    const payload = {
      alert_type: alertType,
      triggered_by: 'Admin',
      department: 'ER',
    };

    const res = await fetch('http://localhost:5000/alert/trigger-alert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setStatus(data.message);
  };

  const stopAlert = async () => {
    const res = await fetch('http://localhost:5000/alert/clear-alert', {
      method: 'POST',
    });

    const data = await res.json();
    setStatus(data.message);
  };

  return (
    <div className="min-h-screen w-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-2xl p-10 flex flex-col items-center space-y-8">
        <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-3">
          🚨 Emergency Alert Dashboard
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full">
          {alerts.map((alert) => (
            <button
              key={alert.type}
              className={`w-full text-white text-lg font-semibold py-4 rounded-xl shadow-lg hover:scale-105 transition-all duration-200 ${alert.color}`}
              onClick={() => triggerAlert(alert.type)}
            >
              {alert.label}
            </button>
          ))}
        </div>

        {status && (
          <div className="w-full text-center mt-6">
            <p className="text-green-700 font-medium text-lg mb-4">{status}</p>
            <button
              className="px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition"
              onClick={stopAlert}
            >
              🛑 Stop Alert
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
