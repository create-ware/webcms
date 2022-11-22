<template lang="html">
  <div>
    <div
      id="header"
      v-window-resize="onResizeWindow">
      <div
        class="left-wrapper"
        v-bind:style="headerLeftRightStyle">
        <img
          id="app-logo"
          src="/static/assets/webcms-logo-header.png"
          v-on:click="toggleMenuDalay"/>
        <div class="header-buttons-wrapper">
          <ButtonIcon
            v-if="!isMobile"
            v-bind:buttonIcon="getMenuIconName()"
            v-bind:buttonAction="toggleFullContent"
            class="menu-button header-button"/>
        </div>
      </div>
      <div
        id="search-wrapper"
        v-bind:class="{ 'search-active': resultsIsVisible }"
        v-click-outside="clickOutsite">
        <LoadingBar
          v-show="isLoading"
          style="margin: 0; width: 100%;"/>
        <i
          id="icon-search"
          class="material-icons-round">
          search
        </i>
        <input
          type="text"
          v-bind:placeholder="$t('Search')"
          v-model="searchValue"
          v-on:focus="onChangeSearchValueThrottle"/>
        <div class="bkg"></div>
        <div
          class="results-wrapper"
          v-if="resultsIsVisible">
          <div
            class="no-results"
            v-if="!searchItems.getModels().length">
            {{ $t('Without results') }}
          </div>
          <div
            id="search-results"
            v-if="searchItems.getModels().length">
            <VuePerfectScrollbar class="scroll-area">
              <div id="items-wrapper">
                <div
                  class="item"
                  v-on:click="onClickResult"
                  v-for="item in searchItems.getModels()">
                  <div
                    v-if="item.get('item_model') !== 'local_page'"
                    v-on:click="goToModelDetail(item)">
                    <i class="material-icons-round icon">
                      {{ item.get('item_icon') }}
                    </i>
                    <label>
                      {{ item.get('item_title') }}
                    </label>
                    <span
                      class="chip detail">
                      {{ $t('Detail') }}
                    </span>
                    <span
                      class="chip model"
                      v-bind:style="getCoverModelColor(item.get('item_model') , false, 75, 50, 20)">
                      {{ item.get('item_model') }}
                    </span>
                  </div>
                  <div
                    v-if="item.get('item_model') === 'local_page'"
                    v-on:click="goToLocalPage(item)">
                    <i class="material-icons-round icon">
                      {{ item.get('item_icon') }}
                    </i>
                    <label>
                      {{ item.get('item_title') }}
                    </label>
                    <span
                      v-if="item.get('item_icon') !== 'list'"
                      class="chip new">
                      {{ $t('new') }}
                    </span>
                    <span
                      v-if="item.get('item_icon') === 'list'"
                      class="chip list">
                      {{ $t('List') }}
                    </span>
                  </div>
                </div>
              </div>
            </VuePerfectScrollbar>
          </div>
        </div>
        <div
          v-if="searchValue"
          id="search-close-button">
          <ButtonIcon
            buttonIcon="close"
            v-bind:buttonAction="clearAndhideResults"/>
        </div>
      </div>
      <div
        class="right-wrapper"
        v-bind:style="headerLeftRightStyle">
        <div
          class="header-buttons-wrapper">
          <ButtonIcon
            v-if="!isMobile"
            buttonIcon="notifications"
            v-bind:buttonAction="showSidebarNotification"/>
        </div>
        <div
          class="username"
          v-on:click="showUserMenu"
          v-click-outside="hideUserMenu">
          <div
            v-if="isDesktopScreen"
            class="name">
            <p id="user-first-name">
              {{ profile.get('user_first_name') }}
            </p>
            <p id="user-role-name">
              {{ profile.get('role_name') }}
            </p>
          </div>
          <div
            class="avatar"
            v-if="profile.get('profile_file_id')"
            v-bind:style="getCoverImage()">
          </div>
          <div
          class="avatar"
          v-if="!profile.get('profile_file_id')"
          v-bind:style="getCoverColor(false, 75, 50, 20)">
            <span v-bind:style="{
              color: getCoverColor(true),
            }">
              {{ getUserFirstLetter(profile) }}
            </span>
          </div>
          <div
            class="menu"
            v-if="userMenuOpen">
            <div class="options-wrapper">
              <div
                class="option"
                v-on:click="showUserProfile(profile)">
                <i class="material-icons-round option-icon">
                  person
                </i>
                {{ $t('Profile') }}
              </div>
              <div
                class="option"
                v-if="isMobile"
                v-on:click="showSidebarNotification">
                <i class="material-icons-round option-icon">
                  notification_important
                </i>
                {{ $t('Notification') }}
              </div>
              <a
                class="option"
                href="/logout">
                <i class="material-icons-round option-icon">
                  input
                </i>
                {{ $t('Logout') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

import LoadingBar from './templates/loading-bar.vue'
import ButtonIcon from './templates/button-icon.vue'


export default {
  props: [
    'isFullContent',
  ],
  data () {
    return {
      searchValue: '',
      resultsIsVisible: false,
      searchItems: new this.$models.SearchCollection(),
      profile: new this.$models.Profile(),
      userMenuOpen: false,
      settings: new this.$models.DashboardSetting(),
      isDesktopScreen: true,
      headerLeftRightStyle: '',
      toggleMenuDalay: this.toggleMenu,
      isMobile: false,
      isLoading: false,
      onChangeSearchValueThrottle: _.throttle(this.onChangeSearchValue, 100, { 'trailing': false }),
    }
  },
  components: {
    VuePerfectScrollbar,
    LoadingBar,
    ButtonIcon,
  },
  watch: {
    searchValue (newVal, oldVal) {
      this.onChangeSearchValueThrottle()
    },
  },
  created () {
    if (this.$isMobile())
      this.toggleMenuDalay = _.debounce(this.toggleMenu, 200)
    this.createModelEventListener()
    this.getData()
    // this.getDashboardData()
  },
  beforeDestroy () {
    this.removeModelEventListener()
  },
  mounted () {
    this.onResizeWindow()
  },
  methods: {
    createModelEventListener () {
      this.profile.on('notification', event => {
        window.user_data = this.profile
        this.$i18n.locale = this.profile.get('language_id_ref')
        this.$eventHub.$emit('dashboard-app-user-loaded', '')
        this.$eventHub.$emit('app-user-language', this.profile.get('language_id'))
      })
    },
    removeModelEventListener () {
      this.profile.off('notification')
    },
    onResizeWindow () {
      if (window.innerWidth <= 640) {
        this.isDesktopScreen = false
        this.headerLeftRightStyle = 'min-width: 50px;'
      } else {
        this.isDesktopScreen = true
        this.headerLeftRightStyle = 'min-width: 180px;'
      }
      if (window.innerWidth < 1080)
        this.isMobile = true
      else
        this.isMobile = false
    },
    showSidebarNotification () {
      this.$eventHub.$emit('app-show-sidebar-notification', '')
    },
    toggleMenu (e) {
      e.preventDefault()
      this.$eventHub.$emit('app-show-sidebar-menu', '')
    },
    toggleFullContent () {
      this.$eventHub.$emit('app-toggle-full-content', '')
    },
    getMenuIconName () {
      if (this.isFullContent)
        return 'fullscreen'
      return 'fullscreen_exit'
    },
    async onChangeSearchValue () {
      this.searchIsFocused = true
      if (!this.searchValue)
        return

      let localItems = []
      let search = this.searchValue.toLowerCase()
      let resourceViewNames = []
      for (let rr of window.user_data.get('role_resources'))
        if (rr.resource_type === 'view')
          resourceViewNames.push(rr.resource_name)
      let routes = []
      for (let route of this.$router.options.routes)
        for (let resourceViewName of resourceViewNames)
          if (resourceViewName === route.name)
            routes.push(route)
      for (let route of routes) {
        let title = route.meta.title.toLowerCase()
        let routeName = route.name
        if (
          title.indexOf(search) >= 0 &&
          routeName.indexOf('detail') === -1 &&
          routeName.indexOf('not-found') === -1
        ) {
          let path = route.path
          let icon = 'list'
          let params = {
            page: 1,
          }
          if (path.indexOf(':page') === -1 ) {
            params = ''
            icon = 'insert_drive_file'
          }
          localItems.push({
            'item_title': title,
            'item_model': 'local_page',
            'item_params': params,
            'page_route_name': routeName,
            'item_icon': icon,
          })
        }
      }
      this.isLoading = true
      this.searchItems.clear()
      this.showResults()
      try {
        await this.searchItems.fetch({
            params: {
              search: this.searchValue,
            },
          })
        this.searchItems.add(localItems)
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    onClickResult () {
      this.hideResults()
    },
    clickOutsite () {
      this.hideResults()
    },
    showResults () {
      this.resultsIsVisible = true
    },
    clearAndhideResults () {
      this.searchValue = ''
      this.resultsIsVisible = false
    },
    hideResults () {
      this.resultsIsVisible = false
    },
    goToModelDetail (item) {
      this.$router.push({
        name: item.get('item_model'),
        params: { id: item.get('item_id') },
      })
    },
    goToLocalPage (page) {
      this.$router.push({
        name: page.page_route_name,
        params: page.item_params,
      })
    },
    showUserProfile (profile) {
      this.$router.push({
        name: 'profile',
      })
    },
    showUserMenu () {
      this.userMenuOpen = true
    },
    hideUserMenu () {
      this.userMenuOpen = false
    },
    getData () {
      try {
        this.profile.set('id', this.$getCookie('user_id'))
        this.profile.fetch()
      } catch (err) {
        console.error(err)
      }
    },
    getDashboardData () {
      try {
        this.settings.fetch()
      } catch (err) {
        console.error(err)
      }
    },
    getCoverImage () {
      return this.$getAvatarURL(this.profile.get('profile_file_id_ref'))
    },
    getCoverColor (plain, l, s, opacity) {
      return this.$getHexColor(this.profile.get('user_first_name'), plain, l, s, opacity)
    },
    getUserFirstLetter (profile) {
      if (!profile.get('user_first_name'))
        return

      return profile.get('user_first_name')[0]
    },
    getCoverModelColor (value, plain, s, l, opacity) {
      return this.$getHexColor(value, plain, s, l, opacity)
    },
  },
}
</script>

<style scoped lang="css">
#header {
  color: var(--main-text-color);
  display: flex;
  height: 50px;
  left: 0px;
  position: absolute;
  right: 0px;
  top: 0;
  width: 100%;
  z-index: 2;
}

.left-wrapper, .right-wrapper {
  -webkit-user-select: none;
  display: flex;
  min-width: 180px;
  position: relative;
  text-overflow: ellipsis;
  user-select: none;
}

.right-wrapper {
  justify-content: flex-end;
}

.username {
  align-self: center;
  cursor: pointer;
  display: flex;
  max-width: 160px;
  padding-right: 10px;
  position: relative;
}

.username .name {
  align-self: center;
  color: var(--main-text-color);
  cursor: pointer;
  flex-grow: 1;
  line-height: 1;
  margin: 0 5px 0 0;
  max-width: 100px;
  overflow: hidden;
  position: relative;
  text-align: right;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
  z-index: 1;
}

.avatar {
  align-self: center;
  border-radius: 100%;
  box-shadow: var(--main-box-shadow);
  display: flex;
  flex-grow: 0;
  height: 32px;
  justify-content: center;
  min-width: 32px;
  z-index: 1;
}

.avatar span {
  align-self: center;
  font-size: 16px;
  font-weight: 400;
  text-transform: uppercase;
}

.username .menu {
  background-color: var(--main-box-bg-color);
  border-radius: 20px;
  box-shadow: var(--main-box-shadow);
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  max-height: calc(100vh - 64px);
  padding: 10px;
  position: absolute;
  right: 10px;
  top: 39px;
  width: 140px;
}

.options-wrapper {
  background-color: var(--main-box-bg-color);
  box-sizing: border-box;
  overflow: hidden;
}

.username .menu .option {
  border-radius: 20px;
  color: var(--main-text-color);
  display: flex;
  font-size: var(--main-secundary-font-size);
  font-weight: bold;
  max-width: 100%;
  padding: 6px 15px;
  text-decoration: none;
  text-transform: uppercase;
}

.username .menu .option:hover {
  background-color: var(--main-hover-color);
}

.username .menu .option:active {
  background-color: var(--main-active-color);
  color: var(--main-accent-color);
}

#search-wrapper {
  align-self: center;
  border-radius: 20px;
  box-shadow: var(--main-box-shadow);
  display: flex;
  margin: 0 150px;
  min-width: 150px;
  position: relative;
  width: 100%;
}

#icon-search,
#search-wrapper .icon {
  align-self: center;
  display: flex;
  position: absolute;
}

#icon-search {
  margin-left: 10px;
  z-index: 2;
}

