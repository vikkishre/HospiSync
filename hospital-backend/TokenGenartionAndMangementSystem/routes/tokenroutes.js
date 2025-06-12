const express = require('express');
const db = require('../../db/db');
const getNextTokenCode = require('../utils/tokenGenerator');
const getNextRoom = require('../utils/roomAllocator');
const { broadcastTokenUpdate } = require('../../ws');

const router = express.Router();

router.post('/generate-token', async (req, res) => {
  try {
    const { department_id } = req.body;
    if (!department_id) {
      return res.status(400).json({ message: 'Department is required' });
    }

    const tokenCode = await getNextTokenCode(db);
    const roomId = await getNextRoom(db, department_id);

    const insertRes = await db.query(
      `INSERT INTO tokens(token_code, department_id, room_id) VALUES($1, $2, $3) RETURNING *`,
      [tokenCode, department_id, roomId]
    );

    const token = insertRes.rows[0];

    // Fetch full display info
    const extraInfoRes = await db.query(`
      SELECT 
        t.id,
        d.name AS department,
        t.token_code,
        r.room_number,
        t.status,
        d.id AS department_id
      FROM tokens t
      JOIN departments d ON t.department_id = d.id
      JOIN rooms r ON t.room_id = r.id
      WHERE t.id = $1
    `, [token.id]);

    const displayData = extraInfoRes.rows[0];

    console.log('Broadcasting token data:', displayData);
    broadcastTokenUpdate(displayData); // WebSocket update

    // ✅ Return enriched token info to frontend
    res.status(201).json({ message: 'Token generated', token: displayData });
  } catch (err) {
    console.error('Error generating token:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


 // Ensure this is imported

// Update token status
router.patch('/update-status', async (req, res) => {
  const { tokenId, status } = req.body;
  const allowedStatuses = ['waiting', 'called', 'in_progress', 'completed'];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid Status Value' });
  }

  try {
    const result = await db.query(
      'UPDATE tokens SET status = $1 WHERE id = $2 RETURNING *',
      [status, tokenId]
    );

    const updatedToken = result.rows[0];

    // Get additional display info for broadcasting
    const extraInfoRes = await db.query(`
      SELECT d.name AS department, t.token_code, r.room_number, t.status, d.id AS department_id
      FROM tokens t
      JOIN departments d ON t.department_id = d.id
      JOIN rooms r ON t.room_id = r.id
      WHERE t.id = $1
    `, [tokenId]);

    const displayData = extraInfoRes.rows[0];
    broadcastTokenUpdate(displayData);

    res.json({ message: 'Status Updated', token: updatedToken });
  } catch (e) {
    res.status(500).json({ message: 'Server Error', error: e.message });
  }
});

router.get('/departments', async (req, res) => {
  try {
    const result = await db.query('SELECT id, name FROM departments');
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ message: 'Error fetching departments', error: e.message });
  }
});

// Update token's department
router.patch('/update-department', async (req, res) => {
  const { tokenId, newDepartmentId } = req.body;
  if (!tokenId || !newDepartmentId) {
    return res.status(400).json({ message: 'tokenId and newDepartmentId required' });
  }

  try {
    // Allocate new room for the new department
    const roomId = await getNextRoom(db, newDepartmentId);

    // Update department and room
    const result = await db.query(
      'UPDATE tokens SET department_id = $1, room_id = $2, status = $3 WHERE id = $4 RETURNING *',
      [newDepartmentId, roomId, 'waiting', tokenId]
    );

    const updatedToken = result.rows[0];

    const displayData = await db.query(`
      SELECT d.name AS department, t.token_code, r.room_number, t.status, d.id AS department_id
      FROM tokens t
      JOIN departments d ON t.department_id = d.id
      JOIN rooms r ON t.room_id = r.id
      WHERE t.id = $1
    `, [tokenId]);

    broadcastTokenUpdate(displayData.rows[0]);
    res.json({ message: 'Department updated', token: updatedToken });
  } catch (e) {
    res.status(500).json({ message: 'Server Error', error: e.message });
  }
});


// Mark token as done
router.patch('/mark-done', async (req, res) => {
  const { tokenId } = req.body;

  try {
    const result = await db.query(
      'UPDATE tokens SET isDone = true WHERE id = $1 RETURNING *',
      [tokenId]
    );

    // Notify display to remove this token
    broadcastTokenUpdate({ token_id: tokenId }, 'token-done');

    res.json({ message: 'Token marked as done', token: result.rows[0] });
  } catch (e) {
    res.status(500).json({ message: 'Server Error', error: e.message });
  }
});

module.exports = router;
