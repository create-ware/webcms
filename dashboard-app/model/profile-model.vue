<script>
import {
  length,
  string,
  email,
} from 'vue-mc/validation'

import BaseModel from './structure/base-model'
import APP_SETTINGS from '../app-settings'


class ProfileModel extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
    this.listenPushMessages('profile')
  }
  defaults () {
    return {
      id: 0,
      user_name: '',
      user_email: '',
      user_first_name: '',
      user_last_name: '',
      role_id: 0,
      user_pass: '',
      role_resources: [],
      profile_file_id: 0,
      user_status: 'offline',
    }
  }
  mutations() {
    return {
      id: Number,
      user_name: String,
      user_email: String,
      user_first_name: String,
      language_id: Number,
      role_id: Number,
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
      fetch: `${ APP_SETTINGS.appApiBaseURL }/profile/`,
      put: `${ APP_SETTINGS.appApiBaseURL }/profile/`,
    }
  }
}

export default {
  model: ProfileModel,
}

</script>
