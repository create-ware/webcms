const mysqldb = require('../../db/mysqldb')


exports.store = async data => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let [res, fields] = await dbConn.query(`
      INSERT INTO
        file
      SET ?;`, {
        file_name: data.file_name,
        file_title: data.file_title,
        file_description: data.file_description,
        file_size: data.file_size,
        file_mime_type: data.file_mime_type,
        user_id: data.user_id,
      })
    let rec = await this.get({
      id: res.insertId,
      user_id: data.user_id,
    })
    return rec
  } catch (err) {
    return {
      error: err
    }
  } finally {

  }
}

exports.update = async data => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let [res, fields] = await dbConn.query(`
      UPDATE
        file
      SET
        updated_at = NOW(),
        file_title = ?,
        file_description = ?
      WHERE
        id = ?
      AND
        user_id = ?
      AND
        deleted_at = '0000-00-00 00:00:00';`, [
        data.file_title,
        data.file_description,
        data.id,
        data.user_id,
      ])
    let rec = await this.get({
      id: data.id,
      user_id: data.user_id,
    })
    return rec
  } catch (err) {
    return {
      error: err
    }
  } finally {

  }
}

exports.delete = async data => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let [res, fields] = await dbConn.query(`
      UPDATE
        file
      SET
        deleted_at = NOW()
      WHERE
        id = ?
      AND
        user_id = ?
      AND
        deleted_at = '0000-00-00 00:00:00';`, [
        data.id,
        data.user_id,
      ])
    if (res.changedRows === 0)
      throw 'file not removed'
    return res
  } catch (err) {
    return {
      error: err
    }
  } finally {

  }
}

exports.get = async data => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let [res, fields] = await dbConn.query(`
      SELECT
        *
      FROM
        file
      WHERE
        id = ?
      AND
        user_id = ?
      AND
        deleted_at = '0000-00-00 00:00:00';
      `, [
        data.id,
        data.user_id,
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

exports.fetch = async data => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let query = `
    SELECT
      *
    FROM
      file
    WHERE
      user_id = ?
    AND
      deleted_at = '0000-00-00'
    ORDER BY id sort
    LIMIT ?
    OFFSET ?;`
    query = query.replace('sort', data.sort)
    let [records, fields] = await dbConn.query(query, [
        data.user_id,
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

exports.search = async data => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let query = `
    SELECT
      *
    FROM
      file
    WHERE
      user_id = ?
    AND
      deleted_at = '0000-00-00'
    AND
      file_title LIKE ?
    LIMIT ?;`
    let [records, fields] = await dbConn.query(query, [
        data.user_id,
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

exports.getTotalRecords = async data => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let [record, fields] = await dbConn.query(`
      SELECT
        count(*) AS total
      FROM
        file
      WHERE
        user_id = ?
      AND
        deleted_at = '0000-00-00 00:00:00';
      `, [
        data.user_id,
      ])
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
