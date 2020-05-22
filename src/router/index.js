import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      needLogin: true
    },
  },
  {
    path: '/activity',
    name: 'Activity',
    component: () => import('../views/Activity/Activity'),
    meta: {
      needLogin: true
    },
  },
  {
    path: '/selected',
    name: 'Selected',
    component: () => import('../views/Selected'),
    meta: {
      needLogin: true
    },
  },
  {
    path: '/find',
    name: 'Find',
    component: () => import('../views/Find'),
    meta: {
      needLogin: true
    },
  },
  {
    path: '/bookshelf',
    name: 'BookShelf',
    component: () => import('../views/BookShelf'),
    meta: {
      needLogin: true
    }
  },
  {
    path: '/mine',
    name: 'Mine',
    component: () => import('../views/Mine'),
    meta: {
      needLogin: true
    }
  },
  {
    path: '/list',
    name: 'List',
    component: () => import('../views/Novel/List'),
    meta: {
      needLogin: true
    }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/Search/Search'),
    meta: {
      needLogin: true
    }
  },
  {
    path: '/detail',
    name: 'Detail',
    component: () => import('../views/Novel/Detail'),
    meta: {
      needLogin: true
    }
  },
  {
    path: '/content',
    name: 'Content',
    component: () => import('../views/Novel/Content'),
    meta: {
      needLogin: true
    }
  },
  {
    path: '/blank',
    name: 'BlankPage',
    component: () => import('../views/ToolPage/BlankPage'),
    meta: {
      needLogin: true
    }
  },
  {
    path: '/share',
    name: 'Share',
    component: () => import('../views/Share/Share'),
    meta: {
      needLogin: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login/Login')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Login/Register')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
