<script>
import {
  length,
  string,
} from 'vue-mc/validation'

import BaseModel from './structure/base-model'
import APP_SETTINGS from '../app-settings'


class LanguageModel extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
    this.listenPushMessages('language')
  }
  defaults () {
    return {
      id: 0,
      language_name: '',
      created_at: '',
      updated_at: '',
      language_messages: [],
    }
  }
  mutations () {
    return {
      id: Number,
      language_name: String,
    }
  }
  validation () {
    return {
      language_name: value => {
        if (value.length < 2)
          return 'Must have a length of at least 2'

        return
      },
    }
  }
  routes () {
    return {
      fetch: `${ APP_SETTINGS.appApiBaseURL }/language/{id}/`,
      save: `${ APP_SETTINGS.appApiBaseURL }/language/`,
      put: `${ APP_SETTINGS.appApiBaseURL }/language/`,
      delete: `${ APP_SETTINGS.appApiBaseURL }/language/`,
    }
  }
}

export default {
  model: LanguageModel,
}
</script>
