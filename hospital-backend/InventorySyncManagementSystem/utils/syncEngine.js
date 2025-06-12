const cron = require('node-cron');
const db = require('../../db/db');
const { broadcastInventoryUpdate } = require('../../ws');

function startSyncEngine() {
  cron.schedule('*/10 * * * * *', async () => {
    console.log('[SyncEngine] 🔄 Running stock check...');

    try {
      // Check all medicines
      const medicines = await db.query('SELECT * FROM medicine');
      for (const med of medicines.rows) {
        const isLow = med.stock < med.reorder_threshold;

        if (isLow) {
          console.log(`[SyncEngine] 🔴 LOW STOCK: ${med.name} (${med.stock}/${med.reorder_threshold})`);

          broadcastInventoryUpdate({
            item_type: 'medicine',
            item_id: med.id,
            name: med.name,
            stock: med.stock,
            reorder_threshold: med.reorder_threshold,
            unit: med.unit,
            department: med.department,
            status: 'low'
          });

        } else {
          console.log(`[SyncEngine] ✅ RESTOCKED (Broadcast Only): ${med.name} (${med.stock}/${med.reorder_threshold})`);

          broadcastInventoryUpdate({
            item_type: 'medicine',
            item_id: med.id,
            name: med.name,
            stock: med.stock,
            reorder_threshold: med.reorder_threshold,
            unit: med.unit,
            department: med.department,
            status: 'ok'
          });
        }
      }

    } catch (err) {
      console.error('[SyncEngine Error]:', err);
    }
  });
}

module.exports = startSyncEngine;
