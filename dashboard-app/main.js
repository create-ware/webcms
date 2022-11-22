import Vue from 'vue'
import VueRouter from 'vue-router'
import VueAxios from 'vue-axios'
import UUID from 'vue-uuid'
import axios from 'axios'
import lodash from  'lodash'
import VueI18n from 'vue-i18n'

// NOTE: libraries
import {
  getHexColor,
  getAvatarURL,
  getThumbnailURL,
  aclReplaceVNode,
  aclUserCan,
  getCookie,
  getOptionsFromCollection,
  getModelColums,
  isImage,
  isMobile,
} from './lib/lib'
import sockerIO from './lib/socket-io.vue'
import exportTo from './lib/export-to.vue'

// NOTE: directives
import APP_SETTINGS from './app-settings'
import GLOBAL_DIRECTIVES from './directive/global-directives.vue'
import ACL_DIRECTIVES from './directive/acl-directives.vue'

// NOTE: models
import UserModel from './model/user-model.vue'
import UserCollection from './model/user-collection.vue'
import SearchCollection from './model/search-collection.vue'
import FileModel from './model/file-model.vue'
import FileCollection from './model/file-collection.vue'
import SearchFileCollection from './model/search-file-collection.vue'
import SettingModel from './model/setting-model.vue'
import SiteModel from './model/site-model.vue'
import DashboardCollection from './model/dashboard-collection.vue'
import RoleModel from './model/role-model.vue'
import RoleCollection from './model/role-collection.vue'
import ResourceModel from './model/resource-model.vue'
import ResourceCollection from './model/resource-collection.vue'
import NotificationModel from './model/notification-model.vue'
import NotificationCollection from './model/notification-collection.vue'

import ProfileModel from './model/profile-model.vue'
import DashboardSettingModel from './model/dashboard-setting-model.vue'
import FeedbackModel from './model/feedback-model.vue'
import FeedbackCollection from './model/feedback-collection.vue'
import LanguageModel from './model/language-model.vue'
import LanguageCollection from './model/language-collection.vue'


// NOTE: components
import App from './app.vue'
import Dashboard from './component/dashboard.vue'
import List from './component/list.vue'
import Settings from './component/settings.vue'
import User from './component/user-components/user.vue'
import File from './component/file-components/file.vue'
import Role from './component/role-components/role.vue'
import NotFound from './component/not-found.vue'
import Feedback from './component/feedback.vue'
import Profile from './component/profile.vue'
import Resource from './component/resource-components/resource.vue'
import Language from './component/language-components/language.vue'


for (let directive of GLOBAL_DIRECTIVES.directives)
  Vue.directive(directive.name, directive.action)
for (let directive of ACL_DIRECTIVES.directives)
  Vue.directive(directive.name, directive.action)
Vue.use(VueRouter)
Vue.use(lodash)
axios.defaults.xsrfCookieName = 'csrf-token'
axios.defaults.xsrfHeaderName = 'csrf-token'
Vue.use(VueAxios, axios)
Vue.use(UUID)
Vue.use(VueI18n)
Vue.prototype.$eventHub = new Vue()
Vue.prototype.$models = {
  User: UserModel.model,
  File: FileModel.model,
  Setting: SettingModel.model,
  Site: SiteModel.model,
  DashboardCollection: DashboardCollection.model,
  Role: RoleModel.model,
  RoleCollection: RoleCollection.model,
  Resource: ResourceModel.model,
  ResourceCollection: ResourceCollection.model,
  UserCollection: UserCollection.model,
  SearchCollection: SearchCollection.model,
  FileCollection: FileCollection.model,
  SearchFileCollection: SearchFileCollection.model,
  Profile: ProfileModel.model,
  DashboardSetting: DashboardSettingModel.model,
  Feedback: FeedbackModel.model,
  FeedbackCollection: FeedbackCollection.model,
  Language: LanguageModel.model,
  LanguageCollection: LanguageCollection.model,
  Notification: NotificationModel.model,
  NotificationCollection: NotificationCollection.model,
}

Vue.prototype.$exportTo = exportTo.exportTo
Vue.prototype.$appApiBaseURL = APP_SETTINGS.appApiBaseURL
Vue.prototype.$getHexColor = getHexColor
Vue.prototype.$getAvatarURL = getAvatarURL
Vue.prototype.$getThumbnailURL = getThumbnailURL
Vue.prototype.$aclReplaceVNode = aclReplaceVNode
Vue.prototype.$aclUserCan = aclUserCan
Vue.prototype.$getCookie = getCookie
Vue.prototype.$getOptionsFromCollection = getOptionsFromCollection
Vue.prototype.$getModelColums = getModelColums
Vue.prototype.$isImage = isImage
Vue.prototype.$isMobile = isMobile
Vue.prototype.$socketIO = new sockerIO.IO()
Vue.prototype._ = lodash
Vue.prototype.appLoaded = false
window.Vue = Vue

