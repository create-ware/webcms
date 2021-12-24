<template lang="html">
  <div id="ribbon-wrapper">
    <p>
      {{ $t(message) }}
    </p>
    <i
      class="material-icons-round"
      v-on:click="removeRibbonMessage"
      >
      close
    </i>
  </div>
</template>

<script>
export default {
  props: [
    'onClickCloseAction',
    'data',
    'message',
  ],
  data() {
    return {}
  },
  components: {},
  created() {},
  methods: {
    removeRibbonMessage () {
      this.onClickCloseAction(this.data)
    },
  },
}
</script>

<style scoped lang="css">

#ribbon-wrapper {
  -webkit-user-select: none;
  align-items: center;
  background-color: #43a047;
  border-radius: 20px;
  box-shadow: var(--main-box-shadow);
  color: white;
  display: flex;
  font-size: var(--main-font-size);
  font-weight: bold;
  line-height: 1;
  margin: 10px;
  position: relative;
  text-align: center;
  user-select: none;
  width: 260px;
  z-index: 2;
}

p {
  flex-grow: 1;
  padding: 0 30px;
}

.material-icons-round {
  cursor: pointer;
  font-weight: bold;
  line-height: calc(var(--main-icon-font-size) - 1px);
  margin: auto;
  position: absolute;
  right: 10px;
}

</style>
