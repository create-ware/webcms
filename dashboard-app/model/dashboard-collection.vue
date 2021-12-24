<script>
import BaseCollection from './structure/base-collection'
import APP_SETTINGS from '../app-settings'


class DashboardCollection extends BaseCollection {
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
      fetch: `${ APP_SETTINGS.appApiBaseURL }/dashboard/`,
    }
  }
}

export default {
  model: DashboardCollection,
}
</script>