window.app = {
  dashboard_full_content: false,
}

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {},
  },
  silentTranslationWarn: true,
})

const routes = [
  {
    name: 'not-found',
    path: '/dashboard/not-found',
    component: NotFound,
    meta: {
      title: 'not found',
    },
  },
  {
    name: 'feedback',
    path: '/dashboard/feedback',
    component: Feedback,
    meta: {
      title: 'feedback',
    },
  },
  {
    meta: {
      title: 'error',
    },
    name: 'error',
    path: '*',
    component: NotFound,
  },
  {
    meta: {
      title: 'dashboard',
    },
    name: 'dashboard',
    path: APP_SETTINGS.appBaseURL,
    component: Dashboard,
  },
  {
    meta: {
      title: 'files',
    },
    name: 'files',
    path: `${ APP_SETTINGS.appBaseURL }/files/:page/`,
    component: List,
  },
  {
    meta: {
      title: 'users',
    },
    name: 'users',
    path: `${ APP_SETTINGS.appBaseURL }/users/:page/`,
    component: List,
  },
  {
    meta: {
      title: 'roles',
    },
    name: 'roles',
    path: `${ APP_SETTINGS.appBaseURL }/roles/:page/`,
    component: List,
  },
  {
    meta: {
      title: 'settings',
    },
    name: 'settings',
    path: `${ APP_SETTINGS.appBaseURL }/settings`,
    component: Settings,
  },
  {
    meta: {
      title: 'user',
    },
    name: 'user',
    path: `${ APP_SETTINGS.appBaseURL }/user/:id?/`,
    component: User,
  },
  {
    meta: {
      title: 'file',
    },
    name: 'file',
    path: `${ APP_SETTINGS.appBaseURL }/file/:id?/`,
    component: File,
  },
  {
    meta: {
      title: 'role',
    },
    name: 'role',
    path: `${ APP_SETTINGS.appBaseURL }/role/:id?/`,
    component: Role,
  },
  {
    meta: {
      title: 'profile',
    },
    name: 'profile',
    path: `${ APP_SETTINGS.appBaseURL }/profile`,
    component: Profile,
  },
  {
    meta: {
      title: 'resources',
    },
    name: 'resources',
    path: `${ APP_SETTINGS.appBaseURL }/resources/:page?/`,
    component: List,
  },
  {
    meta: {
      title: 'resource',
    },
    name: 'resource',
    path: `${ APP_SETTINGS.appBaseURL }/resource/:id?/`,
    component: Resource,
  },
  {
    meta: {
      title: 'languages',
    },
    name: 'languages',
    path: `${ APP_SETTINGS.appBaseURL }/languages/:page?/`,
    component: List,
  },
  {
    meta: {
      title: 'language',
    },
    name: 'language',
    path: `${ APP_SETTINGS.appBaseURL }/language/:id?/`,
    component: Language,
  },
  {
    meta: {
      title: 'categories',
    },
    name: 'categories',
    path: `${ APP_SETTINGS.appBaseURL }/categories/:page/`,
    component: List,
  },
  {
    meta: {
      title: 'feedbacks',
    },
    name: 'feedbacks',
    path: `${ APP_SETTINGS.appBaseURL }/feedbacks/:page/`,
    component: List,
  },
  {
    meta: {
      title: 'feedback',
    },
    name: 'feedback',
    path: `${ APP_SETTINGS.appBaseURL }/feedback/:id?/`,
    component: Feedback,
  },
]

const router = new VueRouter({
  mode: 'history',
  routes: routes,
  base: '/',
})


let lastPath = ''
Vue.prototype.$eventHub.$on('app-user-profile-loaded', data => {
  if (!data.initial)
    return

  Vue.prototype.appLoaded = true
  if (lastPath === '')
    return

  router.replace(lastPath)
})

// NOTE: check for user permissions in router - Improve using Dynamic Route Matching
router.beforeResolve((to, from, next) => {
  if (!Vue.prototype.appLoaded && lastPath === '') {
    lastPath = to.fullPath
    return next({
      name: 'not-found',
      params: {
        '0': {},
      },
    })
  }
  let isExceptionRouteName = APP_SETTINGS.appRouterNameException.indexOf(to.name) >= 0
  if (to.name === 'not-found' || isExceptionRouteName)
    return next()

  let res = aclUserCan(to.name)
  if (res)
    return next()

  next({
    name: 'not-found',
    params: {
      '0': to.path,
    },
  })
})

const app = new Vue({
  el: '#app',
  i18n: i18n,
  router: router,
  render: h => h(App),
})
