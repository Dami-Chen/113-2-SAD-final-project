const express = require('express');
const router = express.Router();
const pool = require('./db');
const queries = require('./queries');

// 1. 取得商品/團購單（含搜尋/標籤/分頁）
router.get('/orders', async (req, res) => {
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
router.get('/orders/:id', async (req, res) => {
  const result = await pool.query(queries.getOrderById, [req.params.id]);
  res.json(result.rows[0]);
});

// 4. 送出「參加團購」訂單（+留言）
router.post('/orders/:id/join', async (req, res) => {
  const { username, quantity, message } = req.body;
  // 參加團購
  await pool.query(queries.joinOrder, [username, req.params.id, quantity]);
  // 留言（如果有填）
  if (message && message.trim() !== '') {
    await pool.query(queries.createComment, [req.params.id, username, message]);
  }
  res.json({ status: 'ok' });
});

// 5. 取得商品留言
router.get('/orders/:id/comments', async (req, res) => {
  const result = await pool.query(queries.getCommentsByOrder, [req.params.id]);
  res.json(result.rows);
});

module.exports = router;
