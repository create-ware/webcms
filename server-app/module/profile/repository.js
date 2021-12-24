const mysqldb = require('../../db/mysqldb')


module.exports.get = async id => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let [rec, fields] = await dbConn.query(`
      SELECT
        u.id,
        u.role_id,
        u.language_id,
        u.user_name,
        u.user_email,
        u.user_first_name,
        u.user_last_name,
        u.user_active,
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
        u.id = ?
      AND
        u.deleted_at = '0000-00-00 00:00:00';
      `, [id])
    if (rec.length)
      rec = rec[0]
    // NOTE: get user resources
    let [resources, _] = await dbConn.query(`
      SELECT
      	r.resource_name,
      	r.resource_type,
      	r.resource_path,
      	rr.role_id,
      	rr.resource_id,
      	rr.permission
      FROM
      	role_resource AS rr
      INNER JOIN
      	resource AS r
      ON
      	r.id = rr.resource_id
      WHERE
      	rr.role_id = ?
      AND
      	rr.deleted_at = '0000-00-00 00:00:00';
      `, [rec.role_id])
    rec.role_resources = resources
    return rec
  } catch (err) {
    return {
      error: err
    }
  } finally {

  }
}

module.exports.update = async params => {
  let dbConn = null
  try {
    if (params.profile_file_id === 0)
      params.profile_file_id = null
    dbConn = await mysqldb.getPoolConnection()
    let query = `
      UPDATE
        user
      SET
        language_id = ?,
        profile_file_id = ?,
        user_pass_replace,
        user_email = ?,
        user_first_name = ?,
        user_last_name = ?
      WHERE
        id = ?
      AND
        deleted_at = '0000-00-00 00:00:00';`
    let values = [
        params.language_id,
        params.profile_file_id,
        'user_pass',
        params.user_email,
        params.user_first_name,
        params.user_last_name,
        params.id,
      ]
    if (params.user_pass) {
      query = query.replaceAll('user_pass_replace,', 'user_pass = ?,')
      values[2] = params.user_pass
    } else {
      query = query.replaceAll('user_pass_replace,', '')
      values.splice(2, 1)
    }
    let [res, resFields] = await dbConn.query(query, values)
    let rec = await this.get(params.id)
    return rec
  } catch (err) {
    return {
      error: err
    }
  } finally {

  }
}
