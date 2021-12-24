
const DASHBOARD_ADMIN_CONFIG = require('../../config/dashboard-admin-config')

const repository = require('./repository')


exports.fetch = async (req, res) => {
  let skipItems = DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST * (req.params.page - 1)
  let ascSort = 'DESC'
  let totalItems = await repository.getTotalRecords({
    user_id: req.session.user.id,
  })
  if (totalItems.error !== undefined) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: 'Error loading the notifications',
    })
    return res
  }
  let items = await repository.fetch({
    user_id: req.session.user.id,
    sort: ascSort,
    skip: skipItems,
    limit: DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST,
  })
  if (items.error !== undefined) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: 'Error loading the notifications',
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

exports.get = async (req, res) => {
  let rec = await repository.get({
    user_id: req.session.user.id,
    id: req.params.id,
  })
  if (rec.error !== undefined) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: 'Error loading the notification',
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
