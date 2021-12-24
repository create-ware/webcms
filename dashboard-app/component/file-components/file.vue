<template lang="html">
  <div class="file">
    <Header/>
    <LoadingBar v-if="isLoading"/>
    <BoxWrapper>
      <form
        v-if="isNew"
        enctype="multipart/form-data"
        method="POST">
        <div
          v-bind:class="{
            'dropzone': true,
            'error': fileFileError,
          }"
          ref="dropzone">
          <div>
            <p class="description">
              {{ $t('Choose a file or drag it here') }}
            </p>
            <p class="file-name">
              {{ fileName }}
            </p>
            <i class="material-icons-round">
              cloud_upload
            </i>
          </div>
        </div>
        <input
          class="file-input"
          type="file"
          ref="file"
          name="file"
          @change="addFile()"/>
      </form>
      <div
        class="file-thumbnail"
        v-if="file.isImage()  && !isNew"
        v-bind:style="getCoverImage()">
      </div>
      <div
        class="file-thumbnail"
        v-if="!file.isImage() && !isNew"
        v-bind:style="getCoverColor()">
      </div>
      <Button
        v-if="!isNew"
        class="file-download"
        buttonIcon="cloud_download"
        v-bind:buttonAction="openfile">
        {{ $t('open') }}
      </Button>
      <div class="content-wrapper">
        <InputText
          class="input"
          inputName="Title"
          v-bind:inputValue="file.get('file_title')"
          v-bind:onChangeValue="onChangeInputValue"
          propName='file_title'
          v-bind:errorMessage="file.errors.file_title"
          helperMessage="Insert a title for this file"/>
        <div class="date-wrapper">
          {{ fileDate }}
        </div>
      </div>
      <FloatButtonOptions
        v-if="!isNew"
        openIcon="add"
        closeIcon="close"
        v-bind:options="floatOptions"/>
    </BoxWrapper>
      <div class="buttons-wrapper">
        <Button
          v-if="isNew"
          buttonIcon="close"
          v-bind:buttonAction="cancel">
          {{ $t('Cancel') }}
        </Button>
        <Button
          v-if="isNew"
          buttonIcon="save"
          v-bind:buttonAction="validate"
          style="margin-left: 5px;">
          {{ $t('Create') }}
        </Button>
        <Button
          v-if="!isNew"
          buttonIcon="remove"
          v-bind:buttonAction="showConfirmationModal">
          {{ $t('Delete') }}
        </Button>
        <Button
          v-if="!isNew"
          buttonIcon="save"
          v-bind:buttonAction="validate"
          style="margin-left: 5px;">
          {{ $t('Update') }}
        </Button>
      </div>
  </div>
</template>

<script>
import BoxWrapper from '../templates/box-wrapper.vue'
import Button from '../templates/button.vue'
import InputText from '../templates/input-text.vue'
import Header from '../templates/header.vue'
import LoadingBar from '../templates/loading-bar.vue'
import FloatButtonOptions from '../templates/float-button-options.vue'

