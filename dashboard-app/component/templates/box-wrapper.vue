<template lang="html">
  <div
    id="box-wrapper"
    v-window-resize="setcustomHeight"
    v-bind:style="customHeight">
    <VuePerfectScrollbar class="scroll-area">
      <div
        id="content"
        v-bind:style="customPadding">
        <slot></slot>
      </div>
    </VuePerfectScrollbar>
  </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'


export default {
  props: [
    'footerSize',
    'customPaddingStyle',
    'customContentStyle',
  ],
  components: {
    VuePerfectScrollbar,
  },
  data() {
    return {
      customHeight: 'height: 0',
      headerHeight: 140,
      customPadding: 'padding: 10px 10px 40px 10px;',
    }
  },
  created() {
    this.setcustomHeight()
    this.setCustomPaddingStyle()
  },
  methods: {
    setcustomHeight () {
      let height = window.innerHeight - this.headerHeight
      if (this.footerSize)
        height = height - this.footerSize;
      this.customHeight = `height: ${ height }px;`
    },
    setCustomPaddingStyle () {
      if (this.customPaddingStyle)
        this.customPadding = `padding: ${ this.customPaddingStyle };`
      if (this.customContentStyle)
        this.customPadding = this.customPadding + this.customContentStyle
    },
  },
}
</script>

<style scoped lang="css">
#box-wrapper {
  background-color: var(--main-box-bg-color);
  border-radius: 20px;
  box-shadow: var(--main-box-shadow);
  margin-left: 10px;
  margin-right: 10px;
  overflow: auto;
  position: relative;
}

#content {
  padding: 10px 10px 40px 10px;
  position: relative;
}
</style>
