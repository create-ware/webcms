const session = require('../../lib/session')
const controller = require('./controller')


let routes = [
  {
    method: 'GET',
    url: '/files/:page/',
    preHandler: session.isAuthenticated,
    handler: controller.fetch,
    config: { resource_name: 'files', },
  },
  {
    method: 'GET',
    url: '/files/',
    preHandler: session.isAuthenticated,
    querystring: {
      s: { type: 'string' }
    },
    handler: controller.search,
    config: { resource_name: 'files', },
  },
  {
    method: 'GET',
    url: '/file/:id/',
    preHandler: session.isAuthenticated,
    handler: controller.get,
    config: { resource_name: 'file', },
  },
  {
    method: 'POST',
    url: '/file/',
    preHandler: session.isAuthenticated,
    handler: controller.store,
    config: { resource_name: 'file', },
    attachValidation: true,
  },
  {
    method: 'PUT',
    url: '/file/',
    preHandler: session.isAuthenticated,
    handler: controller.update,
    config: { resource_name: 'file', },
    attachValidation: true,
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          file_title: { type: 'string' },
        },
        required: [
          'id',
          'file_title',
        ],
      },
    },
  },
  {
    method: 'DELETE',
    url: '/file/',
    preHandler: session.isAuthenticated,
    handler: controller.delete,
    config: { resource_name: 'file', },
    attachValidation: true,
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
        },
        required: [
          'id',
        ],
      },
    },
  },
]

const API_ROUTER = async (fastify, opts, next) => {
  routes.forEach(route => {
    fastify.route(route)
  })
}

module.exports = API_ROUTER
