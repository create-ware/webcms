<template lang="html">
  <div class="modal-box-wrapper">
    <div class="box-content">
      <div id="file-cover" v-bind:style="getCoverImage()">
        <label v-if="!file.file_image" id="letter">
          {{ file.file_file_original_name[0] }}
        </label>
      </div>
      <div id="file-info">
        <div class="info">
          {{ file.file_file_original_name }}
        </div>
        <InputText
          v-bind:key="field.meta_name"
          v-for="(field, index) of metaFields"
          v-bind:inputName="field.meta_title"
          v-bind:inputValue="field.meta_value"
          v-bind:onChangeValue="onChangeInputValue"
          v-bind:propName="index"
          class="input">
        </InputText>
      </div>
      <div class="buttons-wrapper">
        <Button buttonIcon="close" v-bind:buttonAction="onClose">
          {{ $t('close') }}
        </Button>
        <Button
          buttonIcon="delete"
          v-bind:buttonAction="onClickRemove"
          style="margin-left: 5px;">
          {{ $t('remove') }}
        </Button>
        <Button
          buttonIcon="done"
          v-bind:buttonAction="onClickSave"
          style="margin-left: 5px;">
          {{ $t('accept') }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import Button from './button.vue'
import InputText from './input-text.vue'

export default {
  props: [
    'onClose',
    'onRemove',
    'onSave',
    'metaFields',
    'file',
  ],
  data() {
    return {}
  },
  components: {
    Button,
    InputText,
  },
  methods: {
    getCoverImage () {
      if (this.file.file_image)
        return this.$getThumbnailURL(this.file.file_file_name)
      else return this.$getHexColor(this.file.file_file_name)
    },
    onClickRemove () {
      this.onRemove(this.file)
    },
    onChangeInputValue (propName, value) {
      this.metaFields[propName].meta_value = value
    },
    onClickSave () {
      this.onSave(this.file, this.metaFields)
    },
  },
}
</script>

<style scoped lang="css">
.modal-box-wrapper {
  background: rgba(175, 175, 175, 0.25);
  bottom: 0;
  display: flex;
  height: 100%;
  left: 0;
  margin: auto;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 5;
}

.box-content {
  align-self: center;
  background-color: var(--main-box-bg-color);
  border-radius: 20px;
  box-shadow: var(--main-box-shadow);
  margin: auto;
  padding: 0px;
  position: relative;
  width: calc(100% - 20px);
  max-width: 600px;
}

#file-cover {
  background-position: center center;
  background-size: cover;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  display: flex;
  height: 150px;
  justify-content: center;
}

#file-info {
  padding: 10px;
}

.info {
  color: var(--main-text-color);
  font-size: var(--main-font-size);
  font-weight: 500;
  letter-spacing: 0;
  line-height: 32px;
}

.buttons-wrapper {
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  right: 0;
}

.buttons-wrapper .button {
  background: transparent;
  border-radius: 20px;
  border: none;
  color: #000;
  color: #444;
  cursor: pointer;
  display: block;
  font-size: var(--main-font-size);
  font-weight: 500;
  outline: none;
  padding: 7px;
  position: relative;
  right: 0;
  text-transform: uppercase;
}

.buttons-wrapper .button:last-child {
  color: var(--main-accent-color);
  margin-left: 10px;
}

.buttons-wrapper .button:hover {
  background-color: var(--main-hover-color);
}

#letter {
  align-self: center;
  color: white;
  display: flex;
  font-size: 100px;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  position: absolute;
}
</style>
