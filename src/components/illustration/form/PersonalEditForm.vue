<template>
  <div ref="shade"
       class="shade_outFrame"
       v-show="isDisplay"
       v-if="hasLoginUser"
  >
    <button class="cancelButton" @click="close">
      <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIiBmaWxsPSJub25lIj4KICA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEzLjMzMTcgMTIuMjYwMUMxMy4wMzg4IDExLjk2NzIgMTIuNTYzOSAxMS45NjcyIDEyLjI3MSAxMi4yNkMxMS45NzgxIDEyLjU1MjkgMTEuOTc4IDEzLjAyNzggMTIuMjcwOSAxMy4zMjA3TDE0LjkzODEgMTUuOTg4NUwxMi4yNzQ0IDE4LjY1MjJDMTEuOTgxNSAxOC45NDUxIDExLjk4MTUgMTkuNDIgMTIuMjc0NCAxOS43MTI5QzEyLjU2NzMgMjAuMDA1OCAxMy4wNDIxIDIwLjAwNTggMTMuMzM1IDE5LjcxMjlMMTUuOTk4NyAxNy4wNDkyTDE4LjY2NTYgMTkuNzE2N0MxOC45NTg0IDIwLjAwOTYgMTkuNDMzMyAyMC4wMDk3IDE5LjcyNjIgMTkuNzE2OEMyMC4wMTkxIDE5LjQyMzkgMjAuMDE5MiAxOC45NDkxIDE5LjcyNjMgMTguNjU2MUwxNy4wNTkzIDE1Ljk4ODZMMTkuNzI0NCAxMy4zMjM1QzIwLjAxNzIgMTMuMDMwNiAyMC4wMTcyIDEyLjU1NTggMTkuNzI0NCAxMi4yNjI5QzE5LjQzMTUgMTEuOTcgMTguOTU2NiAxMS45NyAxOC42NjM3IDEyLjI2MjlMMTUuOTk4OCAxNC45Mjc4TDEzLjMzMTcgMTIuMjYwMVoiIGZpbGw9IiNBMUFCQzkiIGZpbGwtb3BhY2l0eT0iMC44Ii8+CiAgPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTMiIHN0cm9rZT0iI0ExQUJDOSIgc3Ryb2tlLW9wYWNpdHk9IjAuOCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K"/>
    </button>
    <div class="mannuel_model_inner" @click.stop>
      <div class="shade_section">
        <div class="section_box">
          <div class="main_content">
            <div class="edit-content" v-loading="loading">
              <img class="back-img" src="https://liblibai-web-static.vibrou.com/liblibai_v4_online/static/_next/static/images/bg.cde1b98473c5026ea8342ccb78598f5f.png"/>
              <div class="potrait_line">
                <div class="title-img">
                  <img v-if="hasLoginUser"
                       :src="curLoginUser.potrait_src"/>
                </div>
              </div>
              <div class="potrait_line">
                <button class="chooseTitleImgButton" style="width: 116px">更改头像</button>
              </div>
              <div class="form-main">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm" @submit.native.prevent>
                  <el-form-item label="用户名" prop="name">
                    <el-input v-model="ruleForm.name"
                              maxlength="15"
                              show-word-limit
                    ></el-input>
                    <input style="display: none" type="text"/>
                  </el-form-item>
                  <el-form-item label="简介" prop="desc">
                    <el-input type="textarea"
                              v-model="ruleForm.desc"
                              maxlength="50"
                              show-word-limit
                    ></el-input>
                  </el-form-item>
                  <el-form-item class="flex-row">
                    <button @click="close" class="chooseTitleImgButton flex-button">暂不修改</button>
                    <button @click="submit" class="chooseTitleImgButton blue-back white-word flex-button">确认修改</button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import PersonFanItem from "@/components/illustration/table/PersonFanItem";
import {editPersonalMsg, getConcernPersonListByUserId} from "@/network/illustration/person";
import {checkObj} from "@/common/uctil";
import {changeAttentionOnePerson} from "@/network/illustration/person";

export default {
  name: "PersonalEditForm",
  components: {PersonFanItem},
  props:{
    changeAttitude:Function
  },
  data() {
    return {
      person:{},
      isDisplay:false,
      loading: false,
      ruleForm: {
        name: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请填写名字', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        desc: [
          { required: false, message: '简介不能含有违规字符', trigger: 'blur' }
        ]
      }
    };
  },
  methods:{
    initData(){
      console.log("获取到当前登录用户:",this.curLoginUser)
      this.person = this.curLoginUser;
      this.ruleForm.name = this.displayName
      this.ruleForm.desc = this.displayBrief
    },
    submit() {
      this.loading = true
      editPersonalMsg({
        user_id:this.curLoginUserId,
        edited_username:this.ruleForm.name,
        edited_brief:this.ruleForm.desc}).then(res=>{
        if(res.code === 200){
          console.log("编辑个人信息成功！")
          this.$message.success("编辑个人信息成功！")
          //修改登录缓存信息
          let editedUser = this.curLoginUser
          editedUser.user_name = this.ruleForm.name
          editedUser.brief = this.ruleForm.desc
          localStorage.setItem("curLoginUser",JSON.stringify(editedUser))
          //修改页面显示
          this.$bus.$emit('changePersonMsgBox')
          this.$nextTick(()=>{
            this.loading = false;
            this.close()
          })
        }else{
          console.log("编辑个人信息失败！")
          this.$message.error("编辑个人信息失败！")
        }
      })
    },
    open(){
      this.isDisplay = true
    },
    close(){
      this.isDisplay = false
    },
  },
  created() {
    this.initData(this.person);
    this.$bus.$on('openEditPersonalBox',()=>{
      this.open()
    })
  },
  computed:{
    hasLoginUser(){
      return checkObj(localStorage.getItem("curLoginUser"))
    },
    curLoginUserId(){
      return this.hasLoginUser?JSON.parse(localStorage.getItem("curLoginUser")).user_id:null
    },
    curLoginUser(){
      return this.hasLoginUser?JSON.parse(localStorage.getItem("curLoginUser")):null;
    },
    displayName(){
      if(checkObj(this.person.user_name))
        return this.person.user_name
      else {
        return this.person.phone_number.slice(0,3) + "****" +
          this.person.phone_number.slice(this.person.phone_number.length - 3,this.person.phone_number.length)
      }
    },
    displayBrief(){
      if(checkObj(this.person.brief))
        return this.person.brief
      else
        return ""
    }
  },
}
</script>

