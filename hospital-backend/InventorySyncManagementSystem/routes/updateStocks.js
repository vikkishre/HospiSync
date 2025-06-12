const db = require('../../db/db');
const express = require('express');
const router = express.Router();

// Helper to get item_id and unit from name
const getItemDetails = async (item_type, item_name) => {
  if (item_type === 'medicine') {
    const res = await db.query('SELECT id, unit FROM medicine WHERE name = $1', [item_name]);
    return res.rows[0];
  } else if (item_type === 'equipment') {
    const res = await db.query('SELECT id FROM equipment WHERE name = $1', [item_name]);
    return res.rows[0];
  }
  throw new Error('Invalid item type');
};

// 🟢 CONSUME STOCKS (used by nurses/staff)
router.post('/consume-stocks', async (req, res) => {
  const { item_name, item_type, quantity_used, department, source } = req.body;

  try {
    const item = await getItemDetails(item_type, item_name);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const { id: item_id } = item;

    if (item_type === 'medicine') {
      await db.query(
        'UPDATE medicine SET stock = stock - $1, last_updated = NOW() WHERE id = $2',
        [quantity_used, item_id]
      );
    } else if (item_type === 'equipment') {
      await db.query(
        'UPDATE equipment SET quantity = quantity - $1, last_checked = NOW() WHERE id = $2',
        [quantity_used, item_id]
      );
    }

    await db.query(
      `INSERT INTO inventory_logs (item_type, item_id, change_type, quantity, department, source)
       VALUES ($1, $2, 'consume', $3, $4, $5)`,
      [item_type, item_id, quantity_used, department, source]
    );

    res.status(200).json({ message: 'Stock consumed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// 🟢 RESTOCK (used by pharmacist/admin)
router.post('/restock', async (req, res) => {
  const { item_name, item_type, quantity, department, source } = req.body;

  try {
    const item = await getItemDetails(item_type, item_name);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const { id: item_id } = item;

    if (item_type === 'medicine') {
      await db.query(
        'UPDATE medicine SET stock = stock + $1, last_updated = NOW() WHERE id = $2',
        [quantity, item_id]
      );
    } else if (item_type === 'equipment') {
      await db.query(
        'UPDATE equipment SET quantity = quantity + $1, last_checked = NOW() WHERE id = $2',
        [quantity, item_id]
      );
    }

    await db.query(
      `INSERT INTO inventory_logs (item_type, item_id, change_type, quantity, department, source)
       VALUES ($1, $2, 'restock', $3, $4, $5)`,
      [item_type, item_id, quantity, department, source]
    );

    res.status(200).json({ message: 'Stock restocked successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error restocking stock' });
  }
});

// 🟢 VIEW INVENTORY LOGS
router.get('/logs', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT logs.*, 
             m.name AS medicine_name, 
             e.name AS equipment_name
      FROM inventory_logs logs
      LEFT JOIN medicine m ON logs.item_type = 'medicine' AND logs.item_id = m.id
      LEFT JOIN equipment e ON logs.item_type = 'equipment' AND logs.item_id = e.id
      ORDER BY timestamp DESC
      LIMIT 100
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching logs' });
  }
});

module.exports = router;
