<template lang="html">
  <div>
    <Header>
      <Dropdown
        label="Actions"
        v-bind:onSelectOption="onSelectOption"
        v-bind:selectOptions="selectOptions"
        v-bind:isLast="true"/>
    </Header>
    <LoadingBar v-if="isLoading"/>
    <BoxWrapper>
      <ListTable
        v-if="items.models.length"
        v-bind:collection="items"
        v-bind:onClickRow="showDetail"
        v-bind:navigationBefore="navigationBefore"
        v-bind:navigationNext="navigationNext"
        v-bind:currentPage="currentPage"
        v-bind:totalPages="totalPages"
        v-bind:itemsSkipped="totalSkippedItems"
        v-bind:totalItems="totalItems"
        v-bind:columnNames="columnNames"
        v-bind:itemPropNames="itemPropNames"
        v-bind:iconPropName="iconPropName"
        v-bind:keyThumbnail="keyThumbnail"
        v-bind:rowButtons="rowButtons"/>
        <FloatButtonIcon
          v-if="listTypeNew !== ''"
          buttonText="New"
          buttonIcon="note_add"
          v-bind:buttonAction="openNew"/>
    </BoxWrapper>
    <Footer>
      <div class="data">
        {{ $t('rows from') }} {{ totalSkippedItems + 1 }} {{ $t('to') }}
        {{ totalSkippedItems + items.models.length }} {{ $t('of') }} {{ totalItems }}
      </div>
      <div class="data">
        {{ $t('page') }} {{ currentPage }} {{ $t('of') }} {{ totalPages }}
      </div>
      <ButtonIcon
        buttonIcon="first_page"
        v-bind:buttonAction="navigationFirst"/>
      <ButtonIcon
        buttonIcon="navigate_before"
        v-bind:buttonAction="navigationBefore"/>
      <ButtonIcon
        buttonIcon="navigate_next"
        v-bind:buttonAction="navigationNext"/>
      <ButtonIcon
        buttonIcon="last_page"
        v-bind:buttonAction="navigationLast"/>
    </Footer>
  </div>
</template>

<script>
import ListTable from './templates/list-table.vue'
import BoxWrapper from './templates/box-wrapper.vue'
import Button from './templates/button.vue'
import Dropdown from './templates/dropdown.vue'
import ButtonIcon from './templates/button-icon.vue'
import LoadingBar from './templates/loading-bar.vue'
import Header from './templates/header.vue'
import Footer from './templates/footer.vue'
import FloatButtonIcon from './templates/float-button-icon.vue'