<style lang="less" scoped>
.shade_outFrame {
  transition-property: opacity;
  transition-duration: 200ms;
  transition-timing-function: ease;
  opacity: 1;
  background-color: rgba(0,0,0,.851);
  position: fixed;
  inset: 0rem;
  border-radius: 0rem;
  z-index: 200;
  pointer-events: auto;
}

.cancelButton {
  top: 70px;
  right: calc(50vw - 290px);
  position: absolute;
  -webkit-tap-highlight-color: transparent;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  cursor: pointer;
  appearance: none;
  font-size: 1rem;
  text-align: left;
  text-decoration: none;
  box-sizing: border-box;
  border-radius: 0.25rem;
  padding: 0;
  line-height: 1;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  min-height: 1.375rem;
  min-width: 1.375rem;
  border: 0.0625rem solid transparent;
  background-color: transparent;
  color: rgb(134, 142, 150);
  margin-left: auto;
  margin-right: 0px;
  width: 2.25rem;
  height: 2.25rem;
  text-transform: none;
  overflow: visible;
}

.mannuel_model_inner {
  padding: 0;
  border-radius: 0.75rem;
  overflow: hidden;
  margin-top: 70px;
  position: fixed;
  width: 100%;
  top: 0px;
  bottom: 0px;
  max-height: 100%;
  z-index: 200;
  pointer-events: none;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  align-items: flex-start;
}

.shade_section {
  transition-property: transform, opacity;
  transition-duration: 200ms;
  transition-timing-function: ease;
  transform-origin: center center;
  opacity: 1;
  transform: scale(1);
  background-color:#fff;
  border-radius: 0.75rem;
  overflow-x: hidden;
  outline: 0;
  -webkit-tap-highlight-color: transparent;
  display: block;
  text-decoration: none;
  color: rgb(0, 0, 0);
  box-sizing: border-box;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0.0625rem 0.1875rem, rgba(0, 0, 0, 0.05) 0px 2.25rem 1.75rem -0.4375rem, rgba(0, 0, 0, 0.04) 0px 1.0625rem 1.0625rem -0.4375rem;
  pointer-events: all;
  max-width: 100%;
  max-height: calc(100vh - (5vh * 2));
}

.section_box {
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: flex-start;
  background-color: #fff;
  border-radius: 0.75rem;
}

.main_content{
  overflow-y: auto;
  background-color: #fff;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  font-size: 14px;
  line-height: 1.5714285714285714;
  word-wrap: break-word;
  padding: 0;
  .edit_content{
    position: relative;
    font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji';
    font-size: 14px;
    box-sizing: border-box;
    transition: opacity 0.3s;
  }
}
.back-img {
  width: 100%;
  height: 108px;
  border-style: none;
  vertical-align: middle;
  max-width: 100%;
  display: block;
}
.potrait_line{
  align-items: center;
  flex-direction: column;
  height: 2.75rem;
  display: flex;
  margin-bottom: 1rem;
  position: relative;
}
.chooseTitleImgButton {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  transition-duration: .15s;
  --tw-text-opacity: 1;
  color: rgb(34, 34, 34);
  line-height: 3rem;
  font-weight: 500;
  font-size: 1rem;
  text-align: center;
  --tw-bg-opacity: 1;
  background-color: rgb(241, 242, 248);
  border-width: 0;
  border-radius: 0.5rem;
  height: 3rem;
  -webkit-appearance: button;
  text-transform: none;
  overflow: visible;
  font-family: sans-serif;
  margin: 0;
  cursor: pointer;
  background-image: none;
}

.title-img {
  top:-44px;
  position: absolute;
  background-color: rgb(255, 255, 255);
  background: linear-gradient(to right, rgb(233, 243, 247), rgba(70, 72, 73, 0.8));
  padding: 0.1rem;
  border-radius: 9999px;
  cursor: pointer;
}

.title-img img {
  width: calc(76px);
  height: calc(76px);
  border-width: 3.33px;
  border-color: rgb(255, 255, 255);
  -o-object-fit: cover;
  object-fit: cover;
  border-style: solid;
  border-radius: 9999px;
  justify-content: center;
  align-items: center;
  display: flex;
  vertical-align: middle;
  max-width: 100%;
}

.form-main {
  margin: 10px 20px;
}

.flex-row {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.flex-button {
  width: 220px;
}

.blue-back {
  background-color: rgb(23,62,255);
}

.white-word {
  color: #fff;
}
.input-color {
  background-color: #f2f5f9;
}
</style>
