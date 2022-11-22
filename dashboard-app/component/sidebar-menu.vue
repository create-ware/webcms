<template lang="html">
  <div>
    <div
      id="menu"
      v-bind:class="{
        'sticky': isSticky,
        'no-sticky': !isSticky,
        }"
      v-click-outside="afterClose">
      <VuePerfectScrollbar class="scroll-area">
        <img
          v-if="!isSticky"
          id="app-logo"
          src="/static/assets/webcms-logo-header.png"/>
        <div
          v-for="(item, index) in menuItems"
          v-acl-show="item.resourceName"
          class="menu-option">
          <router-link
            v-bind:key="item.position"
            :to="{ name: item.name, params: item.params }"
            v-bind:class="getMenuItemClass(item)">
            <i class="material-icons-round icon">
              {{ item.icon }}
            </i>
            {{ $t(item.title) }}
          </router-link>
          <i
            v-if="item.children"
            class="material-icons-round button-more-items"
            v-on:click="toggleOptions(index)">
            {{ item.expanded ? 'expand_less' : 'expand_more' }}
          </i>
          <router-link
            v-if="item.expanded"
            class="children-item"
            v-for="(itemChildren) of item.children"
            v-bind:key="itemChildren.uuid"
            :to="{ name: itemChildren.name, params: '' }">
            <i class="material-icons-round icon">
              {{ itemChildren.icon }}
            </i>
            {{ $t(itemChildren.title) }}
          </router-link>
        </div>
        <div id="menu-footer"></div>
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
  ],
  components: {
    VuePerfectScrollbar,
  },
  data () {
    return {
      afterClose: _.after(2, this.close),
      currentItemName: '',
      menuItems: [
        {
          position: 0,
          title: 'dashboard',
          name: 'dashboard',
          icon: 'dashboard',
          resourceName: 'dashboard',
          keys: 'dashboard',
          expanded: false,
        },
        {
          position: 3,
          title: 'files',
          name: 'files',
          icon: 'perm_media',
          params: { page: 1 },
          resourceName: 'files',
          keys: 'files, file',
          expanded: false,
          children: [
            {
              title: 'new',
              name: 'file',
              icon: 'add',
              uuid: this.$uuid.v1(),
            },
          ],
        },
        {
          position: 4,
          title: 'users',
          name: 'users',
          icon: 'people',
          params: { page: 1 },
          resourceName: 'users',
          keys: 'users, user',
          expanded: false,
          children: [
            {
              title: 'new',
              name: 'user',
              icon: 'add',
              uuid: this.$uuid.v1(),
            },
          ],
        },
        {
          position: 5,
          title: 'resources',
          name: 'resources',
          icon: 'pages',
          params: { page: 1 },
          resourceName: 'resources',
          keys: 'resources, resource',
          expanded: false,
          children: [
            {
              title: 'new',
              name: 'resource',
              icon: 'add',
              uuid: this.$uuid.v1(),
            },
          ],
        },
        {
          position: 6,
          title: 'roles',
          name: 'roles',
          icon: 'security',
          params: { page: 1 },
          resourceName: 'roles',
          keys: 'roles, role',
          expanded: false,
          children: [
            {
              title: 'new',
              name: 'role',
              icon: 'add',
              uuid: this.$uuid.v1(),
            },
          ],
        },
        {
          position: 9,
          title: 'categories',
          name: 'categories',
          icon: 'category',
          params: { page: 1 },
          resourceName: 'categories',
          keys: 'categories, category',
          expanded: false,
          children: [
            {
              title: 'new',
              name: 'category',
              icon: 'add',
              uuid: this.$uuid.v1(),
            },
          ],
        },
        {
          position: 15,
          title: 'feedbacks',
          name: 'feedbacks',
          icon: 'feedback',
          params: { page: 1 },
          resourceName: 'feedbacks',
          keys: 'feedbacks, feedback',
        },
        {
          position: 16,
          title: 'languages',
          name: 'languages',
          icon: 'language',
          params: { page: 1 },
          resourceName: 'languages',
          keys: 'languages, language',
          expanded: false,
          children: [
            {
              title: 'new',
              name: 'language',
              icon: 'add',
              uuid: this.$uuid.v1(),
            },
          ],
        },
        {
          position: 7,
          title: 'profile',
          name: 'profile',
          icon: 'person',
          resourceName: '',
          keys: 'profile',
          expanded: false,
        },
        {
          position: 8,
          title: 'settings',
          name: 'settings',
          icon: 'settings',
          resourceName: 'settings',
          keys: 'settings',
          expanded: false,
        },
        {
          position: 17,
          title: 'areas',
          name: 'areas',
          icon: 'workspaces',
          params: { page: 1 },
          resourceName: 'areas',
          keys: 'areas, area',
          expanded: false,
          children: [
            {
              title: 'new',
              name: 'area',
              icon: 'note_add',
              uuid: this.$uuid.v1(),
            },
          ],
        },
        {
          position: 18,
          title: 'sections',
          name: 'sections',
          icon: 'straighten',
          params: { page: 1 },
          resourceName: 'sections',
          keys: 'sections, section',
          expanded: false,
          children: [
            {
              title: 'new',
              name: 'section',
              icon: 'note_add',
              uuid: this.$uuid.v1(),
            },
          ],
        },
        {
          position: 19,
          title: 'documents',
          name: 'documents',
          icon: 'description',
          params: { page: 1 },
          resourceName: 'documents',
          keys: 'documents, document',
          expanded: false,
          children: [
            {
              title: 'new',
              name: 'document',
              icon: 'note_add',
              uuid: this.$uuid.v1(),
            },
          ],
        },
      ],
    }
  },
  created () {
    this.highlightCurrentMenuItem(this.$router.currentRoute.name)
    this.$router.beforeResolve(this.routerBeforeResolve)
  },
  methods: {
    close () {
      if (this.isSticky)
        return

      this.$eventHub.$emit('app-hide-sidebar-menu', '')
    },
    highlightCurrentMenuItem (itemName) {
      let name = ''
      let index = -1
      let isMatch = false
      for (let itemIndex in this.menuItems) {
        let regx = new RegExp(`^${ itemName }$`, 'gi')
        let itemKeys = this.menuItems[itemIndex].keys.replace(/\s/gi, '').split(',')
        for (let itemKey of itemKeys) {
          let match = itemKey.match(regx)
          if (match) {
            name = this.menuItems[itemIndex].name
            index = itemIndex
            isMatch = true
            // NOTE: check for children
            let children = this.menuItems[itemIndex].children
            if (children !== undefined)
              for (let child of children)
                if (child.keys !== undefined && child.keys.indexOf(itemName) >= 0) {
                  child.expanded = true
                  break
                }
            break
          }
        }
        if (isMatch)
          break
      }
      this.currentItemName = name
      if (!this.menuItems[index])
        return

      this.menuItems[index].expanded = true
    },
    getMenuItemClass (item) {
      return {
        'current': this.isCurrentItem(item),
        'option': true,
      }
    },
    isCurrentItem (item) {
      return item.name == this.currentItemName
    },
    routerBeforeResolve (to, from, next) {
      this.highlightCurrentMenuItem(to.name)
      next()
    },
    toggleOptions (index) {
      this.menuItems[index].expanded = !this.menuItems[index].expanded
    },
  },
}
</script>

