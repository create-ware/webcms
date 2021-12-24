<script>
import BaseCollection from './structure/base-collection'
import RoleModel from './role-model.vue'
import APP_SETTINGS from '../app-settings'


class RoleCollection extends BaseCollection {
  constructor (models = [], options = {}) {
    super(models, options)
    this.listenPushMessages('role')
  }
  model () {
    return RoleModel.model
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
      fetch: `${ APP_SETTINGS.appApiBaseURL }/roles/{page_number}/`,
      search: `${ APP_SETTINGS.appApiBaseURL }/roles/`,
    }
  }
}

export default {
  model: RoleCollection,
}
</script>
