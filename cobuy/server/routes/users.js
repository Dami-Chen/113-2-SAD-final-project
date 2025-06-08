const express = require('express');
const router = express.Router();
const pool = require('../db');
const queries = require('../sql/queries');

//////////////// ✅ 註冊：POST /api/users
router.post('/', async (req, res) => {
  const {
    username,
    nickname,
    real_name,
    password,
    email,
    school,
    student_id,
    dorm,
    score,
    phone,
  } = req.body;
  try {
    await pool.query(queries.createUser, [
      username,
      nickname,
      real_name,
      password,
      email,
      school,
      student_id,
      dorm,
      score,
      phone,
    ]);
    res.status(201).json({ message: '註冊成功' });
  } catch (err) {
    res.status(500).json({ error: '註冊失敗', detail: err.message });
  }
});

module.exports = router;

// 查詢用戶資料（給個人資料頁使用）
router.get('/profile/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await pool.query(queries.getUserById, [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到用戶' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: '查詢失敗', detail: err.message });
  }
});

module.exports = router;


/////////////////// 查使用者資訊
router.get('/:username', async (req, res) => {
  try {
    const result = await pool.query(queries.getUserProfile, [req.params.username]);
    if (!result.rows.length) return res.status(404).json({ error: '使用者不存在' });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: '查詢失敗', detail: err.message });
  }
});

// 更新使用者資訊
router.put('/:username', async (req, res) => {
  const { real_name, email, school, student_id, dorm } = req.body;
  try {
    await pool.query(queries.updateUserProfile, [
      req.params.username,
      real_name,
      email,
      school,
      student_id,
      dorm
    ]);
    res.status(200).json({ message: '更新成功' });
  } catch (err) {
    res.status(500).json({ error: '更新失敗', detail: err.message });
  }
});

// 查某使用者開的訂單（主揪）
router.get('/:username/orders', async (req, res) => {
  const username = req.params.username;
  const { type } = req.query;

  if (!username) return res.status(400).json({ error: '缺少 username' });

  try {
    const hostResult = await pool.query(queries.getOrdersByUser, [username]);
    const joinResult = await pool.query(queries.getOrdersJoinedByUser, [username]);

    const hostOrders = hostResult.rows.map(order => ({ ...order, order_type: 'host' }));
    const joinOrders = joinResult.rows.map(order => ({ ...order, order_type: 'join' }));

    let response = [];
    if (type === 'host') response = hostOrders; //查使用者開的團購單
    else if (type === 'join') response = joinOrders; //查使用者參加的訂單
    else response = [...hostOrders, ...joinOrders]; //查所有歷史訂單

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: '查詢失敗', detail: err.message });
  }
});

module.exports = router;
