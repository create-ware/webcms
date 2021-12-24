<script>
import BaseCollection from './structure/base-collection'
import FileModel from './file-model.vue'
import APP_SETTINGS from '../app-settings'


class FileCollection extends BaseCollection {
  constructor (models = [], options = {}) {
    super(models, options)
    this.listenPushMessages('file')
  }
  model () {
    return FileModel.model
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
      search: `${ APP_SETTINGS.appApiBaseURL }/files/{page_number}/`,
      fetch: `${ APP_SETTINGS.appApiBaseURL }/files/{page_number}/`,
      search: `${ APP_SETTINGS.appApiBaseURL }/files/`,
    }
  }
}

export default {
  model: FileCollection,
}
</script>