export default {
  data () {
    return {
      listTypeDetail: '',
      listTypeNew: '',
      items: null,
      currentPage: this.$route.params.page,
      totalPages: 1,
      totalSkippedItems: -1,
      totalItems: 0,
      itemsSelected: {},
      selectOptions: [
        {
          name: 'delete',
          value: 'delete',
        },
      ],
      isLoading: false,
      selectColumnOptions: [],
      columnNames: [],
      itemPropNames: [],
      routeName: '',
      iconPropName: '',
      keyThumbnail: '',
      identifier: '',
      rowButtons: [],
    }
  },
  components: {
    ListTable,
    BoxWrapper,
    Button,
    Dropdown,
    ButtonIcon,
    LoadingBar,
    Header,
    Footer,
    FloatButtonIcon,
  },
  created () {
    this.routeName = this.$router.history.current.name
    let model = null
    let modelPrefix = ''
    let modelDefaultProps = []
    switch (this.routeName) {
      case 'categories':
        this.items = new this.$models.CategoryCollection()
        this.listTypeDetail = 'category'
        this.listTypeNew = 'category'
        model = new this.$models.Category()
        modelPrefix = 'category'
        modelDefaultProps = [
          'id',
          'category_name',
          'category_description',
          'category_locale',
        ]
        this.iconPropName = 'category_name'
        break
      case 'files':
        this.items = new this.$models.FileCollection()
        this.listTypeDetail = 'file'
        this.listTypeNew = 'file'
        model = new this.$models.File()
        modelPrefix = 'file'
        modelDefaultProps = [
          'id',
          'file_title',
          'file_name',
          'file_description',
          'file_mime_type',
        ]
        this.iconPropName = 'file_title'
        this.keyThumbnail = 'file_name'
        break
      case 'languages':
        this.items = new this.$models.LanguageCollection()
        this.listTypeDetail = 'language'
        this.listTypeNew = 'language'
        model = new this.$models.Language()
        modelPrefix = 'language'
        modelDefaultProps = [
          'id',
          'language_name',
          'created_at',
          'updated_at',
        ]
        this.iconPropName = 'language_name'
        break
      case 'resources':
        this.items = new this.$models.ResourceCollection()
        this.listTypeDetail = 'resource'
        this.listTypeNew = 'resource'
        model = new this.$models.Resource()
        modelPrefix = 'resource'
        modelDefaultProps = [
          'id',
          'resource_name',
          'resource_description',
          'resource_type',
          'resource_path',
          'created_at',
          'updated_at',
        ]
        this.iconPropName = 'resource_name'
        break
      case 'roles':
        this.items = new this.$models.RoleCollection()
        this.listTypeDetail = 'role'
        this.listTypeNew = 'role'
        model = new this.$models.Role()
        modelPrefix = 'role'
        modelDefaultProps = [
          'id',
          'role_name',
          'created_at',
          'updated_at',
        ]
        this.iconPropName = 'role_name'
        break
      case 'users':
        this.items = new this.$models.UserCollection()
        this.listTypeDetail = 'user'
        this.listTypeNew = 'user'
        model = new this.$models.User()
        modelPrefix = 'user'
        modelDefaultProps = [
          'id',
          'user_name',
          'user_first_name',
          'user_last_name',
          'user_email',
          'user_active',
          'role_id',
          'user_status',
          'created_at',
          'updated_at',
        ]
        this.iconPropName = 'user_name'
        this.keyThumbnail = 'profile_file_id_ref'
        break
    }
    this.selectColumnOptions = this.$getModelColums(model, modelPrefix, modelDefaultProps)
    this.generateViewColumns()
    this.fetchItems()
    this.$eventHub.$on('items-selected', itemsSelected => {
      this.itemsSelected = itemsSelected
    })
  },
  methods: {
    async fetchItems () {
      this.isLoading = true
      try {
        this.items.set({
          'page_number': this.currentPage,
        })
        let data = await this.items.fetch()
        this.isLoading = false
        this.totalPages = data.getData().total_pages
        this.totalSkippedItems = data.getData().items_skipped
        this.totalItems = data.getData().total_items
        if (this.items.getModels().length)
          this.identifier = this.items.first().getOption('identifier')
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    navigationFirst () {
      this.currentPage = 1
      this.$router.push({ name: this.routeName, params: { page: this.currentPage } })
    },
    navigationLast () {
      this.currentPage = this.totalPages
      this.$router.push({ name: this.routeName, params: { page: this.currentPage } })
    },
    navigationBefore () {
      if (this.currentPage < 2)
        return

      this.currentPage--
      this.$router.push({
        name: this.routeName,
        params: {
          page: this.currentPage,
        },
      })
    },
    navigationNext () {
      if (parseInt(this.currentPage) + 1 > this.totalPages)
        return

      this.currentPage++
      this.$router.push({
        name: this.routeName,
        params: {
          page: this.currentPage,
        },
      })
    },
    showDetail (item) {
      this.$router.push({
        name: this.listTypeDetail,
        params: {
          id: item.get(this.identifier),
        },
      })
    },
    openNew () {
      this.$router.push({
        name: this.listTypeNew,
      })
    },
    goToReportDetail (data) {
      this.$router.push({
        name: 'custom-report-detail',
        params: {
          id: data.item.get('id'),
          name: data.item.get('report_name'),
          page: 1,
        },
      })
    },
    onSelectOption (option) {
      let promisses = []
      let typeAction = ''
      this.isLoading = true
      if (option === 'delete') {
        typeAction = 'deleted'
        Object.values(this.itemsSelected).forEach(id => {
          let items = this.items.find(item => {
            let itemId = item.get(this.identifier)
            if (itemId === id)
              return true

            return false
          })
          promisses.push(items.delete())
        })
      }
      Promise.all(promisses)
        .then(responses => {
          this.isLoading = false
        })
        .catch(err => {
          this.isLoading = false
        })
      this.itemsSelected = {}
      this.$eventHub.$emit('clear-items-selected', '')
    },
    closeInputModal () {
      this.$eventHub.$emit('input-modal', null)
    },
    onSelectColumnOptionChange (propName) {
      for (let column of this.selectColumnOptions)
        if (column.item_prop === propName) {
          column.item_value = !column.item_value
          break
        }
    },
    generateViewColumns () {
      let columnNames = []
      let itemPropNames = []
      for (let column of this.selectColumnOptions) {
        if (column.item_value) {
          columnNames.push(column.item_name)
          itemPropNames.push(column.item_prop)
        }
      }
      this.columnNames = columnNames
      this.itemPropNames = itemPropNames
    },
  },
}
</script>

<style scoped lang="css">
.data {
  align-self: center;
  color: var(--main-text-color);
  display: flex;
  font-size: var(--main-secundary-font-size);
  font-weight: bold;
  margin: 4px;
  text-transform: uppercase;
}
</style>
