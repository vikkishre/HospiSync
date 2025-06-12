// server.js or index.js or wherever you start the server
const http = require('http');
const app = require('./app');
const { setWebSocketServer } = require('./ws');

// 👇 ADD THIS LINE
const startSyncEngine = require('./InventorySyncManagementSystem/utils/syncEngine');

const server = http.createServer(app);

// Setup WebSocket
setWebSocketServer(server);

// 👇 START THE CRON JOB
startSyncEngine();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running with WebSockets on port ${PORT}`);
});
