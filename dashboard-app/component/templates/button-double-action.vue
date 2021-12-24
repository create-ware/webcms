<template lang="html">
  <div
    id="button-wrapper"
    v-bind:style="this.getColor()"
  >
    <p v-on:click="onClickText">
      <slot></slot>
    </p>
    <i
      v-if="buttonIcon"
      class="material-icons-round icon"
      v-on:click="onClickIcon"
      >
      {{ buttonIcon }}
    </i>
  </div>
</template>

<script>
export default {
  props: [
    'buttonIcon',
    'buttonTextAction',
    'buttonIconAction',
    'buttonColor',
    'data',
  ],
  data() {
    return {}
  },
  components: {},
  created() {},
  methods: {
    getColor () {
      if (this.buttonColor)
        return `color: ${ this.buttonColor }`

      return 'color: var(--main-text-color)'
    },
    onClickText () {
      if (!this.buttonTextAction)
        return

      this.buttonTextAction(this.data)
    },
    onClickIcon () {
      if (!this.buttonIconAction)
        return

      this.buttonIconAction(this.data)
    },
  },
}
</script>

<style scoped lang="css">
#button-wrapper {
  -webkit-user-select: none;
  align-self: center;
  background: transparent;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  display: block;
  display: flex;
  font-size: var(--main-font-size);
  font-weight: 600;
  height: 16px;
  outline: none;
  padding: 6px 15px;
  position: relative;
  user-select: none;
}

#button-wrapper:hover {
  background-color: var(--main-hover-color);
}

#button-wrapper:active {
  background-color: var(--main-active-color);
  color: var(--main-accent-color) !important;
}

#button-wrapper .icon {
  font-size: 16px;
  margin-right: 5px;
  align-self: center;
}

p {
  align-self: center;
  display: flex;
  margin-right: 5px;
  margin: 0;
  width: 100%;
}

</style>
