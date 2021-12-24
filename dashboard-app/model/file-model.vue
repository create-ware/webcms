<script>
import {
  length,
  string,
} from 'vue-mc/validation'

import BaseModel from './structure/base-model'
import APP_SETTINGS from '../app-settings'


class FileModel extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
    this.listenPushMessages('file')
  }
  defaults () {
    return {
      file_name: '',
      file_title: '',
      file_description: '',
      file_mime_type: '',
      file_size: '',
    }
  }
  mutations() {
    return {
      file_title: String,
      file_name: String,
      file_description: String,
      file_mime_type: String,
      file_size: String,
    }
  }
  validation() {
    return {
      file_title: string.and(length(2, 150)),
    }
  }
  isImage () {
    let mimetype = this.get('file_mime_type')
    if (mimetype === 'image/jpeg' || mimetype === 'image/png')
      return true

    return false
  }
  getFileURL () {
    return `/storage/${ this.get('file_name') }`
  }
  routes () {
    return {
      fetch: `${ APP_SETTINGS.appApiBaseURL }/file/{id}`,
      save: `${ APP_SETTINGS.appApiBaseURL }/file/`,
      put: `${ APP_SETTINGS.appApiBaseURL }/file/`,
      delete: `${ APP_SETTINGS.appApiBaseURL }/file/`,
    }
  }
}


export default {
  model: FileModel,
}
</script>
