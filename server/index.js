const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { connectDB } = require('./models');
const authRoutes = require('./routes/auth');
const { authenticateToken } = require('./middleware/auth');
const productRoutes = require('./routes/products');
const savedPaintsRoutes = require('./routes/savedPaints');
const paintTypesRoutes = require('./routes/paintTypes');
const chemicalRoutes = require('./routes/chemicals');
const branchRoutes = require('./routes/branches');
const receivingRoutes = require('./routes/receiving');
const transferRoutes = require('./routes/transfers');
const salesRoutes = require('./routes/sales');
const inventoryRoutes = require('./routes/inventory');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
connectDB();

// Public Routes (No auth required)
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Protected Routes (Auth required)
app.use('/api/products', authenticateToken, productRoutes);
app.use('/api/saved-paints', authenticateToken, savedPaintsRoutes);
app.use('/api/paint-types', authenticateToken, paintTypesRoutes);
app.use('/api/chemicals', authenticateToken, chemicalRoutes);
app.use('/api/branches', authenticateToken, branchRoutes);
app.use('/api/receiving', authenticateToken, receivingRoutes);
app.use('/api/transfers', authenticateToken, transferRoutes);
app.use('/api/sales', authenticateToken, salesRoutes);
app.use('/api/inventory', authenticateToken, inventoryRoutes);

const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'API route not found' });
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
