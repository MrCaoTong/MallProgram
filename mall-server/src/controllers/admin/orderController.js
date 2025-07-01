const pool = require('../../config/db');

// 获取订单列表（支持分页和搜索）
exports.getOrderList = async (req, res) => {
    const { page = 1, limit = 10, order_no, status, date_range } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (order_no) {
        whereClause += ' AND o.order_no LIKE ?';
        params.push(`%${order_no}%`);
    }
    if (status !== '' && status !== undefined) {
        whereClause += ' AND o.status = ?';
        params.push(status);
    }
    if (date_range && date_range.length === 2) {
        whereClause += ' AND o.created_at BETWEEN ? AND ?';
        params.push(date_range[0], date_range[1]);
    }

    try {
        const countSql = `SELECT COUNT(*) as total FROM \`order\` o ${whereClause}`;
        const [totalRows] = await pool.query(countSql, params);
        const total = totalRows[0].total;

        const sql = `
            SELECT 
                o.id, o.order_no, o.status, o.total_amount, o.created_at,
                u.nickname as user_nickname,
                a.receiver, a.phone, a.province, a.city, a.district, a.detail
            FROM \`order\` o
            LEFT JOIN user u ON o.user_id = u.id
            LEFT JOIN address a ON o.address_id = a.id
            ${whereClause}
            ORDER BY o.id DESC
            LIMIT ? OFFSET ?
        `;
        const [rows] = await pool.query(sql, [...params, parseInt(limit), parseInt(offset)]);

        res.json({
            code: 200,
            message: '获取成功',
            data: {
                items: rows,
                total: total
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 500, message: '服务器错误' });
    }
};

// 获取订单详情
exports.getOrderDetail = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ code: 400, message: '缺少订单ID' });
    }

    try {
        // 获取订单主信息
        const orderSql = `
            SELECT 
                o.*, u.nickname as user_nickname,
                a.receiver, a.phone, a.province, a.city, a.district, a.detail
            FROM \`order\` o
            LEFT JOIN user u ON o.user_id = u.id
            LEFT JOIN address a ON o.address_id = a.id
            WHERE o.id = ?
        `;
        const [orderRows] = await pool.query(orderSql, [id]);

        if (orderRows.length === 0) {
            return res.status(404).json({ code: 404, message: '订单不存在' });
        }

        // 获取订单商品信息
        const goodsSql = 'SELECT * FROM order_goods WHERE order_id = ?';
        const [goodsRows] = await pool.query(goodsSql, [id]);

        const orderDetail = {
            ...orderRows[0],
            goods: goodsRows
        };

        res.json({ code: 200, message: '获取成功', data: orderDetail });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 500, message: '服务器错误' });
    }
};

// 订单发货
exports.shipOrder = async (req, res) => {
    const { id } = req.body;
    // 在实际项目中，这里可能还需要接收物流公司和物流单号
    // const { id, logistics_company, tracking_number } = req.body;
    try {
        // 订单状态: 0待支付 1已支付 2已发货 3已完成 4已取消
        await pool.query('UPDATE \`order\` SET status = 2 WHERE id = ? AND status = 1', [id]);
        res.json({ code: 200, message: '发货成功' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 500, message: '服务器错误' });
    }
}; 