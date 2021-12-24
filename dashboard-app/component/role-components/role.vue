<template lang="html">
  <div class="role-wrapper">
    <Header/>
    <LoadingBar v-if="isLoading"/>
    <BoxWrapper>
      <div class="content-wrapper">
        <InputText
          inputName="Name"
          v-bind:inputValue="role.get('role_name')"
          v-bind:onChangeValue="onChangeInputValue"
          propName="role_name"
          v-bind:errorMessage="role.errors.role_name"
          helperMessage="At least 2 characters">
        </InputText>
        <div id="doubleBoxWrapper">
          <div id="leftBox">
            <p class="sub-title">
              {{ $t('Resources') }} - {{ resourceOptions.length }}
            </p>
            <VuePerfectScrollbar class="scroll-area">
              <div class="boxlist-wrapper">
                <ButtonDoubleAction
                  v-for="(resourceOption, index) of resourceOptions"
                  buttonIcon="add"
                  v-bind:buttonTextAction="addToRoleResources"
                  v-bind:buttonIconAction="addToRoleResources"
                  v-bind:data="index"
                  :key="$uuid.v1()">
                  {{ resourceOption.name }}
                </ButtonDoubleAction>
              </div>
            </VuePerfectScrollbar>
          </div>
          <div id="rightBox">
            <p class="sub-title">
              {{ $t('Current resources') }} - {{ role.get('role_resources').length }}
            </p>
            <VuePerfectScrollbar class="scroll-area">
              <div class="boxlist-wrapper">
                <ButtonDoubleAction
                  v-for="(resource, index) of role.get('role_resources')"
                  buttonIcon="remove"
                  v-if="!resource.removed"
                  v-bind:buttonTextAction="openPermissionsModal"
                  v-bind:buttonIconAction="addToResources"
                  v-bind:data="index"
                  :key="$uuid.v1()">
                  {{ resource.name }}
                  <label class="item-permissions">
                    {{ resource.permission }}
                  </label>
                </ButtonDoubleAction>
              </div>
            </VuePerfectScrollbar>
          </div>
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
        style="margin-left: 5px;"
        buttonIcon="close"
        v-bind:buttonAction="cancel">
        {{ $t('Cancel') }}
      </Button>
      <Button
        v-if="isNew"
        buttonIcon="save"
        v-bind:buttonAction="validate"
        style="margin-left: 10px;">
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
        style="margin-left: 10px;">
        {{ $t('Update') }}
      </Button>
    </div>
    <ModalPermissions
      v-if="modalPermissionsIsVisible"
      v-bind:modalTitle="modalPermissionsTitle"
      v-bind:modalDescription="modalPermissionsDescription"
      v-bind:cancelAction="modalPermissionsClose"
      v-bind:acceptAction="modalPermissionsAccept"
      v-bind:checkboxNames="modalPermissionsCheckboxNames"/>
  </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import BoxWrapper from '../templates/box-wrapper.vue'
import Button from '../templates/button.vue'
import InputText from '../templates/input-text.vue'
import Header from '../templates/header.vue'
import LoadingBar from '../templates/loading-bar.vue'
import ButtonDoubleAction from '../templates/button-double-action.vue'
import ModalPermissions from '../templates/modal-permissions.vue'
import FloatButtonOptions from '../templates/float-button-options.vue'