#search-wrapper input {
  align-self: center;
  background: none;
  border: none;
  box-sizing: border-box;
  color: var(--main-text-color);
  display: flex;
  font-size: var(--main-font-size);
  font-weight: 500;
  height: 35px;
  outline: none;
  padding: 0 10px 0 35px;
  position: absolute;
  width: 100%;
}

#search-wrapper input::-webkit-input-placeholder {
  color: var(--main-text-color);
  text-transform: uppercase;
}

#search-wrapper .bkg {
  align-self: center;
  background-color: var(--main-box-bg-color);
  border-radius: 20px;
  height: 35px;
  width: 100%;
}

#search-wrapper.search-active .bkg {
  background-color: var(--main-box-bg-color);
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  z-index: 1;
}

#search-wrapper.search-active input {
  color: var(--main-text-color);
  z-index: 2;
}

.results-wrapper {
  background-color: var(--main-box-bg-color);
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  box-shadow: var(--main-box-shadow);
  color: var(--main-text-color);
  max-height: 240px;
  position: absolute;
  top: 100%;
  width: 100%;
}

.results-wrapper .item:first-child {
  padding-top: 10px;
}

.results-wrapper .item:last-child {
  padding-bottom: 10px;
}

.results-wrapper .item > div {
  border-radius: 20px;
  box-sizing: border-box;
  color: var(--main-text-color);
  cursor: pointer;
  display: flex;
  font-size: var(--main-font-size);
  height: auto;
  padding: 5px 10px;
  width: 100%;
}

