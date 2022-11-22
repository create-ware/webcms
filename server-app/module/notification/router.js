const session = require('../../lib/session')
const controller = require('./controller')


let routes = [
  {
    method: 'GET',
    url: '/notifications/:page/',
    preHandler: session.isAuthenticated,
    handler: controller.fetch,
    config: { resource_name: 'notification', },
  },
  {
    method: 'GET',
    url: '/notification/:id/',
    preHandler: session.isAuthenticated,
    handler: controller.get,
    config: { resource_name: 'notification', },
  },
]

const API_ROUTER = async (fastify, opts, next) => {
  routes.forEach(route => {
    fastify.route(route)
  })
}

module.exports = API_ROUTER
