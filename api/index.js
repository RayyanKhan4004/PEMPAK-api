// filepath: d:\Code Playground\Collaborate Work\PEMPAK-api\api\index.js
const express = require('express');
const authRoutes = require('../dist/routes/authRoutes').default;
const productRoutes = require('../dist/routes/productRoutes').default;
const blogRoutes = require('../dist/routes/blogRoutes').default;
const teamRoutes = require('../dist/routes/teamRoutes').default;
const { errorHandler } = require('../dist/middleware/errorHandler');
const { connectToDatabase } = require('../dist/db/connect');

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/teams', teamRoutes);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (_req, res) => {
  res.send('Express server is running (TypeScript)');
});

// Connect to database when the app starts
connectToDatabase().catch(console.error);

// Centralized error handler
app.use(errorHandler);

module.exports = app;