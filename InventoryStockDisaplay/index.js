let currentView = 'pharmacy';
let socket = null;

function setView(view) {
  currentView = view;
  fetchAndRenderInventory();
}

async function fetchAndRenderInventory() {
  const response = await fetch('http://localhost:5000/inventory/all');
  const data = await response.json();
  renderInventory(data);
}

function renderInventory(items) {
  const tbody = document.getElementById('inventoryBody');
  tbody.innerHTML = '';

  items.forEach(item => {
    if (currentView === 'pharmacy' && item.item_type !== 'medicine') return;
    if (currentView === 'general' && item.item_type !== 'equipment') return;

    const row = document.createElement('tr');
    const uniqueId = `item-${item.item_type}-${item.item_id}`;
    row.id = uniqueId;

    const stockVal = item.stock ?? item.quantity;
    const reorderThreshold = item.reorder_threshold ?? 10;
    const status = stockVal <= reorderThreshold ? 'LOW' : 'OK';

    row.className = stockVal <= reorderThreshold ? 'low-stock' : 'ok-stock';

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.item_type}</td>
      <td class="stock">${stockVal}</td>
      <td>${item.unit || '-'}</td>
      <td>${item.department || item.location || 'Unknown'}</td>
      <td class="status">${status}</td>
    `;

    tbody.appendChild(row);
  });
}

function updateInventoryUI(item) {
  const rowId = `item-${item.item_type}-${item.item_id}`;
  const row = document.getElementById(rowId);

  const stockVal = item.stock ?? item.quantity;
  const reorderThreshold = item.reorder_threshold ?? 10;
  const status = stockVal <= reorderThreshold ? 'LOW' : 'OK';
  const className = stockVal <= reorderThreshold ? 'low-stock' : 'ok-stock';

  if (row) {
    row.className = className;
    row.querySelector('.stock').textContent = stockVal;
    row.querySelector('.status').textContent = status;
  } else {
    console.warn('[WebSocket] Received update for item not currently rendered:', rowId);
    fetchAndRenderInventory(); // Refresh table to include new/changed item
  }
}

function setupWebSocket() {
  socket = new WebSocket('ws://localhost:5000');

  socket.onopen = () => console.log('[WebSocket] Connected to server');

  socket.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);

      // 🔧 FIX: Corrected message type check
      if ((msg.type === 'inventory-update' || msg.type === 'inventory_update') && msg.payload) {
        console.log('[WebSocket] Inventory update received:', msg.payload);
        updateInventoryUI(msg.payload);
      }
    } catch (err) {
      console.error('[WebSocket] Invalid message:', event.data);
    }
  };

  socket.onerror = (error) => {
    console.error('[WebSocket Error]:', error);
  };

  socket.onclose = () => {
    console.warn('[WebSocket] Disconnected. Reconnecting in 5s...');
    setTimeout(setupWebSocket, 5000);
  };
}

window.onload = () => {
  fetchAndRenderInventory();
  setupWebSocket();
};
