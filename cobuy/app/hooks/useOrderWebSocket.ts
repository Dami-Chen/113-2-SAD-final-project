import { useEffect } from 'react';
import { Alert } from 'react-native';

export default function useOrderWebSocket(username: string) {
  useEffect(() => {
    if (!username) return;

    const socket = new WebSocket('wss://你的後端網址'); // 換成你的 Railway 網域

    socket.onopen = () => {
      socket.send(JSON.stringify({ username }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'GROUP_FULL') {
          Alert.alert('拼單已滿', '你參與的拼單已額滿，請立即付款！');
        }
      } catch (err) {
        console.warn('無法解析 WebSocket 資料:', err);
      }
    };

    return () => {
      socket.close();
    };
  }, [username]);
}
