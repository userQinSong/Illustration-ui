<template>
  <div class="topBar">
    <div class="tobBarMain">
      <div class="topBarLeftPart">
        <div class="titleIconDom">
          <div class="titleSideBar" @click="changeLeftBarType">
            <i :class="classObject"/>
          </div>
          <el-image class="title-img-front" :src="require('@/assets/img/illustration/logo-front.png')"/>
          <el-image class="title-img-middle" style="" :src="require('@/assets/img/illustration/logo1.png')"/>
          <el-image class="title-img" :src="require('@/assets/img/illustration/logo.png')"/>
        </div>
      </div>
      <div class="topBarRightPart">
        <div style="margin-left: 12px" v-if="hasLoginUser">
          <button class="upload_btn" @click="openUploadBox">
            <div class="button_innder">
              <i class="qin-iconplus-circle font-light"/>
              <span>发布</span>
            </div>
          </button>
        </div>
        <div style="margin-left: 12px" v-if="hasLoginUser">
          <el-dropdown>
            <div class="rightPotraitDom">
              <div class="rightPotrait">
                <Potrait
                  :width="45"
                  :click-handler="toPersonalPage"
                  :potrait_src="loginUser.potrait_src"
                  :has_draw="true"
                  style="margin-bottom: 15px"
                />
              </div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="qin-iconsetting" @click.native="userSet">账号设置</el-dropdown-item>
              <el-dropdown-item icon="qin-iconlogout" @click.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div style="margin-left: 12px" v-if="!hasLoginUser">
          <div class="loginButton" @click="openLoginBox">
            <div class="button_inner">
              <span>登录</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <LoginMsgBox ref="loginShadeBox"/>
    <PersonalEditForm/>
    <UploadForm/>
  </div>
</template>

<script>

import LoginMsgBox from "@/components/illustration/msgBox/LoginMsgBox";
import PersonalEditForm from "@/components/illustration/form/PersonalEditForm";
import {checkObj, getCurrentTimeSeconds} from "@/common/uctil";
import Potrait from "@/components/illustration/potrait/Potrait";
import UploadForm from "@/components/illustration/form/UploadForm";
import {pushRemainTime} from "@/network/illustration/person";
export default {
  name: "TopBar",
  components: {UploadForm, Potrait, LoginMsgBox,PersonalEditForm},
  data() {
    return {
      rankNames:["客户端","零售商端","供应商端","管理员端"],
      rankName:"未登录",
      input:"",
      loginUser:{},
      isRightArrowMulu:true,
      hasLoginUser:false,
    }
  },
  props:{
    pushRemain:Function,
    getRemain:Function
  },
  created() {
    this.setLocalWatcher();
    console.log("进入TopBar:",localStorage.getItem("curLoginUser"))
    if(checkObj(localStorage.getItem("curLoginUser"))){
      this.hasLoginUser = true;
      this.loginUser = JSON.parse(localStorage.getItem("curLoginUser"));
    }
  },
  computed: {
    classObject:function (){
      return {
        mulu:true,
        'qin-iconindent':!this.isRightArrowMulu,
        'qin-iconoutdent':this.isRightArrowMulu
      }
    },
    curLoginUserId() {
      return this.hasLoginUser ? JSON.parse(localStorage.getItem("curLoginUser")).user_id : null
    }
  },
  methods: {
    //返回
    togBack(){
      this.$router.back();//先执行返回操作，
    },
    changeLeftBarType(){
      this.isRightArrowMulu = !this.isRightArrowMulu
      this.$bus.$emit('changeLeftNavHidden')
    },
    openLoginBox(){
      this.$bus.$emit('openLoginForm');
    },
    openUploadBox(){
      this.$bus.$emit("openUploadBox");
    },
    setLocalWatcher(){
      let _this=this;
      window.addEventListener("setItemEvent",function(e){
        if(e.key==="curLoginUser"){
          console.log("监测到localStorage变化：",e.newValue);
          if(checkObj(e.newValue)){
            _this.hasLoginUser = true;
            _this.loginUser = JSON.parse(e.newValue)
          } else
            _this.hasLoginUser = false;
        }
      })
    },
    toPersonalPage(){
      console.log("点击了去主页,当前loginUser:",this.loginUser)
      this.$bus.$emit('goRoute',{path:'/personalPage_loginUser'})
    },
    logout(key) {
      this.$message.success("账号已退出！")
      this.pushRemain();
      localStorage.setItem('curLoginUser', '')
      this.$nextTick(()=>{
        this.$router.go(0)
      })
    },
    userSet(){
      this.$bus.$emit('openEditPersonalBox');
    }
  },
}
</script>

