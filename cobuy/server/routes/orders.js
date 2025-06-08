const express = require('express');
const router = express.Router();
const pool = require('../db');
const queries = require('../sql/queries');
const { notifyViaWebSocket } = require('../ws');

// 1. 取得訂單列表（含搜尋/標籤/分頁） → GET /api/orders
router.get('/', async (req, res) => {
  const { search = null, tag = null, page = 1, pageSize = 20 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(pageSize);
  const result = await pool.query(
    queries.getAllOrdersWithJoinedCount,
    [search, tag, pageSize, offset]
  );
  res.status(200).json(result.rows);
});

// 2. 熱門標籤 → GET /api/tags/popular
router.get('/tags/popular', async (req, res) => {
  const result = await pool.query(queries.getPopularTags);
  res.status(200).json(result.rows);
});

// 3. 單一訂單詳細 → GET /api/orders/:id
router.get('/:id', async (req, res) => {
  const result = await pool.query(queries.getOrderById, [req.params.id]);
  if (!result.rows.length) {
    return res.status(404).json({ error: '找不到此訂單' });
  }
  res.status(200).json(result.rows[0]);
});

// 4. 加入團購（+留言）→ POST /api/orders/:id/join
router.post('/:id/join', async (req, res) => {
  const { username, quantity, message } = req.body;
  const orderId = req.params.id;

  await pool.query(queries.joinOrder, [username, orderId, quantity]);

  if (message && message.trim() !== '') {
    await pool.query(queries.createComment, [orderId, username, message]);
  }

  const orderRes = await pool.query('SELECT stop_at_num, item_name FROM orders WHERE order_id = $1', [orderId]);
  const stopAtNum = orderRes.rows[0]?.stop_at_num;
  const itemName = orderRes.rows[0]?.item_name;

  const totalRes = await pool.query('SELECT SUM(quantity) AS total FROM joined_order WHERE order_id = $1', [orderId]);
  const total = Number(totalRes.rows[0]?.total) || 0;

  if (stopAtNum && total >= stopAtNum) {
    const participantsRes = await pool.query('SELECT username FROM joined_order WHERE order_id = $1', [orderId]);
    const usernames = participantsRes.rows.map(row => row.username);
    const messageText = `你參加的訂單「${itemName || orderId}」已結單！`;

    for (const uname of usernames) {
      await pool.query(
        `INSERT INTO notifications (recipient_username, title, message, order_id)
         VALUES ($1, $2, $3, $4)`,
        [uname, '有一筆新拼單結單', messageText, orderId]
      );
    }

    notifyViaWebSocket(usernames, {
      type: 'notification',
      notification: {
        title: '有一筆新拼單結單',
        message: messageText,
      }
    });
  }

  res.status(200).json({ status: 'ok' });
});

// 5. 留言 → GET /api/orders/:id/comments
router.get('/:id/comments', async (req, res) => {
  const result = await pool.query(queries.getCommentsByOrder, [req.params.id]);
  res.status(200).json(result.rows);
});

// 建立訂單
router.post('/', async (req, res) => {
  const {
    username,
    item_name,
    quantity,
    total_price,
    unit_price,
    image_url,
    information,
    share_method,
    share_location,
    stop_at_num,
    stop_at_date,
    comment,
    hashtag,
    pay_method,
    labels,
    delivery_time
  } = req.body;

  try {
    const result = await pool.query('SELECT MAX(order_id) AS max_id FROM orders');
    let maxId = parseInt(result.rows[0].max_id || '0', 10);
    const newOrderId = (maxId + 1).toString();

    await pool.query(queries.createOrder, [
      newOrderId,
      username,
      item_name,
      quantity,
      total_price,
      unit_price,
      image_url,
      information,
      share_method,
      share_location,
      stop_at_num,
      stop_at_date,
      comment,
      hashtag,
      pay_method,
      labels,
      delivery_time
    ]);
    res.status(201).json({ message: '開團成功' });
  } catch (err) {
    res.status(500).json({ error: '開團失敗', detail: err.message });
  }
});

// 查某訂單的參與者
router.get('/:id/participants', async (req, res) => {
  try {
    const result = await pool.query(queries.getParticipantsByOrder, [req.params.id]);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: '查詢參與者失敗', detail: err.message });
  }
});

// 查某訂單的拼單記錄
router.get('/:id/join-details', async (req, res) => {
  try {
    const result = await pool.query(queries.getOrderById, [req.params.id]);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: '查詢參與拼單失敗', detail: err.message });
  }
});

// 加入訂單
router.post('/:id/join', async (req, res) => {
  const { user_id, quantity } = req.body;
  const order_id = req.params.id;
  try {
    await pool.query(queries.joinOrder, [user_id, order_id, quantity]);

    // 查目前參加人數
    const { rows } = await pool.query(queries.getParticipantsByOrder, [order_id]);
    const participants = rows.map(r => r.username);

    // 查訂單上限
    const orderResult = await pool.query(queries.getOrderById, [order_id]);
    const limit = orderResult.rows[0].stop_at_num;

    if (participants.length >= limit) {
      const msg = `你參與的拼單已額滿！`;
      notifyViaWebSocket(participants, { type: 'GROUP_FULL', order_id });
      await sendOneSignalNotification(participants, msg);
    }

    res.status(201).json({ message: '已成功加入訂單' });
  } catch (err) {
    res.status(500).json({ error: '加入失敗', detail: err.message });
  }
});

module.exports = router;

