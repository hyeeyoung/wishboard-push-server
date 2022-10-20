const logger = require('../config/winston');
const { ErrorMessage } = require('../utils/response');
const Noti = require('../models/noti');
const { sendFcmTokenToFirebase } = require('../lib/pushAlarm');

module.exports = {
  /*
   * @params: sendPushNotification()
   * return 데이터가 있을 경우 firebase에 fcm 토큰 전송
   */
  sendPushNotification: async function () {
    await Noti.selectNotiFrom30minAgo()
      .then((notiList) => {
        sendFcmTokenToFirebase(notiList).catch(() => {
          logger.error(ErrorMessage.notiSendFailed);
        });
      })
      .catch((err) => logger.info(err));
  },
};
