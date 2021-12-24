
const DASHBOARD_ADMIN_CONFIG = require('../../config/dashboard-admin-config')

const repository = require('./repository')


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
      status_msg: 'Error loading the roles',
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
      status_msg: 'Error loading the roles'
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
      status_msg: 'Error loading the roles'
    })
    return res
  }
  let items = await repository.fetchAll({
    sort: ascSort,
    skip: skipItems,
    limit: DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST,
    user_id: sessionUserId,
  })
  if (items.error !== undefined) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: 'Error loading the roles'
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
      status_msg: 'Error searching the roles'
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
  req.body.user_id = sessionUserId
  let rec = await repository.create(req.body)
  if (rec.error !== undefined) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: 'Error saving the role',
    })
    return res
  }
  res.pushBroadcastMessage({
    channel: 'role-post',
    data: {
      data: rec
    },
    notification: {
      user_id: sessionUserId,
      notification_type: 'log',
      notification_title: 'New role added',
      notification_description: '',
    },
  })
  await res.send({
    data: rec,
    status_code: 0,
    status_msg: 'New role added',
  })
  return res
}

exports.update = async (req, res) => {
  let sessionUserId = req.session.user.id
  req.body.user_id = sessionUserId
  let rec = await repository.update(req.body)
  if (rec.error !== undefined) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: 'Error updating the role',
    })
    return res
  }
  let roleResources = await repository.getRoleResources(rec.id)
  res.pushBroadcastMessage({
    channel: 'role-resources-put',
    data: {
      data: {
        id: rec.id,
        role_resources: roleResources,
      }
    }
  })
  res.pushBroadcastMessage({
    channel: 'role-put',
    data: {
      data: rec
    },
    notification: {
      user_id: sessionUserId,
      notification_type: 'log',
      notification_title: 'Role updated',
      notification_description: '',
    },
  })
  await res.send({
    data: rec,
    status_code: 0,
    status_msg: 'Role updated',
  })
  return res
}

exports.delete = async (req, res) => {
  let sessionUserId = req.session.user.id
  req.body.user_id = sessionUserId
  let rec = await repository.delete(req.body)
  if (rec.error !== undefined) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: 'Error deleting the role',
    })
    return res
  }
  res.pushBroadcastMessage({
    channel: 'role-delete',
    data: {
      data: rec
    },
    notification: {
      user_id: sessionUserId,
      notification_type: 'log',
      notification_title: 'Role deleted',
      notification_description: '',
    },
  })
  await res.send({
    data: rec,
    status_code: 0,
    status_msg: 'Role deleted',
  })
  return res
}

exports.get = async (req, res) => {
  let sessionUserId = req.session.user.id
  let rec = await repository.get({
    id: req.params.id,
    user_id: sessionUserId,
  })
  if (rec.error !== undefined) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: 'Error loading the role',
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
