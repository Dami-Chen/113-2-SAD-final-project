const express = require('express');
const router = express.Router();
const pool = require('../db');
const queries = require('../sql/queries');
const multer = require('multer');
const path = require('path');
const { sendOneSignalNotification } = require('../onesignal');
const { notifyViaWebSocket } = require('../ws');


// 開團
router.post('/orders', async (req, res) => {
  const { title, description, creator_id, limit_count, deadline } = req.body;
  try {
    await pool.query(queries.createOrder, [title, description, creator_id, limit_count, deadline]);
    res.status(201).json({ message: '開團成功' });
  } catch (err) {
    res.status(500).json({ error: '開團失敗', detail: err.message });
  }
});

// 查詢所有團購訂單
router.get('/orders', async (req, res) => {
  try {
    const result = await pool.query(queries.getAllOrders);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: '查詢失敗', detail: err.message });
  }
});

// 查詢單一訂單
router.get('/orders/:id', async (req, res) => {
  const orderId = req.params.id;
  try {
    const result = await pool.query(queries.getOrderById, [orderId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: '找不到訂單' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: '查詢失敗', detail: err.message });
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

// 查某訂單的所有參與者
router.get('/orders/:id/participants', async (req, res) => {
  const orderId = req.params.id;
  try {
    const result = await pool.query(queries.getParticipantsByOrder, [orderId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: '查詢參與者失敗', detail: err.message });
  }
});

// 圖片本地儲存位置與命名
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 確保這個資料夾存在
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// 上傳圖片
router.post('/upload', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '未收到圖片' });
  }

  const filename = req.file.filename;
  const filepath = `/uploads/${filename}`;

  res.status(201).json({
    message: '圖片上傳成功',
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
  });
});

module.exports = router;