export default {
  data() {
    return {
      isNew: true,
      role: new this.$models.Role(),
      resourcesCollection: new this.$models.ResourceCollection(),
      resourceOptions: [],
      isLoading: false,
      modalPermissionsIsVisible: false,
      modalPermissionsTitle: '',
      modalPermissionsDescription: 'Chose permissions for this resource',
      modalPermissionsCheckboxNames: [],
      currentResourceModalIndex: null,
      confirmationModalData: {
        modalTitle: 'Do you want delete this role?',
        modalDescription: 'This action will delete this role',
        cancelAction: this.cancelAction,
        acceptAction: this.acceptAction,
      },
      floatOptions: [],
    }
  },
  components: {
    VuePerfectScrollbar,
    BoxWrapper,
    Button,
    InputText,
    Header,
    LoadingBar,
    ButtonDoubleAction,
    ModalPermissions,
    FloatButtonOptions,
  },
  created() {
    let routeParamId = this.$route.params.id
    this.generateFloatOptions()
    if (routeParamId !== undefined) {
      this.isNew = false
      this.role.set('id', routeParamId)
      this.getData()
      this.createModelEventListener()
      return
    }
    this.getResources()
  },
  beforeDestroy () {
    this.removeModelEventListener()
  },
  methods: {
    generateFloatOptions () {
      this.floatOptions = [{
        icon: 'note_add',
        name: 'New',
        action: this.goToNew,
      }]
    },
    createModelEventListener () {
      this.role.on('notification', event => {
        let isActiveRequest = this.role.getOption('isActiveRequest')
        if (isActiveRequest && event.method !== 'put')
          return

        this.setup()
      })
    },
    removeModelEventListener () {
      this.role.off('notification')
    },
    async getData () {
      this.isLoading = true
      try {
        await this.role.fetch()
        this.setup()
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    setup () {
      this.getResources()
    },
    async getResources () {
      this.isLoading = true
      try {
        await this.resourcesCollection.fetchAll()
        await this.setRoleResourceName()
        this.setInitialResourceData()
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    async setRoleResourceName () {
      let resources = this.resourcesCollection.getModels()
      let currentRoleResources = this.role.get('role_resources')
      for (let cR of currentRoleResources) {
        for (let r of resources) {
          if (cR.resource_id == r.get('id')) {
            cR.name = `${ r.get('resource_name') } ${ r.get('resource_type') }`
            cR.type = r.get('resource_type')
            break
          }
        }
      }
      this.role.sync()
    },
    onChangeInputValue (propName, value) {
      this.role.set(propName, value)
    },
    addToRoleResources (index) {
      let selectedResource = this.resourceOptions[index]
      let currentRoleResources = this.role.get('role_resources')
      let cResource = null
      for (let cr of currentRoleResources)
        if (cr.resource_id === selectedResource.resource_id) {
          cResource = cr
          cResource.removed = false
          break
        }
      if (cResource === null) {
        let resource = {
          name: selectedResource.name,
          role_id: this.role.get('id'),
          resource_id: selectedResource.resource_id,
          permission: '',
          type: selectedResource.type,
        }
        currentRoleResources.push(resource)
        this.role.set('role_resources', currentRoleResources)
      }
      this.setInitialResourceData()
    },
    addToResources (index) {
      let currentRoleResources = this.role.get('role_resources')
      if (currentRoleResources[index].id)
        currentRoleResources[index].removed = true
      else
        currentRoleResources.splice(index, 1)
      this.role.set('role_resources', currentRoleResources)
      this.setInitialResourceData()
    },
    setInitialResourceData () {
      this.resourceOptions = []
      let currentRoleResources = this.role.get('role_resources')
      let isFreeResource = true
      for (let resource of this.resourcesCollection.getModels()) {
        isFreeResource = true
        for (let cResource of currentRoleResources) {
          if (!cResource.removed && resource.id === cResource.resource_id) {
            isFreeResource = false
          }
        }
        if (isFreeResource)
          this.resourceOptions.push({
            resource_id: resource.id,
            name: `${ resource.resource_name } - ${ resource.resource_type }`,
            type: resource.resource_type,
          })
      }
    },
    openPermissionsModal (index) {
      this.currentResourceModalIndex = index
      let resource = this.role.get('role_resources')[index]
      let resourcePermissions =  resource.permission
      this.modalPermissionsTitle = `Permissions for ${ resource.name }`
      this.modalPermissionsCheckboxNames = []
      if (resource.type === 'data')
        this.modalPermissionsCheckboxNames = [
          {
            name: 'Create',
            letter: 'c',
            value: resourcePermissions.includes('c'),
          },
          {
            name: 'Read',
            letter: 'r',
            value: resourcePermissions.includes('r'),
          },
          {
            name: 'Update',
            letter: 'u',
            value: resourcePermissions.includes('u'),
          },
          {
            name: 'Delete',
            letter: 'd',
            value: resourcePermissions.includes('d'),
          },
        ]
      else if (resource.type === 'view')
        this.modalPermissionsCheckboxNames = [
          {
            name: 'View',
            letter: 'v',
            value: resourcePermissions.includes('v'),
          },
        ]
      this.modalPermissionsIsVisible = true
    },
    modalPermissionsClose () {
      this.modalPermissionsIsVisible = false
    },
    modalPermissionsAccept (data) {
      let currentRoleResources = this.role.get('role_resources')
      let permissions = []
      this.modalPermissionsIsVisible = false
      for (let itemP of data) {
        if (itemP.letter === 'c' && itemP.value)
          permissions.push('c')
        if (itemP.letter === 'r' && itemP.value)
          permissions.push('r')
        if (itemP.letter === 'u' && itemP.value)
          permissions.push('u')
        if (itemP.letter === 'd' && itemP.value)
          permissions.push('d')
        if (itemP.letter === 'v' && itemP.value)
          permissions.push('v')
      }
      currentRoleResources[this.currentResourceModalIndex].permission = permissions.join(',')
      this.role.set('role_resources', currentRoleResources)
    },
    showConfirmationModal () {
      this.$eventHub.$emit('confirmation-modal', this.confirmationModalData)
    },
    acceptAction () {
      this.$eventHub.$emit('confirmation-modal', null)
      this.isLoading = true
      this.role.delete()
        .finally(() => {
          this.isLoading = false
          this.$router.replace({
            name: 'roles',
            params: {
              page: 1,
            },
          })
        })
    },
    cancelAction () {
      this.$eventHub.$emit('confirmation-modal', null)
    },
    async validate () {
      try {
        let isActiveRequest = this.role.getOption('isActiveRequest')
        if (isActiveRequest)
          return

        this.role.setOption('isActiveRequest', true)
        let errors = await this.role.validate()
        if (!_.isEmpty(errors)) {
          this.role.setOption('isActiveRequest', false)
          return
        }
        if (this.isNew) {
          this.save()
          return
        }
        this.update()
      } catch (err) {
        this.role.setOption('isActiveRequest', false)
        console.error(err)
      }
    },
    async save () {
      this.isLoading = true
      try {
        let data = await this.role.save()
        if (data.getData().status_code == 1)
          throw 'Error on save'
        this.$router.replace({
          name: 'role',
          params: {
            id: data.getData().data.id,
          },
        })
      } catch (err) {
        console.error(err)
      } finally {
        this.role.setOption('isActiveRequest', false)
        this.isLoading = false
      }
    },
    async update () {
      this.isLoading = true
      try {
        await this.role.put()
      } catch (err) {
        console.error(err)
      } finally {
        this.role.setOption('isActiveRequest', false)
        this.isLoading = false
      }
    },
    async delete () {
      this.isLoading = true
      try {
        let data = await this.role.delete()
        if (data.getData().status_code == 1)
          throw 'Error on save'
        this.$router.replace({
          name: 'roles',
          params: {
            page: 1,
          }
        })
      } catch (err) {
        console.error(err)
      } finally {
        this.role.setOption('isActiveRequest', false)
        this.isLoading = false
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
.role-wrapper {
  position: relative;
}

h3 {
  align-self: center;
  color: var(--main-text-color);
  display: flex;
  flex-grow: 1;
  font-size: var(--main-font-size);
  font-weight: 600;
  margin: 30px 0 15px 0;
  text-transform: capitalize;
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
  margin-bottom: 40px;
}

.dropdown-select {
  margin-top: 10px;
}

#doubleBoxWrapper {
  border-radius: 20px;
  border: 1px solid transparent;
  display: flex;
  margin: 10px 0;
}

#leftBox, #rightBox {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 50%;
}

#rightBox {
  border-left: 1px solid #eee;
}

.sub-title {
  align-self: center;
  color: var(--main-text-color);
  display: flex;
  flex-grow: 1;
  font-size: var(--main-font-size);
  font-weight: 600;
  margin: 5px 0;
}

.boxlist-wrapper {
  box-sizing: border-box;
  display: block;
  max-height: 320px;
  padding: 10px;
  width: 100%;
}

.item-permissions {
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
  padding-right: 10px;
  pointer-events: none;
}
</style>
