const mysqldb = require('../../db/mysqldb')


exports.delete = async userId => {
  let dbConn = null
  try {
    let query = `
    SELECT
      *
    FROM
      session
    WHERE
      data LIKE '%"id":"${ userId }"%';`
    dbConn = await mysqldb.getPoolConnection()
    let [recs, fields] = await dbConn.query(query, [])
    for (let rec of recs) {
      let dataJSON = JSON.parse(rec.data)
      let resJSON = delete dataJSON.user
      let sessionId = dataJSON.sessionId
      dataJSON = JSON.stringify(dataJSON)
      await dbConn.query(`
        UPDATE
          session
        SET
          data = ?
        WHERE
          session_id = ?;
        `, [
          dataJSON,
          sessionId,
        ])
    }
    return recs
  } catch (err) {
    return {
      error: err
    }
  } finally {

  }
}

exports.fetchSessionsByUserId = async userId => {
  let dbConn = null
  try {
    let query = `
    SELECT
      *
    FROM
      session
    WHERE
      data LIKE '%"id":"${ userId }"%';`
    dbConn = await mysqldb.getPoolConnection()
    let [recs, fields] = await dbConn.query(query, [])
    return recs
  } catch (err) {
    return {
      error: err
    }
  } finally {

  }
}

exports.updateUserStatus = async (sessionId, userStatus) => {
  let dbConn = null
  try {
    let userId = 0
    let customerId = 0
    let query = `
    SELECT
      *
    FROM
      session
    WHERE
      session_id = ?;`
    dbConn = await mysqldb.getPoolConnection()
    let [rec, fields] = await dbConn.query(query, [sessionId])
    if (rec.length) {
      rec = rec[0]
      let dataJSON = JSON.parse(rec.data)
      if (dataJSON.user.user_status !== 'busy')
        dataJSON.user.user_status = userStatus
      userId = dataJSON.user.id
      customerId = dataJSON.user.user_id
      dataJSON = JSON.stringify(dataJSON)
      await dbConn.query(`
        UPDATE
          session
        SET
          data = ?
        WHERE
          session_id = ?;
        `, [
          dataJSON,
          sessionId,
        ])
      await dbConn.query(`
        UPDATE
          user
        SET
          user_status = ?
        WHERE
          id = ?;
        `, [
          userStatus,
          userId,
        ])
    }
    return {
      id: parseInt(userId),
      user_id: parseInt(customerId),
      user_status: userStatus,
    }
  } catch (err) {
    return {
      error: err
    }
  } finally {

  }
}
