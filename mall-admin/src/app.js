const config = require('./config')
const express = require('express')
const app = express()

console.log('当前环境:', process.env.NODE_ENV)
console.log('API地址:', config.apiUrl)

// 安全输出数据库配置，隐藏密码
const safeDbConfig = {
  ...config.database,
  password: config.database.password ? '*'.repeat(6) : undefined
}
console.log('数据库配置:', safeDbConfig)
console.log('说明：3000为服务监听端口，3306为数据库端口')

// 示例接口
app.get('/', (req, res) => {
  res.send('商城后台服务已启动，当前环境：' + process.env.NODE_ENV)
})

// 启动服务
app.listen(config.port, () => {
  console.log(`服务已启动，监听端口 ${config.port}`)
})

// 这里可以继续初始化 express/koa 等服务
// const express = require('express')
// const app = express()
// app.set('port', config.port)
// ... 