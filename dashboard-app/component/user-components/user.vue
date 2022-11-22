<template lang="html">
  <div>
    <Header/>
    <LoadingBar v-if="isLoading"/>
    <BoxWrapper>
      <div id="user-avatar-wrapper">
        <div id="user-avatar">
          <div
            class="user-image-color"
            v-if="user.get('profile_file_id')"
            v-bind:style="getAvatarImage()">
          </div>
          <div
            class="user-image-color"
            v-if="!user.get('profile_file_id')"
            v-bind:style="getCoverColor()">
            <span class="user-letter">
              {{ getUserFirstLetter(user) }}
            </span>
          </div>
          <div class="avatar-buttons-wrapper">
            <Button
              class="buttom-top"
              v-if="user.get('profile_file_id')"
              buttonIcon="broken_image"
              v-bind:buttonAction="removeFileAvatar">
              {{ $t('Remove avatar') }}
            </Button>
            <Button
              class="buttom-bottom"
              buttonIcon="image"
              v-bind:buttonAction="openFileAvatarModal">
              {{ $t('Set avatar') }}
            </Button>
          </div>
        </div>
      </div>
      <div class="form-wrapper">
        <InputText
          inputName="First name"
          v-bind:inputValue="user.get('user_first_name')"
          v-bind:onChangeValue="onChangeInputValue"
          propName="user_first_name"
          v-bind:errorMessage="user.errors.user_first_name"
          helperMessage="At least 2 characters"/>
        <InputText
          inputName="Last name"
          v-bind:inputValue="user.get('user_last_name')"
          v-bind:onChangeValue="onChangeInputValue"
          propName="user_last_name"/>
        <InputText
          inputName="User name"
          v-bind:inputValue="user.get('user_name')"
          v-bind:onChangeValue="onChangeInputValue"
          propName="user_name"
          v-bind:errorMessage="user.errors.user_name"
          helperMessage="At least 2 characters"/>
        <InputText
          inputName="New password"
          v-bind:inputValue="user.get('user_pass')"
          v-bind:onChangeValue="onChangeInputValue"
          propName="user_pass"
          v-bind:errorMessage="user.errors.user_pass"
          helperMessage="At least 2 characters"/>
        <InputText
          inputName="Email"
          v-bind:inputValue="user.get('user_email')"
          v-bind:onChangeValue="onChangeInputValue"
          propName="user_email"
          v-bind:errorMessage="user.errors.user_email"
          helperMessage="Example: eduardobc.88@gmail.com"/>
        <FormSearchDropdownSelect
          title="Role"
          helpMsg="Select role"
          v-bind:errorMsg="user.errors.role_id"
          v-bind:collection="roleCollection"
          v-bind:currentValue="user.get('role_id_ref')"
          v-bind:onSelectOption="onSelectOption"
          propName="role_id"
          propNameToShow="role_name"/>
        <FormSearchDropdownSelect
          title="Language"
          helpMsg="Select language"
          v-bind:errorMsg="user.errors.language_id"
          v-bind:collection="languageCollection"
          v-bind:currentValue="user.get('language_id_ref')"
          v-bind:onSelectOption="onSelectOption"
          propName="language_id"
          propNameToShow="language_name"/>
        <div class="date-wrapper">
          {{ new Date(user.get('created_at')).toDateString() }}
        </div>
        {{ user.get('user_status') }}
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
import FormSearchDropdownSelect from '../templates/form-search-dropdown-select.vue'
import LoadingBar from '../templates/loading-bar.vue'
import FloatButtonOptions from '../templates/float-button-options.vue'

