require('dotenv').config({ path: '../.env' });

const scheduleService = require('./middleware/notiScheduler');

async function main() {
  try {
    const now = new Date().toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
    });
    console.info(`>> GitHub Action - Push Notification Start. now: ${now}`);
    await scheduleService.sendPushNotification();
    console.info('>> GitHub Action - Push Notification Complete');
    process.exit(0);
  } catch (err) {
    console.error('>> Push Notification Error', err);
    process.exit(1);
  }
}

main();
