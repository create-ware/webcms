const session = require('../../lib/session')
const controller = require('./controller')


let routes = [
  {
    method: 'GET',
    url: '/resources/all/',
    preHandler: session.isAuthenticated,
    handler: controller.fetchAll,
    config: { resource_name: 'resource', },
  },
  {
    method: 'GET',
    url: '/resources/:page/',
    preHandler: session.isAuthenticated,
    handler: controller.fetch,
    config: { resource_name: 'resource', },
  },
  {
    method: 'GET',
    url: '/resources/',
    preHandler: session.isAuthenticated,
    querystring: {
      s: { type: 'string' }
    },
    handler: controller.search,
    config: { resource_name: 'resource', },
  },
  {
    method: 'GET',
    url: '/resource/:id/',
    preHandler: session.isAuthenticated,
    handler: controller.get,
    config: { resource_name: 'resource', },
  },
  {
    method: 'POST',
    url: '/resource/',
    preHandler: session.isAuthenticated,
    handler: controller.save,
    config: { resource_name: 'resource', },
    schema: {
      body: {
        type: 'object',
        properties: {
          resource_name: { type: 'string' },
          resource_description: { type: 'string' },
          resource_type: { type: 'string' },
          resource_path: { type: 'string' },
        },
        required: [
          'resource_name',
          'resource_description',
          'resource_type',
          'resource_path',
        ],
      },
    },
    attachValidation: true,
  },
  {
    method: 'PUT',
    url: '/resource/',
    preHandler: session.isAuthenticated,
    handler: controller.update,
    config: { resource_name: 'resource', },
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          resource_name: { type: 'string' },
          resource_description: { type: 'string' },
          resource_type: { type: 'string' },
          resource_path: { type: 'string' },
        },
        required: [
          'id',
          'resource_name',
          'resource_description',
          'resource_type',
          'resource_path',
        ],
      },
    },
    attachValidation: true,
  },
  {
    method: 'DELETE',
    url: '/resource/',
    preHandler: session.isAuthenticated,
    handler: controller.delete,
    config: { resource_name: 'resource', },
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
    attachValidation: true,
  },
]

const API_ROUTER = async (fastify, opts, next) => {
  routes.forEach(route => {
    fastify.route(route)
  })
}

module.exports = API_ROUTER
