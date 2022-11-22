<template lang="html">
  <div
    v-bind:class="{ 'select-wrapper': true, open: show }"
    v-on:click="showOptions"
    v-click-outside="clickOutsite"
  >
    <i class="material-icons-round">
      {{ icon }}
    </i>
    <div class="items-wrapper" v-if="show">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'icon',
  ],
  data() {
    return {
      currentValue: '',
      show: false,
    }
  },
  methods: {
    showOptions () {
      this.show = !this.show
    },
    clickOutsite (event) {
      this.show = false
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
  border: none;
  color: var(--main-text-color);
  cursor: pointer;
  display: flex;
  padding: 6px 15px;
  position: relative;
  text-transform: uppercase;
  user-select: none;
}

.select-wrapper label {
  cursor: pointer;
}

.select-wrapper:hover {
  background-color: var(--main-hover-color);
  color: var(--main-accent-color) !important;
}

.select-wrapper.open .icon,
.select-wrapper.open label {
  z-index: 2;
}

.items-wrapper {
  background-color: var(--main-box-bg-color);
  border-radius: 20px;
  box-shadow: var(--main-box-shadow);
  display: flex;
  flex-wrap: wrap;
  left: -45px;
  list-style: none;
  margin: 0;
  max-height: 200px;
  min-width: 120px;
  overflow: hidden;
  overflow: scroll;
  padding: 0;
  position: absolute;
  right: 0;
  top: 100%;
  z-index: 2;
}

.icon {
  color: var(--main-text-color);
  font-size: 18px;
}

.select-wrapper.open {
  background-color: var(--main-box-bg-color);
}
</style>
