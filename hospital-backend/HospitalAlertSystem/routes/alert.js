const express = require('express');
const router = express.Router();
const { broadcastAlert,broadcastEmergencyAlertClear } = require('../../ws'); 
// Import from ws.js

router.post('/trigger-alert', (req, res) => {
  const { alert_type, triggered_by, department } = req.body;

  if (!alert_type || !triggered_by || !department) {
    return res.status(400).json({ message: 'Missing fields in alert' });
  }

  const alertPayload = {
    alert_type,
    triggered_by,
    department
  };

  // ✅ Use centralized broadcast function
  broadcastAlert(alertPayload);

  res.json({ message: `Alert '${alert_type}' triggered successfully` });
});

router.post('/clear-alert', (req, res) => {
    broadcastEmergencyAlertClear();
    res.json({ message: 'Emergency alert cleared' });
  });

module.exports = router;
