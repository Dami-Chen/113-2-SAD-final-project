const express = require('express');
const router = express.Router();
const pool = require('../db');
const queries = require('../sql/queries');

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
