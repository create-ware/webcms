<template lang="html">
  <div id="custom-fields">
    <label id="title">
      {{ $t(title) }}
    </label>
    <div id="new-field">
      <InputText
        class="input"
        inputName="Key"
        v-bind:inputValue="newFieldKey"
        v-bind:onChangeValue="onChangeInputValue"
        propName="new_key"
        helperMessage="At least 1 character"
        ref="start"/>
      <InputText
        class="input"
        inputName="Value"
        v-bind:inputValue="newFieldValue"
        v-bind:onChangeValue="onChangeInputValue"
        propName="new_value"
        helperMessage="At least 1 character"
        v-bind:onKeyupEnter="onKeyupEnter"/>
      <ButtonIcon
        class="remove"
        buttonIcon="cancel"
        v-bind:buttonAction="clearNewCustomField"/>
    </div>
    <div id="overflow">
      <VuePerfectScrollbar>
        <div
          class="item"
          style="display: flex;"
          v-for="(item, index) in items"
          :key="items[index].id"
          v-if="!items[index].removed">
          <SimpleInputText
            class="input"
            v-bind:inputValue="items[index][propNames.leftPropName]"
            v-bind:onChangeValue="onChangeCustomField"
            v-bind:data="{ index: index, key: propNames.leftPropName, }"/>
          <SimpleInputText
            class="input"
            v-bind:inputValue="items[index][propNames.rightPropName]"
            v-bind:onChangeValue="onChangeCustomField"
            v-bind:data="{ index: index, key: propNames.rightPropName, }"/>
          <ButtonIcon
            class="remove"
            buttonIcon="cancel"
            v-bind:buttonAction="onRemoveCustomField"
            v-bind:buttonData="index"/>
        </div>
      </VuePerfectScrollbar>
    </div>
  </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import SimpleInputText from './simple-input-text.vue'
import InputText from './input-text.vue'
import ButtonIcon from './button-icon.vue'

export default {
  props: [
    'title',
    'items',
    'onChangeCustomField',
    'onAddCustomField',
    'inputType',
    'onRemoveCustomField',
    'propNames',
  ],
  data () {
    return {
      newFieldKey: '',
      newFieldValue: '',
    }
  },
  components: {
    VuePerfectScrollbar,
    SimpleInputText,
    InputText,
    ButtonIcon,
  },
  created () {},
  methods: {
    onChangeInputValue (key, value) {
      if (key === 'new_key') {
        this.newFieldKey = value
        return
      }
      if (key === 'new_value')
        this.newFieldValue = value
    },
    onKeyupEnter () {
      this.onAddCustomField({
        key: this.newFieldKey,
        value: this.newFieldValue,
      })
      this.newFieldKey = ''
      this.newFieldValue = ''
      this.setFocus()
    },
    clearNewCustomField () {
      this.newFieldKey = ''
      this.newFieldValue = ''
    },
    setFocus () {
      // NOTE: [1]: is the input - improve this
      this.$refs.start['$el'].children[1].focus()
    },
  },
}
</script>

<style scoped lang="css">
#custom-fields {
  max-width: 320px;
  margin-top: 20px;
}

#title {
  background-color: transparent;
  color: var(--main-text-color);
  font-size: var(--main-font-size);
  font-weight: 600;
  pointer-events: none;
}

#overflow {
  display: flex;
  height: 300px;
  max-width: 100%;
}

.item {
  display: flex;
  min-width: 200px;
}

.item .input:first-child {
  margin-right: 5px;
}

.item .input:last-child {
  margin-left: 5px;
}

.input {
  flex-grow: 1;
}

#new-field {
  display: flex;
}

#new-field .input:first-child {
  margin-right: 5px;
}

#new-field .input:last-child {
  margin-left: 5px;
}

.remove {
  align-self: center;
  margin-left: 5px;
  max-height: 28px;
}
</style>
