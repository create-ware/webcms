<template lang="html">
  <div
    id="app-wrapper"
    v-window-resize="onResizeWindow"
    :style="appTheme">
    <Header
      v-if="userProfileLoaded"
      v-on:dashboard-toggle-menu="isSidebarMenuOpen"
      v-bind:isFullContent="isFullContent"/>
    <SidebarMenu
        class="left-menu-wrapper"
        v-if="isSidebarMenuOpen && userProfileLoaded"
        v-bind:isSticky="isSidebarMenuSticky"/>
    <div
      v-if="userProfileLoaded"
      id="content"
      v-bind:class="{
        'full-content-width': isSidebarMenuSticky,
        'full-content': (isSidebarMenuSticky && !isSidebarMenuOpen),
        }">
      <div class="page-content-wrapper">
        <router-view :key="getKey()"/>
      </div>
    </div>
    <SidebarNotification
      class="right-menu-wrapper"
      v-bind:class="{
        sticky: isSidebarMenuSticky
      }"
      v-if="isSidebarNotificationOpen && userProfileLoaded"
      v-bind:isSticky="isSidebarNotificationSticky"
      v-bind:notifications="notifications.getModels()"/>
    <transition name="autohide">
      <SplashScreen v-if="showSplashScreen && !userProfileLoaded"/>
    </transition>
    <Login v-if="showLogin && userProfileLoaded"/>
    <div
      id="ribbon-errors"
      v-if="statusMessages.length && userProfileLoaded">
      <div
        v-for="(item, index) of statusMessages" v-if="item !== undefined">
        <RibbonError
          v-if="item.type == 'error'"
          v-bind:onClickCloseAction="removeRibbonById"
          v-bind:data="index.key"
          v-bind:message="item.message"
          :key="index.key">
        </RibbonError>
        <RibbonSuccess
          v-if="item.type == 'success'"
          v-bind:onClickCloseAction="removeRibbonById"
          v-bind:data="index.key"
          v-bind:message="item.message"
          :key="index.key">
        </RibbonSuccess>
      </div>
    </div>
    <footer>
      <a
        href="/"
        target="_blank">
        <img src="/static/assets/webcms-logo.png"/>
      </a>
    </footer>
    <FileModal
      v-if="fileModalData"
      v-bind:onlyImages="fileModalData.onlyImages"
      v-bind:modalTitle="fileModalData.modalTitle"
      v-bind:modalDescription="fileModalData.modalDescription"
      v-bind:closeFileModal="fileModalData.closeFileModal"
      v-bind:onFileSelect="fileModalData.onFileSelect"/>
    <ConfirmationModal
      v-if="confirmationModalData"
      v-bind:modalTitle="confirmationModalData.modalTitle"
      v-bind:modalDescription="confirmationModalData.modalDescription"
      v-bind:cancelAction="confirmationModalData.cancelAction"
      v-bind:acceptAction="confirmationModalData.acceptAction"/>
    <PreviewFileModal
      v-if="previewFileModalData"
      v-bind:onClose="previewFileModalData.onClose"
      v-bind:onRemove="previewFileModalData.onRemove"
      v-bind:onSave="previewFileModalData.onSave"
      v-bind:metaFields="previewFileModalData.metaFields"
      v-bind:file="previewFileModalData.file"/>
    <div
      id="modal-wrapper"
      v-if="showModalFeedBack">
      <div id="modal-box">
        <LoadingBar
          v-if="isModalLoading"
          class="loading-bar-custom"/>
        <h2>
          {{ $t('feedback') }}
        </h2>
        <div id="modal-content">
          <VuePerfectScrollbar class="scroll-area">
            <Checkbox
              label="Check if is anonymous"
              v-bind:onChangeValue="onChangeInputCheck"
              item="feedback_anonymous"
              v-bind:currentValue="feedback.get('feedback_anonymous')"/>
            <br />
            <Checkbox
              label="Check if is a suggestion"
              v-bind:onChangeValue="onChangeInputCheck"
              item="feedback_suggestion"
              v-bind:currentValue="feedback.get('feedback_suggestion')"/>
            <br />
            <InputTextarea
              inputName="Write your feedback"
              v-bind:inputValue="feedback.get('feedback_description')"
              v-bind:onChangeValue="onChangeInputValue"
              propName="feedback_description"
              v-bind:errorMessage="feedback.errors.feedback_description"
              helperMessage="Something about of service"/>
          </VuePerfectScrollbar>
        </div>
        <div id="modal-buttons-wrapper">
          <Button
            buttonIcon="close"
            v-bind:buttonAction="onModalCancel">
            {{ $t('cancel') }}
          </Button>
          <Button
            buttonIcon="check"
            v-bind:buttonAction="onModalAccept">
            {{ $t('send') }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from './component/header.vue'
import RibbonError from './component/templates/ribbon-error.vue'
import RibbonSuccess from './component/templates/ribbon-success.vue'
import SidebarMenu from './component/sidebar-menu.vue'
import SplashScreen from './splash-screen.vue'
import Login from './component/login.vue'
import FileModal from './component/file-modal.vue'
import ConfirmationModal from './component/templates/confirmation-modal.vue'
import PreviewFileModal from './component/templates/preview-file-modal.vue'
import Socket from './lib/socket-io.vue'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import Button from './component/templates/button.vue'
import LoadingBar from './component/templates/loading-bar.vue'
import Checkbox from './component/templates/checkbox.vue'
import InputTextarea from './component/templates/input-textarea.vue'
import SidebarNotification from './component/sidebar-notification.vue'


let io = new Socket.IO()
let windowIntervalRemove = null

export default {
  components: {
    Header,
    SidebarMenu,
    RibbonError,
    RibbonSuccess,
    SplashScreen,
    Login,
    ConfirmationModal,
    FileModal,
    PreviewFileModal,
    VuePerfectScrollbar,
    Button,
    LoadingBar,
    Checkbox,
    InputTextarea,
    SidebarNotification,
  },
  data () {
    return {
      userProfileLoaded: false,
      isSidebarMenuOpen: false,
      isSidebarMenuSticky: false,
      isSidebarNotificationOpen: false,
      isSidebarNotificationSticky: false,
      isFullContent: false,
      pageTitle: '',
      showSplashScreen: true,
      showLogin: false,
      ribbonTimeOut: 4500,
      confirmationModalData: null,
      fileModalData: null,
      previewFileModalData: null,
      throttleToggleFullcontent: _.throttle(this.toggleFullContent, 100, { 'trailing': false }),
      throttleShowSidebarMenu: _.throttle(this.showSidebarMenu, 100, { 'trailing': false }),
      throttleShowSidebarNotification: _.throttle(this.showSidebarNotification, 100, { 'trailing': false }),
      throttleLoadNotifications: _.throttle(this.getNotifications, 3000, { 'trailing': false }),
      breakWidth: 1360,
      statusMessages: [],
      version: 'Version 1.0.0',
      showModalFeedBack: false,
      isModalLoading: false,
      headerButtonActive: 1,
      isMobile: true,
      feedback: new this.$models.Feedback(),
      language: new this.$models.Language(),
      languages: new this.$models.LanguageCollection(),
      notifications: new this.$models.NotificationCollection(),
      loadNotifications: new this.$models.NotificationCollection(),
      totalNotificationPages: 2,
      appTheme: {
        '--main-body-bg-color': '#fdfdfd',
        '--main-box-bg-color': '#ffffff',
        '--main-box-bg-opace-color': '#ffffff',
        '--main-text-color': '#616161',
        '--main-secondary-text-color': '#686868',
        '--main-input-border-bottom': '1px solid #cccccc',
        '--main-input-border-bottom-active': '1px solid #124a6e',
        '--main-border-color': '#cccccc',
        '--main-accent-color': '#124a6e',
        '--main-active-color': '#124a6e1c',
        '--main-hover-color': '#aaaaaa20',
        '--main-font-size': '13px',
        '--main-table-bg-row': '#cccccc20',
        '--main-secundary-font-size': '12px',
        '--main-accent-font-size': '13px',
        '--main-checkbox-border': '2px solid var(--main-border-color)',
        '--main-checkbox-border-hover': '2px solid #124a6e',
        '--main-box-shadow': '0 7px 14px 0 rgb(60 66 87 / 10%), 0 3px 6px 0 rgb(0 0 0 / 10%)',
        '--main-notification-bkg': '#cccccc20',
        '--main-icon-font-size': '18px',
        '--main-box-shadow-line': '0px 10px 10px -9px rgb(0 0 0 / 45%)',
      },
    }
  },
  watch: {
    isFullContent (newValue, oldValue) {
      window.app.dashboard_full_content = newValue
    },
    isMobile (newValue, oldValue) {
      window.app.dashboard_is_mobile = newValue
    },
    statusMessages (newVal, oldVal) {
      if (windowIntervalRemove)
        return

      windowIntervalRemove = window.setInterval(() => {
        this.removeLastRibbonStatusNotification()
      }, this.ribbonTimeOut)
    },
  },
  created () {
    this.initAxiosListenEvent()
    this.getLanguages()
    this.$eventHub.$on('app-user-profile-loaded', data => {
      this.getNotifications()
      if (data.initial) {
        setTimeout(this.onResizeWindow, 300)
        setTimeout(this.hideSplashScreen, 3000)
      }
    })
    this.$eventHub.$on('dashboard-notification-load', data => {
      this.throttleLoadNotifications()
    })
    this.$eventHub.$on('dashboard-app-page-title', title => {
      if (title)
        this.pageTitle = ' - ' + title
      else
        this.pageTitle = title
    })
    this.$eventHub.$on('dashboard-app-error', errorMessage => {
      this.statusMessages.push({
        type: 'error',
        message: errorMessage,
        key: this.$uuid.v1(),
      })
    })
    this.$eventHub.$on('dashboard-app-success', successMessage => {
      this.statusMessages.push({
        type: 'success',
        message: successMessage,
        key: this.$uuid.v1(),
      })
    })
    this.$eventHub.$on('dashboard-hide-login', () => {
      this.showLogin = false
    })
    this.$eventHub.$on('confirmation-modal', ObjectData => {
      this.confirmationModalData = ObjectData
    })
    this.$eventHub.$on('file-modal', ObjectData => {
      this.fileModalData = ObjectData
    })
    this.$eventHub.$on('preview-file-modal', ObjectData => {
      this.previewFileModalData = ObjectData
    })
    this.$eventHub.$on('navigation-button', position => {
      this.navigationButton = position
    })
    this.$eventHub.$on('register-notification-event', data => {
      this.registerNotificationEvent(data)
    })
    this.$eventHub.$on('app-user-language', code => {
      if (code !== undefined)
        this.geti18nLocaleMessages(code)
    })
    this.$eventHub.$on('app-toggle-full-content', () => {
      this.throttleToggleFullcontent()
    })
    this.$eventHub.$on('app-show-sidebar-menu', () => {
      this.throttleShowSidebarMenu()
    })
    this.$eventHub.$on('app-hide-sidebar-menu', () => {
      this.hideSidebarMenu()
    })
    this.$eventHub.$on('app-show-sidebar-notification', () => {
      this.throttleShowSidebarNotification()
    })
    this.$eventHub.$on('app-hide-sidebar-notification', () => {
      this.hideSidebarNotification()
    })
    this.onResizeWindow()
  },
  methods: {
    getKey () {
      return this.$route.fullPath
    },
    onChangeInputCheck (isCheck, propName) {
      this.feedback.set(propName, isCheck)
    },
    onChangeInputValue (propName, value) {
      this.feedback.set(propName, value)
    },
    openModalFeedback () {
      this.feedback = new this.$models.Feedback()
      this.showModalFeedBack = true
    },
    onModalCancel () {
      if (this.isModalLoading)
        return

      this.showModalFeedBack = false
    },
    async getNotifications () {
      try {
        let pageNumber = this.loadNotifications.get('page_number')
        if (pageNumber > this.totalNotificationPages)
          return

        let data = await this.loadNotifications.fetch()
        this.totalNotificationPages = data.getData().total_pages
        this.notifications.add(this.loadNotifications.getModels())
        pageNumber++
        this.loadNotifications.set('page_number', pageNumber)
        this.loadNotifications.clear()
      } catch (err) {
        console.error(err)
      }
    },
    async getLanguages () {
      try {
        let data = await this.languages.fetchAll()
        for (let language of data.getData().items)
          this.$i18n.setLocaleMessage(language.language_name, {})
      } catch (err) {
        console.error(err)
      }
    },
    async geti18nLocaleMessages (languageId) {
      try {
        window._18n = this.$i18n
        this.language.set('id', languageId)
        await this.language.fetch()
        this.$i18n.locale = this.language.get('language_name')
        let languageMessage = {}
        for (let message of this.language.get('language_messages'))
          languageMessage[message.language_message_key] = message.language_message_value
        this.$i18n.setLocaleMessage(this.language.get('language_name'), languageMessage)
      } catch (err) {
        console.error(err)
      }
    },
    async onModalAccept () {
      if (this.isModalLoading)
        return

      this.isModalLoading = true
      try {
        let errors = await this.feedback.validate()
        if (Object.keys(errors).length)
          throw Object.keys(errors).join()
        await this.feedback.save()
        this.showModalFeedBack = false
      } catch (err) {
        console.error(err)
      } finally {
        this.isModalLoading = false
      }
    },
    registerNotificationEvent (eventId) {
      if (eventId === '')
        return

      io.registerEvent(
        eventId,
        data => {
          this.$eventHub.$emit('dashboard-app-success', data.data)
        }
      )
    },
    initAxiosListenEvent () {
      this.axios.interceptors.response.use(
        response => {
          let requestMethod = response.config.method
          let requestURL = response.config.url
          let statusCode = response.data.status_code
          let statusMessage = response.data.status_msg
          if (statusMessage !== undefined) {
            let isModelError = ((statusMessage.toLowerCase().indexOf('api route') === -1)?true:false)
            if (statusCode === 0 && statusMessage)
              this.$eventHub.$emit('dashboard-app-success', statusMessage)
            else if (statusCode === 1)
              this.$eventHub.$emit('dashboard-app-error', statusMessage)
            else if (statusCode === 3)
              this.showLogin = true
          }
          return response
        },
        error => {
          let statusMessage = error.response.data.status_msg
          if (statusMessage === undefined || statusMessage === '')
            statusMessage = error.message
          this.$eventHub.$emit('dashboard-app-error', statusMessage)
          return Promise.reject(error)
        },
      )
    },
    hideSplashScreen () {
      this.userProfileLoaded = true
      this.showSplashScreen = false
    },
    hideRibbonSuccessNotification () {
      this.appSuccessMessage = ''
    },
    removeLastRibbonStatusNotification () {
      if (this.statusMessages.length) {
        this.statusMessages.shift()
        return
      }
      window.clearInterval(windowIntervalRemove)
      windowIntervalRemove = null
    },
    removeRibbonById (key) {
      if (!this.statusMessages.length)
        return
      let index = -1
      for (let i in this.statusMessages) {
        if (key === this.statusMessages[i].key) {
          index = i
          return
        }
      }
      this.statusMessages.splice(index, 1)
    },
    toggleFullContent () {
      if (this.isMobile)
        return

      if (this.isFullContent) {
        this.isFullContent = false
        this.isSidebarMenuOpen = true
        this.isSidebarNotificationOpen = false
        this.isSidebarMenuSticky = true
        this.isSidebarNotificationSticky = false
        if (this.headerButtonActive === 1) {
          this.isSidebarNotificationOpen = true
          this.isSidebarNotificationSticky = true
        }
      } else {
        this.isFullContent = true
        this.isSidebarMenuOpen = false
        this.isSidebarNotificationOpen = false
        this.isSidebarMenuSticky = false
        this.isSidebarNotificationSticky = false
      }
      this.$eventHub.$emit('app-is-full-content', this.isFullContent)
    },
    showSidebarMenu () {
      this.isSidebarMenuOpen = true
      this.isSidebarNotificationOpen = false
      this.isSidebarMenuSticky = false
      this.isSidebarNotificationSticky = false
      if (!this.isFullContent) {
        this.isSidebarMenuSticky = true
        if (this.headerButtonActive === 1) {
          this.isSidebarNotificationOpen = true
          this.isSidebarNotificationSticky = true
        }
      }
    },
    showSidebarNotification () {
      this.headerButtonActive = 1
      this.isSidebarNotificationOpen = true
      if (this.isFullContent)
        this.isSidebarNotificationSticky = false
      else
        this.isSidebarNotificationSticky = this.isSidebarMenuSticky
      if (!this.isFullContent && this.isSidebarMenuSticky)
        this.isSidebarNotificationOpen = true
    },
    hideSidebarMenu () {
      if (this.isFullContent)
        this.isSidebarMenuOpen = false
    },
    hideSidebarNotification () {
      this.isSidebarNotificationOpen = false
    },
    onResizeWindow () {
      this.checkIfMobile()
      this.isSidebarNotificationOpen = false
      this.isSidebarNotificationSticky = false
      if (window.innerWidth >= this.breakWidth) {
        this.isFullContent = false
        this.isSidebarMenuOpen = true
        this.isSidebarMenuSticky = true
        if (this.headerButtonActive === 1) {
          this.isSidebarNotificationOpen = true
          this.isSidebarNotificationSticky = true
        }
      } else {
        this.isFullContent = true
        this.isSidebarMenuOpen = false
        this.isSidebarMenuSticky = false
      }
      this.$eventHub.$emit('app-is-full-content', this.isFullContent)
    },
    checkIfMobile () {
      if (window.innerWidth < 1080)
        this.isMobile = true
      else
        this.isMobile = false
      window.app.dashboard_is_mobile = this.isMobile
      this.$eventHub.$emit('dashboard-is-mobile', this.isMobile)
    },
  },
}
</script>

<style scoped lang="css">

#app-wrapper {
  background-color: var(--main-body-bg-color);
  display: flex;
  height: 100%;
  overflow: hidden;
  position: relative;
  width: 100%;
  z-index: 1;
}

