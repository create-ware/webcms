<template lang="html">
  <div
    v-bind:class="{ 'select-wrapper': true, open: show }"
    v-on:click="showOptions"
    v-click-outside="clickOutsite">
    <i class="material-icons-round">
      {{ getIconName() }}
    </i>
    <label>
      {{ $t(label) }}
    </label>
    <div
      id="select-options"
      v-bind:class="{
        'top': openInTop,
        'bottom': !openInTop,
      }"
      v-if="show">
      <VuePerfectScrollbar class="scroll-area">
        <div
          class="item"
          v-for="option in selectOptions"
          v-on:click="onSelect(option.value)">
          {{ $t(option.name) }}
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
    'label',
    'selectOptions',
    'openInTop',
  ],
  data() {
    return {
      currentValue: '',
      show: false,
    }
  },
  components: {
    VuePerfectScrollbar,
  },
  methods: {
    showOptions () {
      this.show = !this.show
    },
    onSelect (value) {
      this.currentValue = value
      this.onSelectOption(this.currentValue)
    },
    clickOutsite (event) {
      this.show = false
    },
    getIconName () {
      let iconName = this.show ? 'expand_less' : 'expand_more'
      if (this.openInTop)
        return this.show ? 'expand_more' : 'expand_less'

      return iconName
    },
  },
}
</script>

<style scoped lang="css">
.select-wrapper {
  -webkit-user-select: none;
  align-self: center;
  background: transparent;
  border-radius: 20px;
  border: 1px solid transparent;
  color: var(--main-text-color);
  cursor: pointer;
  display: flex;
  font-size: var(--main-font-size);
  font-weight: 600;
  height: 16px;
  outline: none;
  padding: 6px 15px;
  position: relative;
  user-select: none;
}

.select-wrapper label {
  cursor: pointer;
}

.select-wrapper:hover {
  background-color: var(--main-hover-color);
}

.select-wrapper.open,
.select-wrapper:active {
  background-color: var(--main-active-color);
}

.select-wrapper.open label,
.select-wrapper.open .icon,
.select-wrapper:active label,
.select-wrapper:active .icon {
  color: var(--main-accent-color) !important;
}

.select-wrapper.open .icon,
.select-wrapper.open label {
  z-index: 2;
}

.select-wrapper .icon {
  align-self: center;
  font-size: 20px;
  line-height: 1;
  margin-right: 5px;
  position: relative;
}

#select-options {
  background-color: var(--main-box-bg-color);
  border-radius: 20px;
  box-shadow: var(--main-box-shadow);
  left: 0;
  list-style: none;
  margin: 0;
  max-height: 150px;
  min-width: 112px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  right: 0;
  z-index: 2;
}

#select-options .scroll-area {
  max-height: 150px;
}

.top {
  bottom: 0;
  padding: 0 0 26px 0;
}

.bottom {
  padding: 26px 0 0 0;
  top: 0;
}

#select-options.top {
  padding-bottom: 24px;
}

#select-options.bottom {
  margin-top: 36px;
}

#select-options .item {
  background-color: var(--main-box-bg-color);
  padding: 6px 15px;
  text-transform: capitalize;
}

#select-options .item:hover {
  background-color: var(--main-hover-color);
}

#select-options .item:active {
  background-color: var(--main-active-color);
  color: var(--main-accent-color);
}

</style>
