<template lang="html">
  <div>
    <div
      id="notification-wrapper"
      v-bind:class="{
        'sticky': isSticky,
        'no-sticky': !isSticky,
        }"
      v-click-outside="afterClose">
      <div id="title">
        <h2>
          {{ $t('Notifications') }}
        </h2>
      </div>
      <div
        v-if="showShadow"
        id="shadow"
        v-bind:style="{
          top: ((isSticky)?'10px':'18px'),
        }"></div>
      <VuePerfectScrollbar
        class="scroll-area"
        @ps-scroll-y="scrollHandleThrottle">
        <div id="items">
          <div
            v-for="(item, index) in notifications"
            v-bind:class="{
              'item': true,
              'type-log': item.get('notification_type') == 'log',
              'type-call': item.get('notification_type') == 'call',
              }"
            v-on:click="openItem(item)">
            <div>
              <i class="material-icons-round">
                notifications
              </i>
            </div>
            <div>
              <p class="title">
                {{ item.get('notification_title') }}
              </p>
              <p class="date">
                {{ new Date(item.get('created_at')).toDateString() }}
              </p>
            </div>
          </div>
        </div>
        <div id="notification-footer"></div>
      </VuePerfectScrollbar>
    </div>
    <div
      class="shadow"
      v-if="!isSticky">
    </div>
  </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

export default {
  props: [
    'isSticky',
    'notifications',
  ],
  components: {
    VuePerfectScrollbar,
  },
  data () {
    return {
      confirmationModalData: {
        modalTitle: '',
        modalDescription: '',
        cancelAction: null,
        acceptAction: this.acceptAction,
      },
      afterClose: _.after(2, this.close),
      showShadow: false,
      scrollHandleThrottle: _.throttle(this.scrollHandle, 100, { 'trailing': true }),
    }
  },
  methods: {
    scrollHandle (evt) {
      if (evt.target.scrollHeight - evt.target.scrollTop === evt.target.clientHeight)
        this.$eventHub.$emit('dashboard-notification-load', '')
      if (evt.target.scrollTop > 10) {
        this.showShadow = true
        return
      }
      this.showShadow = false
    },
    close () {
      if (this.isSticky)
        return

      this.$eventHub.$emit('app-hide-sidebar-notification', '')
    },
    async openItem (item) {
      this.confirmationModalData.modalTitle = item.get('notification_title')
      this.confirmationModalData.modalDescription = `${ item.get('notification_description') }\n${ item.get('created_at') }`
      this.$eventHub.$emit('confirmation-modal', this.confirmationModalData)
    },
    acceptAction () {
      this.$eventHub.$emit('confirmation-modal', null)
    },
  },
}
</script>

<style scoped lang="css">

#title {
  display: flex;
  height: 30px;
  justify-content: center;
  margin: 0;
  padding: 3px 8px 0px 8px;
}

h2 {
  align-self: center;
  color: var(--main-text-color);
  font-size: var(--main-font-size);
  font-weight: 600;
  margin: 0;
  padding: 0;
}

#notification-wrapper {
  flex-grow: 0;
  overflow-y: hidden;
  position: fixed;
  right: 0;
  width: 180px;
  z-index: 1;
}

.no-sticky {
  background-color: var(--main-box-bg-opace-color);
  box-shadow: var(--main-box-shadow);
  height: 100%;
  top: 0px;
  transition-duration: 200ms;
  transition-property: background-color;
  z-index: 2;
}

.sticky {
  height: calc(100% - 33px);
  top: 46px;
}

#notification-footer {
  height: 80px;
}

.no-sticky .notification-header {
  margin: 8px !important;
}

.item {
  align-items: center;
  border-bottom: 0;
  border-radius: 20px;
  border: 0;
  cursor: pointer;
  display: flex;
  margin: 2px 8px 2px 8px;
  max-width: 100%;
  padding: 5px 10px;
  position: relative;
  text-decoration: none;
}

.type-log {
  background-color: var(--main-notification-bkg);
}

.type-log:hover {
  background-color: var(--main-hover-color);
}

.type-log:active {
  background-color: var(--main-active-color);
}

.type-log:active i,
.type-log:active p {
  color: var(--main-accent-color);
}

.item i {
  color: var(--main-text-color);
  font-size: var(--main-icon-font-size);
  margin-right: 5px;
}

.item > div:last-child {
  overflow: hidden;
  padding: 0;
}

.no-sticky .item {
  margin: 2px 6px !important;
}

.item .title {
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: bold;
  margin: 0;
  overflow: hidden;
  text-transform: uppercase;
}

.item .date {
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  line-height: 14px;
  margin: 0;
  overflow: hidden;
  text-transform: uppercase;
}

.shadow {
  bottom: 0;
  height: 100%;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 0;
}

#shadow {
  box-shadow: var(--main-box-shadow-line);
  height: 20px;
  margin: auto;
  pointer-events: none;
  position: absolute;
  top: 10px;
  width: 100%;
  z-index: 2;
}
</style>
