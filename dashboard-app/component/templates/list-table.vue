<template lang="html">
  <div>
    <div id="header">
      <div id="table-header-info">
        {{ tableHeaderInfo }}<span v-if="tableHeaderInfo && tableHeaderFilteredInfo"> - </span>{{ tableHeaderFilteredInfo }}
      </div>
      <div id="search-wrapper">
        <InputText
          inputName="Search"
          v-bind:inputValue="searchKeyWord"
          v-bind:onChangeValue="throttleSearchInRows"
          helperMessage="Some keyword"/>
      </div>
    </div>
    <div id="overflow-x-scroll">
      <table id="table-wrapper">
        <thead>
          <tr>
            <td>
              <Checkbox
                v-bind:onChangeValue="onChangeValue"
                item="all"
                v-bind:currentValue="checkAll"/>
            </td>
            <td>
              {{ $t('icon') }}
            </td>
            <td v-for="columnName, i in columnNames">
              <div class="column-name">
                <ButtonIcon
                  v-bind:buttonIcon="getIconName(i)"
                  v-bind:buttonAction="orderByColumn"
                  v-bind:buttonData="{
                    column_index: i,
                    column_name: columnName,
                  }"/>
                {{ $t(columnName) }}
              </div>
            </td>
            <td
              v-if="rowButtons !== undefined && rowButtons.length">
              {{ $t('actions') }}
            </td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in collectionItems"
            :key="item._uid">
            <td>
              <Checkbox
                v-bind:onChangeValue="onChangeValue"
                v-bind:item="item"
                v-bind:currentValue="!!item.getOption('is_checked')"/>
            </td>
            <td v-on:click="onClickRow(item)">
              <div
                class="avatar"
                v-if="imageURL = getCoverImage(item, keyThumbnail, 0)"
                v-bind:style="imageURL">
              </div>
              <div
                v-if="!imageURL"
                class="avatar"
                v-bind:style="getCoverColor(item.get(iconPropName), false, 75, 50, 20)">
                <span v-bind:style="{
                  color: getCoverColor(item.get(iconPropName), true),
                }">
                  {{ item.get(iconPropName)[0] }}
                </span>
              </div>
            </td>
            <td
              v-on:click="onClickRow(item)"
              v-for="itemPropName in itemPropNames">
              <p class="item-text">
                {{ getItemText(item, itemPropName, 0) }}
              </p>
            </td>
            <td v-if="rowButtons !== undefined && rowButtons.length">
              <div class="buttons">
                <ButtonIcon
                  v-for="b in rowButtons"
                  :key="$uuid.v1()"
                  v-bind:buttonIcon="b.icon"
                  v-bind:buttonAction="b.action"
                  v-bind:buttonData="{
                    name: b.name,
                    item: item,
                  }"/>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
