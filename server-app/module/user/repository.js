const mysqldb = require('../../db/mysqldb')
const query = require('../../lib/query')


exports.create = async data => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let [res, fields] = await dbConn.query(`
      INSERT INTO
        user
      SET ?;`, {
        role_id: data.role_id,
        language_id: data.language_id,
        user_name: data.user_name,
        user_pass: data.user_pass,
        user_email: data.user_email,
        user_first_name: data.user_first_name,
        user_last_name: data.user_last_name,
        user_active: true,
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

exports.get = async (data, userPass = false) => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let [res, fields] = await dbConn.query(`
      SELECT
        u.created_at,
        u.updated_at,
        u.id,
        u.role_id,
        u.language_id,
        u.user_name,
        u.user_email,
        u.user_first_name,
        u.user_last_name,
        u.user_active,
        u.user_pass,
        r.role_name,
        u.user_status,
        u.profile_file_id,
        r.role_name AS role_id_ref,
        l.language_name AS language_id_ref,
        f.file_name AS profile_file_id_ref
      FROM
        user AS u
      INNER JOIN
        role AS r
      ON
        r.id = u.role_id
      INNER JOIN
        language AS l
      ON
        l.id = u.language_id
      LEFT JOIN
        file AS f
      ON
        f.id = u.profile_file_id
      WHERE
        u.id = ?
      AND
        u.user_id = ?
      AND
        u.deleted_at = '0000-00-00 00:00:00';
      `, [
        data.id,
        data.user_id,
      ])
    if (res.length)
      res = res[0]
    if (!userPass)
      res.user_pass = ''
    // NOTE: get references optional
    // await query.getRef(res, 'role', 'role_name', 'role_id_ref', res.role_id)
    // await query.getRef(res, 'language', 'language_name', 'language_id_ref', res.role_id)
    return res
  } catch (err) {
    console.error(err)
    return {
      error: err
    }
  } finally {

  }
}

exports.update = async data => {
  let dbConn = null
  try {
    if (data.profile_file_id === 0)
      data.profile_file_id = null
    dbConn = await mysqldb.getPoolConnection()
    let query = `
      UPDATE
        user
      SET
        language_id = ?,
        profile_file_id = ?,
        user_pass_replace,
        role_id = ?,
        user_email = ?,
        user_first_name = ?,
        user_last_name = ?
      WHERE
        id = ?
      AND
        user_id = ?
      AND
        deleted_at = '0000-00-00 00:00:00';`
    let values = [
        data.language_id,
        data.profile_file_id,
        'user_pass',
        data.role_id,
        data.user_email,
        data.user_first_name,
        data.user_last_name,
        data.id,
        data.user_id,
      ]
    if (data.user_pass) {
      query = query.replaceAll('user_pass_replace,', 'user_pass = ?,')
      values[2] = data.user_pass
    } else {
      query = query.replaceAll('user_pass_replace,', '')
      values.splice(2, 1)
    }
    let [res, resFields] = await dbConn.query(query, values)
    if (res.affectedRows === 0)
      throw 'No updated'
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
    if (data.profile_file_id === 0)
      data.profile_file_id = null
    dbConn = await mysqldb.getPoolConnection()
    let rec = await this.get({
      id: data.id,
      user_id: data.user_id,
    })
    let [res, resFields] = await dbConn.query(`
      UPDATE
        user
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
      `, [userName])
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
      u.created_at,
      u.updated_at,
      u.id,
      u.role_id,
      u.language_id,
      u.user_name,
      u.user_email,
      u.user_first_name,
      u.user_last_name,
      u.user_active,
      u.user_status,
      r.role_name,
      u.profile_file_id,
      r.role_name AS role_id_ref,
      l.language_name AS language_id_ref,
      f.file_name AS profile_file_id_ref
    FROM
      user AS u
    INNER JOIN
      role AS r
    ON
      r.id = u.role_id
    INNER JOIN
      language AS l
    ON
      l.id = u.language_id
    LEFT JOIN
      file AS f
    ON
      f.id = u.profile_file_id
    WHERE
      u.user_id = ?
    AND
      u.deleted_at = '0000-00-00'
    ORDER BY u.id sort
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
      created_at,
      updated_at,
      id,
      role_id,
      language_id,
      user_name,
      user_email,
      user_first_name,
      user_last_name,
      user_active,
      user_status
    FROM
      user
    WHERE
      user_id = ?
    AND
      deleted_at = '0000-00-00'
    AND
      user_first_name LIKE ?
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
        user
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

exports.getById = async id => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let [res, fields] = await dbConn.query(`
      SELECT
        *
      FROM
        user
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
