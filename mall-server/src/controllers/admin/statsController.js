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
    const [rows] = await pool.query(`
      SELECT DATE(created_at) as date, IFNULL(SUM(total_amount),0) as sales
      FROM \`order\`
      WHERE status IN (1,2,3) AND created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);
    // 补全日期
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const found = rows.find(r => r.date === dateStr);
      result.push({ date: dateStr, sales: found ? Number(found.sales) : 0 });
    }
    res.json({ code: 200, message: '获取成功', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: '服务器错误' });
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

// 首页汇总统计
exports.getSummary = async (req, res) => {
  try {
    const [[{ goodsCount }]] = await pool.query('SELECT COUNT(*) as goodsCount FROM goods');
    const [[{ categoryCount }]] = await pool.query('SELECT COUNT(*) as categoryCount FROM category');
    const [[{ orderCount }]] = await pool.query('SELECT COUNT(*) as orderCount FROM `order`');
    const [[{ totalSales }]] = await pool.query('SELECT IFNULL(SUM(total_amount),0) as totalSales FROM `order` WHERE status IN (1,2,3)');
    const [[{ todayOrderCount }]] = await pool.query('SELECT COUNT(*) as todayOrderCount FROM `order` WHERE DATE(created_at) = CURDATE()');
    const [[{ todaySales }]] = await pool.query('SELECT IFNULL(SUM(total_amount),0) as todaySales FROM `order` WHERE status IN (1,2,3) AND DATE(created_at) = CURDATE()');
    res.json({
      code: 200,
      message: '汇总数据获取成功',
      data: {
        goodsCount,
        categoryCount,
        orderCount,
        totalSales,
        todayOrderCount,
        todaySales
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

// 近7天订单趋势
exports.getOrderTrend = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM \`order\`
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);
    // 补全日期
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const found = rows.find(r => r.date === dateStr);
      result.push({ date: dateStr, count: found ? Number(found.count) : 0 });
    }
    res.json({ code: 200, message: '获取成功', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

// 首页仪表盘接口
exports.getDashboard = async (req, res) => {
  try {
    // 今日、周、月销售额
    const [[{ todaySales }]] = await pool.query(
      "SELECT IFNULL(SUM(total_amount),0) as todaySales FROM `order` WHERE status IN (1,2,3) AND DATE(created_at) = CURDATE()"
    );
    const [[{ weekSales }]] = await pool.query(
      "SELECT IFNULL(SUM(total_amount),0) as weekSales FROM `order` WHERE status IN (1,2,3) AND YEARWEEK(DATE(created_at),1) = YEARWEEK(CURDATE(),1)"
    );
    const [[{ monthSales }]] = await pool.query(
      "SELECT IFNULL(SUM(total_amount),0) as monthSales FROM `order` WHERE status IN (1,2,3) AND DATE_FORMAT(created_at, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')"
    );
    // 订单统计
    const [[{ pendingPay }]] = await pool.query("SELECT COUNT(*) as pendingPay FROM `order` WHERE status=0");
    const [[{ pendingShip }]] = await pool.query("SELECT COUNT(*) as pendingShip FROM `order` WHERE status=1");
    const [[{ shipped }]] = await pool.query("SELECT COUNT(*) as shipped FROM `order` WHERE status=2");
    const [[{ finished }]] = await pool.query("SELECT COUNT(*) as finished FROM `order` WHERE status=3");
    // 热销商品TOP5
    const [hotGoods] = await pool.query(`
      SELECT g.name, SUM(og.quantity) as sales
      FROM order_goods og
      LEFT JOIN goods g ON og.goods_id = g.id
      LEFT JOIN \`order\` o ON og.order_id = o.id
      WHERE o.status IN (1,2,3)
      GROUP BY og.goods_id
      ORDER BY sales DESC
      LIMIT 5
    `);
    res.json({
      code: 200,
      message: '仪表盘数据获取成功',
      data: {
        todaySales,
        weekSales,
        monthSales,
        orderStats: {
          pendingPay,
          pendingShip,
          shipped,
          finished
        },
        hotGoods
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
}; 