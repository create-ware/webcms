const mysqldb = require('../../db/mysqldb')


exports.create = async data => {
  let dbConn = null
  let transaction = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    transaction = await dbConn.getConnection()
    let [res, fields] = await transaction.query(`
      INSERT INTO
        role
      SET ?;`, {
        role_name: data.role_name,
        user_id: data.user_id,
      })
    // NOTE: save role resources
    for (let i of data.role_resources)
      await transaction.query(`
        INSERT INTO
          role_resource
        SET ?;`, {
          role_id: res.insertId,
          resource_id: i.resource_id,
          permission: i.permission,
        })
    await transaction.commit()
    let rec = await this.get({
      id: res.insertId,
      user_id: data.user_id,
    })
    return rec
  } catch (err) {
    await transaction.rollback()
    return {
      error: err
    }
  } finally {
    await transaction.release()
  }
}

exports.update = async data => {
  let dbConn = null
  let transaction = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    transaction = await dbConn.getConnection()
    await transaction.beginTransaction()
    // NOTE: update role
    let [res, fields] =  await transaction.query(`
      UPDATE
        role
      SET
        updated_at = NOW(),
        role_name = ?
      WHERE
        id = ?
      AND
        user_id = ?
      AND
        deleted_at = '0000-00-00 00:00:00';`,
      [
        data.role_name,
        data.id,
        data.user_id,
      ])
    if (res.affectedRows === 0)
      throw 'error updating record'
    // NOTE: update role resources
    for (let i of data.role_resources) {
      if (i.id !== undefined && i.id > 0) {
        // NOTE: remove
        if (i.removed) {
          await transaction.query(`
            UPDATE
              role_resource
            SET
              updated_at = NOW(),
              deleted_at = NOW()
            WHERE
              id = ?
            AND
              role_id = ?;`,
            [
              i.id,
              i.role_id,
            ])
        } else {
          // NOTE: update
          await transaction.query(`
            UPDATE
              role_resource
            SET
              updated_at = NOW(),
              permission = ?
            WHERE
              id = ?
            AND
              role_id = ?
            AND
              deleted_at = '0000-00-00 00:00:00';`,
            [
              i.permission,
              i.id,
              i.role_id,
            ])
        }
      } else {
        // NOTE: save
        await transaction.query(`
          INSERT INTO
            role_resource
          SET ?;`, {
            role_id: data.id,
            permission: i.permission,
            resource_id: i.resource_id,
          })
      }
    }
    await transaction.commit()
    let rec = await this.get({
      id: data.id,
      user_id: data.user_id,
    })
    return rec
  } catch (err) {
    await transaction.rollback()
    return {
      error: err
    }
  } finally {
    await transaction.release()
  }
}

exports.delete = async data => {
  let dbConn = null
  let transaction = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let rec = await await this.get({
      id: res.insertId,
      user_id: data.user_id,
    })
    transaction = await dbConn.getConnection()
    await transaction.beginTransaction()
    // NOTE: update role
    let [res, fields] =  await transaction.query(`
      UPDATE
        role
      SET
        updated_at = NOW(),
        deleted_at = NOW()
      WHERE
        id = ?
      AND
        user_id = ?;`,
      [
        data.id,
        data.user_id,
      ])
    if (res.affectedRows === 0)
      throw 'error deleting record'
    // NOTE: update role resources
    await transaction.query(`
      UPDATE
        role_resource
      SET
        updated_at = NOW(),
        deleted_at = NOW()
      WHERE
        role_id = ?;`,
      [
        data.id,
      ])
    await transaction.commit()
    return rec
  } catch (err) {
    await transaction.rollback()
    return {
      error: err
    }
  } finally {
    await transaction.release()
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
        role
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

exports.fetch = async data => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let query = `
    SELECT
      *
    FROM
      role
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

exports.fetchAll = async data => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let query = `
    SELECT
      *
    FROM
      role
    WHERE
      user_id = ?
    AND
      deleted_at = '0000-00-00'
    ORDER BY id;`
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

exports.getTotalRecords = async data => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let [record, fields] = await dbConn.query(`
      SELECT
        count(*) AS total
      FROM
        role
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

exports.search = async data => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let query = `
    SELECT
      *
    FROM
      role
    WHERE
      user_id = ?
    AND
      deleted_at = '0000-00-00'
    AND
      role_name LIKE ?
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

exports.getRoleResources = async roleId => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
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
      `, [roleId])
    return resources
  } catch (err) {
    return {
      error: err
    }
  } finally {

  }
}
