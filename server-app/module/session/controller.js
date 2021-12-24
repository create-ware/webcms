const session = require('../../lib/session')
const websiteRepository = require('../website/repository')
const roleResourceRepository = require('../role-resource/repository')
const userRepository = require('../user/repository')
const repository = require('./repository')


exports.validateLogin = async (req, res) => {
  const user_name = req.body.user_name
  const user_pass = req.body.user_pass
  // NOTE: 1- get user
  let rec = await userRepository.getByUserName(user_name)
  // NOTE: 2- validations
  let errorMessage = ''
  if (!Object.keys(rec).length || rec.error !== undefined)
    errorMessage = 'invalid user'
  if (errorMessage === '' && !rec.user_active)
    errorMessage = 'user not activated'
  if (errorMessage === '') {
    let result = await session.passwordIsEqual(user_pass, rec.user_pass)
    if (!result)
      errorMessage = 'invalid password'
  }
  if (errorMessage !== '') {
    await res.send({
      error_message: errorMessage,
    })
    return res
  }
  // NOTE: remove sessions for this user id
  await repository.delete(rec.id)
  // NOTE: 3- get user role
  let userRoleRec = await websiteRepository.getRole({
    id: rec.role_id,
  })
  if (!Object.keys(userRoleRec).length || rec.error !== undefined) {
    await res.send({
      error_message: 'error loading user role',
    })
    return res
  }
  // NOTE: 4- set user data in session
  req.session.user = {
    user_id: rec.id.toString(),
    user_name: rec.user_name.toString(),
    role_id: userRoleRec.id.toString(),
    user_role_name: userRoleRec.role_name.toString(),
    user_status: 'offline',
  }
  res.pushBroadcastMessage({
    channel: 'session',
    data: {
      data: rec
    },
    notification: {
      user_id: rec.id,
      notification_type: 'log',
      notification_title: 'Session started',
      notification_description: '',
    },
  })
  await res.send({
    data: rec,
    status_code: 0,
    status_msg: 'ready!',
  })
  return res
}
