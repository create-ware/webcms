<script>
import BaseCollection from './structure/base-collection'
import APP_SETTINGS from '../app-settings'


class SearchFileCollection extends BaseCollection {
  constructor (models = [], options = {}) {
    super(models, options)
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
      search: `${ APP_SETTINGS.appApiBaseURL }/files/`,
    }
  }
}

export default {
  model: SearchFileCollection,
}
</script>