<style scoped >
.topBar {
  padding: 0 16px;
  background-color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  top: 0px;
  left: 0px;
  right: 0px;
  z-index: 100;
  height: 3.125rem;
  max-height: 3.125rem;
  position: relative;
  box-sizing: border-box;
  border-bottom: 0.0625rem solid rgb(233, 236, 239);
}

.tobBarMain {
  height: 100%;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: space-between;
}

.topBarLeftPart {
  flex: 1;
  margin-right: 0.875rem;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: start;
  justify-content: start;
}

.titleIconDom {
  margin-right: 2rem;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  flex-shrink: 0;
}

.titleSideBar {
  margin-right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  line-height: 32px;
  text-align: center;
  font-size: 18px;
  background-color: #f1f2f8;
  cursor: pointer;
  transform: rotate(0deg);
}

.mulu {
  color: inherit;
  font-size: 18px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
}

.title-name{
  font-size: 18px;
}
.title-img-front {
  height: 23px;
  margin-right: 5px;
}
.title-img-middle {
  height: 26px;
  margin-right: 2px;
}
.title-img {
  height: 20px;
}


.topBarRightPart {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: end;
  justify-content: end;
}

.rightPotraitDom{
  width: 42px;
  height: 42px;
  box-sizing: border-box;
  border-radius: 50%;
  padding: 2px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.rightPotrait {
  background-color: transparent;
  padding: 0.25rem;
  border-radius: 9999px;
  position: relative;
}

.el-dropdown-menu {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px 0;
  margin: 3px -10px 2px 0px !important;
  background-color: #FFF;
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

.el-popper.dropdown {
  background-color: #fff;
}

.el-dropdown-menu__item {
  font-weight: 600;
  color: #222 !important;
}
.el-dropdown-menu__item:not(.is-disabled):hover {
  background-color: #f1f2f8;
}

.loginButton {
  padding: 0 0.875rem;
  font-weight: 400;
  appearance: none;
  text-align: left;
  text-decoration: none;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  -webkit-tap-highlight-color: transparent;
  display: inline-block;
  width: auto;
  border-radius: 0.5rem;
  position: relative;
  line-height: 1;
  font-size: 0.875rem;
  user-select: none;
  cursor: pointer;
  color: rgb(51, 51, 51);
  background: rgb(241, 242, 248);
  border: none;
  height: 1.875rem;
}

[type=button], [type=reset], [type=submit], button {
  -webkit-appearance: button;
  background-image: none;
}

.button_inner {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  height: 100%;
  overflow: visible;
}

.button_inner span {
  white-space: nowrap;
  height: 100%;
  overflow: hidden;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
}
.button:not(.rigid), button:not(.rigid) {
  transition-property: color,background-color,border-color,text-decoration-color,fill,stroke;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
  transition-duration: .15s;
}
[type=button], [type=reset], [type=submit], button {
  -webkit-appearance: button;
  background-image: none;
}
.upload_btn {
  padding: 0px 0.625rem;
  appearance: none;
  text-align: left;
  text-decoration: none;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  -webkit-tap-highlight-color: transparent;
  display: inline-block;
  width: auto;
  border-radius: 0.5rem;
  font-weight: 600;
  position: relative;
  line-height: 1;
  font-size: 0.875rem;
  user-select: none;
  cursor: pointer;
  border: 0.0625rem solid transparent;
  color: rgb(51, 51, 51);
  background: rgb(241, 242, 248);
  height: 1.875rem
}


.button_innder{
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  height: 100%;
  overflow: visible;
}

.button_inner span{
  white-space: nowrap;
  height: 100%;
  overflow: hidden;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
}

.font-light {
  color: inherit;
  font-size: 16px;
  font-weight: 400;
  font-style: normal;
  margin-right: 3px;
  -webkit-font-smoothing: antialiased;
}

</style>
