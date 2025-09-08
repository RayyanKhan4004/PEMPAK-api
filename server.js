const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
	res.status(200).json({ status: 'ok' });
});

// Root route
app.get('/', (req, res) => {
	res.send('Express server is running');
});

// Start server
app.listen(port, () => {
	console.log(`Server listening on http://localhost:${port}`);
});


