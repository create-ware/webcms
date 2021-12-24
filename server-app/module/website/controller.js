const dateTime = require('node-datetime')
const crypto = require('crypto')

const DASHBOARD_ADMIN_CONFIG = require('../../config/dashboard-admin-config')
const SITE_CONFIG = require('../../config/site-config')
const VIEW_FUNCTIONS = require('../../lib/view-functions')
const RESOURCES = require('../../config/resources')
const APP_CONFIG = require('../../config/config')
const session = require('../../lib/session')
const repository = require('./repository')
const sessionRepository = require('../session/repository')
const userRepository = require('../user/repository')


exports.validateRequestAccess = async (req, res) => {
  if (req.session.user) {
    await res.redirect('dashboard')
    return
  }
  await res.view('dashboard-login', {
    title: DASHBOARD_ADMIN_CONFIG.dashboardTitle,
    error_message: '',
    csrfToken: res.generateCsrf(),
  })
}

exports.validateLoginAccess = async (req, res) => {
  const user_name = req.body.user_name
  const user_pass = req.body.user_pass
  // NOTE: 1- get user
  let userRec = await userRepository.getByUserName(user_name)
  // NOTE: 2- validations
  let errorMessage = ''
  if (!Object.keys(userRec).length || userRec.error !== undefined)
    errorMessage = 'invalid user'
  if (errorMessage === '' && !userRec.user_active)
    errorMessage = 'user not activated'
  if (errorMessage === '') {
    let result = await session.passwordIsEqual(user_pass, userRec.user_pass)
    if (!result)
      errorMessage = 'invalid password'
  }
  if (errorMessage !== '') {
    res.view('dashboard-login', {
      viewFunctions: VIEW_FUNCTIONS,
      title: DASHBOARD_ADMIN_CONFIG.dashboardTitle,
      error_message: errorMessage,
      csrfToken: res.generateCsrf(),
    })
    return res
  }
  // NOTE: 3- get user role
  let userRoleRec = await repository.getRole({
    id: userRec.role_id,
  })
  if (!Object.keys(userRoleRec).length || userRec.error !== undefined) {
    res.view('dashboard-login', {
      viewFunctions: VIEW_FUNCTIONS,
      title: DASHBOARD_ADMIN_CONFIG.dashboardTitle,
      error_message: 'error loading user role',
      csrfToken: res.generateCsrf(),
    })
    return res
  }
  // NOTE: remove sessions for this user id
  await sessionRepository.delete(userRec.id)
  // NOTE: 5- set user data in session
  req.session.user = {
    id: userRec.id.toString(),
    user_id: userRec.user_id.toString(),
    user_name: userRec.user_name.toString(),
    role_id: userRoleRec.id.toString(),
    user_role_name: userRoleRec.role_name.toString(),
    user_status: 'offline',
  }
  res.redirect('dashboard')
}

exports.logout = async (req, res) => {
  if (req.session && req.session.user) {
    let sessionId = req.session.sessionId
    await sessionRepository.updateUserStatus(sessionId, 'offline')
    await sessionRepository.delete(req.session.user.id)
    req.sessionStore.destroy(sessionId)
    req.session = null
  }
  res.redirect('/')
}

exports.dashboardView = async (req, res) => {
  await res.view('dashboard-index', {
    viewFunctions: VIEW_FUNCTIONS,
    title: DASHBOARD_ADMIN_CONFIG.dashboardTitle,
  })
}

exports.websiteRecoverAccountView = async (req, res) => {
  res.view('recover-account', {
    viewFunctions: VIEW_FUNCTIONS,
    title: 'recover account',
    error_message: req.query.error_message,
    success_message: req.query.success_message,
    csrfToken: res.generateCsrf(),
  })
}

exports.websiteRecoverAccount = async (req, res) => {
  res.redirect('/')
}

exports.websiteResetPasswordView = async (req, res) => {
  res.redirect('/')
}

exports.websiteResetPassword = async (req, res) => {
  res.redirect('/')
}
