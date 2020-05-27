import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant';
import { Lazyload } from 'vant';
import 'vant/lib/index.css';
import iHttp from './net/index';
import VueTouch from 'vue-touch'

Vue.prototype.$iHttp = iHttp

Vue.use(Vant);
Vue.use(Lazyload);
Vue.use(VueTouch, { name: 'v-touch' })

Vue.config.productionTip = false


// //路由守卫
// router.beforeEach((to, from, next) => {
//   window.scrollTo(0, 0);
//   const isLogin = JSON.parse(localStorage.getItem("OneBook_Login"));
//   let needLogin = to.matched.some(match => match.meta.needLogin)
//   let path = to.path
//   if (needLogin) {
//     // 需要登录
//     if (isLogin) {
//       // 登录过了
//       next()
//     } else {
//       next("/login")
//     }
//   } else {
//     // 不需要登录
//     if (isLogin && path === "/login") {
//       next('/');
//     } else {
//       next()
//     }
//   }
// })

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