// columnNames: [
//   'Name',
//   'Active',
// ],
// itemPropNames: [
//   'custom_entity_name',
//   'custom_entity_is_active',
// ],
// keyThumbnail: [
//   'user_avatar',
//   'file_name',
// ],
// rowButtons: [
//   icon: '',
//   action () {},
// ]
import ButtonIcon from './button-icon.vue'
import Checkbox from './checkbox.vue'
import InputText from './input-text.vue'
export default {
  props: [
    'collection',
    'onClickRow',
    'navigationBefore',
    'navigationNext',
    'totalPages',
    'currentPage',
    'itemsSkipped',
    'totalItems',
    'columnNames',
    'itemPropNames',
    'keyThumbnail',
    'iconPropName',
    'rowButtons',
  ],
  data () {
    return {
      collectionItems: [],
      itemSelected: {},
      checkAll: false,
      tableHeaderInfo: '',
      tableHeaderFilteredInfo: '',
      orderByColumnName: '',
      orderType: '',
      searchKeyWord: '',
      throttleSearchInRows: _.throttle(this.searchInRows, 200, { 'trailing': true }),
    }
  },
  components: {
    ButtonIcon,
    Checkbox,
    InputText,
  },
  watch: {
    collection (newValues, oldValues) {
      this.collectionItems = newValues.getModels()
    },
  },
  created () {
    this.collectionItems = this.collection.getModels()
    this.$eventHub.$on('clear-items-selected', () => {
      this.checkAll = false
    })
  },
  methods: {
    setTableHeaderInfo () {
      let tableInfo = ''
      if (!!Object.keys(this.itemSelected).length)
        tableInfo = `${ Object.keys(this.itemSelected).length } ${ this.$t('records of') } ${ this.collectionItems.length } ${ this.$t('selected') }`
      this.tableHeaderInfo = tableInfo
    },
    onChangeValue (_, isChecked, itemData) {
      if (itemData === 'all') {
        let itemsChecked = {}
        this.checkAll = !this.checkAll
        for (let item of this.collectionItems) {
          item.setOption('is_checked', this.checkAll)
          if (this.checkAll) {
            let propName = item.getOption('identifier')
            let id = item.get(propName)
            itemsChecked[id] = id
          }
        }
        this.itemSelected = itemsChecked
        this.$eventHub.$emit('items-selected', this.itemSelected)
        this.setTableHeaderInfo()
        return
      }
      this.checkAll = false
      itemData.setOption('is_checked', isChecked)
      let propName = itemData.getOption('identifier')
      let id = itemData.get(propName)
      if (isChecked)
        this.itemSelected[id] = id
      else
        delete this.itemSelected[id]
      this.$eventHub.$emit('items-selected', this.itemSelected)
      this.setTableHeaderInfo()
    },
    getMomentDate (date) {
      return moment(date).format('MMMM Do YYYY, h:mm:ss a')
    },
    getCoverColor (value, plain, s, l, opacity) {
      return this.$getHexColor(value, plain, s, l, opacity)
    },
    getCoverImage (item, itemPropName, index) {
      if (itemPropName === undefined)
        return false
      if (Array.isArray(itemPropName))
        return this.getCoverImage(item[itemPropName[index]], itemPropName[index + 1], index + 1)
      let imageName = item[itemPropName]
      if (!this.$isImage(imageName))
        return false
      return this.$getAvatarURL(imageName)
    },
    getItemText (item, itemPropName, index) {
      if (Array.isArray(itemPropName))
        return this.getItemText(item[itemPropName[index]], itemPropName[index + 1], index + 1)
      let keys = itemPropName.split(':')
      if (keys.length > 1) {
        let key = keys[0]
        let type = keys[1]
        if (type === 'date')
          return this.getMomentDate(item[key])
      }
      return item[keys[0]]
    },
    getItemId (item) {
      let propIdName = item.getOption('identifier')
      return item.get(propIdName)
    },
    getIconName (columnIndex) {
      if (this.orderByColumnName === '')
        return 'sort_by_alpha'
      let propName = this.itemPropNames[columnIndex]
      if (this.orderByColumnName !== propName)
        return 'sort_by_alpha'
      if (this.orderType === 'desc')
        return 'expand_more'
      return 'expand_less'
    },
    orderByColumn (data) {
      let propName = this.itemPropNames[data.column_index]
      if (this.orderByColumnName !== propName || this.orderType === '')
        this.orderType = 'desc'
      else if (this.orderType === 'desc')
        this.orderType = 'asc'
      else
        this.orderType = 'desc'
      this.orderByColumnName = propName
      let collectionItemsResult = []
      if (this.searchKeyWord !== '')
        collectionItemsResult = this.getCollectionFiltered(this.searchKeyWord)
      else
        collectionItemsResult = this.collection.getModels()
      this.collectionItems = _.orderBy(collectionItemsResult, this.orderByColumnName, this.orderType)
      this.setTableHeaderInfo()
    },
    searchInRows (i, keyword) {
      this.searchKeyWord = keyword.trim()
      this.collectionItems = this.getCollectionFiltered(keyword)
      this.cleanUpSelectedItems()
    },
    getCollectionFiltered (keyword) {
      let regKeyword = new RegExp(keyword, 'i')
      let collectionFiltered = this.collection.filter(item => {
        let match = false
        for (var propName of this.itemPropNames) {
          let value = item.attributes[propName]
          if (value !== undefined && value.length && value.toString().match(regKeyword) !== null) {
            match = true
            break
          }
        }
        return match
      })
      return collectionFiltered.getModels()
    },
    cleanUpSelectedItems () {
      let newItemsSelected = {}
      for (var itemModel of this.collectionItems) {
        let propName = itemModel.getOption('identifier')
        let itemModelId = itemModel.get(propName)
        let isChecked = false
        for (var itemSelectedId of Object.keys(this.itemSelected)) {
          if (itemModelId.toString() === itemSelectedId) {
            isChecked = true
            break
          }
        }
        itemModel.setOption('is_checked', isChecked)
        if (isChecked)
          newItemsSelected[itemModelId] = itemModelId
      }
      this.orderByColumnName = ''
      this.orderType = ''
      this.checkAll = false
      this.itemSelected = newItemsSelected
      this.$eventHub.$emit('items-selected', this.itemSelected)
      this.setTableHeaderInfo()
    },
  },
}
</script>

