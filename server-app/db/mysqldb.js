const mysql = require('mysql2')

const APP_CONFIG = require('../config/config')


const POOL = mysql.createPool({
  connectionLimit : 10,
  host            : APP_CONFIG.mariaDB.host,
  user            : APP_CONFIG.mariaDB.user,
  password        : APP_CONFIG.mariaDB.password,
  database        : APP_CONFIG.mariaDB.db_name,
  debug           : false,
})

exports.getPoolConnection = () => {
  return POOL.promise()
}
