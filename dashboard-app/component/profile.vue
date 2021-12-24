<template lang="html">
  <div>
    <Header/>
    <LoadingBar v-if="isLoading"/>
    <BoxWrapper>
      <div id="user-avatar-wrapper">
        <div id="user-avatar">
          <div
            class="user-image-color"
            v-if="profile.get('profile_file_id')"
            v-bind:style="getAvatarImage()">
          </div>
          <div
            class="user-image-color"
            v-if="!profile.get('profile_file_id')"
            v-bind:style="getCoverColor()">
            <span class="user-letter">
              {{ getUserFirstLetter(profile) }}
            </span>
          </div>
          <div class="avatar-buttons-wrapper">
            <Button
              class="buttom-top"
              v-if="profile.get('profile_file_id')"
              buttonIcon="broken_image"
              v-bind:buttonAction="removeFileAvatar">
              {{ $t('Remove') }}
            </Button>
            <Button
              class="buttom-bottom"
              buttonIcon="image"
              v-bind:buttonAction="openFileAvatarModal">
              {{ $t('Change') }}
            </Button>
          </div>
        </div>
      </div>
      <div class="form-wrapper">
        <InputText
          inputName="First name"
          v-bind:inputValue="profile.get('user_first_name')"
          v-bind:onChangeValue="onChangeInputValue"
          propName="user_first_name"
          v-bind:errorMessage="profile.errors.user_first_name"
          helperMessage="At least 2 characters"/>
        <InputText
          inputName="Last name"
          v-bind:inputValue="profile.get('user_last_name')"
          v-bind:onChangeValue="onChangeInputValue"
          propName="user_last_name"/>
        <InputText
          inputName="User name"
          v-bind:inputValue="profile.get('user_name')"
          disabled="true"/>
        <InputText
          inputName="New password"
          v-bind:inputValue="profile.get('user_pass')"
          v-bind:onChangeValue="onChangeInputValue"
          propName="user_pass"
          v-bind:errorMessage="profile.errors.user_pass"
          helperMessage="At least 2 characters"/>
        <InputText
          inputName="Email"
          v-bind:inputValue="profile.get('user_email')"
          v-bind:onChangeValue="onChangeInputValue"
          propName="user_email"
          v-bind:errorMessage="profile.errors.user_email"
          helperMessage="Example: user@reactivecms.com"/>
        <InputText
          inputName="Role"
          v-bind:inputValue="profile.get('role_name')"
          disabled="true"/>
        <FormSearchDropdownSelect
          title="Language"
          helpMsg="Select language"
          errorMsg=""
          v-bind:collection="languageCollection"
          v-bind:currentValue="profile.get('language_id_ref')"
          v-bind:onSelectOption="onSelectOption"
          propName="language_id"
          propNameToShow="language_name"/>
        <div class="date-wrapper">
          {{ profile.get('created_at') }}
        </div>
      </div>
    </BoxWrapper>
    <div class="buttons-wrapper">
      <Button
        buttonIcon="save"
        v-bind:buttonAction="validate"
        style="margin-left: 5px;">
        {{ $t('Update') }}
      </Button>
    </div>
  </div>
</template>

<script>
import BoxWrapper from './templates/box-wrapper.vue'
import Button from './templates/button.vue'
import InputText from './templates/input-text.vue'
import Header from './templates/header.vue'
import LoadingBar from './templates/loading-bar.vue'
import FormSearchDropdownSelect from './templates/form-search-dropdown-select.vue'


export default {
  data() {
    return {
      profile: new this.$models.Profile({
        id: this.$getCookie('user_id'),
      }),
      languageCollection: new this.$models.LanguageCollection(),
      fileModalAvatarData: {
        onlyImages: true,
        modalTitle: 'Set Avatar Image',
        modalDescription: 'Chose one image or upload new',
        closeFileModal: this.closeFileAvatarModal,
        onFileSelect: this.onFileAvatarSelect,
      },
      isLoading: false,
    }
  },
  components: {
    BoxWrapper,
    Button,
    InputText,
    Header,
    LoadingBar,
    FormSearchDropdownSelect,
  },
  created() {
    this.createModelEventListener()
    this.getData()
  },
  beforeDestroy () {
    this.removeModelEventListener()
  },
  methods: {
    createModelEventListener () {
      this.profile.on('notification', event => {
        let isActiveRequest = this.profile.getOption('isActiveRequest')
        if (isActiveRequest && event.method !== 'put')
          return

        this.setup()
      })
    },
    removeModelEventListener () {
      this.profile.off('notification')
    },
    async getData () {
      this.isLoading = true
      try {
        await this.profile.fetch()
        this.setup()
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    setup () {
      this.profile.sync()
    },
    onChangeInputValue (propName, value) {
      this.profile.set(propName, value)
    },
    onFileAvatarSelect (file) {
      this.profile.set({
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
      this.profile.set({
        'profile_file_id': 0,
        'profile_file_id_ref': '',
      })
    },
    getAvatarImage () {
      return this.$getAvatarURL(this.profile.get('profile_file_id_ref'))
    },
    getCoverColor () {
      return this.$getHexColor(this.profile.get('user_first_name'))
    },
    getUserFirstLetter (profile) {
      if (!profile.get('user_first_name'))
        return

      return profile.get('user_first_name')[0]
    },
    onSelectOption (option) {
      if (option === null)
        return

      this.profile.set({
        'language_id': option.get('id'),
        'language_id_ref': option.get('language_name'),
      })
    },
    async validate () {
      let isActiveRequest = this.profile.getOption('isActiveRequest')
      if (isActiveRequest)
        return

      this.profile.setOption('isActiveRequest', true)
      let errors = await this.profile.validate()
      if (!_.isEmpty(errors)) {
        this.profile.setOption('isActiveRequest', false)
        return
      }
      this.update()
    },
    async update () {
      this.isLoading = true
      try {
        await this.profile.put()
        this.profile.set('user_pass', '')
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
        this.profile.setOption('isActiveRequest', false)
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

</style>
