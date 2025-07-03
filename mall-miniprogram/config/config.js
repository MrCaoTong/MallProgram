const ENV = 'development'; // 或 'production'

const config = {
  development: {
    apiBaseUrl: 'http://localhost:4000/api',
    uploadUrl: 'http://localhost:4000/uploads/'
  },
  production: {
    apiBaseUrl: 'https://mall-server.guoxu.tech/api',
    uploadUrl: 'https://mall-server.guoxu.tech/uploads/'
  }
};

module.exports = config[ENV]; 