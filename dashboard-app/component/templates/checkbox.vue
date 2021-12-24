<template lang="html">
  <label
    id="input-wrapper"
    v-bind:class="{
      'align-left': isAlignLeft,
      'disabled': disabled,
      'embeded': isEmbeded,
      }">
    <input
      type="checkbox"
      v-on:change="onChange"
      v-bind:class="{
        checked: isChecked,
        }"/>
    <div id="checkmark"></div>
    <label v-if="label">
      {{ $t(label) }}
    </label>
  </label>
</template>

<script>
export default {
  props: [
    'onChangeValue',
    'label',
    'item',
    'currentValue',
    'propName',
    'isAlignLeft',
    'disabled',
    'isEmbeded',
  ],
  watch: {
    currentValue (newVal, oldVal) {
      this.isChecked = this.getBooleanValue(newVal)
    },
  },
  data () {
    return {
      isChecked: this.getBooleanValue(this.currentValue),
    }
  },
  created () {
    this.isChecked = this.getBooleanValue(this.currentValue)
  },
  methods: {
    onChange () {
      if (this.disabled === true)
        return

      this.isChecked = !this.isChecked
      this.onChangeValue(this.propName, this.isChecked, this.item)
    },
    getBooleanValue (value) {
      if (value === undefined)
        return false

      if (value.toString() === 'true')
        return true

      return false
    },
  },
}
</script>

<style scoped lang="css">
#input-wrapper {
  -webkit-user-select: none;
  align-self: center;
  cursor: pointer;
  display: flex;
  margin: auto;
  max-width: 320px;
  position: relative;
  user-select: none;
}

#input-wrapper.align-left {
  margin: 4px 0;
}

#input-wrapper label {
  align-self: center;
  color: var(--main-text-color);
  font-size: var(--main-font-size);
  font-weight: 600;
  margin-left: 8px;
  pointer-events: none;
  position: relative;
}

#input-wrapper.embeded {
  margin: 0;
}

#input-wrapper.embeded label {
  font-size: var(--main-accent-font-size);
  font-weight: 500;
}

#input-wrapper:active label {
  color: var(--main-accent-color);
}

#input-wrapper label:first-letter {
  text-transform: capitalize;
}

#input-wrapper input {
  bottom: 0;
  cursor: pointer;
  height: 0;
  left: 0;
  opacity: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: 0;
}

#checkmark {
  align-self: center;
  border-radius: 100%;
  border: var(--main-checkbox-border);
  flex-shrink: 0;
  height: 16px;
  position: relative;
  width: 16px;
}

#input-wrapper input.checked ~ #checkmark {
  background-color: var(--main-accent-color);
  border: var(--main-checkbox-border-hover);
}

#checkmark:after {
  content: "";
  display: none;
  position: absolute;
}

#input-wrapper input.checked ~ #checkmark:after {
  display: block;
}

#input-wrapper #checkmark:after {
  -ms-transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  border-color: var(--main-box-bg-color);
  border-radius: 100%;
  border-style: solid;
  border-width: 2px;
  bottom: 0;
  left: 0;
  margin: auto;
  right: 0;
  top: 0;
}

#input-wrapper.disabled input.checked ~ #checkmark {
  background-color: var(--main-text-color);
  border-color: var(--main-text-color);
}
</style>
