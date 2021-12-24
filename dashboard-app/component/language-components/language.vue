<template lang="html">
  <div class="language">
    <Header/>
    <LoadingBar v-if="isLoading"/>
    <BoxWrapper>
      <div class="content-wrapper">
        <InputText
          class="input"
          inputName="Name"
          v-bind:inputValue="language.get('language_name')"
          v-bind:onChangeValue="onChangeInputValue"
          propName="language_name"
          v-bind:errorMessage="language.errors.language_name"
          helperMessage="At least 2 characters without spaces"/>
        <CustomFields
          title="Messages"
          v-bind:items="language.get('language_messages')"
          v-bind:onChangeCustomField="onChangeCustomField"
          v-bind:onAddCustomField="onAddCustomField"
          v-bind:onRemoveCustomField="onRemoveCustomField"
          v-bind:propNames="customFieldProps"/>
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
        style="margin-left: 5px;"
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
        style="margin-left: 5px;"
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
import CustomFields from '../templates/custom-fields.vue'
import FloatButtonOptions from '../templates/float-button-options.vue'

export default {
  data () {
    return {
      isNew: true,
      language: new this.$models.Language(),
      confirmationModalData: {
        modalTitle: 'Do you want delete this language?',
        modalDescription: 'This action will delete this language',
        cancelAction: this.cancelAction,
        acceptAction: this.acceptAction,
      },
      isLoading: false,
      customFieldProps: {
        leftPropName: 'language_message_key',
        rightPropName: 'language_message_value',
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
    CustomFields,
    FloatButtonOptions,
  },
  created () {
    let routeParamId = this.$route.params.id
    if (routeParamId !== undefined) {
      this.isNew = false
      this.language.set('id', routeParamId)
      this.getData()
    }
    this.generateFloatOptions()
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
        await this.language.fetch()
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    onChangeInputValue (propName, value) {
      this.language.set(propName, value)
    },
    onChangeCustomField (data, oldValue, newValue) {
      let languageMessages = this.language.get('language_messages')
      let message = languageMessages[data.index]
      if (data.key === 'language_message_key')
        message.language_message_key = newValue
      else if (data.key === 'language_message_value')
        message.language_message_value = newValue
      languageMessages[data.index] = message
      this.language.set('language_messages', languageMessages)
    },
    onAddCustomField ({key, value}) {
      let languageMessages = this.language.get('language_messages')
      languageMessages.unshift({
        id: 0,
        language_message_key: key,
        language_message_value: value,
      })
      this.language.set('language_messages', languageMessages)
    },
    onRemoveCustomField (index) {
      let languageMessages = this.language.get('language_messages')
      if (!languageMessages[index].id)
        languageMessages.splice(index, 1)
      else
        languageMessages[index].removed = true
      this.language.set('language_messages', languageMessages)
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
    goToNew () {
      let routeName = this.$router.history.current.name
      this.$router.push({
        name: routeName,
      })
    },
    cancel () {
      this.$router.back()
    },
    async validate () {
      try {
        let isActiveRequest = this.language.getOption('isActiveRequest')
        if (isActiveRequest)
          return

        this.language.setOption('isActiveRequest', true)
        let errors = await this.language.validate()
        if (!_.isEmpty(errors)) {
          this.language.setOption('isActiveRequest', false)
          return
        }
        if (this.isNew) {
          this.save()
          return
        }
        this.update()
      } catch (err) {
        this.language.setOption('isActiveRequest', false)
        console.error(err)
      }
    },
    async save () {
      this.isLoading = true
      try {
        let data = await this.language.save()
        if (data.getData().status_code == 1)
          throw 'Error on save'
        this.$router.replace({
          name: 'language',
          params: {
            id: data.getData().data.id,
          },
        })
      } catch (err) {
        console.error(err)
      } finally {
        this.language.setOption('isActiveRequest', false)
        this.isLoading = false
      }
    },
    async update () {
      this.isLoading = true
      try {
        await this.language.put()
      } catch (err) {
        console.error(err)
      } finally {
        this.language.setOption('isActiveRequest', false)
        this.isLoading = false
      }
    },
    async delete () {
      this.isLoading = true
      try {
        let data = await this.language.delete()
        if (data.getData().status_code == 1)
          throw 'Error on save'
        this.$router.replace({
          name: 'languages',
          params: {
            page: 1,
          }
        })
      } catch (err) {
        console.error(err)
      } finally {
        this.language.setOption('isActiveRequest', false)
        this.isLoading = false
      }
    },
  },
}
</script>

<style scoped lang="css">
.language {
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

.content-wrapper {
  box-sizing: content-box;
  position: relative;
}

.header-action-buttons-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 0;
  position: relative;
  right: 0;
  top: 0;
  z-index: 1;
}
</style>
