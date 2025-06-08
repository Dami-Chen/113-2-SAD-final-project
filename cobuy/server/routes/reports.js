const express = require('express');
const router = express.Router();
const pool = require('../db');
const queries = require('../sql/queries');

// POST /api/abandon-reports
router.post('/', async (req, res) => {
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
      reporter_username, target_username, order_id, reason, reported_at, status
    ]);
    res.status(200).json({ message: '報告成功送出', data: result.rows[0] });
  } catch (error) {
    console.error('❌ 棄單報告失敗:', error.stack);
    res.status(500).json({ error: '伺服器錯誤：' + error.message });
  }
});

module.exports = router;
