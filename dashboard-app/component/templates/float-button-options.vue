<template lang="html">
  <div
    id="button-wrapper"
    v-bind:class="{
      full: isFullContent,
      mobile: isMobile,
    }">
    <div
      id="button"
      v-on:click="toggle">
      <i
        class="material-icons-round icon">
        {{ buttonIcon }}
      </i>
    </div>
    <div
      v-if="isExpanded"
      id="options">
      <div
        v-for="option of options"
        class="option"
        v-on:click="option.action">
        <div>
          {{ option.name }}
        </div>
        <i
          class="material-icons-round icon">
          {{ option.icon }}
        </i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'openIcon',
    'closeIcon',
    'options',
  ],
  data () {
    return {
      isExpanded: false,
      buttonIcon: this.openIcon,
      isMobile: false,
      isFullContent: false,
    }
  },
  created () {
    this.isFullContent = window.app.dashboard_full_content
    this.$eventHub.$on('app-is-full-content', isFullContent => {
      this.isFullContent = isFullContent
    })
    this.isMobile = window.app.dashboard_is_mobile
    this.$eventHub.$on('dashboard-is-mobile', isMobile => {
      this.isMobile = isMobile
    })
  },
  methods: {
    toggle () {
      this.isExpanded = !this.isExpanded
      if (this.isExpanded) {
        this.buttonIcon = this.closeIcon
        return
      }
      this.buttonIcon = this.openIcon
    },
  },
}
</script>

<style scoped lang="css">
#button-wrapper {
  -webkit-user-select: none;
  align-self: center;
  background-color: var(--main-box-bg-opace-color);
  border-radius: 100%;
  border: none;
  bottom: 77px;
  box-shadow: var(--main-box-shadow);
  color: var(--main-text-color);
  cursor: pointer;
  display: flex;
  font-size: var(--main-accent-font-size);
  font-weight: 400;
  height: 40px;
  margin-left: auto;
  outline: none;
  position: fixed;
  right: calc(174px + 16px);
  transition-duration: 200ms;
  transition-property: background-color;
  user-select: none;
  width: 40px;
  z-index: 1;
}

#button-wrapper.full {
  right: 14px;
}

#button-wrapper.mobile {
  bottom: 70px;
}

#button {
  border-radius: 100%;
  height: 100%;
  left: 0;
  margin: auto;
  position: relative;
  top: 0;
  width: 100%;
  display: flex;
}

#button-wrapper:hover #button {
  background-color: var(--main-hover-color);
}

#button-wrapper:active #button {
  background-color: var(--main-active-color);
  color: var(--main-accent-color);
}

#button-wrapper #button .icon {
  bottom: 0;
  display: flex;
  height: var(--main-accent-font-size);
  justify-content: center;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
  width: var(--main-accent-font-size);
}

#options {
  bottom: 50px;
  position: absolute;
  right: 0;
}

.option {
  -webkit-user-select: none;
  background-color: var(--main-box-bg-opace-color);
  border-radius: 60px;
  border: none;
  box-shadow: var(--main-box-shadow);
  color: var(--main-text-color);
  cursor: pointer;
  display: flex;
  font-size: var(--main-accent-font-size);
  font-weight: 400;
  margin: 10px 0;
  outline: none;
  overflow: hidden;
  padding: 6px 10px;
  position: relative;
  transition-duration: 200ms;
  transition-property: background-color;
  user-select: none;
}

.option:before {
  background-color: var(--main-box-bg-opace-color);
  content: "";
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}

.option > .icon {
  align-self: center;
  font-size: 20px;
  justify-self: center;
  position: relative;
}

.option > div:first-child {
  align-self: center;
  padding: 0 6px;
  text-align: right;
  width: 100%;
  z-index: 1;
}

.option:hover:before {
  background-color: var(--main-hover-color);
}

.option:active:before {
  background-color: var(--main-hover-color);
}

.option:active {
  background-color: var(--main-active-color);
  color: var(--main-accent-color);
}
</style>
