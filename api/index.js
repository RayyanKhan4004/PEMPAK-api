const serverless = require("serverless-http");
const app = require("../dist/server").default;

// wrap your Express app so Vercel can run it as a serverless function
module.exports = serverless(app);
