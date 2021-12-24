const bcrypt = require('bcrypt')
const dateTime = require('node-datetime')

const APP_CONFIG = require('../config/config')
const DASHBOARD_ADMIN_CONFIG = require('../config/dashboard-admin-config')
const sessionRepository = require('../module/session/repository')
const permission = require('./permission')


const isAuthenticated = async (req, res) => {
  if (req.session.user === undefined) {
    const urlData = req.urlData()
    if (urlData.path.indexOf('/dashboard/api/') >= 0) {
      await res.send({
        status_code: 3,
        status_msg: 'Session Finished',
      })
      return
    }
    if (urlData.path.match('/dashboard/$') !== null)
      req.session.lastPath = urlData.path
    await res.view('dashboard-login', {
      title: DASHBOARD_ADMIN_CONFIG.dashboardTitle,
      error_message: '',
      csrfToken: await res.generateCsrf(),
    })
    return
  }
  // NOTE: check for validation and permission errors
  if (req.validationError) {
    let fisrtMessage = req.validationError.validation[0]
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: fisrtMessage.message,
    })
    return res
  }
  if (req.context.config.free === undefined || !req.context.config.free) {
    let hasPermission = await permission.canUser({
      req: req,
      res: res,
    })
    if (!hasPermission) {
      res.code(500)
      await res.send({
        status_code: 1,
        status_msg: 'You don\'t have permission',
      })
      return res
    }
  }
  if (req.session.lastPath) {
    let redirectURL = req.session.lastPath
    req.session.lastPath = ''
    await res.redirect(redirectURL)
    return
  }
}

const validateSchema = async (req, res) => {
  if (req.validationError) {
    let fisrtMessage = req.validationError.validation[0]
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: fisrtMessage.message,
    })
    return res
  }
}

const saveSessionOnDB = (sessionID, user) => {
  // let session = new sessionRepository()
  // session._id = sessionID
  // session.createdAt = dateTime.create().now()
  // session.session_user = user
  // session.save()
}

const hashPassword = async (userPass) => {
  try {
    let hashedPassword = await bcrypt.hash(userPass, APP_CONFIG.bcryptSaltRounds)
    return hashedPassword
  } catch (err) {
    return err
  }
}

const passwordIsEqual = (userPass, hashedPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(userPass, hashedPassword)
      .then(result => {
        resolve(result)
      })
      .catch(err => {
        reject(err)
      })
  })
}

const currentUserSessionDataChanged = (user, req) => {
  return new Promise((resolve, reject) => {
    let removeSession = false
    // NOTE: improve this with session collection
    if (user._id.toString() !== req.session.user.id.toString())
      resolve(false)
    else if (user.role_id.toString() !== req.session.user.role_id.toString())
      removeSession = true
    else if (user.user_name.toString() !== req.session.user.user_name.toString())
      removeSession = true
    else if (user.user_pass.toString() !== req.session.user.user_pass.toString())
      removeSession = true
    if (removeSession) {
      req.sessionStore.destroy(req.session.sessionId)
      resolve(true)
    }
    resolve(false)
  })
}

const removeUserSessionOnDB = async userId => {
  try {
    let session = await sessionRepository.delete(userId)
    if (session.error === undefined)
      return true

    return false
  } catch (err) {
    return false
  }
}

module.exports = {
  isAuthenticated: isAuthenticated,
  hashPassword: hashPassword,
  passwordIsEqual: passwordIsEqual,
  currentUserSessionDataChanged: currentUserSessionDataChanged,
  removeUserSessionOnDB: removeUserSessionOnDB,
  saveSessionOnDB: saveSessionOnDB,
  validateSchema: validateSchema,
}
