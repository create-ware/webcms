<template lang="html">
  <div>
    <div
      id="select-wrapper"
      v-click-outside="clickOutsite">
      <InputText
        v-bind:inputName="title"
        v-bind:inputValue="getValue()"
        v-bind:onChangeValue="throttleOnChangeValue"
        v-bind:errorMessageg="errorMsg"
        v-bind:helperMessage="helpMsg"
        v-bind:isEmbededDropdown="show"/>
      <div
        id="select-options"
        v-bind:class="{
          'top': true,
        }"
        v-if="show"
        :key="collection._uid">
        <VuePerfectScrollbar class="scroll-area">
          <div
            v-if="collection.getModels().length"
            class="item"
            v-on:click="onSelectEmpty()">
            {{ $t('none') }}
          </div>
          <div
            id="empty"
            v-if="!collection.getModels().length">
            {{ $t('without results') }}
          </div>
          <div
            class="item"
            v-for="(option, index) in collection.getModels()"
            v-on:click="onSelect(option)">
            {{ option.get(propNameToShow) }}
          </div>
        </VuePerfectScrollbar>
      </div>
    </div>
  </div>
</template>

<script>
// NOTE: use
// <FormSearchDropdownSelect
//   title="Resource"
//   helpMsg="Select resource"
//   errorMsg=""
//   v-bind:collection="resourceCollection"
//   v-bind:currentValue="resourceValue"
//   v-bind:onSelectOption="onSelectOption"
//   propName="resource_id"
//   propNameToShow="resource_name"/>
//   // NOTE: data
//   resourceCollection: new this.$models.ResourceCollection(),
//   resourceValue: '',
//   // NOTE: method
//   onSelectOption (option) {
//     this.resourceValue = option.get('resource_name')
//   },

import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import InputText from './input-text.vue'

export default {
  props: [
    'title',
    'onChangeInputValue',
    'onSelectOption',
    'collection',
    'helpMsg',
    'errorMsg',
    'currentValue',
    'propNameToShow',
    'propName',
  ],
  data () {
    return {
      inputValue: '',
      show: false,
      throttleOnChangeValue: _.throttle(this.onChangeValue, 1500, { 'trailing': true }),
      itemSelected: null,
    }
  },
  components: {
    VuePerfectScrollbar,
    InputText,
  },
  methods: {
    onSelect (option) {
      this.onSelectOption(option, this.propName)
      this.show = false
      this.inputValue = ''
    },
    clickOutsite (event) {
      this.inputValue = ''
      this.show = false
    },
    onChangeValue (prop, value) {
      this.inputValue = value
      this.show = true
      this.search(value)
      if (this.onChangeInputValue !== undefined)
        this.onChangeInputValue(value)
    },
    onSelectEmpty () {
      this.onSelectOption(null, this.propName)
      this.show = false
      this.inputValue = ''
    },
    getValue () {
      if (this.show)
        return this.inputValue

      return this.currentValue
    },
    search (value) {
      this.collection.search({s: value})
    },
  },
}
</script>

<style scoped lang="css">
#select-options {
  background-color: var(--main-box-bg-color);
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  border-top: 0;
  border: 1px solid var(--main-border-color);
  box-shadow: var(--main-box-shadow);
  left: 0;
  list-style: none;
  margin: 0;
  max-width: 318px;
  overflow: auto;
  position: absolute;
  right: 0;
  top: 47px;
  width: 100%;
  z-index: 2;
}

.embeded #select-options {
  top: 21px;
}

#select-options .scroll-area {
  max-height: 200px;
}

#select-wrapper {
  -webkit-user-select: none;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  max-width: 320px;
  position: relative;
  user-select: none;
}

#select-wrapper.embeded {
  height: auto;
  padding: 0;
}

#input-title {
  background-color: var(--main-box-bg-color);
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: bold;
  left: 6px;
  padding: 0 4px;
  pointer-events: none;
  position: absolute;
  text-transform: uppercase;
  top: 4px;
  transition-duration: 50ms;
}

input {
  background: transparent;
  border-radius: 20px;
  border: 1px solid var(--main-border-color);
  box-sizing: border-box;
  caret-color: var(--main-accent-color);
  color: var(--main-text-color);
  font-size: var(--main-font-size);
  font-weight: 500;
  line-height: 1;
  margin: 0;
  outline: none;
  padding: 3px 0;
  padding: 6px 10px;
  pointer-events: none;
  width: 100%;
}

#select-wrapper.open input {
  border-bottom: 0px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
}

#select-wrapper .icon {
  font-size: 14px;
  left: 4px;
  line-height: 1;
  position: absolute;
}

#select-options .item {
  background-color: var(--main-box-bg-color);
  border-radius: 20px;
  color: var(--main-text-color);
  cursor: pointer;
  font-size: var(--main-secundary-font-size);
  font-weight: bold;
  margin: 0px 10px;
  overflow: hidden;
  padding: 6px 10px;
  text-overflow: ellipsis;
  text-transform: uppercase;
}

#select-options .scroll-area {
  padding: 10px 0;
}

#select-options .item:first-letter {
  text-transform: uppercase;
}

#select-options .item:hover {
  background-color: var(--main-hover-color);
}

#select-options .item:active {
  background-color: var(--main-active-color);
  color: var(--main-accent-color);
}

#select-wrapper.open input {
  border-bottom: 1px solid var(--main-text-color);
}

#select-wrapper.open #input-title {
  color: var(--main-accent-color);
}

#input-error-message,
#input-helper-message {
  font-size: var(--main-secundary-font-size);
  font-weight: 500;
  left: 10px;
  position: relative;
}

#input-error-message {
  color: #ff4949;
}

#input-helper-message {
  color: #777;
}

.input-wrapper #input-title.error {
  color: #ff4949;
}

#empty {
  padding: 10px;
  color: var(--main-text-color);
  font-size: var(--main-font-size);
}
</style>
