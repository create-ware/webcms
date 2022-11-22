<template lang="html">
  <div class="error-wrapper">
    <Header/>
    <BoxWrapper>
      <div class="content-wrapper">
        <h3>
          {{ $t('RESOURCE NOT FOUND OR YOU DON\'T HAVE PERMISSIONS TO SEE THIS CONTENT') }}
        </h3>
      </div>
    </BoxWrapper>
  </div>
</template>

<script>
import BoxWrapper from './templates/box-wrapper.vue'
import Header from './templates/header.vue'

export default {
  data() {
    return {}
  },
  components: {
    BoxWrapper,
    Header,
  },
  created() {},
  methods: {},
}
</script>

<style scoped lang="css">
.error-wrapper {
  position: relative;
}

.buttons-wrapper {
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
}

.content-wrapper {
  box-sizing: content-box;
}

h3 {
  color: var(--main-text-color);
  flex-grow: 1;
  font-size: 16px;
  font-weight: 600;
  margin-top: 7px;
  text-align: center;
  text-transform: uppercase;
}

</style>
