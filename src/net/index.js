import axios from 'axios'
import store from '../store/index'

let loadingNum = 0; //内存中正在请求的数量

function startLoading() {
  if (loadingNum == 0) {
    store.commit('changeLoading',true)
    // NProgress.start()
  }
  loadingNum++;
}
function endLoading() {
  loadingNum--
  if (loadingNum <= 0) {
    store.commit('changeLoading',false)
    // NProgress.done()
  }
}
// 请求拦截
axios.interceptors.request.use(
  config => {
    // 加载动画
    startLoading()
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截
axios.interceptors.response.use(
  response => {
    endLoading()
    return response;
  },
  err => {
    // 错误提醒
    endLoading()
    return Promise.reject(err);
  }
);

export default {
  get(url, params) {
    return axios.get(url, {params})
  },
  post(url, data) {
    return axios.post(url, data)
  },
  delete(url, data) {
    return axios.delete(url, data)
  },
  put(url, data) {
    return axios.put(url, data)
  },
  patch(url, data) {
    return axios.patch(url, data)
  }
}
