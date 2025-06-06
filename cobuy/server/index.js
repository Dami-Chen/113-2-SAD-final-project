// index.js
const http = require('http');
const app = require('./app');
const { initWebSocket } = require('./ws');

const server = http.createServer(app);

initWebSocket(server); // 初始化 WebSocket

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = server; // 如果需要給外部（測試）用，可以選擇 export server
