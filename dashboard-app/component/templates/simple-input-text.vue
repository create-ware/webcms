<template lang="html">
  <div
    v-bind:class="{
      'input-wrapper': true,
      focus: hasFocus,
      'no-empty': hasText,
    }">
    <input
      v-bind:type="inputType"
      v-on:focus="focus"
      v-on:blur="focus"
      v-model="value"
      autocomplete="off"/>
    <label
      v-show="errorMessage"
      id="input-error-message">
      {{ $t(errorMessage) }}
    </label>
    <label
      v-show="!errorMessage"
      id="input-helper-message">
      {{ $t(helperMessage) }}
    </label>
  </div>
</template>

<script>
export default {
  props: [
    'inputValue',
    'onChangeValue',
    'inputType',
    'data',
    'helperMessage',
    'errorMessage',
  ],
  data () {
    return {
      hasFocus: false,
      hasText: false,
    }
  },
  computed: {
    value: {
      get() {
        this.hasText = false
        if (this.inputValue)
          this.hasText = true
        return this.inputValue
      },
      set(newVal) {
        this.onChangeValue(this.data, this.inputValue, newVal)
      },
    },
  },
  methods: {
    focus () {
      if (this.hasFocus) {
        this.hasFocus = false
        return
      }
      this.hasFocus = true
    },
  },
}
</script>

<style scoped lang="css">

.input-wrapper {
  background-color: transparent;
  display: flex;
  flex-direction: column;
  margin: 0;
  position: relative;
  max-width: 320px;
}

.input-wrapper input {
  background: transparent;
  border-bottom: var(--main-input-border-bottom);
  border-left: none;
  border-right: none;
  border-top: none;
  box-sizing: border-box;
  caret-color: var(--main-accent-color);
  color: var(--main-text-color);
  font-size: var(--main-font-size);
  font-weight: 400;
  margin: 0;
  outline: none;
  padding: 2px 0;
  width: 100%;
}

.input-wrapper.focus input {
  border-bottom: var(--main-input-border-bottom-active);
}

#input-error-message, #input-helper-message {
  font-size: var(--main-font-size);
  font-weight: 400;
  position: relative;
  top: -2px;
  width: 100%;
}

#input-error-message {
  color: var(--main-error-color);
}

#input-helper-message {
  color: var(--secundary-text-color);
}

</style>
