const db = require('../config/db');
const { NotFound } = require('../utils/errors');
const { ErrorMessage } = require('../utils/response');
const { generateNotiItem } = require('../dto/notiItem');

module.exports = {
  selectNotiFrom30minAgo: async function () {
    const sqlSelect = `SELECT n.item_notification_type, n.user_id, u.fcm_token FROM notifications n
    INNER JOIN users u ON n.user_id = u.user_id
    WHERE TO_SECONDS(n.item_notification_date) = (TO_SECONDS(NOW()) + 1800)
    AND u.push_state = true`;

    const [rows] = await db.query(sqlSelect);

    if (Array.isArray(rows) && !rows.length) {
      throw new NotFound(ErrorMessage.notiTodayNotFound);
    }

    const notiList = generateNotiItem(rows);
    return notiList;
  },
};
