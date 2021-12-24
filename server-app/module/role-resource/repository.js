const mysqldb = require('../../db/mysqldb')


exports.create = async data => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let [res, fields] = await dbConn.query(`
      INSERT INTO
        role_resource
      SET ?;`, {
        role_id: data.role_id,
        resource_id: data.resource_id,
        permission: data.permission,
      })
    let rec = await get(res.insertId)
    return rec
  } catch (err) {
    return {
      error: err
    }
  } finally {

  }
}

exports.get = async id => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let [res, fields] = await dbConn.query(`
      SELECT
        *
      FROM
        role_resource
      WHERE
        id = ?
      AND
        deleted_at = '0000-00-00 00:00:00';
      `, [id])
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

exports.fetchByRoleId = async roleId => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let [res, fields] = await dbConn.query(`
      SELECT
        *
      FROM
        role_resource
      WHERE
        role_id = ?
      AND
        deleted_at = '0000-00-00 00:00:00';
      `, [roleId])
    return res
  } catch (err) {
    return {
      error: err
    }
  } finally {

  }
}

exports.hasPermission = async (roleId, resourceName, permissionType) => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let [record, fields] = await dbConn.query(`
      SELECT
      	count(*) AS total
      FROM
      	role_resource AS rr
      INNER JOIN
      	resource AS r
      ON
      	r.id = rr.resource_id
      WHERE
      	rr.role_id = ?
      AND
      	r.resource_name = ?
      AND
      	rr.permission LIKE ?
      AND
      	rr.deleted_at = '0000-00-00 00:00:00';
      `, [roleId, resourceName, `%${ permissionType }%`])
    if (record.length)
      record = record[0].total
    return record
  } catch (err) {
    return {
      error: err
    }
  } finally {

  }
}
