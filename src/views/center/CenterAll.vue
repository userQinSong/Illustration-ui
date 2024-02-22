<template>
  <div class="centerall" v-loading="tag_loading || type_loading" v-if="!tag_loading && !type_loading">
<!--    <LeftNav class="left-side"/>-->
    <LeftNav/>
    <div class="con-all">
      <!-- <RightTop> </RightTop> -->
      <transition :name="transitionName">
        <keep-alive include="MainPage" exclude="PicoltDetailPage,PersonalPage">
          <router-view :key="key" v-if="routerAlive"></router-view>
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script>
import LeftNav from "views/left/LeftNav";
import RightRouteBar from "@/views/center/RightRouteBar";
import {getTagList, getTypeList} from "@/network/illustration/cats";
export default {
  name: "CenterAll",
  components: {
    LeftNav,
    RightRouteBar,
  },
  data() {
    return {
      transitionName: "",
      timeLineHeight: "",
      routerAlive: true,
      tag_loading:true,
      type_loading:true
    };
  },
  provide(){
    return{
      routerRefresh: this.routerRefresh
    }
  },
  created() {
    this.$bus.$on('goRoute',(param)=>{
      this.goRoute(param)
    })
    getTagList().then(res=>{
      if(res.code === 200){
        console.log("获取tag_list成功！",res.data)
        this.$store.commit("illustration/setTagList",res.data)
        this.$nextTick(()=>{
          this.tag_loading = false;
        })
      }else{
        console.log("获取tag_list失败！")
      }
    })
    getTypeList().then(res=>{
      if(res.code === 200){
        console.log("获取type_list成功！",res.data)
        this.$store.commit("illustration/setTypeList",res.data)
        this.$nextTick(()=>{
          this.type_loading = false;
        })
      }else{
        console.log("获取type_list失败！")
      }
    })
  },
  methods: {
    routerRefresh(){
      this.routerAlive = false;
      this.$nextTick(()=>{
        this.routerAlive = true;
      });
    },
    goRoute(routeObj){
      this.$router.push(routeObj);
      this.routerRefresh()
    }
  },
  mounted() {
    this.timeLineHeight = document.documentElement.clientHeight - 100;
    window.onresize = () => {
      this.timeLineHeight = document.documentElement.clientHeight - 100;
    };
  },
  computed: {
    key() {
      return this.$route.name !== undefined? this.$route.name +new Date(): this.$route +new Date()
    }
  },
  watch: {
    //使用watch 监听$router的变化
    $route(to, from) {
      //如果to索引大于from索引,判断为前进状态,反之则为后退状态
      // console.log(to.meta.index,from.meta.index);
      if (from.meta.index == 0 && to.meta.index > from.meta.index) {
        //设置动画名称
        this.transitionName = "slide-left";
        return;
      }
      if(to.meta.index == 0 && to.meta.index < from.meta.index){
        this.transitionName = "slide-right";
      }
      if (to.meta.index > 1 && to.meta.index > from.meta.index) {
        //设置动画名称
        this.transitionName = "slide-com";
        }
      if (to.meta.index > 1 && to.meta.index < from.meta.index) {
        //设置动画名称
        this.transitionName = "slide-back";
        }
      // } else {
      //   this.transitionName = "slide-back";
      // }
    },
  },
};
</script>
<style >
/*滚动条样式*/
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 255, 0.1);
  border-radius: 3px;
}
/* 动画效果 */
.slide-right-enter-active,
.slide-right-leave-active,
.slide-com-enter-active,
.slide-com-leave-active,
.slide-back-enter-active,
.slide-back-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 500ms;
  position: absolute;
}
.slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 100%, 0);
}
.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 100%, 0);
}
.slide-left-enter {
  opacity: 0;
  transform: translate3d(-100%, 100%, 0);
}
.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 100%, 0);
}
.slide-com-enter {
  opacity: 0;
  transform: translate3d(0,-100%,0);
}
.slide-com-leave-active {
  opacity: 0;
  transform: translate3d(0,100%,0);
}
.slide-back-enter {
  opacity: 0;
  transform: translate3d(0,100%,0);
}
.slide-back-leave-active {
  opacity: 0;
  transform: translate3d(0,-100%, 0);
}
</style>
<style scoped>
.con-all {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  align-items: center;
  background-color: white;
  text-align: center;
}

.toBottom {
  flex: 1;
  width: 100%;
  background-color: #409eff;
}
/* .rt-top{
    position: absolute;
    top: -43px;

} */
.centerall {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  height: 100vh;
  overflow: auto;
  max-width: 100vw;
  margin: 0 auto;
  /*max-height: 660px;*/
  /*height: 660px;*/
}
.ct-container {
  width: 100%;
  /*height: 660px;*/
  height: 100%;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}

.left-side {
  width: auto;
  padding: 0px;
  margin: 0px;
  border-right: 1px solid #EBEEF5;
}
</style>
