const pool = require('../../config/db');

// 销售统计（今日、本周、本月销售额）
exports.getSalesStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [todaySales] = await pool.query("SELECT SUM(total_amount) as sales FROM \`order\` WHERE status IN (1,2,3) AND created_at >= ?", [today]);
    const [weekSales] = await pool.query("SELECT SUM(total_amount) as sales FROM \`order\` WHERE status IN (1,2,3) AND created_at >= ?", [startOfWeek]);
    const [monthSales] = await pool.query("SELECT SUM(total_amount) as sales FROM \`order\` WHERE status IN (1,2,3) AND created_at >= ?", [startOfMonth]);

    res.json({
      code: 200,
      data: {
        today: todaySales[0].sales || 0,
        week: weekSales[0].sales || 0,
        month: monthSales[0].sales || 0,
      }
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
};

// 销售趋势（例如：近7日销售额）
exports.getSalesTrend = async (req, res) => {
    try {
      const results = await pool.query(`
        SELECT DATE(created_at) as date, SUM(total_amount) as sales
        FROM \`order\`
        WHERE created_at >= CURDATE() - INTERVAL 7 DAY AND status IN (1,2,3)
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `);
      res.json({ code: 200, data: results[0] });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
    }
  };

// 热销商品排行
exports.getHotGoods = async (req, res) => {
    try {
      const results = await pool.query(`
        SELECT g.name, SUM(og.quantity) as total_quantity
        FROM order_goods og
        JOIN goods g ON og.goods_id = g.id
        GROUP BY og.goods_id
        ORDER BY total_quantity DESC
        LIMIT 10
      `);
      res.json({ code: 200, data: results[0] });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
    }
  };

// 订单统计（各状态订单数量）
exports.getOrderStats = async (req, res) => {
    try {
      const results = await pool.query(`
        SELECT status, COUNT(*) as count
        FROM \`order\`
        GROUP BY status
      `);
      res.json({ code: 200, data: results[0] });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
    }
  };

// 转化率统计
exports.getConversionStats = async (req, res) => {
  try {
    // 总注册用户数
    const [userRows] = await pool.query("SELECT COUNT(*) as total_users FROM user");
    // 有下单的用户数
    const [orderRows] = await pool.query("SELECT COUNT(DISTINCT user_id) as order_users FROM `order`");
    // 有支付的用户数
    const [payRows] = await pool.query("SELECT COUNT(DISTINCT user_id) as pay_users FROM `order` WHERE status IN (1,2,3)");

    const totalUsers = userRows[0].total_users || 0;
    const orderUsers = orderRows[0].order_users || 0;
    const payUsers = payRows[0].pay_users || 0;

    res.json({
      code: 200,
      data: {
        totalUsers,
        orderUsers,
        payUsers,
        orderConversion: totalUsers ? (orderUsers / totalUsers * 100).toFixed(2) : '0.00',
        payConversion: orderUsers ? (payUsers / orderUsers * 100).toFixed(2) : '0.00'
      }
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
}; 