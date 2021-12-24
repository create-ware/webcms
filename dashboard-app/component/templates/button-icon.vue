<template lang="html">
  <div
    id="button-wrapper"
    v-on:click="onClick"
    v-bind:class="{
      active: isActive,
      }">
    <i
      v-if="buttonIcon"
      id="icon"
      class="material-icons-round"
      v-bind:style="customIconStyle">
      {{ buttonIcon }}
    </i>
  </div>
</template>

<script>
export default {
  props: [
    'buttonIcon',
    'buttonAction',
    'buttonData',
    'customIconStyle',
    'isActive',
  ],
  methods: {
    onClick () {
      this.buttonAction(this.buttonData)
    },
  },
}
</script>

<style scoped lang="css">
#button-wrapper {
  -webkit-user-select: none;
  background: transparent;
  border-radius: 100%;
  border: none;
  color: var(--main-text-color);
  cursor: pointer;
  display: flex;
  font-weight: 600;
  height: 24px;
  justify-content: center;
  outline: none;
  padding: 2px;
  position: relative;
  user-select: none;
  width: 24px;
}

#button-wrapper:hover {
  background-color: var(--main-hover-color);
}

#button-wrapper:active {
  background-color: var(--main-active-color);
  color: var(--main-accent-color);
}

#button-wrapper.active {
  background-color: var(--main-hover-color);
  color: var(--main-accent-color);
}

#icon {
  align-self: center;
  line-height: 1;
  padding: 1px;
}

</style>
