<template lang="html">
  <div id="navigation-buttons-wrapper">
    <div
      class="button-wrapper"
      v-on:click="routerHistory(historyBack)"
      v-bind:style="this.getColor()"
    >
      <i class="material-icons-round icon">
        keyboard_arrow_left
      </i>
    </div>
    <div
      class="button-wrapper"
      v-on:click="routerHistory(historyNext)"
      v-bind:style="this.getColor()"
    >
      <i class="material-icons-round icon">
        keyboard_arrow_right
      </i>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'buttonColor',
  ],
  data() {
    return {
      historyBack: -1,
      historyNext: 1,
    }
  },
  components: {},
  created() {},
  methods: {
    routerHistory (position) {
      this.$router.go(position)
    },
    getColor () {
      if (this.buttonColor)
        return `color: ${ this.buttonColor }`

      return 'color: var(--main-text-color)'
    },
  },
}
</script>

<style scoped lang="css">
#navigation-buttons-wrapper {
  -webkit-user-select: none;
  display: flex;
  position: relative;
  user-select: none;
}

.button-wrapper {
  background: transparent;
  border-radius: 20px;
  border: 1px solid transparent;
  cursor: pointer;
  display: inline-flex;
  font-weight: 600;
  margin-right: 5px;
  outline: none;
  padding: 2px;
  position: relative;
  height: 24px;
  width: 24px;
  justify-content: center;
}

.button-wrapper:hover {
  background-color: var(--main-hover-color);
}

.button-wrapper:active {
  background-color: var(--main-active-color);
  color: var(--main-accent-color);
}

.button-wrapper:active .icon {
  color: var(--main-accent-color);
}

.button-wrapper .icon {
  align-self: center;
  line-height: 1;
}
</style>
