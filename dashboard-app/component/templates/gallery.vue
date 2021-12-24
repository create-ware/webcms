<template lang="html">
  <div id="gallery-wrapper">
    <h2>
      {{ $t(title) }}
    </h2>
    <p id="gallery-description">
      {{ $t(description) }}
    </p>
    <div id="items-wrapper">
      <div
        v-for="(item, key) of items"
        class="item"
        v-on:click="onClickItem(item)"
        v-bind:style="getCoverImage(item)"
      >
        <i class="letter" v-if="!item.file_image">
          {{ item.file_file_original_name[0] }}
        </i>
      </div>
      <div
        id="add-item-button"
        v-if="showAddItem"
        class="item"
        v-on:click="openFileModal"
      >
        <i id="icon-add" class="material-icons-round">
          add
        </i>
      </div>
    </div>
  </div>
</template>

<script>
import Button from './button.vue'
import InputText from './input-text.vue'

export default {
  props: [
    'title',
    'description',
    'onAddItem',
    'onClickItem',
    'onlyImages',
    'items',
    'maxItems',
  ],
  data() {
    return {
      showAddItem: true,
      fileModalData: {
        onlyImages: true,
        modalTitle: 'Set Featured Image',
        modalDescription: 'Chose one image or upload new',
        closeFileModal: this.closeFileModal,
        onFileSelect: this.onFileSelect,
      },
    }
  },
  updated () {
    this.showAddItem = this.isMaxItems()
  },
  components: {
    Button,
    InputText,
  },
  methods: {
    openFileModal () {
      this.$eventHub.$emit('file-modal', this.fileModalData)
    },
    closeFileModal () {
      this.$eventHub.$emit('file-modal', null)
    },
    onFileSelect (file) {
      let fileData = {
        file_id: file.get('id'),
        file_file_name: file.get('file_name'),
        file_image: file.isImage(),
        file_file_original_name: file.get('file_original_name'),
      }
      this.onAddItem(fileData)
      this.closeFileModal()
    },
    getCoverImage (image) {
      if (image.file_image) return this.$getAvatarURL(image.file_file_name)
      else return this.$getHexColor(image.file_file_name)
    },
    isMaxItems () {
      if (this.items.length < parseInt(this.maxItems)) return true

      return false
    },
  },
}
</script>

<style scoped lang="css">
#gallery-wrapper {
  position: relative;
  margin: 0 0 35px 0;
}

h2 {
  color: var(--main-text-color);
  font-size: var(--main-font-size);
  font-weight: 600;
  margin-bottom: 5px;
}

#gallery-description {
  color: var(--main-text-color);
  font-size: var(--main-font-size);
  font-weight: 500;
  margin-top: 0px;
}

#items-wrapper {
  display: flex;
  flex-wrap: wrap;
}

#items-wrapper .item {
  background-position: center center;
  background-size: cover;
  border-radius: 20px;
  margin: 1px;
  display: flex;
  height: 70px;
  overflow: hidden;
  position: relative;
  width: 70px;
  cursor: pointer;
}

#items-wrapper .item:after {
  content: "";
  height: 100%;
  position: absolute;
  width: 100%;
  z-index: 1;
}

#items-wrapper .item:hover:after {
  background-color: rgba(255, 255, 255, 0.7)
}

#add-item-button {
  background-color: var(--main-text-color);
}

#icon-add {
  align-self: center;
  color: #f0f0f0;
  display: flex;
  font-size: 36px;
  margin: auto;
  text-align: center;
}

#items-wrapper .item .letter {
  align-self: center;
  color: white;
  display: flex;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  margin: auto;
  text-transform: capitalize;
}
</style>
