const express = require('express');
const db = require('../../db/db');

const router = express.Router();

router.get('/display-tokens', async (req, res) => {
  try {
    const { department_id } = req.query;

    let query;
    let params;

    if (department_id) {
      query = `
        SELECT 
          t.id,                                         -- ✅ Add token ID
          d.name AS department, 
          d.id AS department_id, 
          t.token_code, 
          r.room_number, 
          t.status
        FROM tokens t
        JOIN departments d ON t.department_id = d.id
        JOIN rooms r ON t.room_id = r.id
        WHERE d.id = $1 AND t.isdone = false
        ORDER BY t.created_at DESC
        LIMIT 5;
      `;
      params = [department_id];
    } else {
      query = `
        SELECT 
          t.id,                                         -- ✅ Add token ID
          d.name AS department, 
          d.id AS department_id, 
          t.token_code, 
          r.room_number, 
          t.status
        FROM tokens t
        JOIN departments d ON t.department_id = d.id
        JOIN rooms r ON t.room_id = r.id
        WHERE t.isdone = false
        ORDER BY t.created_at DESC
        LIMIT 50;
      `;
      params = [];
    }

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


module.exports = router;
