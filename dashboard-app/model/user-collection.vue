<script>
import BaseCollection from './structure/base-collection'
import UserModel from './user-model.vue'
import APP_SETTINGS from '../app-settings'


class UserCollection extends BaseCollection {
  constructor (models = [], options = {}) {
    super(models, options)
    this.listenPushMessages('user')
  }
  model () {
    return UserModel.model
  }
  defaults () {
    return {
      page_number: '',
      total_pages: '',
      total_skipped_items: '',
    }
  }
  routes () {
    return {
      fetch: `${ APP_SETTINGS.appApiBaseURL }/users/{page_number}/`,
      search: `${ APP_SETTINGS.appApiBaseURL }/users/`,
    }
  }
}

export default {
  model: UserCollection,
}
</script>