<style scoped lang="css">
#table-wrapper {
  border-collapse: collapse;
  border-spacing: 0;
  color: var(--main-text-color);
  min-width: 720px;
  width: 100%;
}

#overflow-x-scroll {
  position: relative;
  width: 100%;
}

#table-wrapper tr td {
  padding: 0;
}

#table-wrapper tbody tr td:first-child,
#table-wrapper thead tr td:first-child,
#table-wrapper tfoot tr td:first-child {
  padding-left: 8px;
  width: 30px;
}

#table-wrapper tbody tr td:last-child,
#table-wrapper thead tr td:last-child,
#table-wrapper tfoot tr td:last-child {
  padding-right: 8px;
}

#table-wrapper tbody tr td:first-child {
  border-bottom-left-radius: 20px;
  border-top-left-radius: 20px;
}

#table-wrapper tbody tr td:last-child {
  border-bottom-right-radius: 20px;
  border-top-right-radius: 20px;
}

#table-wrapper thead tr td:nth-child(2) {
  width: 40px;
}

thead tr td {
  background-color: var(--main-box-bg-color);
  font-size: calc(var(--main-accent-font-size) - 2px);
  font-weight: 700;
  height: 31px;
  padding: 0;
  position: -webkit-sticky;
  position: sticky;
  text-transform: uppercase;
  transition-duration: 200ms;
  transition-property: background-color;
  z-index: 1;
}

thead tr td {
  top: 0;
}

tfoot tr td {
  bottom: 0;
}

#table-wrapper tbody tr td {
  cursor: pointer;
  font-size: var(--main-font-size);
}

#table-wrapper tbody tr td p {
  margin-left: 4px;
}

#table-wrapper tbody tr:nth-child(even) {
  background-color: var(--main-table-bg-row);
}

#table-wrapper tbody tr:hover {
  background-color: var(--main-hover-color);
}

#table-wrapper tbody tr:active {
  background-color: var(--main-active-color);
  color: var(--main-accent-color);
}

.avatar {
  border-radius: 100%;
  display: flex;
  height: 28px;
  justify-content: center;
  margin: auto 0 auto 0;
  width: 28px;
}

.avatar span {
  align-self: center;
  color: var(--main-letter-color);
  font-size: 14px;
  font-weight: 400;
  text-transform: capitalize;
}

.item-text {
  align-self: center;
  margin: 0;
  padding: 0;
}

.buttons {
  display: inline-flex;
  grid-gap: 5px;
}

.column-name {
  align-items: center;
  display: flex;
  gap: 4px;
  margin: 0 4px;
}

#header {
  display: grid;
  grid-template-columns: auto 120px;
}

#table-header-info {
  align-self: center;
  color: var(--main-text-color);
  font-size: calc(var(--main-accent-font-size) - 2px);
  font-weight: 600;
  position: inherit;
  text-align: center;
  text-transform: uppercase;
}

#search-wrapper {
  align-self: center;
}

</style>
