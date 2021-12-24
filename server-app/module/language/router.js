const session = require('../../lib/session')
const controller = require('./controller')


let routes = [
  {
    method: 'GET',
    url: '/languages/all/',
    preHandler: session.isAuthenticated,
    handler: controller.fetchAll,
    config: { resource_name: 'languages', },
  },
  {
    method: 'GET',
    url: '/languages/:page/',
    preHandler: session.isAuthenticated,
    handler: controller.fetch,
    config: { resource_name: 'languages', },
  },
  {
    method: 'GET',
    url: '/languages/',
    preHandler: session.isAuthenticated,
    querystring: {
      s: { type: 'string' }
    },
    handler: controller.search,
    config: { resource_name: 'languages', },
  },
  {
    method: 'GET',
    url: '/language/:id/',
    preHandler: session.isAuthenticated,
    handler: controller.get,
    config: { resource_name: 'language', },
  },
  {
    method: 'POST',
    url: '/language/',
    preHandler: session.isAuthenticated,
    handler: controller.save,
    config: { resource_name: 'language', },
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          language_name: { type: 'string' },
          language_messages: { type: 'array' },
        },
        required: [
          'id',
          'language_name',
          'language_messages',
        ],
      },
    },
  },
  {
    method: 'PUT',
    url: '/language/',
    preHandler: session.isAuthenticated,
    handler: controller.update,
    config: { resource_name: 'language', },
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          language_name: { type: 'string' },
          language_messages: { type: 'array' },
        },
        required: [
          'id',
          'language_name',
          'language_messages',
        ],
      },
    },
  },
  {
    method: 'DELETE',
    url: '/language/',
    preHandler: session.isAuthenticated,
    handler: controller.delete,
    config: { resource_name: 'language', },
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          language_name: { type: 'string' },
          language_messages: { type: 'array' },
        },
        required: [
          'id',
          'language_name',
          'language_messages',
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
