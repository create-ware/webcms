<script>
import BaseCollection from './structure/base-collection'
import InterpreterModel from './interpreter-model.vue'
import APP_SETTINGS from '../app-settings'


class InterpreterCollection extends BaseCollection {
  constructor (models = [], options = {}) {
    super(models, options)
    this.listenPushMessages('interpreter')
  }
  model () {
    return InterpreterModel.model
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
      fetch: `${ APP_SETTINGS.appApiBaseURL }/interpreters/{page_number}/`,
      search: `${ APP_SETTINGS.appApiBaseURL }/interpreters/`,
    }
  }
}

export default {
  model: InterpreterCollection,
}
</script>
