<template lang="html">
  <div
    id="button-wrapper"
    v-on:click="buttonAction"
    v-bind:class="{
      full: isFullContent,
      mobile: isMobile,
    }">
    <div id="button">
      <div>
        {{ buttonText }}
      </div>
      <i
        v-if="buttonIcon"
        class="material-icons-round icon">
        {{ buttonIcon }}
      </i>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'buttonText',
    'buttonIcon',
    'buttonAction',
  ],
  data () {
    return {
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
}
</script>

<style scoped lang="css">
#button-wrapper {
  -webkit-user-select: none;
  align-self: center;
  background-color: var(--main-box-bg-opace-color);
  border-radius: 60px;
  border: none;
  bottom: 77px;
  box-shadow: var(--main-box-shadow);
  color: var(--main-text-color);
  cursor: pointer;
  display: flex;
  font-size: var(--main-font-size);
  font-weight: 400;
  margin-left: auto;
  outline: none;
  overflow: hidden;
  position: fixed;
  right: calc(174px + 16px);
  transition-duration: 200ms;
  transition-property: background-color;
  user-select: none;
}

#button-wrapper.full {
  right: 20px;
}

#button-wrapper.mobile {
  bottom: 70px;
}

#button {
  align-self: center;
  display: flex;
  font-size: 20px;
  justify-self: center;
  padding: 6px 10px;
  position: relative;
}

#button-wrapper:hover #button {
  background-color: var(--main-hover-color);
}

#button-wrapper:active #button {
  background-color: var(--main-active-color);
  color: var(--main-accent-color);
}

#button-wrapper .icon {
  font-size: 20px;
  position: relative;
}

#button > div:first-child {
  align-self: center;
  font-size: var(--main-font-size);
  padding: 0 10px;
  text-align: right;
  width: 100%;
  z-index: 1;
}

</style>
