const ENV = 'development'; // 或 'production'

const config = {
  development: {
    apiBaseUrl: 'http://192.168.2.56:4000/api',
    uploadUrl: 'http://192.168.2.56:4000/uploads/'
  },
  production: {
    apiBaseUrl: 'https://www.ctdevelopment.cn/api',
    uploadUrl: 'https://www.ctdevelopment.cn/uploads/'
  }
};

module.exports = config[ENV]; 