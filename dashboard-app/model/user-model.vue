<script>
import {
  length,
  string,
  email,
} from 'vue-mc/validation'

import BaseModel from './structure/base-model'
import APP_SETTINGS from '../app-settings'


class UserModel extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
    this.listenPushMessages('user')
  }
  defaults () {
    return {
      id: 0,
      user_name: '',
      user_pass: '',
      user_email: '',
      user_first_name: '',
      user_last_name: '',
      user_active: true,
      role_id: 0,
      language_id: 0,
      created_at: '',
      updated_at: '',
      profile_file_id: 0,
      user_status: 'offline',
    }
  }
  mutations() {
    return {
      id: Number,
      user_name: String,
      user_pass: String,
      user_email: String,
      user_first_name: String,
      profile_file_id: Number,
    }
  }
  validation() {
    return {
      user_name: string.and(length(2, 100)),
      user_pass: value => {
          let id = this.get('id')
          if (id !== undefined && value === '')
            return

          if (value.length < 2 || value.length > 100)
            return 'Must have a length between 2 and 100'

          return
        },
      user_email: email,
      user_first_name: string.and(length(2, 100)),
    }
  }
  routes () {
    return {
      fetch: `${ APP_SETTINGS.appApiBaseURL }/user/{id}/`,
      save: `${ APP_SETTINGS.appApiBaseURL }/user/`,
      put: `${ APP_SETTINGS.appApiBaseURL }/user/`,
      delete: `${ APP_SETTINGS.appApiBaseURL }/user/`,
    }
  }
}

export default {
  model: UserModel,
}
</script>
