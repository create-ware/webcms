const mysqldb = require('../../db/mysqldb')


exports.search = async (userId, customerUserId, resources, word) => {
  let dbConn = null
  try {
    let searchWord = `%${ word }%`
    dbConn = await mysqldb.getPoolConnection()
    let results = []
    let result = null
    for (let resource of resources) {
      if (resource.model === 'file') {
        result = await dbConn.query(`
          SELECT
            'file' AS item_model,
            file_title AS item_title,
            id AS item_id,
            'perm_media' AS item_icon
          FROM
            file
          WHERE
            user_id = ?
          AND
            deleted_at = '0000-00-00'
          AND
            file_title LIKE ?
          LIMIT 5;`, [
            userId,
            searchWord,
            5,
          ])
        results = [...results, ...result[0]]
      }
      if (resource.model === 'user') {
        result = await dbConn.query(`
          SELECT
            'user' AS item_model,
            user_first_name AS item_title,
            id AS item_id,
            'people' AS item_icon
          FROM
            user
          WHERE
            user_id = ?
          AND
            deleted_at = '0000-00-00'
          AND
            user_first_name LIKE ?
          LIMIT 5;`, [
            userId,
            searchWord,
            5,
          ])
        results = [...results, ...result[0]]
      }
      if (resource.model === 'resource') {
        result = await dbConn.query(`
          SELECT
            'resource' AS item_model,
            resource_name AS item_title,
            id AS item_id,
            'pages' AS item_icon
          FROM
            resource
          WHERE
            deleted_at = '0000-00-00'
          AND
            resource_name LIKE ?
          LIMIT 5;`, [
            searchWord,
            5,
          ])
        results = [...results, ...result[0]]
      }
      if (resource.model === 'role') {
        result = await dbConn.query(`
          SELECT
            'role' AS item_model,
            role_name AS item_title,
            id AS item_id,
            'security' AS item_icon
          FROM
            role
          WHERE
            user_id = ?
          AND
            deleted_at = '0000-00-00'
          AND
            role_name LIKE ?
          LIMIT 5;`, [
            userId,
            searchWord,
            5,
          ])
        results = [...results, ...result[0]]
      }
      if (resource.model === 'language') {
        result = await dbConn.query(`
          SELECT
            'language' AS item_model,
            language_name AS item_title,
            id AS item_id,
            'language' AS item_icon
          FROM
            language
          WHERE
            deleted_at = '0000-00-00'
          AND
            language_name LIKE ?
          LIMIT 5;`, [
            searchWord,
            5,
          ])
        results = [...results, ...result[0]]
      }
    }
    return results
  } catch (err) {
    return {
      error: err
    }
  } finally {

  }
}

exports.fetchRoleResourceDataById = async roleId => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let [res, fields] = await dbConn.query(`
      SELECT
        r.resource_name AS model
      FROM
        role_resource AS rr
      LEFT JOIN
        resource AS r
      ON
        r.id = rr.resource_id
      WHERE
        rr.role_id = ?
      AND
        r.resource_type = 'data'
      AND
        r.resource_name NOT LIKE "%s"
      AND
        rr.permission LIKE '%r%'
      AND
        rr.deleted_at = '0000-00-00 00:00:00';`,[
        roleId
      ])
    return res
  } catch (err) {
    return {
      error: err
    }
  } finally {

  }
}
