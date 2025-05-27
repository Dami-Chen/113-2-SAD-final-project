const express = require('express');
const router = express.Router();
const pool = require('../db');
const queries = require('../sql/queries');
const { sendOneSignalNotification } = require('../onesignal');
const { notifyViaWebSocket } = require('../ws');

// 開團
router.post('/orders', async (req, res) => {
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
    labels
  } = req.body;
  try {
    const result = await pool.query('SELECT MAX(order_id) AS max_id FROM orders');
    let maxIdStr = result.rows[0].max_id;
    // Convert string to int safely, fallback to 0 if null or invalid
    let maxId = 0;
    if (maxIdStr) {
      maxId = parseInt(maxIdStr, 10);
      if (isNaN(maxId)) maxId = 0;
    }
    const newOrderId = (maxId + 1).toString(); // convert back to string if needed


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
      labels
    ]);
    res.status(201).json({ message: '開團成功' });
  } catch (err) {
    res.status(500).json({ error: '開團失敗', detail: err.message });
  }
});
/*
// 查詢所有團購訂單
router.get('/orders', async (req, res) => {
  try {
    const result = await pool.query(queries.getAllOrders);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: '查詢失敗', detail: err.message });
  }
});*/


// 查詢單一訂單
router.get('/open_order', async (req, res) => {
  const { username } = req.query;
  try {
    const result = await pool.query(queries.getOrdersByUser, [username]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到訂單' });
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: '查詢失敗', detail: err.message });
  }
});


// 查詢使用者的所有訂單
router.get('/history_order', async (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ error: 'username' });
  }
  try {
    const hostResult = await pool.query(queries.getOrdersByUser, [username]);
    const joinResult = await pool.query(queries.getOrdersJoinedByUser, [username]);
   
    const hostOrders = hostResult.rows.map(order => ({
      ...order,
      order_type: 'host',
    }));


    const joinOrders = joinResult.rows.map(order => ({
      ...order,
      order_type: 'join',
    }));


    // 3. 合併後回傳
    const allOrders = [...hostOrders, ...joinOrders];
    res.status(200).json(allOrders);
  } catch (err) {
    console.error('❌ Error in /history_order:', err);
    res.status(500).json({ error: '查詢失敗', detail: err.message });
  }
});


// 查某使用者參與的所有拼單
router.get('/joined_order/:id', async (req, res) => {
  const order_id = req.params.id;
  try {
    const result = await pool.query(queries.getOrderById, [order_id]);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: '查詢參與拼單失敗', detail: err.message });
  }
});


// 查某訂單的所有參與者
router.get('/orders/:id', async (req, res) => {
  const order_id = req.params.id;
  try {
    const result = await pool.query(queries.getParticipantsByOrder, [order_id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: '查詢參與者失敗', detail: err.message });
  }
});


// 查某訂單的單主
router.get('/order_host', async (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ error: '缺少 username' });
  }
  try {
    const result = await pool.query(queries.getUserProfile, [username]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: '查詢失敗', detail: err.message });
  }
});


// 修改個人資訊
router.post('/updateUserInfo', async (req, res) => {
  const {
    username,
    real_name,
    email,
    school,
    student_id,
    dorm,
  } = req.body;
 
  try {
    await pool.query(queries.updateUserProfile, [
      username,
      real_name,
      email,
      school,
      student_id,
      dorm,
    ]);
    res.json({ success: true, message: '更新成功' });
  } catch (err) {
    console.error("❌ updateUserInfo error:", err);
    res.status(500).json({ error: '更新失敗', detail: err.message });
  }
});

// 加入訂單
router.post('/join', async (req, res) => {
  const { order_id, user_id, quantity } = req.body;
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

// 棄單
router.post('/abandonReport', async (req, res) => {
  const {
    reporter_username,
    target_username,
    order_id,
    reason,
    reported_at,
    status
  } = req.body;

  try {
    const result = await pool.query(queries.insertAbandonReport, [
    reporter_username,
    target_username,
    order_id,
    reason,
    reported_at,
    status
    ]);

    res.status(200).json({ message: '報告成功送出', data: result.rows[0] });
  } catch (error) {
      console.error('❌ 棄單報告失敗:', error.stack); // 印出堆疊，看到是哪裡錯
      res.status(500).json({ error: '伺服器錯誤：' + error.message });
  }
});

module.exports = router;