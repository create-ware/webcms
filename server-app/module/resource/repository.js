const mysqldb = require('../../db/mysqldb')


exports.create = async data => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let [res, fields] = await dbConn.query(`
      INSERT INTO
        resource
      SET ?;`, {
        resource_name: data.resource_name,
        resource_description: data.resource_description,
        resource_type: data.resource_type,
        resource_path: data.resource_path,
      })
    let rec = await this.get(res.insertId)
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
        resource
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

exports.update = async params => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()

    let [res, resFields] = await dbConn.query(`
      UPDATE
        resource
      SET
        updated_at = NOW(),
        resource_name = ?,
        resource_description = ?,
        resource_type = ?,
        resource_path = ?
      WHERE
        id = ?
      AND
        deleted_at = '0000-00-00 00:00:00';`, [
        params.resource_name,
        params.resource_description,
        params.resource_type,
        params.resource_path,
        params.id,
      ])
    if (res.affectedRows === 0)
      throw 'No updated'
    let rec = await this.get(params.id)
    return rec
  } catch (err) {
    return {
      error: err
    }
  } finally {

  }
}

exports.delete = async params => {
  let dbConn = null
  try {
    if (params.resource_profile_file_id === 0)
      params.resource_profile_file_id = null
    dbConn = await mysqldb.getPoolConnection()
    let rec = await this.get(params.id)
    let [res, resFields] = await dbConn.query(`
      UPDATE
        resource
      SET
        deleted_at = NOW()
      WHERE
        id = ?
      AND
        deleted_at = '0000-00-00 00:00:00';`, [
        params.id,
      ])
    if (res.affectedRows === 0)
      throw 'No deleted'
    return rec
  } catch (err) {
    return {
      error: err
    }
  } finally {

  }
}

exports.fetch = async data => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let query = `
    SELECT
      *
    FROM
      resource
    WHERE
      deleted_at = '0000-00-00'
    ORDER BY id sort
    LIMIT ?
    OFFSET ?;`
    query = query.replace('sort', data.sort)
    let [records, fields] = await dbConn.query(query, [
        data.limit,
        data.skip,
      ])
    return records
  } catch (err) {
    return {
      error: err
    }
  } finally {

  }
}

exports.fetchAll = async data => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let query = `
      SELECT
        r.created_at,
        r.updated_at,
        r.id,
        r.resource_name,
        r.resource_description,
        r.resource_type,
        r.resource_path
      FROM
        role_resource AS rr
      LEFT JOIN
        resource AS r
      ON
        r.id = rr.resource_id
      WHERE
        rr.role_id = ?
      AND
        rr.deleted_at = '0000-00-00'
      ORDER BY rr.id;`
    let [records, fields] = await dbConn.query(query, [
        data.role_id,
      ])
    return records
  } catch (err) {
    return {
      error: err
    }
  } finally {

  }
}

exports.search = async data => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let query = `
    SELECT
      *
    FROM
      resource
    WHERE
      deleted_at = '0000-00-00'
    AND
      resource_name LIKE ?
    LIMIT ?;`
    let [records, fields] = await dbConn.query(query, [
        `%${ data.search }%`,
        data.limit,
      ])
    return records
  } catch (err) {
    return {
      error: err
    }
  } finally {

  }
}

exports.getTotalRecords = async id => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let [record, fields] = await dbConn.query(`
      SELECT
        count(*) AS total
      FROM
        resource
      WHERE
        deleted_at = '0000-00-00 00:00:00';
      `)
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

exports.fetchAllAdmin = async data => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let query = `
      SELECT
        *
      FROM
        resource
      WHERE
        deleted_at = '0000-00-00'
      ORDER BY id;`
    let [records, fields] = await dbConn.query(query)
    return records
  } catch (err) {
    return {
      error: err
    }
  } finally {

  }
}
