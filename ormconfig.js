// ormconfig.js
require('ts-node/register');
const { AppDataSource } = require('./dist/infrastructure/config/database.config');

module.exports = AppDataSource;
