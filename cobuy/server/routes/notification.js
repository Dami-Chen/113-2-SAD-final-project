const express = require('express');
const router = express.Router();
const pool = require('../db'); // 你的 db 連線

// 取得目前用戶的全部通知（建議加 JWT middleware, 這裡用 req.user.username）
router.get('/notifications', async (req, res) => {
  // 假設有驗證，從 req.user 拿 username，否則用 query 參數
  // const username = req.user.username;
  const username = req.query.username; // DEMO 可先這樣
  if (!username) return res.status(400).json({ error: '缺少 username' });

  const result = await pool.query(
    `SELECT * FROM notifications WHERE recipient_username = $1 ORDER BY created_at DESC`,
    [username]
  );
  res.json(result.rows);
});

// 取得未讀通知數量
router.get('/notifications/unread/count', async (req, res) => {
  const username = req.query.username;
  if (!username) return res.status(400).json({ error: '缺少 username' });

  const result = await pool.query(
    `SELECT COUNT(*) FROM notifications WHERE recipient_username = $1 AND is_read = FALSE`,
    [username]
  );
  res.json({ count: parseInt(result.rows[0].count, 10) });
});

// 設定單一通知為已讀
router.post('/notifications/:id/read', async (req, res) => {
  const id = req.params.id;
  const username = req.body.username; // 或 req.user.username
  await pool.query(
    `UPDATE notifications SET is_read = TRUE WHERE notification_id = $1 AND recipient_username = $2`,
    [id, username]
  );
  res.json({ status: 'ok' });
});

module.exports = router;