const base = require('./config.base')

module.exports = {
  ...base,
  database: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: process.env.DB_PASSWORD || 'ROOT',
    database: 'mall',
  },
  fileUpload: 'local',
  logLevel: 'debug',
  apiUrl: 'http://localhost:4000',
  debug: true,
} 