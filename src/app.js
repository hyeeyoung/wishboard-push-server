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

app.listen(port, () => {
  logger.info(`Push Server start listening on port ${port} | ${nodeEnv}`);

  /** 앱 시작과 동시에 푸쉬알림 스케줄러 실행 */
  logger.info(SuccessMessage.notiSchedulerStart);
  schedule.scheduleJob("* * * * *", function () {
    schduleService.sendPushNotification();
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
