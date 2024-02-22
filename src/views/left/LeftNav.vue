<template>
  <el-row class="tac" style="height: 100%">
    <el-col :span="24">
      <el-menu :default-active="this.$route.path"
               :router="true"
               class="el-menu-vertical-demo"
               @open="handleOpen"
               @close="handleClose"
               :collapse="isCollapse"
               background-color="#fff"
               text-color="#666"
               active-text-color="blue"
               active-background-color="f4f5f9"
               unique-opened
               menu-trigger="hover"
      >
        <el-menu-item index="/mainPage">
          <i class="qin-iconhome nav-dom"></i>
          <span slot="title" class="nav-word">插画主页</span>
        </el-menu-item>
        <el-menu-item index="2">
          <i class="el-icon-document"></i>
          <span slot="title" class="nav-word">画师之家</span>
        </el-menu-item>
        <el-menu-item index="/personalPage_loginUser">
          <i class="qin-iconuser nav-dom"></i>
          <span slot="title" class="nav-word">个人主页</span>
        </el-menu-item>
        <el-submenu index="/adminPage">
          <template slot="title">
            <i class="qin-iconsetting nav-dom"></i>
            <span slot="title" class="nav-word">平台管理</span>
          </template>
          <el-menu-item index="/adminPage/dataCenter">
            <i class="qin-iconfund nav-dom"></i>
            <span slot="title" class="nav-word">数据中心</span>
          </el-menu-item>
          <el-menu-item index="/adminPage/userCenter">
            <i class="qin-iconteam nav-dom"></i>
            <span slot="title" class="nav-word">用户管理</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "LeftNav",
  data(){
    return {
      isCollapse:false
    }
  },
  mounted() {
    this.$bus.$on('changeLeftNavHidden',()=>{
      this.isCollapse = !this.isCollapse
    })
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>


<style scoped>


.el-container{
  height: 100%;
}
.el-header,
.el-footer {
  background-color: #4a5064;
  color: peru;
  padding: 20px;
}
.el-aside{
  background-color: rgb(238, 241, 246);
  border: 1px solid #eee
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.el-icon-arrow-down:before {
  content: "";
  font-size: 18px;
}

.nav-dom{
  font-size: 18px;
  margin-right: 10px;
  margin-left: 2px;
}
.nav-word {
  width: 24px;
  height: 18px;
}
.el-submenu /deep/ .el-submenu__title:hover {
  background-color: #f4f5f9 !important;
}
.el-menu {
  border: none !important;
  list-style: none;
  position: relative;
  margin: 0;
  padding-left: 0;
  background-color: #FFF;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 220px;
  min-height: 400px;
}

.el-menu-item:hover {
  background-color: #f4f5f9 !important;
}
.el-menu-item.is-active {
  color: #666;
  background-color: #f4f5f9 !important;
}
</style>
