const StatusCode = {
  OK: 200,
  CREATED: 201,
  NOCONTENT: 204,
  BADREQUEST: 400,
  UNAUTHORIZED: 401,
  NOTFOUND: 404,
  CONFLICT: 409,
};

const SuccessMessage = {
  notiFCMSend: '알림 전송 성공',
  
  notiPushServiceStart: '푸쉬 알림 서비스 시작',
  notiPushServiceExit: '푸쉬 알림 서비스 종료',
  notiSchedulerStart: '푸쉬 알림 스케줄러 동작',
  notiSchedulerExit: '푸쉬 알림 스케줄러 종료',
};

const ErrorMessage = {
  /* 알림*/
  notiTodayNotFound: '오늘 날짜 기준, 30분 후 예정된 알림 정보 없음',
  notiFCMSendError: 'FCM 토큰 에러. 토큰이 없거나 잘못된 경우',
  notiSendFailed: 'Firebase FCM server로 전송 실패',
  notiSchedulerERROR: '푸쉬 알림 스케줄러 동작 실패',

  /* 공통*/
  BadRequestMeg: '잘못된 요청',
  ApiUrlIsInvalid: '잘못된 경로',
};

module.exports = { StatusCode, SuccessMessage, ErrorMessage };
