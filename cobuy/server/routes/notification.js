const express = require('express');
const router = express.Router();
const pool = require('../db');

// 取得所有通知（可加 JWT 認證，這裡先用 query）
router.get('/', async (req, res) => {
  const username = req.query.username;
  if (!username) return res.status(400).json({ error: '缺少 username' });

  try {
    const result = await pool.query(
      `SELECT * FROM notifications WHERE recipient_username = $1 ORDER BY created_at DESC`,
      [username]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: '查詢失敗', detail: err.message });
  }
});

// 取得未讀通知數
router.get('/unread-count', async (req, res) => {
  const username = req.query.username;
  if (!username) return res.status(400).json({ error: '缺少 username' });

  try {
    const result = await pool.query(
      `SELECT COUNT(*) FROM notifications WHERE recipient_username = $1 AND is_read = FALSE`,
      [username]
    );
    res.status(200).json({ count: parseInt(result.rows[0].count, 10) });
  } catch (err) {
    res.status(500).json({ error: '查詢失敗', detail: err.message });
  }
});

// 將單一通知標記為已讀
router.patch('/:id/read', async (req, res) => {
  const id = req.params.id;
  const username = req.body.username;
  if (!username) return res.status(400).json({ error: '缺少 username' });

  try {
    await pool.query(
      `UPDATE notifications SET is_read = TRUE WHERE notification_id = $1 AND recipient_username = $2`,
      [id, username]
    );
    res.status(200).json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ error: '更新失敗', detail: err.message });
  }
});

module.exports = router;
