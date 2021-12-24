<template lang="html">
    <div
      id="header-wrapper"
      v-bind:class="{
        mobile: isMobile,
      }">
      <div id="title-wrapper">
        <NavigationButtons/>
        <div id="title">
          <h2>
            {{ $t(`${ headerTitle }`) }}
          </h2>
        </div>
      </div>
      <div id="actions">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import NavigationButtons from './navigation-buttons.vue'
export default {
  props: [
    'title',
  ],
  components: {
    NavigationButtons,
  },
  data () {
    return {
      headerTitle: '',
      isFullContent: false,
      isMobile: false,
    }
  },
  created () {
    if (this.sectionTitle === undefined || this.sectionTitle === '') {
      let title = this.$router.history.current.meta.title
      this.headerTitle = title.charAt(0).toUpperCase() + title.slice(1)
      return
    }
    this.headerTitle = this.title
  },
}
</script>

<style scoped lang="css">
#title-wrapper {
  display: flex;
}

#header-wrapper.mobile {
  display: block;
}

#title {
  display: flex;
  flex-grow: 0;
}

#title > div {
  display: flex;
  position: relative;
}

h2 {
  align-self: center;
  color: var(--main-accent-color);
  font-size: calc(var(--main-font-size) + 4px);
  font-weight: 600;
  letter-spacing: normal;
  margin: 0 4px;
  padding: 0;
  white-space: nowrap;
}

#header-wrapper {
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  margin: 0 10px 3px 10px;
  position: relative;
  z-index: 1;
}

#actions {
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
}

#actions div {
  margin-left: 4px;
}

#actions div:first-child {
  margin-left: 0;
}

</style>
