const mysqldb = require('../../db/mysqldb')


exports.getRole = async data => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let [res, fields] = await dbConn.query(`
      SELECT
        *
      FROM
        role
      WHERE
        id = ?
      AND
        deleted_at = '0000-00-00 00:00:00';
      `, [
        data.id,
      ])
    if (res.length)
      res = res[0]
    // NOTE: get role resources
    let [roleResourceRecords, roleResourceFields] = await dbConn.query(`
      SELECT
        created_at,
        updated_at,
        id,
        role_id,
        resource_id,
        permission,
        false AS removed
      FROM
        role_resource
      WHERE
        role_id = ?
      AND
        deleted_at = '0000-00-00 00:00:00';
      `, [
        data.id,
      ])
    res.role_resources = []
    if (roleResourceRecords.length)
      res.role_resources = roleResourceRecords
    return res
  } catch (err) {
    return {
      error: err
    }
  } finally {

  }
}

exports.getByUserName = async userName => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let [res, fields] = await dbConn.query(`
      SELECT
        *
      FROM
        user
      WHERE
        user_name = ?
      AND
        deleted_at = '0000-00-00 00:00:00';
      `, [
        userName,
      ])
    if (res.length)
      res = res[0]
    return res
  } catch (err) {
    return {
      error: err
    }
  } finally {

  }
}

exports.fetchRoles = async data => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let [records, fields] = await dbConn.query(`
    SELECT
      id,
      role_name
    FROM
      role
    WHERE
      user_id = ?
    AND
      deleted_at = '0000-00-00';`, [
        data.user_id,
      ])
    return records
  } catch (err) {
    return {
      error: err
    }
  } finally {

  }
}

exports.fetchLanguages = async () => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let [records, fields] = await dbConn.query(`
    SELECT
      id,
      language_name
    FROM
      language
    WHERE
      language_name = 'es'
    AND
      deleted_at = '0000-00-00';`)
    return records
  } catch (err) {
    return {
      error: err
    }
  } finally {

  }
}
