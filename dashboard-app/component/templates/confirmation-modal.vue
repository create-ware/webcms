<template lang="html">
  <div class="modal-box-wrapper">
    <div class="box-content">
      <div class="title">
        {{ $t(modalTitle) }}
      </div>
      <p>
        {{ $t(modalDescription) }}
      </p>
      <div class="buttons-wrapper">
        <Button
          v-if="cancelAction"
          buttonIcon="clear"
          v-bind:buttonAction="cancelAction">
          {{ $t('Cancel') }}
        </Button>
        <Button
          buttonIcon="done"
          v-bind:buttonAction="acceptAction"
          style="margin-left: 5px;">
          {{ $t('Accept') }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import Button from './button.vue'

export default {
  props: [
    'modalTitle',
    'modalDescription',
    'cancelAction',
    'acceptAction',
  ],
  components: {
    Button,
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
  max-height: 300px;
  max-width: 500px;
  padding: 10px;
  position: relative;
  width: calc(100% - 40px);
}

.title {
  color: var(--main-accent-color);
  font-size: var(--main-secundary-font-size);
  font-weight: bold;
  letter-spacing: 0;
  text-transform: uppercase;
}

.box-content p {
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  letter-spacing: 0;
  margin: 0px;
  text-transform: uppercase;
}

.buttons-wrapper {
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  padding: 0px;
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
  padding: 6px 15px;
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
</style>
