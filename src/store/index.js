import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username:'',
    imgPrefix: 'http://statics.zhuishushenqi.com',
    loading: false,
    isRead: false
  },
  mutations: {
    changeLoading(state, load) {
      state.loading = load;
    },
    changeRead(state, load) {
      state.isRead = load;
    }
  },
  actions: {

  },
  modules: {
  }
})
