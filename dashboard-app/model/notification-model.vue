<script>
import {
  length,
  string,
} from 'vue-mc/validation'

import BaseModel from './structure/base-model'
import APP_SETTINGS from '../app-settings'


class NotificationModel extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
    this.listenPushMessages('notification')
  }
  defaults () {
    return {
      notification_title: '',
      notification_description: '',
      notification_type: '',
      created_at: '',
      user_id: 0,
    }
  }
  routes () {
    return {

    }
  }
}

export default {
  model: NotificationModel,
}

</script>
