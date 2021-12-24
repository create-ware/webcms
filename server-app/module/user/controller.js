const DASHBOARD_ADMIN_CONFIG = require('../../config/dashboard-admin-config')
const session = require('../../lib/session')
const repository = require('./repository')
const sessionRepository = require('../session/repository')


exports.fetch = async (req, res) => {
  let sessionUserId = req.session.user.id
  let skipItems = DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST * (req.params.page - 1)
  let ascSort = 'DESC'
  let totalItems = await repository.getTotalRecords({
    user_id: sessionUserId,
  })
  if (totalItems.error !== undefined) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: 'Error loading the users',
    })
    return res
  }
  let items = await repository.fetch({
    sort: ascSort,
    skip: skipItems,
    limit: DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST,
    user_id: sessionUserId,
  })
  if (items.error !== undefined) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: 'Error loading the users',
    })
    return res
  }
  await res.send({
    items: items,
    total_pages: Math.ceil(totalItems / DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST),
    items_skipped: skipItems,
    total_items: totalItems,
    status_code: 0,
    status_msg: '',
  })
  return res
}

exports.search = async (req, res) => {
  let sessionUserId = req.session.user.id
  let search = req.query.s
  let limit = 10
  let items = await repository.search({
    search: search,
    limit: limit,
    user_id: sessionUserId,
  })
  if (items.error !== undefined) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: 'Error loading the users',
    })
    return res
  }
  await res.send({
    items: items,
    total_pages: 0,
    items_skipped: 0,
    total_items: items.length,
    status_code: 0,
    status_msg: '',
  })
  return res
}

exports.save = async (req, res) => {
  let sessionUserId = req.session.user.id
  let passHashed = await session.hashPassword(req.body.user_pass)
  req.body.user_pass = passHashed
  req.body.user_id = sessionUserId
  let rec = await repository.create(req.body)
  if (rec.error !== undefined) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: rec.error.toString(),
    })
    return res
  }
  res.pushBroadcastMessage({
    channel: 'user-post',
    data: {
      data: rec
    },
    notification: {
      user_id: sessionUserId,
      notification_type: 'log',
      notification_title: 'User created',
      notification_description: '',
    },
  })
  await res.send({
    data: rec,
    status_code: 0,
    status_msg: 'User created',
  })
  return res
}

exports.get = async (req, res) => {
  let sessionUserId = req.session.user.user_id
  // NOTE: improve this
  if (req.session.user.user_role_name === 'cliente')
    sessionUserId = req.session.user.id
  let rec = await repository.get({
    id: req.params.id,
    user_id: sessionUserId,
  })
  if (rec.error !== undefined) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: 'Error loading the user',
    })
    return res
  }
  await res.send({
    data: rec,
    status_code: 0,
    status_msg: '',
  })
  return res
}

exports.update = async (req, res) => {
  let sessionUserId = req.session.user.id
  // NOTE: check if password has changed
  if (req.body.user_pass) {
    let passHashed = await session.hashPassword(req.body.user_pass)
    req.body.user_pass = passHashed
  }
  req.body.user_id = sessionUserId
  let rec = await repository.update(req.body)
  // NOTE: finish session for this user req.body.id
  // TODO: improve this getting the session data for user updated and validate if has some changes
  if (req.body.user_pass || req.body.role_id || req.body.user_name) {
    await sessionRepository.delete(req.body.id)
    // NOTE: delete session data for current user
    if (req.body.id === sessionUserId)
      delete req.session.user
  }
  if (rec.error !== undefined) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: rec.error.toString(),
    })
    return res
  }
  res.pushBroadcastMessage({
    channel: 'user-put',
    data: {
      data: rec
    },
    notification: {
      user_id: sessionUserId,
      notification_type: 'log',
      notification_title: 'User updated',
      notification_description: '',
    },
  })
  await res.send({
    data: rec,
    status_code: 0,
    status_msg: 'User updated',
  })
  return res
}

exports.delete = async (req, res) => {
  let sessionUserId = req.session.user.id
  if (req.body.id === sessionUserId) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: 'Not permitted',
    })
    return res
  }
  req.body.user_id = sessionUserId
  let rec = await repository.delete(req.body)
  if (rec.error !== undefined) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: rec.error.toString(),
    })
    return res
  }
  // NOTE: delete user session
  await sessionRepository.delete(req.body.id)
  res.pushBroadcastMessage({
    channel: 'user-delete',
    data: {
      data: rec
    },
    notification: {
      user_id: sessionUserId,
      notification_type: 'log',
      notification_title: 'User deleted',
      notification_description: '',
    },
  })
  await res.send({
    data: rec,
    status_code: 0,
    status_msg: 'User deleted',
  })
  return res
}
