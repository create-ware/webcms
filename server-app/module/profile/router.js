const session = require('../../lib/session')
const controller = require('./controller')


let routes = [
  {
    method: 'GET',
    url: '/profile/',
    preHandler: session.isAuthenticated,
    handler: controller.get,
    config: { resource_name: 'profile', },
  },
  {
    method: 'PUT',
    url: '/profile/',
    preHandler: session.isAuthenticated,
    handler: controller.update,
    config: { resource_name: 'profile', },
    schema: {
      body: {
        type: 'object',
        properties: {
          user_first_name: { type: 'string' },
          user_last_name: { type: 'string' },
          language_id: { type: 'integer' },
          user_email: { type: 'string' },
          profile_file_id: { type: 'integer' },
        },
        required: [
          'user_first_name',
          'user_last_name',
          'language_id',
          'user_email',
        ],
      },
    },
    attachValidation: true,
  },
]

const API_ROUTER = async (fastify, opts, next) => {
  routes.forEach(route => {
    fastify.route(route)
  })
}

module.exports = API_ROUTER
