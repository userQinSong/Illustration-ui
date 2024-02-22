<template>
  <div class="main">
    <div id="app" style="margin: 0;padding: 0">
      <TopBar
        :push-remain="pushRemain"
        :get-remain="getRemain"
      ></TopBar>
      <CenterAll class="center-m"></CenterAll>
    </div>
  </div>
</template>

<script>

import TopBar from "@/views/topbar/TopBar";
import CenterAll from "views/center/CenterAll";
import LeftNav from "@/views/left/LeftNav";
import {checkObj,getCurrentTimeSeconds} from "@/common/uctil";
import {pushRemainTime} from "@/network/illustration/person";

export default {
  name: "APP",
  components: {
    LeftNav,
    TopBar,
    CenterAll,
  },
  data(){
    return {
      beforeUnloadTime:0,
      gapTime:0
    }
  },
  mounted() {
    console.log("#####获取到当前TestNum:",localStorage.getItem("testNum"))
    this.getRemain()
    window.addEventListener("beforeunload", () => this.beforeunloadHandler());
    window.addEventListener("unload", () => this.unloadHandler());
  },
  destroyed() {
    window.removeEventListener("beforeunload", () => this.beforeunloadHandler());
    window.removeEventListener("unload", () => this.unloadHandler());
  },
  methods: {
    beforeunloadHandler() {
      this.beforeUnloadTime = new Date().getTime();
    },
    unloadHandler() {
      this.gapTime = new Date().getTime() - this.beforeUnloadTime;
      if (this.gapTime <= 5) { //判断是窗口关闭还是刷新，小于5代表关闭，否则就是刷新。
        if(this.hasLoginUser){
          this.pushRemain()
        }
      }
    },
    pushRemain(){
      let endTime = getCurrentTimeSeconds()
      let loginTime = parseInt(localStorage.getItem('login_time'))
      localStorage.removeItem('login_time')
      let userParam = JSON.stringify({
        user_id:this.curLoginUserId,
        remain_time:(endTime - loginTime)
      })
      fetch('http://localhost:29001/api/person/pushRemainTime?userParam=' + userParam).then(function(data){
        // text()方法属于fetchAPI的一部分，它返回一个Promise实例对象，用于获取后台返回的数据
        return data.data;
      }).then(function(data){
        console.log(data);
      })
    },
    getRemain() {
      console.log("create:当前login_time:", localStorage.getItem("login_time"))
      if (this.hasLoginUser) {//判断当前是否有登录用户
        if (!checkObj(localStorage.getItem("login_time"))) {//判断是否需要记录登录时间
          localStorage.setItem("login_time", getCurrentTimeSeconds() + '')
          console.log("create:改变后login_time:", localStorage.getItem("login_time"))
        }
      }
    },
  },
  computed: {
    hasLoginUser() {
      return checkObj(localStorage.getItem("curLoginUser"))
    },
    curLoginUserId() {
      return this.hasLoginUser ? JSON.parse(localStorage.getItem("curLoginUser")).user_id : null
    }
  }
};
</script>

<style scoped>
.center-m {
  position: relative;
}
.btm-b {
  position: relative;
}
/*#app {*/
/*  width: 1400px;*/
/*  margin: 0 auto;*/
/*  margin-top: 50px;*/
/*  border-radius: 20px;*/
/*  overflow: hidden;*/
/*  position: relative;*/
/*  background: #fff;*/
/*}*/
#app {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  background: #fff;
  font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji';
  font-size: 14px;
  box-sizing: border-box;
}

.back-img {
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
}
.main{
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-image: linear-gradient(to bottom right, #d819bf, #2683cf, #63e4b9);
}
.back-img img {
  width: 100%;
}

.outFrame {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.el-header{
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
  margin: 0;
  padding: 0;
  width: 100%;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.title span {
  margin: 0 8px;
}
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}

.center-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-right: 20px;
}
</style>

<style>
.title_line {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  height: 40px;
  margin-bottom: 10px;
}
.span-dom {
  width: auto;
  height: 100px;
  text-align: center;
  font-size: 24px;
}

.font-big {
  font-size: 24px !important;
}

.title {
  max-width: 624px;
  overflow: hidden;
  color: #222;
  font-weight: 500;
  font-size: 26px;
  line-height: 36px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.cursor {
  cursor: pointer;
}

.font-medium {
  font-size: 20px;
  font-weight: 500;
}
</style>