#content {
  margin: 50px auto 100px auto;
  position: relative;
  width: 100%;
}

.full-content-width {
  width: calc(100% - 340px) !important;
}

.full-content {
  width: 100% !important;
}

.page-content-wrapper {
  margin-top: 15px;
  margin: auto;
  position: relative;
}

.page-content-wrapper.closed {
  margin-left: auto;
}

footer {
  -webkit-user-select: none;
  bottom: 4px;
  color: var(--main-text-color);
  display: flex;
  justify-content: center;
  position: absolute;
  user-select: none;
  width: 100%;
  z-index: 0;
}

footer span {
  align-self: center;
  display: flex;
  font-size: var(--main-font-size);
  margin: auto 5px auto 5px;
}

footer img {
  display: flex;
  position: relative;
  top: -1px;
  width: 100px;
}

.left-menu-wrapper {
  position: relative;
  z-index: 4;
}

.autohide-enter-active, .autohide-leave-active {
  transition: all 500ms ease;
}

.autohide-enter, .autohide-leave-to {
  opacity: 0;
}

#ribbon-errors {
  bottom: 0;
  display: flex;
  flex-direction: column;
  height: 60px;
  justify-content: center;
  overflow: hidden;
  position: absolute;
  right: 0;
  z-index: 4;
}