export default {
  data() {
    return {
      isNew: true,
      user: new this.$models.User(),
      roleCollection: new this.$models.RoleCollection(),
      languageCollection: new this.$models.LanguageCollection(),
      confirmationModalData: {
        modalTitle: 'Do you want delete this user?',
        modalDescription: 'This action will delete this user',
        cancelAction: this.cancelAction,
        acceptAction: this.acceptAction,
      },
      fileModalAvatarData: {
        onlyImages: true,
        modalTitle: 'Set Avatar Image',
        modalDescription: 'Chose one image or upload new',
        closeFileModal: this.closeFileAvatarModal,
        onFileSelect: this.onFileAvatarSelect,
      },
      isLoading: false,
      userLocaleIndex: null,
      localeOptions: [],
      floatOptions: [],
    }
  },
  components: {
    BoxWrapper,
    Button,
    Header,
    InputText,
    FormSearchDropdownSelect,
    LoadingBar,
    FloatButtonOptions,
  },
  created () {
    let routeParamId = this.$route.params.id
    this.generateFloatOptions()
    if (routeParamId !== undefined) {
      this.isNew = false
      this.user.set('id', routeParamId)
      this.createModelEventListener()
      this.getData()
      return
    }
    this.setup()
  },
  beforeDestroy () {
    this.removeModelEventListener()
  },
  methods: {
    generateFloatOptions () {
      this.floatOptions = [{
        icon: 'note_add',
        name: 'new',
        action: this.goToNew,
      }]
    },
    createModelEventListener () {
      this.user.on('notification', event => {
        let isActiveRequest = this.user.getOption('isActiveRequest')
        if (isActiveRequest && event.method !== 'put')
          return

        this.user.set('user_pass', '')
      })
    },
    removeModelEventListener () {
      this.user.off('notification')
    },
    async setup () {
      this.isLoading = true
      let promises = []
      try {

      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    async getData () {
      this.isLoading = true
      try {
        await this.user.fetch()
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    onSelectOption (option, propName) {
      let id = 0
      let name = ''
      let propRef = `${ propName }_ref`
      if (option !== null) {
        id = option.get('id')
        switch (propName) {
          case 'role_id':
            name = option.get('role_name')
            break
          case 'language_id':
            name = option.get('language_name')
            break
        }
      }
      this.user.set(propName, id)
      this.user.set(propRef, name)
    },
    onChangeInputValue (propName, value) {
      this.user.set(propName, value)
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
    removeFile () {
      this.user.set('user_thumbnail', '')
    },
    onFileAvatarSelect (file) {
      this.user.set({
        'profile_file_id': file.get('id'),
        'profile_file_id_ref': file.get('file_name'),
      })
      this.closeFileAvatarModal()
    },
    openFileAvatarModal () {
      this.$eventHub.$emit('file-modal', this.fileModalAvatarData)
    },
    closeFileAvatarModal () {
      this.$eventHub.$emit('file-modal', null)
    },
    removeFileAvatar () {
      this.user.set('profile_file_id', '')
    },
    onSelectRole (option) {
      this.user.set({
        'user_role': option.value,
        'role_id': option.value._id,
      })
    },
    getAvatarImage () {
      return this.$getAvatarURL(this.user.get('profile_file_id_ref'))
    },
    getCoverColor () {
      return this.$getHexColor(this.user.get('user_first_name'))
    },
    getUserFirstLetter (user) {
      if (!user.get('user_first_name')) return

      return user.get('user_first_name')[0]
    },
    async validate () {
      try {
        let isActiveRequest = this.user.getOption('isActiveRequest')
        if (isActiveRequest)
          return

        this.user.setOption('isActiveRequest', true)
        let errors = await this.user.validate()
        if (!_.isEmpty(errors)) {
          this.user.setOption('isActiveRequest', false)
          return
        }
        if (this.isNew) {
          this.save()
          return
        }
        this.update()
      } catch (err) {
        console.error(err)
      }
    },
    async save () {
      this.isLoading = true
      try {
        let data = await this.user.save()
        if (data.getData().status_code == 1)
          throw 'error on save'
        this.$router.replace({
          name: 'user',
          params: {
            id: data.getData().data.id,
          },
        })
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
        this.user.setOption('isActiveRequest', false)
      }
    },
    async update () {
      this.isLoading = true
      try {
        this.user.put()
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
        this.user.setOption('isActiveRequest', false)
      }
    },
    async delete () {
      this.isLoading = true
      try {
        await this.user.delete()
        if (data.getData().status_code == 1)
          throw 'error on delete'
        this.$router.replace({
          name: 'users',
          params: {
            page: 1,
          },
        })
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
        this.user.setOption('isActiveRequest', false)
      }
    },
  },
}
</script>

<style scoped lang="css">

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

.form-wrapper {
  box-sizing: content-box;
  margin-bottom: 40px;
  position: relative;
}

#user-avatar-wrapper {
  position: relative;
}

#user-avatar {
  background-color: var(--main-box-bg-color);
  border-radius: 100%;
  box-shadow: var(--main-box-shadow);
  display: flex;
  height: 150px;
  overflow: hidden;
  position: relative;
  width: 150px;
}

#user-avatar:after {
  background-color: rgba(255, 255, 255, 0.75);
  content: "";
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  transition-duration: 200ms;
}

.user-letter {
  align-self: center;
  color: white;
  font-size: 100px;
  font-weight: 400;
  line-height: 1;
  margin: auto;
}

.avatar-buttons-wrapper {
  bottom: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1;
}

.user-image-color {
  display: flex;
  width: 100%;
}

.buttom-top {
  margin: auto;
  top: 15px;
}

.buttom-bottom {
  bottom: 15px;
  margin: auto;
}

.date-wrapper {
  color: var(--main-text-color);
  display: block;
  font-size: var(--main-font-size);
  font-weight: 600;
  margin-top: 15px;
  text-align: right;
}

.dropdown-select {
  margin-top: 10px;
}
</style>
