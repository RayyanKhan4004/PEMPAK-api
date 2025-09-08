// filepath: d:\Code Playground\Collaborate Work\PEMPAK-api\api\index.js
const app = require('../dist/server').default;

// Connect to database when the app starts
require('../dist/db/connect').connectToDatabase().catch(console.error);

module.exports = app;