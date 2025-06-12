// app.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./TokenGenartionAndMangementSystem/routes/auth');
const tokenRoutes=require('./TokenGenartionAndMangementSystem/routes/tokenroutes')
const displayRoutes=require('./TokenGenartionAndMangementSystem/routes/display-token')
const inVentoryRoutes=require('../hospital-backend/InventorySyncManagementSystem/routes/updateStocks')
const MedicineRoutes=require('./InventorySyncManagementSystem/routes/getMedicines')
const EquipmentRoutes=require('./InventorySyncManagementSystem/routes/getEquipMent')
const AllInventoryRoutes=require('./InventorySyncManagementSystem/routes/getAllInventory')
const AlertRoutes=require('./HospitalAlertSystem/routes/alert')
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/tokens',tokenRoutes)
app.use('/display',displayRoutes)
app.use('/inventory',inVentoryRoutes,AllInventoryRoutes)
app.use('/getThe',MedicineRoutes,EquipmentRoutes)
app.use('/alert',AlertRoutes)
app.get('/', (req, res) => {
  res.send('Hospital Coordination Backend Running');
});

module.exports = app;
