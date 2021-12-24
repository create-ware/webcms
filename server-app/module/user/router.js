const session = require('../../lib/session')
const controller = require('./controller')


let routes = [
  {
    method: 'GET',
    url: '/users/:page/',
    preHandler: session.isAuthenticated,
    handler: controller.fetch,
    config: { resource_name: 'users', },
  },
  {
    method: 'GET',
    url: '/users/',
    preHandler: session.isAuthenticated,
    querystring: {
      s: { type: 'string' }
    },
    handler: controller.search,
    config: { resource_name: 'users', },
  },
  {
    method: 'GET',
    url: '/user/:id/',
    preHandler: session.isAuthenticated,
    handler: controller.get,
    config: { resource_name: 'user', },
  },
  {
    method: 'POST',
    url: '/user/',
    preHandler: session.isAuthenticated,
    handler: controller.save,
    config: { resource_name: 'user', },
    schema: {
      body: {
        type: 'object',
        properties: {
          user_first_name: { type: 'string' },
          user_last_name: { type: 'string' },
          language_id: { type: 'integer' },
          user_email: { type: 'string' },
          profile_file_id: { type: 'integer' },
          role_id: { type: 'integer' },
          user_pass: { type: 'string' },
        },
        required: [
          'user_first_name',
          'user_last_name',
          'language_id',
          'user_email',
          'role_id',
          'user_pass',
        ],
      },
    },
    attachValidation: true,
  },
  {
    method: 'PUT',
    url: '/user/',
    preHandler: session.isAuthenticated,
    handler: controller.update,
    config: { resource_name: 'user', },
    schema: {
      body: {
        type: 'object',
        properties: {
          user_first_name: { type: 'string' },
          user_last_name: { type: 'string' },
          language_id: { type: 'integer' },
          user_email: { type: 'string' },
          profile_file_id: { type: 'integer' },
          role_id: { type: 'integer' },
        },
        required: [
          'user_first_name',
          'user_last_name',
          'language_id',
          'user_email',
          'role_id',
        ],
      },
    },
    attachValidation: true,
  },
  {
    method: 'DELETE',
    url: '/user/',
    preHandler: session.isAuthenticated,
    handler: controller.delete,
    config: { resource_name: 'user', },
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
