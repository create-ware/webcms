const roleResourceRepository = require('../module/role-resource/repository')


const API_PERMISSION = {
  GET: 'r',
  POST: 'c',
  PUT: 'u',
  DELETE: 'd',
}

const canUser = async objectData => {
  let permission = API_PERMISSION[objectData.req.context.config.method]
  let userResources = objectData.req.session.user.user_resource
  let resourceName = objectData.req.context.config.resource_name
  let hasPermission = await roleResourceRepository.hasPermission(objectData.req.session.user.role_id, resourceName, permission)
  console.log('== PERMISSION - url | method | permission | res ==', objectData.req.context.config.url, objectData.req.context.config.method, permission, hasPermission)
  return hasPermission
}

module.exports = {
  canUser: canUser,
}
