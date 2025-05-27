const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const indexRoutes = require('./routes/index');
const notificationRoutes = require('./routes/notification');
const { initWebSocket } = require('./ws');

require('dotenv').config();

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', orderRoutes);
app.use('/api', userRoutes);
app.use('/api', indexRoutes);
app.use('/api', notificationRoutes);

initWebSocket(server); // 初始化 WebSocket

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});