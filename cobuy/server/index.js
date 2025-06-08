const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);

require('dotenv').config();

// 路由載入
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const reportRoutes = require('./routes/reports');
const notificationRoutes = require('./routes/notification');
const { initWebSocket } = require('./ws');

// 中介層
app.use(cors());
app.use(express.json());

// RESTful 路由掛載
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/abandon-reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);

// 初始化 WebSocket
initWebSocket(server);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
