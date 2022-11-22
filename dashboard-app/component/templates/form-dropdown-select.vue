<template lang="html">
  <div
    id="select-wrapper"
    v-bind:class="{
        'open': show,
        'embeded': rowEmbeded,
      }"
    v-click-outside="clickOutsite"
    v-on:click="showOptions">
    <label
      id="input-title"
      v-bind:class="{ 'error': errorMessage }">
      {{ $t(label) }}
    </label>
    <input
      type="text"
      autocomplete="off"
      readonly="readonly"
      v-bind:value="getOptionName()"
      v-on:focus="focus"
      v-on:focusout="focusoutDebounce"/>
    <label
      v-show="errorMessage"
      id="input-error-message">
      {{ $t(errorMessage) }}
    </label>
    <label
      v-show="!errorMessage"
      id="input-helper-message">
      {{ $t(helperMessage) }}
    </label>
    <div id="select-options"
      v-if="show && !disabled">
      <VuePerfectScrollbar class="scroll-area">
        <div id="items">
          <div
            class="item"
            v-on:click="onSelectEmpty()">
            {{ $t('none') }}
          </div>
          <div
            class="item"
            v-for="(option, index) in selectOptions"
            v-on:click="onSelect(index)">
            {{ $t(option.name) }}
          </div>
        </div>
      </VuePerfectScrollbar>
    </div>
  </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'


export default {
  props: [
    'onSelectOption',
    'selectOptions',
    'initialIndexOption',
    'label',
    'openInTop',
    'propName',
    'helperMessage',
    'errorMessage',
    'disabled',
    'data',
    'onOpenClose',
    'rowEmbeded',
  ],
  data() {
    return {
      currentIndex: 0,
      show: false,
      hasFocus: false,
      focusoutDebounce: this._.debounce(this.focusout, 150)
    }
  },
  components: {
    VuePerfectScrollbar,
  },
  watch: {
    initialIndexOption (newVal, oldVal) {
      this.currentIndex = newVal
    },
    show (newVal, oldVal) {
      this.onActions(newVal)
    },
  },
  created () {
    this.currentIndex = this.initialIndexOption
  },
  methods: {
    showOptions () {
      this.hasFocus = true
      this.show = true
    },
    focus () {
      this.hasFocus = true
      this.show = true
    },
    focusout () {
      this.hasFocus = false
      this.show = false
    },
    onSelectEmpty () {
      this.currentIndex = -1
      let option = {
        name: '',
        value: null,
        prop_name: this.propName,
        selected: false,
      }
      this.onSelectOption(option, this.currentIndex)
      this.hasFocus = false
      this.show = false
    },
    onSelect (index) {
      this.currentIndex = index
      let option = this.selectOptions[index]
      option.prop_name = this.propName
      this.onSelectOption(option, index, this.data)
      this.hasFocus = false
      this.show = false
    },
    clickOutsite (e) {
      this.hasFocus = false
      this.show = false
    },
    getOptionName () {
      let name = this.$t('none')
      if (this.selectOptions.length === 0 || this.currentIndex === null || this.currentIndex < 0)
        return name

      if (this.currentIndex >= 0)
        name = this.selectOptions[this.currentIndex].name

      return name
    },
    onActions (isOpen) {
      if (this.onOpenClose !== undefined)
        this.onOpenClose(isOpen)
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
  top: 32px;
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
  margin: 15px 0 0 0;
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
  top: -10px;
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

#select-options .scroll-area .item:first-child {
  margin-top: 10px;
}

#select-options .scroll-area .item:last-child {
  margin-bottom: 10px;
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
</style>
