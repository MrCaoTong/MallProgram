console.log('==== vue.config.js loaded ====');

const apiUrl = process.env.VUE_APP_API_URL || 'http://localhost:4000';

module.exports = {
  devServer: {
    port: 8080,
    open: true,
    proxy: {
      '/api': {
        target: apiUrl, // 后端API服务地址
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      },
      '/uploads': {
        target: apiUrl,
        changeOrigin: true,
      }
    }
  },
  lintOnSave: true
}; 