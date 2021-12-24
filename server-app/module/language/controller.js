
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
      status_msg: 'Error loading the languages',
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
      status_msg: 'Error loading the languages',
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
  let skipItems = DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST * (req.params.page - 1)
  let ascSort = 'DESC'
  let totalItems = await repository.getTotalRecords()
  if (totalItems.error !== undefined) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: 'Error loading the languages',
    })
    return res
  }
  let items = await repository.fetchAll({
    sort: ascSort,
    skip: skipItems,
    limit: DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST,
  })
  if (items.error !== undefined) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: 'Error loading the languages',
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
      status_msg: 'Error searching the languages',
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
  let rec = await repository.create(req.body)
  if (rec.error !== undefined) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: 'Error saving the language',
    })
    return res
  }
  res.pushBroadcastMessage({
    channel: 'language-post',
    data: {
      data: rec
    },
    notification: {
      user_id: req.session.user.id,
      notification_type: 'log',
      notification_title: 'New language added',
      notification_description: '',
    },
  })
  await res.send({
    data: rec,
    status_code: 0,
    status_msg: 'New language added',
  })
  return res
}

exports.update = async (req, res) => {
  let rec = await repository.update(req.body)
  if (rec.error !== undefined) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: 'Error updating the language',
    })
    return res
  }
  res.pushBroadcastMessage({
    channel: 'language-put',
    data: {
      data: rec
    },
    notification: {
      user_id: req.session.user.id,
      notification_type: 'log',
      notification_title: 'Language updated',
      notification_description: '',
    },
  })
  await res.send({
    data: rec,
    status_code: 0,
    status_msg: 'Language updated',
  })
  return res
}

exports.delete = async (req, res) => {
  let rec = await repository.delete(req.body)
  if (rec.error !== undefined) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: 'Error deleting the language',
    })
    return res
  }
  res.pushBroadcastMessage({
    channel: 'language-delete',
    data: {
      data: rec
    },
    notification: {
      user_id: req.session.user.id,
      notification_type: 'log',
      notification_title: 'Language deleted',
      notification_description: '',
    },
  })
  await res.send({
    data: rec,
    status_code: 0,
    status_msg: 'Language deleted',
  })
  return res
}

exports.get = async (req, res) => {
  let rec = await repository.get(req.params.id)
  if (rec.error !== undefined) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: 'Error loading the language',
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
