const { firebaseAdmin } = require('../config/firebaseAdmin');
const logger = require('../config/winston');
const { SuccessMessage, ErrorMessage } = require('../utils/response');
const Noti = require('../models/noti');
const { Strings } = require('../utils/strings');
const { NotiType } = require('../utils/notiType');

async function sendFcmTokenToFirebase(message) {
  try {
    const response = await firebaseAdmin.messaging().sendAll(message);
    logger.info(SuccessMessage.notiFCMSend);
    logger.info(response); //* 추후 삭제
    // failureCount 존재 시 예외처리
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(message[idx]);
        }
      });
      // 실패 토큰에 한하여 재전송
      const reResponse = await firebaseAdmin.messaging().sendAll(failedTokens);
      logger.info(`${SuccessMessage.notiFCMSend}: ${reResponse}`);
      logger.info(reResponse); //* 추후 삭제
    }
    return true;
  } catch (e) {
    const firebaseError = { err: e };
    if (firebaseError.err.code == 'messaging/invalid-payload') {
      logger.error(ErrorMessage.notiFCMSendError);
    } else {
      logger.error(e);
    }
    return false;
  }
}

module.exports = {
  /*
   * @params: sendPushNotification()
   * return 데이터가 있을 경우 firebase에 fcm 토큰 전송
   */
  sendPushNotification: async function () {
    await Noti.selectNotiFrom30minAgo()
      .then((notiList) => {
        const messages = [];
        Object.keys(notiList).forEach((token) => {
          const numOfNotiItems = notiList[token].length;
          const message = {
            notification: {
              title: Strings.notiMessageTitle,
              body: '',
            },
            token: '',
          };
          if (numOfNotiItems === 1) {
            message.notification.body = `${Strings.after30minutes} ${
              NotiType[notiList[token][0].notiType]
            } ${Strings.notiMessageDescription}`;
          } else {
            message.notification.body = `${Strings.after30minutes} ${
              NotiType[notiList[token][0].notiType]
            } 외 ${numOfNotiItems}개의 ${Strings.notiMessageCountDescription}`;
          }
          message.token = token;
          messages.push(message);
        });
        sendFcmTokenToFirebase(messages).catch(() => {
          logger.error(ErrorMessage.notiSendFailed);
        });
      })
      .catch((err) => logger.info(err));
  },
};
