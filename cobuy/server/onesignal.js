const axios = require('axios');

async function sendOneSignalNotification(usernames, message, data = {}) {
  if (!usernames.length) return;

  const payload = {
    app_id: process.env.ONESIGNAL_APP_ID,
    include_external_user_ids: usernames,
    contents: { en: message },
    headings: { en: '拼單通知' },
    data, // 可傳 order_id、type 等
  };

  await axios.post('https://onesignal.com/api/v1/notifications', payload, {
    headers: {
      Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
}

module.exports = { sendOneSignalNotification };
