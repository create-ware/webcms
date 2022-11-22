const session = require('../../lib/session')
const controller = require('./controller')


let routes = [
  {
    method: 'GET',
    url: '/roles/all/',
    preHandler: session.isAuthenticated,
    handler: controller.fetchAll,
    config: { resource_name: 'role', },
  },
  {
    method: 'GET',
    url: '/roles/:page/',
    preHandler: session.isAuthenticated,
    handler: controller.fetch,
    config: { resource_name: 'role', },
  },
  {
    method: 'GET',
    url: '/roles/',
    preHandler: session.isAuthenticated,
    querystring: {
      s: { type: 'string' }
    },
    handler: controller.search,
    config: { resource_name: 'role', },
  },
  {
    method: 'GET',
    url: '/role/:id/',
    preHandler: session.isAuthenticated,
    handler: controller.get,
    config: { resource_name: 'role', },
  },
  {
    method: 'POST',
    url: '/role/',
    preHandler: session.isAuthenticated,
    handler: controller.save,
    config: { resource_name: 'role', },
    schema: {
      body: {
        type: 'object',
        properties: {
          role_name: { type: 'string' },
          role_resources: { type: 'array' },
        },
        required: [
          'role_name',
          'role_resources',
        ],
      },
    },
  },
  {
    method: 'PUT',
    url: '/role/',
    preHandler: session.isAuthenticated,
    handler: controller.update,
    config: { resource_name: 'role', },
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          role_name: { type: 'string' },
          role_resources: { type: 'array' },
        },
        required: [
          'id',
          'role_name',
          'role_resources',
        ],
      },
    },
  },
  {
    method: 'DELETE',
    url: '/role/',
    preHandler: session.isAuthenticated,
    handler: controller.delete,
    config: { resource_name: 'role', },
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          role_name: { type: 'string' },
          role_resources: { type: 'array' },
        },
        required: [
          'id',
          'role_name',
          'role_resources',
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
