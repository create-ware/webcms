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
    <div
      v-if="chipText"
      id="chip">
      <i>
        {{ chipText }}
      </i>
    </div>
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
    'chipText',
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
  font-size: var(--main-secundary-font-size);
  font-weight: bold;
  outline: none;
  padding: 6px 15px;
  position: relative;
  text-transform: uppercase;
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

#chip {
  background-color: var(--main-active-color);
  border-radius: 2px;
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  margin: auto auto auto 8px;
  padding: 0 2px;
  position: relative;
  right: 0;
  top: 0;
}

#chip i {
  color: var(--main-accent-color);
  font-size: var(--main-accent-font-size);
  font-style: normal;
  font-weight: bold;
  margin: auto;
}

</style>
