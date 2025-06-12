const express = require('express');
const db = require('../../db/db'); // adjust if you named it differently

const router = express.Router();

router.get('/medicines', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM medicine ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching medicines:', err);
    res.status(500).json({ error: 'Failed to fetch medicines' });
  }
});

module.exports = router;
