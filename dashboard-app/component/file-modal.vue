<template lang="html">
  <div id="modal-box-wrapper">
    <div id="position-wrapper">
      <LoadingBar v-if="isLoading"/>
      <div id="box-content">
        <div id="header">
          <h2>{{ $t(modalTitle) }}</h2>
          <p id="modal-description">
            {{ $t(modalDescription) }}
          </p>
          <div id="navgation-buttons">
            <Button
              buttonIcon="photo_library"
              v-bind:buttonAction="activeLibrary">
              {{ $t('Library') }}
            </Button>
            <Button
              buttonIcon="cloud_upload"
              v-bind:buttonAction="activeUpload"
              style="margin-left: 5px;">
              {{ $t('Upload') }}
            </Button>
          </div>
        </div>
        <div id="content">
          <div v-if="activeTab === 0" id="library-wrapper">
            <InputText
              inputName="Search"
              v-bind:inputValue="searchValue"
              v-bind:onChangeValue="onChangeInputValue"
              propName="">
            </InputText>
            <div id="file-scroll-wrapper">
              <VuePerfectScrollbar class="scroll-area">
                <div
                  id="files-wrapper"
                  ref="fileWrapper"
                  v-on:scroll="onScroll">
                  <div
                    class="image"
                    v-for="file in fileFiles.getModels()"
                    v-on:click="selectFileImage(file)"
                    v-if="showThisFile(file)"
                    v-bind:style="getPreview(file)"
                  ></div>
                </div>
              </VuePerfectScrollbar>
            </div>
          </div>
          <div v-if="activeTab === 1" id="upload-wrapper">
            <div id="dropzone" ref="dropzone">
              <div>
                <p id="upload-description">
                  {{ $t('Choose a file or drag it here') }}
                </p>
                <p id="upload-file-name">
                  {{ fileName }}
                </p>
                <i class="upload-icon material-icons-round">
                  cloud_upload
                </i>
              </div>
            </div>
            <input
              id="file-input"
              type="file"
              ref="file"
              name="file"
              @change="addFile()"/>
          </div>
        </div>
        <div id="footer">
          <div v-if="activeTab === 0" id="file-info-wrapper">
            <div
              class="avatar"
              v-if="selectedFile.isImage()"
              v-bind:style="$getAvatarURL(selectedFile.get('file_name'))">
            </div>
            <div
              class="avatar"
              v-if="!selectedFile.isImage()"
              v-bind:style="$getHexColor(selectedFile.get('file_title'))">
              <span>
                {{ selectedFile.file_title[0] }}
              </span>
            </div>
            <div id="select-file-data-wrapper">
              <p>
                {{ selectedFile.get('file_title') }}
              </p>
              <p>
                {{ selectedFile.get('file_original_name') }}
              </p>
            </div>
          </div>
          <div id="buttons-wrapper">
            <Button
              buttonIcon="clear"
              v-bind:buttonAction="closeFileModal"
              style="align-self: flex-end;">
              {{ $t('Cancel') }}
            </Button>
            <Button
              v-if="activeTab === 0"
              buttonIcon="done"
              v-bind:buttonAction="selectFile"
              style="margin-left: 5px; align-self: flex-end;">
              {{ $t('Accept') }}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

import Button from './templates/button.vue'
import InputText from './templates/input-text.vue'
import LoadingBar from './templates/loading-bar.vue'

