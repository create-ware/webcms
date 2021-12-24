
const session = require('../../lib/session')
const controller = require('./controller')


let routes = [
  {
    method: 'GET',
    url: '/search*',
    preHandler: session.isAuthenticated,
    handler: controller.search,
    schema: {
      querystring: {
        type: 'object',
        properties: {
          search: { type: 'string' },
        },
        required: [
          'search',
        ],
      },
    },
    config: { resource_name: 'search', },
  },
]

const API_ROUTER = async (fastify, opts, next) => {
  routes.forEach(route => {
    fastify.route(route)
  })
}

module.exports = API_ROUTER
