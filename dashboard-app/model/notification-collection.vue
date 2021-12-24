<script>
import BaseCollection from './structure/base-collection'
import NotificationModel from './notification-model.vue'
import APP_SETTINGS from '../app-settings'


class NotificationCollection extends BaseCollection {
  constructor (models = [], options = {}) {
    super(models, options)
    this.listenPushMessages('notification')
  }
  model () {
    return NotificationModel.model
  }
  defaults () {
    return {
      page_number: 1,
      total_pages: '',
      total_skipped_items: '',
    }
  }
  routes () {
    return {
      fetch: `${ APP_SETTINGS.appApiBaseURL }/notifications/{page_number}/`,
      search: `${ APP_SETTINGS.appApiBaseURL }/notifications/`,
    }
  }
}

export default {
  model: NotificationCollection,
}
</script>
