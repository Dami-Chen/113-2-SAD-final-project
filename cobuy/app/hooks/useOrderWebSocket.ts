import { useEffect } from 'react';
import { Alert } from 'react-native';

const wsUrl = 'https://cobuy.up.railway.app'; // 改成你的後端 WebSocket URL

export default function useOrderWebSocket(username) {
  useEffect(() => {
    if (!username) return;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'auth', username }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'notification' && data.notification) {
          Alert.alert(
            data.notification.title || '新通知',
            data.notification.message || '你有新通知',
            [{ text: '知道了' }]
          );
        }
        // 你也可以根據其他 type 類型處理更多功能
      } catch {}
    };
    ws.onerror = (err) => {
      console.log('WebSocket error', err); // 不建議直接 Alert，可以只 log
    };
    ws.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      ws.close();
    };
  }, [username]);
}
