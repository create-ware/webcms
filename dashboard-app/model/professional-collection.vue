<script>
import BaseCollection from './structure/base-collection'
import ProfessionalModel from './professional-model.vue'
import APP_SETTINGS from '../app-settings'


class ProfessionalCollection extends BaseCollection {
  constructor (models = [], options = {}) {
    super(models, options)
    this.listenPushMessages('professional')
  }
  model () {
    return ProfessionalModel.model
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
      fetch: `${ APP_SETTINGS.appApiBaseURL }/professionals/{page_number}/`,
      search: `${ APP_SETTINGS.appApiBaseURL }/professionals/`,
    }
  }
}

export default {
  model: ProfessionalCollection,
}
</script>
