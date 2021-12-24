import {
  Collection,
} from 'vue-mc'


import Socket from '../../lib/socket-io.vue'


let io = new Socket.IO()


export default class BaseCollection extends Collection {
  constructor (models = [], options = {}) {
    super(models, options)
  }
  listenPushMessages (modelName = '') {
    if (modelName === '')
      return

    if (Vue.prototype.appLoaded) {
      this._registerDefaultEventNotification(modelName)
      return
    }
    Vue.prototype.$eventHub.$on('app-user-profile-loaded', data => {
      this._registerDefaultEventNotification(modelName)
    })
  }
  _registerDefaultEventNotification (modelName = '') {
    io.registerEvent(
      `${ modelName }-post`,
      data => {
        this.add(data.data)
        let lastModel = this.models.pop()
        this.models.unshift(lastModel)
        this.emit('notification', { method: 'post' })
      }
    )
    io.registerEvent(
    `${ modelName }-put`,
      data => {
        this.emit('notification', { method: 'put' })
      }
    )
    io.registerEvent(
      `${ modelName }-delete`,
      data => {
        this.emit('notification', { method: 'delete' })
      }
    )
  }
  listenPushGlobalMessages (modelName = '', event = '') {
    if (modelName === '')
      return

    if (Vue.prototype.appLoaded) {
      this._registerCustomEventNotification(modelName, event)
      return
    }
    Vue.prototype.$eventHub.$on('app-user-profile-loaded', data => {
      Vue.prototype.appLoaded = true
      this._registerCustomEventNotification(modelName, event)
    })
  }
  _registerCustomEventNotification (modelName = '', event = '') {
    io.registerEvent(
      `${ Vue.prototype.$appDashboard }-${ modelName }-${ event }`,
      data => {
        this.add(data.data)
        let lastModel = this.models.pop()
        this.models.unshift(lastModel)
        this.emit('notification', { method: 'post' })
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
    // NOTE: using custom axios instance
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
  getChangedModels () {
    return this.filter(model => {
      let id = model.get('_id')
      if (id === undefined || id === '')
        id = model.get('id')
      if (model.changed() || id === undefined) {
        return true
      }

      return false
    })
  }
  getModelsFromResponse (response) {
    // overriding
    return response.getData().items
  }
  _collectionFetch (methodName, routeName, params) {
    let method = methodName
    let route = this.getRoute(routeName)
    let url = this.getURL(route, this.getRouteParameters())
    let header = this.getHeaders()
    let config = {
      url,
      method,
      params,
      header,
    }
    let request = this.request(
      config,
      this.onFetch,
      this.onFetchSuccess,
      this.onFetchFailure,
    )
    return request
  }
  fetchAll (params) {
    return this._collectionFetch(
      'GET',
      'fetchAll',
      params,
    )
  }
  search (params) {
    return this._collectionFetch(
      'GET',
      'search',
      params,
    )
  }
}
