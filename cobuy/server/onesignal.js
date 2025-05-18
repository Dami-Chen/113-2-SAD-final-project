const axios = require('axios');

async function sendOneSignalNotification(usernames, message) {
  if (!usernames.length) return;

  await axios.post('https://onesignal.com/api/v1/notifications', {
    app_id: process.env.ONESIGNAL_APP_ID,
    include_external_user_ids: usernames,
    contents: { en: message }
  }, {
    headers: {
      Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`,
      'Content-Type': 'application/json',
    }
  });
}

module.exports = { sendOneSignalNotification };