footer a {
  outline: none;
}



#button-feedback {
  align-content: center;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  background-color: var(--main-accent-color);
  border-radius: 100%;
  bottom: 10px;
  box-shadow: var(--main-box-shadow);
  cursor: pointer;
  display: flex;
  height: 38px;
  justify-content: center;
  position: fixed;
  right: 10px;
  width: 38px;
  z-index: 2;
}

.bounce-animation {
  animation-name: bounce-animation;
  animation-timing-function: ease;
}

#button-feedback i {
  color: white;
  font-size: 22px;
  line-height: 1;
  margin: auto;
}

@keyframes bounce-animation {
  0%   { transform: scale(1,1)      translateY(0); }
  10%  { transform: scale(1.1,.9)   translateY(0); }
  30%  { transform: scale(.9,1.1)   translateY(-50px); }
  50%  { transform: scale(1.05,.95) translateY(0); }
  57%  { transform: scale(1,1)      translateY(-7px); }
  64%  { transform: scale(1,1)      translateY(0); }
  100% { transform: scale(1,1)      translateY(0); }
}



#modal-wrapper {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.2);
}

#modal-box {
  background-color: var(--main-box-bg-color);
  border-radius: 20px;
  bottom: 0;
  box-shadow: var(--main-box-shadow);
  display: flex;
  flex-direction: column;
  height: calc(70% - 20%);
  left: 0;
  margin: auto;
  max-width: 320px;
  padding: 10px;
  position: absolute;
  right: 0;
  top: 0;
  width: calc(100% - 20%);
}

