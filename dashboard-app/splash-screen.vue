<template lang="html">
  <div class="splash-screen-wrapper">
    <div class="content-wrapper">
      <img
        id="app-logo"
        src="/static/assets/webcms-logo.png"
        v-bind:class="{
          'bounce-animation': logoLoaded,
          }"/>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      profileLoaded: false,
      profile: new this.$models.Profile(),
      logoLoaded: false,
    }
  },
  created () {
    this.getData()
  },
  methods: {
    async getData () {
      window.user_data = this.profile
      window.user_data.set('id', this.$getCookie('user_id'))
      try {
        this.logoLoaded = true
        await window.user_data.fetch()
        this.$i18n.locale = window.user_data.get('language_id_ref')
        this.$eventHub.$emit('app-user-profile-loaded', { initial: true })
        this.$eventHub.$emit('app-user-language', window.user_data.get('language_id'))
      } catch (err) {
        console.error(err)
      }
    },
  }
}
</script>

<style scoped lang="css">

.splash-screen-wrapper {
  background-color: var(--main-body-bg-color);
  display: flex;
  height: 100%;
  position: fixed;
  width: 100%;
  z-index: 99;
}

.content-wrapper {
  align-self: center;
  margin: auto;
  padding: 15px;
}

#app-logo {
  display: flex;
  align-self: center;
  margin: auto;
  height: 80px;
  filter: grayscale(100%);
}

#app-logo.bounce-animation {
  animation-duration: 1s;
  animation-name: bounce-animation;
  animation-timing-function: ease-in;
  filter: grayscale(0%);
}

@keyframes bounce-animation {
  0%   { transform: scale(1); filter: grayscale(100%); }
  90%  { transform: scale(1.1); filter: grayscale(100%); }
  100% { transform: scale(1); filter: grayscale(0%); }
}


</style>
