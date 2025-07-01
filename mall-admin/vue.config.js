console.log('==== vue.config.js loaded ====');

module.exports = {
  devServer: {
    port: 8080,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 后端API服务地址
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      },
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  },
  lintOnSave: true
}; 