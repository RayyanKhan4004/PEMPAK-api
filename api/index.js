const serverModule = require("../dist/server");
const app = serverModule && serverModule.default ? serverModule.default : serverModule;
module.exports = app;