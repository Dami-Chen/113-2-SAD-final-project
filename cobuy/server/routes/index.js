const express = require('express');
const router = express.Router();
const pool = require('../db');
const queries = require('../sql/queries');
const { notifyViaWebSocket } = require('../ws');

// 1. 取得商品/團購單（含搜尋/標籤/分頁）
router.get('/ordersdetail', async (req, res) => {
  const { search = null, tag = null, page = 1, pageSize = 20 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(pageSize);
  const result = await pool.query(
    queries.getAllOrdersWithFilter,
    [search, tag, pageSize, offset]
  );
  res.json(result.rows);
});

// 2. 熱門標籤
router.get('/tags', async (req, res) => {
  const result = await pool.query(queries.getPopularTags);
  res.json(result.rows);
});

// 3. 商品（團購單）詳細
router.get('/ordersdetail/:id', async (req, res) => {
  const result = await pool.query(queries.getOrderById, [req.params.id]);
  res.json(result.rows[0]);
});

// 4. 送出「參加團購」訂單（+留言）
// router.post('/orders/:id/join', async (req, res) => {
//   const { username, quantity, message } = req.body;
//   // 參加團購
//   await pool.query(queries.joinOrder, [username, req.params.id, quantity]);
//   // 留言（如果有填）
//   if (message && message.trim() !== '') {
//     await pool.query(queries.createComment, [req.params.id, username, message]);
//   }
//   res.json({ status: 'ok' });
// });

router.post('/orders/:id/join', async (req, res) => {
  const { username, quantity, message } = req.body;
  const orderId = req.params.id;

  // 參加團購
  await pool.query(queries.joinOrder, [username, orderId, quantity]);

  // 留言（如果有填）
  if (message && message.trim() !== '') {
    await pool.query(queries.createComment, [orderId, username, message]);
  }

  // 1. 取得上限
  const orderRes = await pool.query('SELECT stop_at_num, item_name FROM orders WHERE order_id = $1', [orderId]);
  const stopAtNum = orderRes.rows[0]?.stop_at_num;
  const itemName = orderRes.rows[0]?.item_name;

  // 2. 目前已加入總數
  const totalRes = await pool.query('SELECT SUM(quantity) AS total FROM joined_order WHERE order_id = $1', [orderId]);
  const total = Number(totalRes.rows[0]?.total) || 0;

  // 3. 達標則通知＋寫入通知中心
  if (stopAtNum && total >= stopAtNum) {
    // 查所有參加者
    const participantsRes = await pool.query('SELECT username FROM joined_order WHERE order_id = $1', [orderId]);
    const usernames = participantsRes.rows.map(row => row.username);
    const messageText = `你參加的訂單「${itemName || orderId}」已結單！`;

    // 通知中心（資料庫）
    for (const uname of usernames) {
      await pool.query(
        `INSERT INTO notifications (recipient_username, title, message, order_id)
        VALUES ($1, $2, $3, $4)`,
        [uname, '有一筆新拼單結單', messageText, orderId]
      );
    }

    // WebSocket 即時通知
    notifyViaWebSocket(usernames, {
      order_id: orderId,
      message: messageText,
    });
  }

  res.json({ status: 'ok' });
});


// 5. 取得商品留言
router.get('/orders/:id/comments', async (req, res) => {
  const result = await pool.query(queries.getCommentsByOrder, [req.params.id]);
  res.json(result.rows);
});

module.exports = router;