export default {
  data() {
    return {
      isNew: true,
      file: new this.$models.File(),
      formData: new FormData(),
      fileStatusIndex: 0,
      fileDate: '',
      dragAndDropCapable: false,
      fileName: '',
      isLoading: false,
      fileFileError: false,
      confirmationModalData: {
        modalTitle: 'Do you want delete this file?',
        modalDescription: 'This action will delete this file',
        cancelAction: this.cancelAction,
        acceptAction: this.acceptAction,
      },
      floatOptions: [],
    }
  },
  components: {
    BoxWrapper,
    Button,
    InputText,
    Header,
    LoadingBar,
    FloatButtonOptions,
  },
  created() {
    let routeParamId = this.$route.params.id
    this.generateFloatOptions()
    if (routeParamId !== undefined) {
      this.isNew = false
      this.file.set('id', routeParamId)
      this.getData()
      return
    }
  },
  mounted () {
    if (this.isNew)
      this.addDragEnterAndLeaveEventListener()
  },
  methods: {
    generateFloatOptions () {
      this.floatOptions = [{
        icon: 'note_add',
        name: 'New',
        action: this.goToNew,
      }]
    },
    async getData () {
      this.isLoading = true
      try {
        await this.file.fetch()
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    onChangeInputValue (propName, value) {
      this.file.set(propName, value)
    },
    showConfirmationModal () {
      this.$eventHub.$emit('confirmation-modal', this.confirmationModalData)
    },
    cancelAction () {
      this.$eventHub.$emit('confirmation-modal', null)
    },
    acceptAction () {
      this.$eventHub.$emit('confirmation-modal', null)
      this.delete()
    },
    openfile () {
      let fileURL = this.file.getFileURL()
      window.open(fileURL, '_blank')
    },
    getCoverImage () {
      return this.$getThumbnailURL(this.file.get('file_name'))
    },
    getCoverColor () {
      return this.$getHexColor(this.file.get('file_title'))
    },
    goToNew () {
      let routeName = this.$router.history.current.name
      this.$router.push({
        name: routeName,
      })
    },
    cancel () {
      this.$router.back()
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
      this.fileTitle = this.fileName
      let fileTitle = this.file.get('file_title')
      if (fileTitle === '')
        this.file.set('file_title', this.fileName)
      this.fileFileError = false
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
    async validate () {
      let isActiveRequest = this.file.getOption('isActiveRequest')
      if (isActiveRequest)
        return

      this.file.setOption('isActiveRequest', true)
      let errors = await this.file.validate()
      if (!_.isEmpty(errors)) {
        this.file.setOption('isActiveRequest', false)
        return
      }
      if (this.isNew) {
        this.save()
        return
      }
      this.update()
    },
    async save () {
      this.isLoading = true
      try {
        this.formData.append('file_title', this.file.get('file_title'))
        this.formData.append('file_description', this.file.get('file_description'))
        let data = await this.axios.post(`${ this.$appApiBaseURL }/file/`, this.formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'csrf-token': this.$getCookie('csrf-token'),
            },
          })
        this.$router.replace({
          name: 'file',
          params: {
            id: data.data.data.id,
          },
        })
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
        this.file.setOption('isActiveRequest', false)
      }
    },
    async delete () {
      this.isLoading = true
      try {
        await this.file.delete()
        this.$router.replace({
          name: 'files',
          params: {
            page: 1,
          },
        })
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
        this.file.setOption('isActiveRequest', false)
      }
    },
    async update () {
      this.isLoading = true
      try {
        await this.file.put()
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
        this.file.setOption('isActiveRequest', false)
      }
    },
  }
}

</script>

<style scoped lang="css">

.file {
  position: relative;
}

.buttons-wrapper {
  bottom: -32px;
  display: flex;
  justify-content: flex-end;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  width: calc(100% - 20px);
  z-index: 1;
}

form {
  margin-top: 10px;
}

.file-thumbnail {
  background-color: #f8f8f8;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-sizing: border-box;
  color: var(--main-text-color);
  display: flex;
  height: 200px;
  left: 0;
  overflow: hidden;
  padding: 0;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 0;
}

.file-thumbnail:after {
  background-color: rgba(255, 255, 255, 0.75);
  bottom: 0;
  content: "";
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}

.content-wrapper {
  box-sizing: content-box;
  margin-bottom: 40px;
  margin-top: 197px;
  position: relative;
}

.file-download {
  position: absolute !important;
  right: 10px;
  top: 10px;
}

.date-wrapper {
  color: var(--main-text-color);
  display: block;
  font-size: var(--main-font-size);
  font-weight: 600;
  margin-top: 15px;
  text-align: right;
}

.dropzone {
  background-color: #f8f8f8;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border: 2px dashed #ccc;
  box-sizing: border-box;
  color: var(--main-text-color);
  display: flex;
  height: 200px;
  left: 0;
  pointer-events: none;
  position: relative;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 1;
  position: absolute;
}

.dropzone.error {
  border: 2px dashed red;
}

.dropzone.dragover {
  background-color: #ccc;
}

.description {
  font-size: 15px;
  margin: 10px;
}

.file-name {
  font-size: 16px;
  margin: 10px;
}

.dropzone i {
  font-size: 40px;
}

.dropzone div {
  align-self: center;
  display: flex;
  flex-direction: column;
  margin: auto;
  text-align: center;
}

.file-input {
  background-color: transparent;
  cursor: pointer;
  display: flex;
  height: 200px;
  left: 0;
  outline: none;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 0;
}

</style>
