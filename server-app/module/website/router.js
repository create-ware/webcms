const session = require('../../lib/session')
const controller = require('./controller')


let routes = [
  {
    method: 'GET',
    url: '/',
    handler: controller.validateRequestAccess,
    config: { free: true, },
  },
  {
    method: 'POST',
    url: '/',
    preHandler: session.validateSchema,
    handler: controller.validateLoginAccess,
    schema: {
      body: {
        type: 'object',
        properties: {
          user_name: { type: 'string' },
          user_pass: { type: 'string' },
        },
        required: [
          'user_name',
          'user_pass',
        ],
      },
    },
    config: { free: true, },
    attachValidation: true,
  },
  {
    method: 'GET',
    url: '/logout',
    handler: controller.logout,
    config: { free: true, },
  },
  {
    method: 'GET',
    url: '/dashboard*',
    preHandler: session.isAuthenticated,
    handler: controller.dashboardView,
    config: { free: true, },
  },
  {
    method: 'GET',
    url: '/recover-account',
    handler: controller.websiteRecoverAccountView,
    config: { free: true, },
  },
  {
    method: 'POST',
    url: '/recover-account',
    preHandler: session.validateSchema,
    handler: controller.websiteRecoverAccount,
    config: { free: true, },
    schema: {
      body: {
        type: 'object',
        properties: {
          email_address: { type: 'string' },
        },
        required: [
          'email_address',
        ],
      },
    },
    attachValidation: true,
  },
  {
    method: 'GET',
    url: '/reset-password/:token',
    handler: controller.websiteResetPasswordView,
    config: { free: true, },
  },
  {
    method: 'POST',
    url: '/reset-password/',
    preHandler: session.validateSchema,
    handler: controller.websiteResetPassword,
    schema: {
      body: {
        type: 'object',
        properties: {
          new_password: { type: 'string' },
        },
        required: [
          'new_password',
        ],
      },
    },
    config: { free: true, },
    attachValidation: true,
  },
]

const ROUTER = async (fastify, opts, next) => {
  routes.forEach(route => {
    fastify.route(route)
  })
}

module.exports = ROUTER
