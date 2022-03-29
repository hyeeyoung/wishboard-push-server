const mysql = require('mysql2/promise');
const logger = require('./winston');
require('dotenv').config({ path: '../.env' });

const TAG_SUCCESS = 'DB success create pool!!';
const TAG_PROTOCOL_CONNECTION_LOST = 'Database connection was closed.';
const TAG_ER_CON_COUNT_ERROR = 'Database has too many connections.';
const TAG_ECONNREFUSED = 'Database connection was refused.';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  connectionLimit: 50,
});

logger.info(TAG_SUCCESS);

module.exports = {
  connection: async function () {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      return connection;
    } catch (err) {
      switch (err.code) {
        case 'PROTOCOL_CONNECTION_LOST':
          logger.error(TAG_PROTOCOL_CONNECTION_LOST);
          break;
        case 'ER_CON_COUNT_ERROR':
          logger.error(TAG_ER_CON_COUNT_ERROR);
          break;
        case 'ECONNREFUSED':
          logger.error(TAG_ECONNREFUSED);
          break;
      }
    }
  },
  query: async function (query, ...args) {
    let rows;
    const connection = await this.connection(async (conn) => conn);

    if (!args) {
      rows = await connection.query(query);
    } else {
      rows = await connection.query(query, args);
    }
    connection.release();

    return rows;
  },
};
