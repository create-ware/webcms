<script>
import {
  length,
  string,
} from 'vue-mc/validation'

import BaseModel from './structure/base-model'
import APP_SETTINGS from '../app-settings'


class RoleModel extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
    this.listenPushMessages('role')
  }
  defaults () {
    return {
      role_name: '',
      created_at: '',
      updated_at: '',
      role_resources: [],
    }
  }
  mutations () {
    return {
      role_name: String,
    }
  }
  validation () {
    return {
      role_name: string.and(length(2, 150)),
    }
  }
  routes () {
    return {
      fetch: `${ APP_SETTINGS.appApiBaseURL }/role/{id}/`,
      save: `${ APP_SETTINGS.appApiBaseURL }/role/`,
      put: `${ APP_SETTINGS.appApiBaseURL }/role/`,
      delete: `${ APP_SETTINGS.appApiBaseURL }/role/`,
    }
  }
}

export default {
  model: RoleModel,
}

</script>
