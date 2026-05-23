const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const { authenticateToken } = require('./middleware/auth');
const authController = require('./controllers/authController');
const crudController = require('./controllers/crudController');
const dashboardController = require('./controllers/dashboardController');
const seedData = require('./config/seeder');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Base Route
app.get('/', (req, res) => {
  res.json({ message: 'Mirësevini në API-në e Sistemit për Menaxhimin e Kompanisë së Ndërtimit.' });
});

// Authentication Routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.post('/api/auth/refresh', authController.refresh);
app.post('/api/auth/logout', authController.logout);
app.get('/api/auth/me', authenticateToken, authController.me);

// Dashboard Statistics Route
app.get('/api/dashboard/stats', authenticateToken, dashboardController.getStats);

// Generic CRUD Routes
app.get('/api/crud/:entity', authenticateToken, crudController.list);
app.get('/api/crud/:entity/:id', authenticateToken, crudController.getOne);
app.post('/api/crud/:entity', authenticateToken, crudController.create);
app.put('/api/crud/:entity/:id', authenticateToken, crudController.update);
app.delete('/api/crud/:entity/:id', authenticateToken, crudController.delete);

// Database Sync and Server Boot
const startServer = async () => {
  try {
    // Authenticate database connection
    await sequelize.authenticate();
    console.log('✔ Lidhja me databazën MySQL u realizua me sukses.');

    // Sync models (force: false, alter: true to automatically update tables if models change)
    await sequelize.sync({ force: false, alter: true });
    console.log('✔ Tabela e modeleve u sinkronizua në databazë.');

    // Seed mock data
    await seedData();

    app.listen(PORT, () => {
      console.log(`🚀 Serveri është duke ecur në portin ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Dështoi lidhja ose sinkronizimi me databazën:', error);
    process.exit(1);
  }
};

startServer();