<style scoped lang="css">
#menu {
  flex-grow: 0;
  left: 0;
  overflow-y: auto;
  position: fixed;
  width: 180px;
  z-index: 1;
}

.no-sticky {
  background-color: var(--main-box-bg-color);
  box-shadow: var(--main-box-shadow);
  height: 100%;
  top: 0px;
}

.sticky {
  height: calc(100% - 50px);
  top: 50px;
}

#logo {
  align-self: center;
  display: flex;
  margin: 10px auto;
  width: 130px;
}

#menu .option {
  -webkit-user-select: none;
  align-items: center;
  border-bottom: 0;
  border-radius: 20px;
  border: 0;
  color: var(--main-text-color);
  cursor: pointer;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  font-size: var(--main-secundary-font-size);
  font-weight: bold;
  height: 30px;
  margin: 2px;
  max-width: 100%;
  padding: 0 8px;
  position: relative;
  text-decoration: none;
  text-transform: uppercase;
  user-select: none;
  z-index: 2;
}

#menu .option:hover {
  background-color: var(--main-hover-color);
}

#menu .option:active {
  background-color: var(--main-active-color);
  color: var(--main-accent-color);
}

#menu .option .icon {
  margin-right: 5px;
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

#menu .option.current {
  background-color: var(--main-active-color);
  color: var(--main-accent-color);
}

.children-item {
  -webkit-user-select: none;
  align-items: center;
  border-bottom: 0;
  border-radius: 20px;
  border: 0;
  color: var(--main-text-color);
  cursor: pointer;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  font-size: calc(var(--main-accent-font-size) - 3px);
  font-weight: bold;
  height: 30px;
  margin: 0 2px;
  max-width: 100%;
  padding: 0 8px;
  position: relative;
  text-decoration: none;
  text-transform: uppercase;
  user-select: none;
  z-index: 2;
}

.children-item:hover {
  background-color: var(--main-hover-color);
}

.children-item:active {
  background-color: var(--main-active-color);
  color: var(--main-accent-color);
}

.children-item .icon {
  font-size: 18px;
  margin-right: 10px;
  padding: 0;
}

.menu-option {
  margin: 0 8px 0 8px;
  position: relative;
}

#menu-footer {
  height: 30px;
}

.button-more-items {
  -webkit-user-select: none;
  color: var(--main-text-color);
  cursor: pointer;
  font-size: 18px;
  position: absolute;
  right: 8px;
  top: 7px;
  user-select: none;
  z-index: 2;
}

#app-logo {
  align-self: center;
  display: flex;
  height: 32px;
  margin: 10px auto;
}
</style>
