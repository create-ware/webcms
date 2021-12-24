const mysqldb = require('../../db/mysqldb')


const getRecords = async () => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let [rows, fields] = await dbConn.query(`
      SELECT
        *
      FROM
        dashboard_setting
      WHERE
        deleted_at = '0000-00-00 00:00:00';`)
    if (rows === undefined)
      return []

    return rows
  } catch (err) {
    return {
      error: err
    }
  } finally {

  }
}


module.exports = {
  getRecords: getRecords,
}
