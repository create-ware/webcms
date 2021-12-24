<script>
import {
  length,
  string,
} from 'vue-mc/validation'

import BaseModel from './structure/base-model'
import APP_SETTINGS from '../app-settings'

let resourceNameRegex = /[^a-z\-]+/g
let sapaceRegex = /(^\s)/g


class ResourceModel extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
    this.listenPushMessages('resource')
  }
  defaults () {
    return {
      resource_name: '',
      resource_description: '',
      resource_type: '',
      resource_path: '',
      created_at: '',
      updated_at: '',
    }
  }
  mutations () {
    return {
      resource_name: String,
      resource_description: String,
      resource_type: String,
      resource_path: String,
    }
  }
  validation () {
    return {
      resource_name: value => {
        if (value.match(sapaceRegex))
          return "Not spaces only '-'"

        if (value.match(resourceNameRegex))
          return 'Only letters'

        if (value.length < 2)
          return 'Must have a length of at least 2'

        return
      },
      resource_description: string.and(length(2, 150)),
      resource_path: value => {
        if (this.resource_type !== 'data')
          return

        if (value === '')
          return 'Required'
      },
    }
  }
  routes () {
    return {
      fetch: `${ APP_SETTINGS.appApiBaseURL }/resource/{id}/`,
      save: `${ APP_SETTINGS.appApiBaseURL }/resource/`,
      put: `${ APP_SETTINGS.appApiBaseURL }/resource/`,
      delete: `${ APP_SETTINGS.appApiBaseURL }/resource/`,
    }
  }
}

export default {
  model: ResourceModel,
}
</script>