export default {
  props: [
    'modalTitle',
    'modalDescription',
    'closeFileModal',
    'onFileSelect',
    'onlyImages',
  ],
  data() {
    return {
      fileFiles: new this.$models.FileCollection(),
      filePage: 1,
      totalItems: 0,
      totalPages: 1,
      selectedFile: new this.$models.File(),
      searchValue: '',
      searchMimetype: 'image',
      activeTab: 0,
      formData: new FormData(),
      fileName: '',
      isLoading: false,
    }
  },
  created() {
    this.getFile()
  },
  updated() {
    if (this.activeTab) this.addDragEnterAndLeaveEventListener()
  },
  components: {
    VuePerfectScrollbar,
    Button,
    InputText,
    LoadingBar,
  },
  methods: {
    async getFile () {
      if (this.filePage <= this.totalPages) {
        this.isLoading = true
        this.fileFiles.set('page_number', this.filePage)
        try {
          let data = await this.fileFiles.fetch()
          this.totalPages = data.getData().total_pages
          this.filePage++
          if (this.filePage === 2)
            this.getFile()
          this.totalItems = data.getData().total_items
        } catch (err) {
          console.error(err)
        } finally {
          this.isLoading = false
        }
      }
    },
    selectFileImage (file) {
      this.selectedFile = file
    },
    onScroll (el) {
      let fileWrapper = this.$refs.fileWrapper
      if (
        fileWrapper.clientHeight + fileWrapper.scrollTop >=
        fileWrapper.scrollHeight
      )
        this.getFile()
    },
    showThisFile (file) {
      if (this.onlyImages === file.isImage())
        return true

      return false
    },
    getPreview (file) {
      if (file.isImage()) return this.$getAvatarURL(file.get('file_name'))

      return this.$getHexColor(file.get('file_title'))
    },
    resetLibraryData () {
      this.fileFiles.clear()
      this.filePage = 1
      this.totalItems = 0
      this.totalPages = 1
    },
    async onChangeInputValue (propName, value) {
      this.searchValue = value
      if (!this.searchValue) {
        this.resetLibraryData()
        this.getFile()
        return
      }
      this.isLoading = true
      this.fileFiles.clear()
      try {
        await this.fileFiles.search({
          s: this.searchValue,
          type: this.searchMimetype,
        })
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    activeLibrary () {
      this.activeTab = 0
    },
    activeUpload () {
      this.activeTab = 1
    },
    addFile () {
      this.formData.delete('file_name')
      this.formData.delete('fule_mime_type')
      this.formData.delete('file_size')
      this.formData.delete('file')
      this.formData.append('file_name', this.$refs.file.files[0].name)
      this.formData.append('fule_mime_type', this.$refs.file.files[0].type)
      this.formData.append('file_size', this.$refs.file.files[0].size)
      this.formData.append('file', this.$refs.file.files[0])
      this.fileName = this.$refs.file.files[0].name
      this.createFile()
    },
    addDragEnterAndLeaveEventListener () {
      this.$refs.file.addEventListener('dragover', e => {
        e.preventDefault()
        e.stopPropagation()
        this.$refs.dropzone.classList.add('dragover')
      })
      this.$refs.file.addEventListener('dragleave', e => {
        e.preventDefault()
        e.stopPropagation()
        this.$refs.dropzone.classList.remove('dragover')
      })
      this.$refs.file.addEventListener('drop', e => {
        this.$refs.dropzone.classList.remove('dragover')
      })
    },
    async createFile () {
      this.isLoading = true
      try {
        let data = await this.axios.post(`${ this.$appApiBaseURL }/file/`, this.formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'csrf-token': this.$getCookie('csrf-token'),
          },
        })
        this.activeTab = 0
        this.resetLibraryData()
        this.getFile()
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    selectFile () {
      if (this.selectedFile.get('id'))
        this.onFileSelect(this.selectedFile)
    },
  },
}
</script>

<style scoped lang="css">
h2 {
  color: var(--main-accent-color);
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 1;
  margin: 0;
  padding: 0;
}

#modal-description {
  color: var(--main-text-color);
  font-size: var(--main-font-size);
  font-weight: 500;
  letter-spacing: 0;
  line-height: 20px;
  margin-bottom: 5px;
  margin-top: 0;
}

#modal-box-wrapper {
  background-color: var(--main-notification-bkg);
  bottom: 0;
  box-sizing: border-box;
  display: flex;
  height: 100%;
  left: 0;
  margin: auto;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 5;
}

#position-wrapper {
  box-sizing: border-box;
  margin: auto;
  max-width: 1145px;
  padding: 10px;
  position: relative;
  width: 100%;
}

#box-content {
  background-color: var(--main-box-bg-color);
  border-radius: 20px;
  box-shadow: var(--main-box-shadow);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 480px;
  margin: auto;
  padding: 10px;
  position: relative;
  width: 100%;
}

#header,
#footer {
  flex-grow: 0;
}

#footer {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

#content {
  display: flex;
  flex-grow: 1;
}

#navgation-buttons {
  display: flex;
}

#library-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

#files-wrapper {
  border-radius: 20px;
  column-gap: 10px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 1fr);
  height: 270px;
  justify-items: stretch;
  row-gap: 10px;
  width: 100%;
}

.image {
  background-color: #f0f0f0;
  border-radius: 20px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
}

.image:after {
  content: "";
  height: 100%;
  position: absolute;
  width: 100%;
  z-index: 1;
}

.image:hover:after {
  background-color: var(--main-hover-color);
}

.image:active:after {
  background-color: var(--main-active-color);
}

#file-info-wrapper {
  display: flex;
  flex-grow: 1;
}

#file-info-wrapper p {
  color: var(--main-text-color);
  font-size: var(--main-font-size);
  height: 16px;
  line-height: 16px;
  margin: 0;
  overflow: hidden;
  position: relative;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: calc(100% - 5px);
}

#file-info-wrapper .avatar {
  align-self: center;
  border-radius: 20px;
  height: 30px;
  min-width: 30px;
}

#file-info-wrapper .avatar span {
  align-self: center;
  color: white;
  font-size: 16px;
  font-weight: 400;
  text-transform: capitalize;
}

#select-file-data-wrapper {
  display: flex;
  flex-direction: column;
  left: 5px;
  position: relative;
  width: 100%;
}

#upload-wrapper {
  margin: auto;
  position: relative;
  width: 100%;
}

#dropzone {
  background-color: #f8f8f8;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border: 2px dashed #ccc;
  box-sizing: border-box;
  color: var(--main-text-color);
  display: flex;
  height: 260px;
  left: 0;
  padding: 10px;
  pointer-events: none;
  position: relative;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 1;
}

#dropzone.dragover {
  background-color: #ccc;
}

.description {
  font-size: 20px;
  margin: 10px;
}

.file-name {
  font-size: 16px;
  margin: 10px;
}

#dropzone i {
  font-size: 40px;
}

#dropzone div {
  align-self: center;
  display: flex;
  flex-direction: column;
  margin: auto;
  text-align: center;
}

#file-input {
  cursor: pointer;
  display: flex;
  height: 260px;
  left: 0;
  opacity: 0;
  outline: none;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 0;
}

#upload-description {
  font-size: 20px;
  margin: 10px;
}

#upload-file-name {
  font-size: 16px;
  margin: 10px;
}

#buttons-wrapper {
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
}

#buttons-wrapper .button:last-child {
  color: var(--main-accent-color);
  margin-left: 10px;
}

#buttons-wrapper .button:hover {
  background-color: var(--main-hover-color);
}

#file-scroll-wrapper {
  position: relative;
  overflow: auto;
  margin: 10px 0 0 0;
}
</style>
