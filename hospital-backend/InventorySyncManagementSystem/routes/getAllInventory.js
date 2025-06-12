const express = require('express');
const db = require('../../db/db');

const router = express.Router();

router.get('/all', async (req, res) => {
  try {
    const medicines = await db.query('SELECT id, name, stock, unit, reorder_threshold, department FROM medicine');
    const equipment = await db.query('SELECT id, name, quantity,  reorder_threshold, location FROM equipment');

    const merged = [
      ...medicines.rows.map(med => ({
        item_type: 'medicine',
        item_id: med.id,
        name: med.name,
        stock: med.stock,
        unit: med.unit,
        reorder_threshold: med.reorder_threshold,
        department: med.department
      })),
      ...equipment.rows.map(eq => ({
        item_type: 'equipment',
        item_id: eq.id,
        name: eq.name,
        quantity: eq.quantity,
        unit: eq.unit,
        reorder_threshold: eq.reorder_threshold,
        location: eq.location
      }))
    ];

    res.json(merged);
  } catch (err) {
    console.error('Error fetching full inventory:', err);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

module.exports = router;