.results-wrapper .item > div:hover {
  background-color: var(--main-hover-color);
}

.results-wrapper .item > div:active {
  background-color: var(--main-active-color);
  color: var(--main-accent-color);
}

.results-wrapper .item > div:active i {
  color: var(--main-accent-color);
}

.results-wrapper .item > div {
  align-self: center;
  display: flex;
  margin: 0;
}

.results-wrapper .item  > div .material-icons {
  align-self: center;
  font-size: 20px;
  margin-right: 5px;
  pointer-events: none;
}

.results-wrapper .item > div label {
  align-self: center;
  padding: 0 0 0 25px;
  pointer-events: none;
}

.no-results {
  color: var(--main-text-color);
  font-size: var(--main-font-size);
  padding: 10px;
}

.option-icon {
  font-size: 16px;
  margin: auto 10px auto 0;
}

#user-first-name {
  font-size: var(--main-secundary-font-size);
  font-weight: bold;
  margin: 0px;
}

#user-role-name {
  display: block;
  font-size: var(--main-secundary-font-size);
  font-weight: 500;
  margin: 0;
}

#search-close-button {
  -webkit-user-select: none;
  align-self: center;
  border-radius: 0;
  cursor: pointer;
  display: flex;
  position: absolute;
  right: 5px;
  user-select: none;
  z-index: 2;
}

#logo {
  width: 130px;
  align-self: center;
}

#search-results {
  border-bottom-right-radius: 20px;
  height: 100%;
  overflow: hidden;
  position: relative;
}

#items-wrapper {
  max-height: 240px;
  padding: 0 8px;
}

#app-logo {
  cursor: pointer;
  height: 32px;
  margin: auto 0 auto 10px;
}

.header-buttons-wrapper {
  display: flex;
  justify-content: flex-end;
  position: relative;
}

.header-buttons-wrapper div {
  margin: auto 10px;
}


@media all and (max-width: 1080px) {
  #search-wrapper {
    margin: 0 20px;
  }
}

@media all and (max-width: 360px) {
  #app-logo {
    height: auto;
    width: 100%;
  }
}

.item .chip {
  background-color: var(--main-hover-color);
  border-radius: 20px;
  color: var(--main-text-color);
  display: flex;
  font-size: var(--main-secundary-font-size);
  font-weight: bold;
  justify-content: center;
  line-height: calc(var(--main-secundary-font-size) + 6px);
  margin: 0 0 0 5px;
  padding: 0 15px;
  text-transform: lowercase;
}

</style>
