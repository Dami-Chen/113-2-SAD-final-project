const express = require('express');
const router = express.Router();
const pool = require('../db');
const queries = require('../sql/queries');

// ✅ 登入：POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(queries.loginUser, [username, password]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: '帳號或密碼錯誤' });
    }
    res.status(200).json({ message: '登入成功', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: '登入失敗', detail: err.message });
  }
});

module.exports = router;
