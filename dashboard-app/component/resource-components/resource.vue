<template lang="html">
  <div class="resource">
    <Header/>
    <LoadingBar v-if="isLoading"/>
    <BoxWrapper>
      <div class="content-wrapper">
        <InputText
          inputName="Name"
          v-bind:inputValue="resource.resource_name"
          v-bind:onChangeValue="onChangeInputValue"
          propName="resource_name"
          v-bind:errorMessage="resource.errors.resource_name"
          helperMessage="At least 2 characters without spaces"/>
        <InputText
          class="input"
          inputName="Description"
          v-bind:inputValue="resource.resource_description"
          v-bind:onChangeValue="onChangeInputValue"
          propName="resource_description"
          v-bind:errorMessage="resource.errors.resource_description"
          helperMessage="At least 2 characters"/>
      </div>
      <FormDropdownSelect
        label="Type"
        helperMessage="Select type"
        v-bind:currentValue="resource.get('resource_type')"
        v-bind:selectOptions="resourceTypeOptions"
        v-bind:onSelectOption="onSelectOption"
        v-bind:initialIndexOption="resourceTypeIndex"
        propName="resource_type"/>
      <InputText
        v-if="resource.get('resource_type') === 'data'"
        inputName="Path"
        v-bind:inputValue="resource.get('resource_path')"
        v-bind:onChangeValue="onChangeInputValue"
        propName="resource_path"
        v-bind:errorMessage="resource.errors.resource_path"
        helperMessage="At least 2 characters"/>
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
import FormDropdownSelect from '../templates/form-dropdown-select.vue'
import FloatButtonOptions from '../templates/float-button-options.vue'

export default {
  data() {
    return {
      isNew: true,
      resource: new this.$models.Resource(),
      confirmationModalData: {
        modalTitle: 'Do you want delete this resource?',
        modalDescription: 'This action will delete this resource',
        cancelAction: this.cancelAction,
        acceptAction: this.acceptAction,
      },
      isLoading: false,
      resourceTypeIndex: null,
      resourceTypeOptions: [{
          name: 'View',
          value: 'view',
        },
        {
          name: 'Data',
          value: 'data',
        }],
      floatOptions: [],
    }
  },
  components: {
    BoxWrapper,
    Button,
    InputText,
    Header,
    LoadingBar,
    FormDropdownSelect,
    FloatButtonOptions,
  },
  created () {
    let routeParamId = this.$route.params.id
    if (routeParamId !== undefined) {
      this.isNew = false
      this.resource.set('id', routeParamId)
      this.getData()
    }
    this.generateFloatOptions()
  },
  methods: {
    generateFloatOptions () {
      this.floatOptions = [{
        icon: 'note_add',
        name: 'new',
        action: this.goToNew,
      }]
    },
    onChangeInputValue (propName, value) {
      this.resource.set(propName, value)
    },
    async getData () {
      this.isLoading = true
      try {
        await this.resource.fetch()
        this.setup()
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    setup () {
      let resourceType = this.resource.get('resource_type')
      for (let index in this.resourceTypeOptions) {
        let i = this.resourceTypeOptions[index]
        if (i.value === resourceType) {
          this.resourceTypeIndex = index
          break
        }
      }
    },
    onSelectOption (data, index) {
      this.resourceTypeIndex = index
      this.resource.set(data.prop_name, data.value)
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
    async validate () {
      try {
        let isActiveRequest = this.resource.getOption('isActiveRequest')
        if (isActiveRequest)
          return

        this.resource.setOption('isActiveRequest', true)
        let errors = await this.resource.validate()
        if (!_.isEmpty(errors)) {
          this.resource.setOption('isActiveRequest', false)
          return
        }
        if (this.isNew) {
          this.save()
          return
        }
        this.update()
      } catch (err) {
        this.resource.setOption('isActiveRequest', false)
        console.error(err)
      }
    },
    async save () {
      this.isLoading = true
      try {
        let data = await this.resource.save()
        if (data.getData().status_code == 1)
          throw 'error on save'
        this.$router.replace({
          name: 'resource',
          params: {
            id: data.getData().data.id,
          },
        })
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
        this.resource.setOption('isActiveRequest', false)
      }
    },
    async delete () {
      this.isLoading = true
      try {
        let data = await this.resource.delete()
        if (data.getData().status_code == 1)
          throw 'error on delete'
        this.$router.replace({
          name: 'resources',
          params: {
            page: 1,
          },
        })
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
        this.resource.setOption('isActiveRequest', false)
      }
    },
    async update () {
      this.isLoading = true
      try {
        await this.resource.put()
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
        this.resource.setOption('isActiveRequest', false)
      }
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
  },
}
</script>

<style scoped lang="css">
.resource {
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

.resource-thumbnail {
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

.resource-thumbnail:after {
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
