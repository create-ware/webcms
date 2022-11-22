
const DASHBOARD_ADMIN_CONFIG = require('../../config/dashboard-admin-config')

const repository = require('./repository')


exports.fetch = async (req, res) => {
  let skipItems = DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST * (req.params.page - 1)
  let ascSort = 'DESC'
  let totalItems = await repository.getTotalRecords()
  if (totalItems.error !== undefined) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: 'error loading the resources',
    })
    return res
  }
  let items = await repository.fetch({
    sort: ascSort,
    skip: skipItems,
    limit: DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST,
  })
  if (items.error !== undefined) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: 'error loading the resources',
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

exports.fetchAll = async (req, res) => {
  // NOTE: get current user role_id and pass it as parameter to query all resources
  let sessionUserId = req.session.user.id
  let sessionUserRoleId = req.session.user.role_id
  const administratorRoleId = 1
  let items = []
  if (sessionUserRoleId == administratorRoleId)
    items = await repository.fetchAllAdmin()
  else
    items = await repository.fetchAll({
      role_id: sessionUserRoleId,
    })
  if (items.error !== undefined) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: 'error loading the resources',
    })
    return res
  }
  await res.send({
    items: items,
    total_pages: 1,
    items_skipped: 0,
    total_items: items.length,
    status_code: 0,
    status_msg: '',
  })
  return res
}

exports.search = async (req, res) => {
  let search = req.query.s
  let limit = 10
  let items = await repository.search({
    search: search,
    limit: limit,
  })
  if (items.error !== undefined) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: 'error loading the resources',
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
    channel: 'resource-post',
    data: {
      data: rec
    },
    notification: {
      user_id: sessionUserId,
      notification_type: 'log',
      notification_title: 'Resource created',
      notification_description: '',
    },
  })
  await res.send({
    data: rec,
    status_code: 0,
    status_msg: 'Resource created',
  })
  return res
}

exports.get = async (req, res) => {
  let rec = await repository.get(req.params.id)
  if (rec.error !== undefined) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: 'error loading the resource',
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
  let rec = await repository.update(req.body)
  if (rec.error !== undefined) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: rec.error.toString(),
    })
    return res
  }
  res.pushBroadcastMessage({
    channel: 'resource-put',
    data: {
      data: rec
    },
    notification: {
      user_id: sessionUserId,
      notification_type: 'log',
      notification_title: 'Resource updated',
      notification_description: '',
    },
  })
  await res.send({
    data: rec,
    status_code: 0,
    status_msg: 'Resource updated',
  })
  return res
}

exports.delete = async (req, res) => {
  let sessionUserId = req.session.user.id
  let rec = await repository.delete(req.body)
  if (rec.error !== undefined) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: rec.error.toString(),
    })
    return res
  }
  res.pushBroadcastMessage({
    channel: 'resource-delete',
    data: {
      data: rec
    },
    notification: {
      user_id: sessionUserId,
      notification_type: 'log',
      notification_title: 'Resource deleted',
      notification_description: '',
    },
  })
  await res.send({
    data: rec,
    status_code: 0,
    status_msg: 'Resource deleted',
  })
  return res
}
