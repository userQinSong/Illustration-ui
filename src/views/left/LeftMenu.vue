<template>
  <div class="leftmenu" :style="{'max-height': this.timeLineHeight + 'px' }">
    <el-menu :default-openeds="['1']" :default-active="this.$route.path" :router="true">
      <el-submenu v-if="this.$store.getters['shopCar/curUser'].rank === 0" index="1">
        <template slot="title">
          <i></i>主页
        </template>
        <el-menu-item-group>
          <el-menu-item index="/shopsPage">
            <i class="el-icon-magic-stick"></i>附近门店
          </el-menu-item>
          <el-menu-item index="1-2" >
            <i class="el-icon-news"></i>热门商户
          </el-menu-item>
          <el-menu-item index="1-3" >
            <i class="el-icon-video-camera-solid"></i>周边活动
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu v-if="this.$store.getters['shopCar/curUser'].rank === 1" index="2">
        <template slot="title">
          <i></i>商铺管理
        </template>
        <el-menu-item-group>
          <el-menu-item index="/shopsHave">
            <i class="el-icon-bangzhu"></i>门店信息
          </el-menu-item>
          <el-menu-item index="3-2">
            <i class="el-icon-download"></i>卷烟管理
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="3">
          <template slot="title">
            <i></i>我的
          </template>
          <el-menu-item-group>
            <el-menu-item index="/shopCigarList">
              <i class="el-icon-bangzhu"></i>购物车
            </el-menu-item>
            <el-menu-item index="/recordPage">
              <i class="el-icon-download"></i>订单管理
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          <i></i>设置
        </template>
        <el-menu-item-group>
          <el-menu-item index="/login">
            <i class="el-icon-bangzhu"></i>登录
          </el-menu-item>
          <el-menu-item index="3-2">
            <i class="el-icon-download"></i>注销
          </el-menu-item>
          <el-menu-item index="/register">
            <i class="el-icon-download"></i>注册
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import {getUserAnchor} from 'network/login'
import { mapGetters } from "vuex";
export default {
  name: "LeftMenu",
  data() {
    return {
      timeLineHeight: "",
      currentUserInfo:
        window.localStorage.getItem("currentUserInfo") === "null"
          ? null
          : JSON.parse(window.localStorage.getItem("currentUserInfo")),
    };
  },
  methods: {
    getUserAnchor(uid){
      getUserAnchor(uid).then(res => {
        console.log(res);
      })
    },
  },
  created() {
    // console.log(this.currentUserInfo.userId);
    if(this.currentUserInfo){
      this.getUserAnchor(this.currentUserInfo.userId);
    }
    // setTimeout(res => {
    //   // console.log(this.getUserSonglist);
    //   console.log(this.currentUserInfo);

    // },1000)
  },
  computed: {
    ...mapGetters(["getUserSonglist"]),
  },
  mounted() {
    this.timeLineHeight = document.documentElement.clientHeight - 210;
    window.onresize = () => {
      this.timeLineHeight = document.documentElement.clientHeight - 210;
    };
  },
};
</script>

<style scoped>
/* .leftmenu{
  position: relative;
  height: 600px;
}
.left-container{
  position: absolute;
  top: 0px;
  height: 600px;
  bottom: 70px;
  border: 1px solid #eee
} */
.song-list {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 12px;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 255, 0.1);
  border-radius: 3px;
}
</style>
