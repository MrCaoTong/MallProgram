module.exports = {
  apps: [
    {
      name: 'mall-server',
      script: 'app.js',
      watch: true,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}; 