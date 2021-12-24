<script>
import {
  length,
  string,
  email,
} from 'vue-mc/validation'

import BaseModel from './structure/base-model'
import APP_SETTINGS from '../app-settings'


class ProfessionalModel extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
    this.listenPushMessages('professional')
  }
  defaults () {
    return {
      id: 0,
      user_name: '',
      user_active: false,
      role_id: 0,
      profile_file_id: 0,
    }
  }
  mutations() {
    return {
    }
  }
  validation() {
    return {
    }
  }
  routes () {
    return {
      fetch: `${ APP_SETTINGS.appApiBaseURL }/professional/{id}/`,
    }
  }
}

export default {
  model: ProfessionalModel,
}
</script>
