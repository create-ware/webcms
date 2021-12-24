const DASHBOARD_ADMIN_CONFIG = require('../../config/dashboard-admin-config')
const session = require('../../lib/session')
const repository = require('./repository')
const sessionRepository = require('../session/repository')


exports.get = async (req, res) => {
  let user = await repository.get(req.session.user.id)
  if (user.error !== undefined) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: err.toString(),
    })
    return res
  }
  await res.send({
    data: user,
    status_code: 0,
    status_msg: '',
  })
  return res
}

exports.update = async (req, res) => {
  let sessionUserId = req.session.user.id
  let sessionRoleId = req.session.user.role_id
  let sessionUserName = req.session.user.user_name
  req.body.id = sessionUserId
  // NOTE: check if password has changed
  if (req.body.user_pass) {
    let passHashed = await session.hashPassword(req.body.user_pass)
    req.body.user_pass = passHashed
  }
  let rec = await repository.update(req.body)
  // NOTE: finish session for this user req.body.id
  if (req.body.user_pass.length || req.body.user_name !== sessionUserName || req.body.role_id != sessionRoleId) {
    await sessionRepository.delete(req.body.id)
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
    channel: 'profile-put',
    data: {
      data: rec
    },
    notification: {
      user_id: sessionUserId,
      notification_type: 'log',
      notification_title: 'Profile updated',
      notification_description: '',
    },
  })
  await res.send({
    data: rec,
    status_code: 0,
    status_msg: 'Profile updated',
  })
  return res
}
