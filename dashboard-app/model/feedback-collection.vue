<script>
import BaseCollection from '../model/structure/base-collection'
import FeedbackModel from './feedback-model.vue'
import APP_SETTINGS from '../app-settings'


class FeedbackCollection extends BaseCollection {
  constructor (models = [], options = {}) {
    super(models, options)
    this.listenPushMessages('feedback')
  }
  model () {
    return FeedbackModel.model
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
      fetch: `${ APP_SETTINGS.appApiBaseURL }/feedbacks/{page_number}/`,
      search: `${ APP_SETTINGS.appApiBaseURL }/feedbacks/`,
    }
  }
}

export default {
  model: FeedbackCollection,
}
</script>
