const getHexColor = (str, plain = false, s = 75, l = 50, opacity = 100) => {
  if (!str)
    return ''
  var hash = 0;
  // var s = 65; // saturation: 0 - 100
  // var l = 65; // lightness: 0 - 100
  for (var i = 0; i < str.length; i++)
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  var h = hash % 360;
  if (plain)
    return `hsl(${ h }deg ${ s }% ${ l }% / ${ opacity }%)`;
  return `background-color: hsl(${ h }deg ${ s }% ${ l }% / ${ opacity }%);`
}

const getAvatarURL = (fileURL, roleName = '') => {
  if (!fileURL)
    return ''

  let fileNameArray = fileURL.split('.')
  let style = ''
  style += `background-image: url(/storage/sizes/${ fileNameArray[0] }-150x150.${ fileNameArray[1] });`
  style += 'background-size: cover;'
  style += 'background-position: center;'
  return style
}

const getThumbnailURL = fileURL => {
  if (!fileURL)
    return ''
  let fileNameArray = fileURL.split('.')
  let style = ''
  style += `background-image: url(/storage/sizes/${ fileNameArray[0] }-600x200.${ fileNameArray[1] });`
  style += 'background-size: cover;'
  style += 'background-position: center;'
  return style
}

const aclReplaceVNode = (el, binding, vNode) => {
  if (!binding.value)
    return
  let permissionResult = aclUserCan(binding.value)
  if (permissionResult)
    return
  const comment = document.createComment('')
  Object.defineProperty(comment, 'setAttribute', {
    value: () => undefined,
  })
  vNode.elm = comment
  vNode.text = ''
  vNode.isComment = true
  vNode.context = undefined
  vNode.tag = undefined
  vNode.data.directives = undefined
  if (vNode.componentInstance)
    vNode.componentInstance.$el = comment
  if (el.parentNode)
    el.parentNode.replaceChild(comment, el)
}

const aclUserCan = resource => {
  // NOTE: in role_resources: ['v',] is 'view'
  let can = false
  if (window.user_data === undefined)
    return can

  let permission = 'v'
  let roleResources = window.user_data.get ? window.user_data.get('role_resources') : window.user_data.role_resources
  let userViewPermissions = []
  for (let rr of roleResources) {
    if (rr.resource_type === 'view')
      userViewPermissions.push(rr)
  }
  for (let userPermission of userViewPermissions) {
    let regx = new RegExp(`^${ resource }$`, 'gi')
    let hasResource = userPermission.resource_name.match(regx)
    let hasPermission = userPermission.permission.includes(permission)
    if (hasResource && hasPermission) {
      can = true
      break
    }
  }
  return can
}

const getCookie = name => {
  for (let i of document.cookie.split(';')) {
    let cookie = i.split('=')
    if (cookie[0].indexOf(name) >= 0)
      return cookie[1].split('.')[0]
  }
}

const isMobile = () => {
  if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    return true
  return false
}

const isImage = (fileName = '') => {
  if (fileName === null)
    return false

  let extension = fileName.split('.').pop()
  if (extension === 'jpg' || extension === 'png' || extension === 'jpeg')
    return true

  return false
}

const getModelColums = (model, prefix, defaultProps) => {
  let propsNames = []
  let attributes = Object.keys(model.attributes)
  for (let attr of attributes) {
    let propName = attr.replace(`${ prefix }_`, '')
    propName = propName.replace(/\_/g, ' ')
    let value = false
    if (defaultProps.includes(attr))
      value = true
    if (attr === 'id')
      value = true
    propsNames.push({
      item_name: propName,
      item_prop: attr,
      item_value: value,
    })
  }
  return propsNames
}

module.exports = {
  getHexColor,
  getAvatarURL,
  getThumbnailURL,
  aclReplaceVNode,
  aclUserCan,
  getCookie,
  isMobile,
  isImage,
  getModelColums,
}
