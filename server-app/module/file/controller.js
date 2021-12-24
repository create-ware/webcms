
const DASHBOARD_ADMIN_CONFIG = require('../../config/dashboard-admin-config')

const repository = require('./repository')
const {
  fileUpload,
} = require('../../lib/file-upload')


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
      status_msg: 'Error loading the files 1',
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
      status_msg: 'Error loading the files',
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
      status_msg: 'Error loading the files',
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
      status_msg: 'Error loading the file',
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

exports.store = async (req, res) => {
  let sessionUserId = req.session.user.id
  let resultUpload = await fileUpload(req, res)
  if (!resultUpload.fileData) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: 'Error uploading file',
    })
    return res
  }
  let rec = await repository.store({
    file_name: resultUpload.fileData.fileName,
    file_title: resultUpload.postData.file_title,
    file_description: resultUpload.postData.file_description,
    file_mime_type: resultUpload.fileData.mimeType,
    file_size: resultUpload.postData.file_size,
    user_id: sessionUserId,
  })
  if (rec.error !== undefined) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: rec.error.toString(),
    })
    return res
  }
  res.pushBroadcastMessage({
    channel: 'file-post',
    data: {
      data: rec
    },
    notification: {
      user_id: sessionUserId,
      notification_type: 'log',
      notification_title: 'New file added',
      notification_description: '',
    },
  })
  await res.send({
    data: rec,
    status_code: 0,
    status_msg: 'New file added',
  })
  return res
}

exports.update = async (req, res) => {
  let sessionUserId = req.session.user.id
  let rec = await repository.update({
    file_title: req.body.file_title,
    file_description: req.body.file_description,
    id: req.body.id,
    user_id: sessionUserId,
  })
  if (rec.error !== undefined) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: rec.error.toString(),
    })
    return res
  }
  res.pushBroadcastMessage({
    channel: 'file-put',
    data: {
      data: rec
    },
    notification: {
      user_id: sessionUserId,
      notification_type: 'log',
      notification_title: 'File updated',
      notification_description: '',
    },
  })
  await res.send({
    data: rec,
    status_code: 0,
    status_msg: 'File updated',
  })
  return res
}

exports.delete = async (req, res) => {
  let sessionUserId = req.session.user.id
  let rec = await repository.delete({
    id: req.body.id,
    user_id: sessionUserId,
  })
  if (rec.error !== undefined) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: rec.error.toString(),
    })
    return res
  }
  res.pushBroadcastMessage({
    channel: 'file-delete',
    data: {
      data: rec
    },
    notification: {
      user_id: sessionUserId,
      notification_type: 'log',
      notification_title: 'File deleted',
      notification_description: '',
    },
  })
  await res.send({
    data: rec,
    status_code: 0,
    status_msg: 'File deleted',
  })
  return res
}
