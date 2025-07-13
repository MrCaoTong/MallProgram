const base = require('./config.base');
module.exports = {
  ...base,
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  uploadDir: 'uploads',
  apiBaseUrl: process.env.BASE_URL || 'http://localhost:3000',
  debug: true
}; 