// server/db.js
const path = require('path');
const { Pool } = require('pg');

// 如果是 test，就從專案根目錄的 .env.test 讀環境變數；否則讀 server/.env
const envPath = process.env.NODE_ENV === 'test'
  ? path.resolve(__dirname, '../.env.test')
  : path.resolve(__dirname, '.env');

require('dotenv').config({ path: envPath });

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_PUBLIC_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

// 只有非 test 時才自動 connect
if (process.env.NODE_ENV !== 'test') {
  pool.connect()
    .then(() => console.log("PostgreSQL connected"))
    .catch(err => console.error("PostgreSQL connection error:", err));
}

module.exports = pool;
