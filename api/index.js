const serverless = require("serverless-http");
const app = require("../dist/server").default || require("../dist/server");
module.exports = serverless(app);
