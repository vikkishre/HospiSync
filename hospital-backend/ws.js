const WebSocket = require('ws');

let wss;

function setWebSocketServer(server) {
  wss = new WebSocket.Server({ server });
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
  });
}

function broadcastTokenUpdate(payload, type = 'token-update') {
  console.log("Broadcasting to clients:", payload);

  if (!wss) return;
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type, payload }));
    }
  });
}

// ✅ NEW: Broadcast Inventory Updates to Clients
function broadcastInventoryUpdate(payload) {
  console.log("Broadcasting inventory update:", payload);

  if (!wss) return;
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'inventory-update',
        payload
      }));
    }
  });
}
// ✅ NEW: Broadcast Alert Messages to Clients
function broadcastAlert(alertPayload) {
  console.log("Broadcasting alert:", alertPayload);

  if (!wss) return;
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'emergency_alert',
        payload: alertPayload
      }));
    }
  });
}
function broadcastEmergencyAlertClear() {
  if (!wss) return;
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'emergency_alert_clear'
      }));
    }
  });
}

module.exports = {
  setWebSocketServer,
  broadcastTokenUpdate,
  broadcastInventoryUpdate ,// <-- Export the new function
  broadcastAlert,
  broadcastEmergencyAlertClear
};
