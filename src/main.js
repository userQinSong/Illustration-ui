import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/reset.css'
import './assets/css/login.css'
import './assets/css/common.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import toast from 'components/common/toast/index'
import global from 'components/common/global/index'
import tool from "./common/tool";
//引入饼状图
import * as echarts from 'echarts'
import waterfall2 from 'vue-waterfall2'
import './assets/css/myCss.css'


Vue.use(waterfall2)
//注册全局
Vue.prototype.$echarts = echarts
import qs from 'qs'
Vue.prototype.$qs = qs
Vue.prototype.$bus = new Vue()
Vue.use(toast);
Vue.use(global)
Vue.use(tool);
Vue.config.productionTip = false
Vue.prototype.$bus = new Vue();
import '@/assets/iconfont/iconfont.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import waterfall from 'vue-waterfall2'

// import axios from 'axios'
// Vue.prototype.$axios = axios
// axios.defaults.baseURL = '/api'  //关键代码
// main.js 注册使用组件
Vue.use(waterfall)
Vue.use(VueAwesomeSwiper)
Vue.use(ElementUI);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

