<template lang="html">
  <div
    id="button-wrapper"
    v-bind:style="{
      '--btn-bkg-color': this.btnBkgColorL,
      '--btn-bkg-hover-color': this.btnBkgHoverColorL,
      '--btn-bkg-active-color': this.btnBkgActiveColorL,
      '--btn-color': this.btnColorL,
      '--btn-btn-active-color': this.btnActiveColorL,
    }"
    v-bind:class="{
      readonly: readOnly,
      }"
    v-on:click="onClickbutton">
    <i
      v-if="buttonIcon && !rightIcon"
      class="material-icons-round icon">
      {{ buttonIcon }}
    </i>
    <slot></slot>
    <i
      v-if="buttonIcon && rightIcon"
      class="material-icons-round icon">
      {{ buttonIcon }}
    </i>
  </div>
</template>

<script>
export default {
  props: [
    'buttonIcon',
    'buttonAction',
    'data',
    'rightIcon',
    'readOnly',
    'btnBkgColor',
    'btnBkgHoverColor',
    'btnBkgActiveColor',
    'btnColor',
    'btnActiveColor',
  ],
  data () {
    return {
      btnBkgColorL: 'transparent',
      btnBkgHoverColorL: 'var(--main-hover-color)',
      btnBkgActiveColorL: 'var(--main-active-color)',
      btnColorL: 'var(--main-text-color)',
      btnActiveColorL: 'var(--main-accent-color)',
    }
  },
  components: {},
  created () {
    if (this.btnBkgColor)
      this.btnBkgColorL = this.btnBkgColor
    if (this.btnBkgHoverColor)
      this.btnBkgHoverColorL = this.btnBkgHoverColor
    if (this.btnBkgActiveColor)
      this.btnBkgActiveColorL = this.btnBkgActiveColor
    if (this.btnColor)
      this.btnColorL = this.btnColor
    if (this.btnActiveColor)
      this.btnActiveColorL = this.btnActiveColor
  },
  methods: {
    onClickbutton () {
      this.buttonAction(this.data)
    },
  },
}
</script>

<style scoped lang="css">

#button-wrapper {
  -webkit-user-select: none;
  align-self: center;
  background-color: var(--btn-bkg-color);
  border-radius: 20px;
  border: 1px solid transparent;
  color: var(--btn-color);
  cursor: pointer;
  display: flex;
  font-size: var(--main-font-size);
  font-weight: 600;
  outline: none;
  padding: 6px 15px;
  position: relative;
  user-select: none;
  word-break: keep-all;

  --btn-bkg-color: #ffffff;
  --btn-bkg-hover-color: #ffffff;
  --btn-bkg-active-color: #ffffff;
  --btn-color: #ffffff;
  --btn-btn-active-color: #ffffff;
}

#button-wrapper:hover {
  background-color: var(--btn-bkg-hover-color);
}

#button-wrapper:active {
  background-color: var(--btn-bkg-active-color);
  color: var(--btn-btn-active-color);
}

#button-wrapper .icon {
  font-size: 16px;
  margin-right: 5px;
  align-self: center;
}

#button-wrapper.readonly {
  opacity: 0.5;
}
</style>