#modal-box h2 {
  color: var(--main-accent-color);
  text-transform: uppercase;
  flex-grow: 0;
  font-size: var(--main-font-size);
}

#modal-buttons-wrapper {
  bottom: 10px;
  display: flex;
  justify-content: flex-end;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  width: calc(100% - 20px);
  z-index: 1;
  flex-grow: 0;
}

#modal-content {
  color: var(--main-text-color);
  font-size: var(--main-font-size);
  font-weight: 500;
  height: 100px;
  margin: 10px 0 35px 0;
  position: relative;
  flex-grow: 1;
}


#modal-content .scroll-area {
  padding: 0 10px 0 0;
}


.loading-bar-custom {
  top: 0;
  left: 0;
  right: 0;
  width: 100% !important;
}

</style>

<style lang="css">

/* vue-perfect-scrollbar global styles */
.material-icons-round {
  font-size: var(--main-icon-font-size);
}

.ps:hover {
  transition: none !important;
  opacity: 1 !important;
}

.scroll-area {
  height: 100%;
  margin: 0;
  position: relative;
  width: 100%;
}

.ps>.ps__scrollbar-y-rail {
  background-color: var(--main-active-color) !important;
  width: 8px !important;
  z-index: 1;
}
.ps>.ps__scrollbar-y-rail>.ps__scrollbar-y {
  background-color: var(--main-accent-color) !important;
  border-radius: 0px !important;
  right: 0 !important;
  width: 8px !important;
}

