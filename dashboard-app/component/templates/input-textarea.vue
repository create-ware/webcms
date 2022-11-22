<template lang="html">
  <div
    v-bind:class="{
      'input-wrapper': true,
      focus: hasFocus,
      'no-empty': true,
    }">
    <label
      id="input-title"
      v-bind:class="{ 'error': errorMessage }">
      {{ $t(inputName) }}
      <span
        v-if="inputValueInLabel"
        id="input-value-label">
        {{ inputValueInLabel }}
      </span>
    </label>
    <textarea
      v-bind:type="inputType"
      v-on:focus="focus"
      v-on:blur="focus"
      v-model="value"
      v-bind:disabled="disabled"
      autocomplete="off"
      v-on:keyup.enter="getOnKeyupEnter">
    </textarea>
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
    'inputName',
    'onChangeValue',
    'inputType',
    'propName',
    'disabled',
    'helperMessage',
    'errorMessage',
    'onKeyupEnter',
    'inputValueInLabel',
  ],
  data() {
    return {
      hasFocus: false,
      hasText: false,
    }
  },
  computed: {
    value: {
      get() {
        this.hasText = false
        if (this.inputValue) this.hasText = true
        return this.inputValue
      },
      set(newVal) {
        this.onChangeValue(this.propName, newVal)
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
    getOnKeyupEnter () {
      if (!this.onKeyupEnter)
        return

      this.onKeyupEnter()
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
  max-width: 320px;
  padding-top: 15px;
  position: relative;
}

#input-title {
  background-color: var(--main-box-bg-color);
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: bold;
  left: 5px;
  padding: 0 4px;
  pointer-events: none;
  position: absolute;
  text-transform: uppercase;
  top: 4px;
  transition-duration: 50ms;
}

#input-value-label {
  font-weight: 500;
}

.input-wrapper textarea {
  background: transparent;
  border-radius: 15px;
  border: 1px solid var(--main-border-color);
  box-sizing: border-box;
  caret-color: var(--main-accent-color);
  color: var(--main-text-color);
  font-family: Roboto,sans-serif;
  font-size: var(--main-font-size);
  font-weight: 500;
  height: 50px;
  line-height: 1;
  margin: 0;
  outline: none;
  padding: 6px 10px;
  width: 100%;
}

.input-wrapper.focus #input-title {
  color: var(--main-accent-color);
  font-size: var(--main-secundary-font-size);
  top: 6px;
}

.input-wrapper.focus textarea {
  border: 1px solid var(--main-accent-color);
}

.input-wrapper.no-empty #input-title {
  font-size: var(-main-secundary-font-size);
  top: 6px;
}

#input-error-message,
#input-helper-message {
  font-size: var(--main-secundary-font-size);
  font-weight: 500;
  left: 10px;
  position: relative;
  text-transform: uppercase;
}

#input-error-message {
  color: #ff4949;
}

#input-helper-message {
  color: #777;
}

.input-wrapper #input-title.error {
  color: #ff4949;
}
</style>
