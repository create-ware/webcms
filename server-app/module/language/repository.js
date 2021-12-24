const mysqldb = require('../../db/mysqldb')


exports.create = async data => {
  let dbConn = null
  let transaction = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    transaction = await dbConn.getConnection()
    let [res, fields] = await transaction.query(`
      INSERT INTO
        language
      SET ?;`, {
        language_name: data.language_name,
      })
    // NOTE: save language messages
    for (let i of data.language_messages)
      await transaction.query(`
        INSERT INTO
          language_message
        SET ?;`, {
          language_id: res.insertId,
          language_message_key: i.language_message_key,
          language_message_value: i.language_message_value,
        })
    await transaction.commit()
    let rec = await this.get(res.insertId)
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
    // NOTE: update language
    let [res, fields] =  await transaction.query(`
      UPDATE
        language
      SET
        updated_at = NOW(),
        language_name = ?
      WHERE
        id = ?
      AND
        deleted_at = '0000-00-00 00:00:00';`,
      [
        data.language_name,
        data.id,
      ])
    if (res.affectedRows === 0)
      throw 'Error updating record'
    // NOTE: update language messages
    for (let i of data.language_messages) {
      if (i.id) {
        // NOTE: update or delete
        if (i.removed) {
          await transaction.query(`
            UPDATE
              language_message
            SET
              updated_at = NOW(),
              deleted_at = NOW()
            WHERE
              id = ?
            AND
              language_id = ?;`,
            [
              i.id,
              i.language_id,
            ])
        } else {
          await transaction.query(`
            UPDATE
              language_message
            SET
              updated_at = NOW(),
              language_message_key = ?,
              language_message_value = ?
            WHERE
              id = ?
            AND
              language_id = ?
            AND
              deleted_at = '0000-00-00 00:00:00';`,
            [
              i.language_message_key,
              i.language_message_value,
              i.id,
              i.language_id,
            ])
        }
      } else {
        // NOTE: save
        await transaction.query(`
          INSERT INTO
            language_message
          SET ?;`, {
            language_id: data.id,
            language_message_key: i.language_message_key,
            language_message_value: i.language_message_value,
          })
      }
    }
    await transaction.commit()
    let rec = await this.get(data.id)
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
    let rec = await this.get(data.id)
    transaction = await dbConn.getConnection()
    await transaction.beginTransaction()
    // NOTE: update language
    let [res, fields] =  await transaction.query(`
      UPDATE
        language
      SET
        updated_at = NOW(),
        deleted_at = NOW()
      WHERE
        id = ?;`,
      [
        data.id,
      ])
    if (res.affectedRows === 0)
      throw 'Error deleting record'
    // NOTE: update language messages
    await transaction.query(`
      UPDATE
        language_message
      SET
        updated_at = NOW(),
        deleted_at = NOW()
      WHERE
        language_id = ?;`,
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

exports.get = async id => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let [res, fields] = await dbConn.query(`
      SELECT
        *
      FROM
        language
      WHERE
        id = ?
      AND
        deleted_at = '0000-00-00 00:00:00';
      `, [id])
    if (res.length)
      res = res[0]
    // NOTE: get language messages
    let [messageRecords, messageFields] = await dbConn.query(`
      SELECT
        created_at,
        updated_at,
        id,
        language_id,
        language_message_key,
        language_message_value,
        false AS removed
      FROM
        language_message
      WHERE
        language_id = ?
      AND
        deleted_at = '0000-00-00 00:00:00';
      `, [id])
    res.language_messages = []
    if (messageRecords.length)
      res.language_messages = messageRecords
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
      language
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
      *
    FROM
      language
    WHERE
      deleted_at = '0000-00-00'
    ORDER BY id;`
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

exports.getTotalRecords = async id => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let [record, fields] = await dbConn.query(`
      SELECT
        count(*) AS total
      FROM
        language
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

exports.search = async data => {
  let dbConn = null
  try {
    dbConn = await mysqldb.getPoolConnection()
    let query = `
    SELECT
      *
    FROM
      language
    WHERE
      deleted_at = '0000-00-00'
    AND
      language_name LIKE ?
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
