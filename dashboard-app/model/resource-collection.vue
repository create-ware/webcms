<script>
import BaseCollection from './structure/base-collection'
import ResourceModel from './resource-model.vue'
import APP_SETTINGS from '../app-settings'


class ResourceCollection extends BaseCollection {
  constructor (models = [], options = {}) {
    super(models, options)
    this.listenPushMessages('resource')
  }
  model () {
    return ResourceModel.model
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
      fetchAll: `${ APP_SETTINGS.appApiBaseURL }/resources/all/`,
      fetch: `${ APP_SETTINGS.appApiBaseURL }/resources/{page_number}/`,
      search: `${ APP_SETTINGS.appApiBaseURL }/resources/`,
    }
  }
}

export default {
  model: ResourceCollection,
}
</script>
