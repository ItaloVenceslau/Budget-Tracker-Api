const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Importar rotas
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

app.use(cors());
app.use(cors({
  origin: [
    'https://budget-tracker-frontend.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// Rota de teste
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Budget Tracker API is running',
    timestamp: new Date().toISOString()
  });
});

// Rota 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.url}` 
  });
});

app.use(errorHandler);

module.exports = app;