const base = require('./config.base');
module.exports = {
  ...base,
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'ROOT',
    database: process.env.DB_NAME || 'mall'
  },
  uploadDir: 'uploads',
  apiBaseUrl: process.env.BASE_URL || 'http://localhost:3000',
  debug: true
}; 