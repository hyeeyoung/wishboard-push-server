const { firebaseAdmin } = require('../config/firebaseAdmin');
const logger = require('../config/winston');
const { SuccessMessage, ErrorMessage } = require('../utils/response');
const Strings = require('../utils/strings');
const Slack = require('../lib/slack');

const sendFcmTokenToFirebase = async (message) => {
  try {
    const messages = [];
    Object.keys(notiList).forEach((token) => {
      const numOfNotiItems = notiList[token].length;
      const message = {
        notification: {
          title: Strings.notiMessageTitle,
          body: '',
        },
        android: {
          data: {
            title: Strings.notiMessageTitle,
            body: '',
          },
        },
        apns: {
          payload: {
            aps: {
              alert: {
                title: Strings.notiMessageTitle,
                body: '',
              },
            },
          },
        },
        token: '',
      };
      if (numOfNotiItems === 1) {
        message.notification.body = `${Strings.after30minutes} ${notiList[token][0].notiType} ${Strings.notiMessageDescription}`;
        message.android.data.body = `${Strings.after30minutes} ${notiList[token][0].notiType} ${Strings.notiMessageDescription}`;
        message.apns.payload.aps.alert.body = `${Strings.after30minutes} ${notiList[token][0].notiType} ${Strings.notiMessageDescription}`;
      } else {
        message.notification.body = `${Strings.after30minutes} ${notiList[token][0].notiType} ${Strings.notiMessageDescription}`;
        message.android.data.body = `${Strings.after30minutes} ${notiList[token][0].notiType} 외 ${numOfNotiItems}개의 ${Strings.notiMessageCountDescription}`;
        message.apns.payload.aps.alert.body = `${Strings.after30minutes} ${notiList[token][0].notiType} 외 ${numOfNotiItems}개의 ${Strings.notiMessageCountDescription}`;
      }
      message.token = token;
      messages.push(message);
    });

    const response = await firebaseAdmin.messaging().sendAll(message);
    logger.info(SuccessMessage.notiFCMSend);
    Slack.sendMessage({
      color: Slack.Colors.info,
      title: '푸쉬 알림 성공 여부 Responses',
      text: `\`\`\`${JSON.stringify(response)}\`\`\``,
    });
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
      logger.info(`${SuccessMessage.notiFCMSend}`);
      Slack.sendMessage({
        color: Slack.Colors.warning,
        title: '푸쉬 알림 실패에 따른 재전송 성공 여부 Responses',
        text: `\`\`\`${JSON.stringify(reResponse)}\`\`\``,
      });
    }
    return true;
  } catch (e) {
    const firebaseError = { err: e };
    if (firebaseError.err.code == 'messaging/invalid-payload') {
      logger.error(ErrorMessage.notiFCMSendError);
      Slack.sendMessage({
        color: Slack.Colors.danger,
        title: `${ErrorMessage.notiFCMSendError}`,
      });
    } else {
      logger.error(e);
      Slack.sendMessage({
        color: Slack.Colors.danger,
        title: 'Firebase FCM Server 에러',
        fields: [
          {
            title: 'Error Stack:',
            value: `\`\`\`${e}\`\`\``,
          },
        ],
      });
    }
    return false;
  }
};

module.exports = {
  sendFcmTokenToFirebase,
};
