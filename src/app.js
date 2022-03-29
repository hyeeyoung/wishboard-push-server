const express = require("express");
const app = express();
const helmet = require("helmet");
const hpp = require("hpp");
const morgan = require("morgan");
const logger = require('./config/winston');
require('dotenv').config({ path: '../.env' });
const port = process.env.PORT;
const nodeEnv = process.env.NODE_ENV;

const schedule = require('node-schedule');
const schduleService = require('./middleware/notiScheduler');

const handleErrors = require('./middleware/handleError');
const { NotFound } = require('./utils/errors');
const { ErrorMessage, SuccessMessage } = require('./utils/response');

/** 기본 설정 */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
app.use(hpp());

if (nodeEnv === "production") {
  morganFormat = "combined"; // Apache 표준
} else {
  morganFormat = "dev";
}
app.use(morgan(morganFormat, { stream: logger.stream }));

const isDisableKeepAlive = false;
app.use(function (req, res, next) {
  if (isDisableKeepAlive) {
    res.set('Connection', 'close');
  }
  next();
});

app.listen(port, () => {
  process.send('ready');
  logger.info(`[Push Server] on port ${port} | ${nodeEnv}`);

  /** 앱 시작과 동시에 푸쉬알림 스케줄러 실행 */
  logger.info(SuccessMessage.notiSchedulerStart);
  schedule.scheduleJob("0/30 * * * *", function () {
    schduleService.sendPushNotification();
  });
});

process.on('SIGINT', function () {
  isDisableKeepAlive = true;
  app.close(function () {
    logger.info('pm2 process closed');
    schedule.gracefulShutdown().then(() => process.exit(0));
    logger.info(SuccessMessage.notiSchedulerExit);
  });
});

/** router 설정 (확인용) */
// app.get('/', (req, res) => res.send('Welcome to WishBoard Push Server!!'));

/** 에러페이지 설정 */
app.use((req, res, next) => {
  throw new NotFound(ErrorMessage.ApiUrlIsInvalid);
});
app.use(handleErrors);

module.exports = app;
