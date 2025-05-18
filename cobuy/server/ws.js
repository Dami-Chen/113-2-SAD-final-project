const WebSocket = require('ws');

const sockets = new Map(); // username → WebSocket

function initWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    ws.on('message', (msg) => {
      try {
        const { username } = JSON.parse(msg);
        sockets.set(username, ws);
        ws.username = username;
      } catch (err) {
        console.error('Invalid message', err);
      }
    });

    ws.on('close', () => {
      if (ws.username) sockets.delete(ws.username);
    });
  });

  return wss;
}

function notifyViaWebSocket(usernames, payload) {
  usernames.forEach(username => {
    const ws = sockets.get(username);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
    }
  });
}

module.exports = { initWebSocket, notifyViaWebSocket };
