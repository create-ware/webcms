const mysql = require('mysql')
const migration = require('mysql-migrations')

const APP_CONFIG = require('./config/config')

/* NOTE: how to use

add new migration:
$node migration.js add migration user_add_user_id

run migration:
$node migration.js up --migrate-all

*/

const conn = mysql.createPool({
  connectionLimit : 10,
  host            : APP_CONFIG.mariaDB.host,
  user            : APP_CONFIG.mariaDB.user,
  password        : APP_CONFIG.mariaDB.password,
  database        : APP_CONFIG.mariaDB.db_name,
  debug           : false,
})
migration.init(conn, __dirname + '/migrations', () => {
  console.log('== webcms - migration : finished running migrations ==')
})
