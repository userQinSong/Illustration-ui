import Vue from 'vue'
import VueRouter from 'vue-router'
import config from './config'
import store from '../store/index'

Vue.use(VueRouter)
// 解决编程式路由往同一地址跳转时会报错的情况
const originalPush = VueRouter.prototype.push;
const originalReplace = VueRouter.prototype.replace;

// push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};

//replace
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalReplace.call(this, location, onResolve, onReject);
  return originalReplace.call(this, location).catch(err => err);
};

const router = new VueRouter(config);
// 路由守卫
router.beforeEach((to, from, next) => {
  let pathArray = store.getters["path/pathArray"];
  let isExist = false;
  pathArray.forEach(item => {
    if(item === to.meta.title)
      isExist = true
  })
  if(isExist)
    while(pathArray.at(-1) !== to.meta.title){
      pathArray.pop()
    }
  else{
    document.title = to.meta.title
    pathArray.push(to.meta.title);
  }
  next();
})

export default router
