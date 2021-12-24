const mysqldb = require('../db/mysqldb')


exports.getRef = async (record, tableName, colName, colAsName, id) => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let query = `
      SELECT
        ${ colName } AS ${colAsName }
      FROM
        ${ tableName }
      WHERE
        id = ?
      AND
        deleted_at = '0000-00-00 00:00:00';`
    let [res, fields] = await dbConn.query(query, [id])
    if (res.length)
      res = res[0]
    record[colAsName] = res[colAsName]
    return record
  } catch (err) {
    return {
      error: err
    }
  } finally {

  }
}
