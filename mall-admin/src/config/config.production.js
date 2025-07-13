const base = require('./config.base')

module.exports = {
  ...base,
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    cluster: true,
  },
  fileUpload: 'cloud',
  logLevel: 'debug',
  apiUrl: 'https://www.ctdevelopment.cn',
  debug: false,
} 