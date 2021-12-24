<script>
import {
  length,
  string,
} from 'vue-mc/validation'

import BaseModel from '../model/structure/base-model'
import APP_SETTINGS from '../app-settings'


class FeedbackModel extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
    this.listenPushMessages('feedback')
  }
  defaults () {
    return {
      id: 0,
      company_id: 0,
      feedback_user_name: '',
      feedback_anonymous: false,
      feedback_suggestion: false,
      feedback_description: '',
      feedback_date: '',
    }
  }
  options () {
    return {
      identifier: 'id',
      validateOnChange: true,
      validateRecursively: true,
      useFirstErrorOnly: true,
      saveUnchanged: false,
      isActiveRequest: false,
      responseKeyData: 'data',
    }
  }
  mutations () {
    return {
      feedback_anonymous: Boolean,
      feedback_suggestion: Boolean,
      feedback_description: String,
      feedback_date: String,
    }
  }
  validation () {
    return {
      feedback_description: value => {
        if (value.length < 2)
          return 'Must have a length of at least 2'

        return
      },
    }
  }
  routes () {
    return {
      fetch: `${ APP_SETTINGS.appApiBaseURL }/feedback/{id}/`,
      save: `${ APP_SETTINGS.appApiBaseURL }/feedback/`,
      put: `${ APP_SETTINGS.appApiBaseURL }/feedback/`,
      delete: `${ APP_SETTINGS.appApiBaseURL }/feedback/`,
    }
  }
}

export default {
  model: FeedbackModel,
}
</script>
