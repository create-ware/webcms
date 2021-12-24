import {
  Model,
} from 'vue-mc'

import Socket from '../../lib/socket-io.vue'


let io = new Socket.IO()


export default class BaseModel extends Model {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
  }
  listenPushMessages (modelName = '') {
    if (modelName === '')
      return

    if (modelName === 'profile' || modelName === 'user')
      this._listenUserStatusMessages()
    if (Vue.prototype.appLoaded) {
      this._registerDefaultEventNotification(modelName)
      return
    }
    Vue.prototype.$eventHub.$on('app-user-profile-loaded', data => {
      Vue.prototype.appLoaded = true
      this._registerDefaultEventNotification(modelName)
    })
  }
  _registerDefaultEventNotification (modelName = '') {
    io.registerEvent(
      `${ modelName }-put`,
      data => {
        let identifier = this.getOption('identifier')
        if (this.get(identifier) !== data.data[identifier])
          return

        this.set(data.data)
        // NOTE: add functionality for ask to user for new model data version
        this.sync()
        this.emit('notification', { method: 'put' })
      }
    )
    io.registerEvent(
      `${ modelName }-delete`,
      data => {
        let identifier = this.getOption('identifier')
        if (this.get(identifier) !== data.data[identifier])
          return

        this.removeFromAllCollections()
        this.emit('notification', { method: 'delete' })
      }
    )
  }
  listenPushGlobalMessages (modelName = '', event = '') {
    if (modelName === '')
      return

    io.registerEvent(
      `${ Vue.prototype.$appDashboard }-${ modelName }-${ event }`,
      data => {
        let identifier = this.getOption('identifier')
        if (this.get(identifier) === data.data[identifier])
          this.set(data.data)
      }
    )
  }
  _listenUserStatusMessages () {
    io.registerEvent(
      'user-status',
      data => {
        let identifier = this.getOption('identifier')
        if (this.get(identifier) === data.data[identifier])
          this.set('user_status', data.data.user_status)
      }
    )
  }
  off (eventName) {
    delete this._listeners[eventName]
  }
  getHeaders () {
    return Vue.axios.defaults.headers.common
  }
  createRequest (config) {
    // NOTE: overriding - using custom axios instance
    config.headers = Vue.axios.defaults.headers.common
    return {
      send: () => Vue.axios(config).then(response => {
        return {
          getData: () => response.data,
          getStatus: () => response.status,
        }
      })
    }
  }
  onFetchSuccess (response) {
    // NOTE: overriding
    let attributes = response.getData().data
    // A fetch request must receive *some* data in return.
    if (_.isEmpty(attributes))
      throw this.createResponseError('No data in fetch response', response)
    this.assign(attributes)
    Vue.set(this, 'fatal',   false)
    Vue.set(this, 'loading', false)
    this.emit('fetch', { error: null })
  }
  update (data) {
    // NOTE: overriding
    return super.update(data.data)
  }
  options () {
    return {
      identifier: 'id',
      validateOnChange: true,
      validateRecursively: true,
      useFirstErrorOnly: true,
      saveUnchanged: false,
      mutateOnChange: true,
      isActiveRequest: false, // custom option
    }
  }
  _modelFetch (methodName, routeName, params) {
    let method = methodName
    let route = this.getRoute(routeName)
    let url = this.getURL(route, this.getRouteParameters())
    let header = this.getHeaders()
    let data = this._attributes
    let config = {
      url,
      method,
      data,
      params,
      header,
    }
    let request = this.request(
      config,
      this.onFetch,
      this.onFetchSuccess,
      this.onFetchFailure
    )
    return request
  }
  _modelSave (methodName, routeName, params) {
    let method = methodName
    let route = this.getRoute(routeName)
    let url = this.getURL(route, this.getRouteParameters())
    let header = this.getHeaders()
    let data = this._attributes
    let config = {
      url,
      method,
      data,
      params,
      header,
    }
    let request = this.request(
      config,
      this.onSave,
      this.onSaveSuccess,
      this.onSaveFailure)
    return request
  }
  _modelDelete (methodName, routeName, params) {
    let method = methodName
    let route = this.getRoute(routeName)
    let url = this.getURL(route, this.getRouteParameters())
    let header = this.getHeaders()
    let data = this._attributes
    let config = {
      url,
      method,
      data,
      params,
      header,
    }
    let request = this.request(
      config,
      this.onDelete,
      this.onDeleteSuccess,
      this.onDeleteFailure)
    return request
  }
  save (params) {
    return this._modelSave(
      'POST',
      'save',
      params)
  }
  put (params) {
    return this._modelSave(
      'PUT',
      'put',
      params)
  }
  delete (params) {
    return this._modelDelete(
      'DELETE',
      'delete',
      params)
  }
}
