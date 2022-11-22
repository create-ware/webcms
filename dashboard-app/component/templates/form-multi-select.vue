<template lang="html">
  <div>
    <div id="select-wrapper">
      <label id="title">
        {{ $t(label) }}
      </label>
      <div id="select-options">
        <VuePerfectScrollbar class="scroll-area">
          <div id="items">
            <div
              v-for="(option, index) in selectOptions"
              v-bind:class="{
                item: true,
                selected: option.selected,
                }"
              v-on:click="onSelect(index)">
              {{ $t(option.name) }}
            </div>
          </div>
        </VuePerfectScrollbar>
      </div>
    </div>
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
    'propName',
    'helperMessage',
    'errorMessage',
  ],
  data () {
    return {
      currentIndex: 0,
      currentOptionLabel: '',
    }
  },
  components: {
    VuePerfectScrollbar,
  },
  watch: {
    initialIndexOption (newVal, oldVal) {
      this.currentIndex = newVal
    },
  },
  created () {
    this.currentIndex = this.initialIndexOption
  },
  methods: {
    onSelect (index) {
      this.currentIndex = index
      let option = this.selectOptions[index]
      option.prop_name = this.propName
      this.onSelectOption(option, index)
    },
  },
}
</script>

<style scoped lang="css">
#select-options {
  background-color: var(--main-body-bg-color);
  border-radius: 20px;
  box-shadow: rgba(25, 25, 25, 0.3) inset 0px 1px 2px 0px, rgba(25, 25, 25, 0.15)  inset 0px 1px 3px 1px;
  height: 150px;
  list-style: none;
  margin: 0;
  max-width: 320px;
  overflow: auto;
  padding: 0;
  position: relative;
  width: 100%;
}
#select-options .scroll-area {
  max-height: 150px;
}
#select-wrapper {
  -webkit-user-select: none;
  align-self: center;
  background: transparent;
  color: var(--main-text-color);
  cursor: pointer;
  font-size: var(--main-font-size);
  position: relative;
  user-select: none;
}
#items {
  padding: 6px;
}
label {
  cursor: pointer;
}
#select-wrapper #title {
  font-weight: 600;
  margin-right: 5px;
  text-transform: uppercase;
}
#select-options .item {
  background-color: transparent;
  border-radius: 20px;
  font-weight: 500;
  padding: 8px 6px;
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
#select-options .item.selected {
  background-color: var(--main-hover-color);
}
#select-options .item:hover.selected {
  color: var(--main-accent-color);
}
#input-error-message,
#input-helper-message {
  font-size: var(--main-font-size);
  font-weight: 500;
  position: relative;
  top: -2px;
  width: 100%;
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