.ps>.ps__scrollbar-x-rail {
  background-color: var(--main-active-color) !important;
  height: 8px !important;
  z-index: 1;
}

.ps>.ps__scrollbar-x-rail>.ps__scrollbar-x {
  background-color: var(--main-accent-color) !important;
  border-radius: 0px !important;
  bottom: 0 !important;
  height: 8px !important;
}

.ps:hover>.ps__scrollbar-x-rail,
.ps:hover>.ps__scrollbar-y-rail {
  opacity: 1;
}
.ps:hover>.ps__scrollbar-x-rail:hover,
.ps:hover>.ps__scrollbar-y-rail:hover {
  opacity: 1;
}

::placeholder {
  color: var(--main-text-color);
  opacity: 1 !important;
}


table {
  border-collapse: collapse;
  border-spacing: 0;
  color: var(--main-text-color);
  min-width: 720px;
  width: 100%;
  margin: 10px 0 40px 0;
  table-layout: fixed;
}

tr td {
  word-break: break-all;
}

tbody tr td:first-child,
thead tr td:first-child {
  padding-left: 8px;
}

tbody tr td:last-child,
thead tr td:last-child {
  padding-right: 8px;
}

thead tr td {
  background-color: var(--main-box-bg-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  height: 30px;
  padding: 0;
  position: -webkit-sticky;
  position: sticky;
  z-index: 1;
}

thead tr td {
  top: 0;
}

tbody tr td {
  cursor: pointer;
  font-size: var(--main-font-size);
  padding: 0;
}

tbody tr:nth-child(even) {
  background-color: rgba(200, 200, 200, 0.10);
}

tbody tr:hover {
  background-color: var(--main-hover-color);
}

tbody tr td:first-child {
  border-bottom-left-radius: 20px;
  border-top-left-radius: 20px;
}

tbody tr td:last-child {
  border-bottom-right-radius: 20px;
  border-top-right-radius: 20px;
}

tbody tr {
  height: 36px;
}

tbody tr td p {
  padding: 0;
  margin: 0;
}


.right-menu-wrapper {
  position: relative;
  z-index: 2;
}
.right-menu-wrapper.sticky {
  z-index: 0;
}

</style>
