<script>
import BaseCollection from './structure/base-collection'
import LanguageModel from './language-model.vue'
import APP_SETTINGS from '../app-settings'


class LanguageCollection extends BaseCollection {
  constructor (models = [], options = {}) {
    super(models, options)
    this.listenPushMessages('language')
  }
  model () {
    return LanguageModel.model
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
      fetchAll: `${ APP_SETTINGS.appApiBaseURL }/languages/all/`,
      fetch: `${ APP_SETTINGS.appApiBaseURL }/languages/{page_number}/`,
      search: `${ APP_SETTINGS.appApiBaseURL }/languages/`,
    }
  }
}

export default {
  model: LanguageCollection,
}
</script>
