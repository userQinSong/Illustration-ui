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
              <div class="form-main">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm" @submit.native.prevent>
                  <div class="form-header">
                    <span class="form-header-word">上传我的图片</span>
                  </div>
                  <el-form-item prop="imgFileList">
                    <el-upload
                      class="upload-drag"
                      ref="upload" action="https://jsonplaceholder.typicode.com/posts/" multiple
                      :limit="limit" :file-list="ruleForm.imgFileList" list-type="picture-card"
                      :on-preview="handlePreview"
                      :on-change="OnChange"
                      :on-remove="handleRemove"
                      accept="image/jpeg,image/png" :auto-upload="false"
                     >
                        <i slot="default" class="el-icon-plus"></i>
                        <div slot="file" slot-scope="{file}">
                          <img
                            class="el-upload-list__item-thumbnail"
                            :src="file.pic_src" alt=""
                          >
                          <span class="el-upload-list__item-actions">
                            <span
                              class="el-upload-list__item-preview"
                              @click="handlePreview(file)">
                              <i class="el-icon-zoom-in"></i>
                            </span>
                            <el-popover
                              placement="bottom"
                              title="图片详情"
                              width="300"
                              trigger="hover"
                            >
                              <div>
                                <PicEditForm :cur-display-msg.sync="file"/>
                              </div>
                              <span class="el-upload-list__item-preview" slot="reference">
                                <i class="el-icon-edit" ></i>
                              </span>
                            </el-popover>
                            <span
                              v-if="!disabled"
                              class="el-upload-list__item-delete"
                              @click="handleRemove(file)"
                            >
                              <i class="el-icon-delete"></i>
                            </span>
                          </span>
                        </div>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，最多上传{{limit}}张且单张图片不超过5M
                      </div>
                    </el-upload>
                  </el-form-item>
                  <el-form-item label="画集名称" prop="name">
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
                  <el-form-item label="画集标签" prop="tags">
                    <el-select v-model="ruleForm.tags"
                               multiple
                               @change="display"
                               :multiple-limit="select_limit"
                               placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                    <div class="el-upload__tip">至少选择一个标签，最多选择{{select_limit}}个标签</div>
                  </el-form-item>
                  <el-form-item class="flex-row">
                    <button @click="submitForm" class="chooseTitleImgButton blue-back white-word flex-button">发布</button>
                  </el-form-item>
                </el-form>
                <el-dialog :visible.sync="dialogVisible" append-to-body>
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
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
import {checkObj, docSimpleName} from "@/common/uctil";
import PicDetail from "@/components/illustration/description/PicDetail";
import PicEditForm from "@/components/illustration/form/PicEditForm";
import {mapState} from "vuex";
import {uploadPicolt} from "@/network/illustration/picolts";
import * as axios from "axios";

export default {
  name: "UploadForm",
  components: {PicEditForm, PicDetail, PersonFanItem},
  props:{
    changeAttitude:Function
  },
  data() {
    return {
      isDisplay:false,
      loading: false,
      tag_loading:true,
      disabled: false,
      dialogVisible: false,
      select_limit:5,
      max_size:50,//mb
      dialogImageUrl: '',
      person:{},
      limit:20,
      ruleForm: {
        name: '',
        desc: '',
        tags:[],
        imgFileList:[]
      },
      rules: {
        imgFileList: [
          {required: true,validator:this.imgArrayValidator, trigger: 'blur' },
          {required: true,validator:this.imgArrayNameValidator, trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请填写名字', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        desc: [
          { required: false, message: '简介不能含有违规字符', trigger: 'blur' }
        ],
        tags:[
          {type:'array',required:true,message:'画集至少包含一个标识',trigger:'blur'}
        ],
      },
    };
  },
  methods:{
    display(){
      console.log("当前tags:",this.ruleForm.tags)
    },
    initData(){
      console.log("获取到当前登录用户:",this.curLoginUser)
      this.person = this.curLoginUser;
      this.ruleForm.name = ""
      this.ruleForm.desc = ""
      this.ruleForm.tags = []
    },
    handlePreview(file){
      console.log("@预览中：",file)
      this.dialogImageUrl = file.pic_src;
      this.dialogVisible = true;
    },
    OnChange(file,fileList){
      if(file.size/1024/1024 > this.max_size){
        this.$message.error("单个图片最多不能超过5MB")
        return;
      }
      this.ruleForm.imgFileList.push({
        pic_id:"pic_" + file.uid,
        pic_src:file.url,
        pic_name:docSimpleName(file.name),
        pic_space_size:file.size,
        pic_type:"平面插画",
        raw:file.raw
      })
    },

    handleRemove(file,fileList){
      console.log("@删除了：",file,fileList)
      this.ruleForm.imgFileList=this.ruleForm.imgFileList.filter(item=>{
        return item.pic_id !== file.pic_id
      })
      this.$nextTick(()=>{
        console.log("删除后：",this.ruleForm.imgFileList)
      })
    },
    submitForm() {
      this.$refs.ruleForm.validate(pass => {
        if(!pass) {
          this.$message.error("验证失败")
          return;
        }
        this.loading = true;
        let fd = new FormData()
        this.ruleForm.imgFileList.forEach(file=>{
          fd.append("files",file.raw)
        })
        this.$nextTick(()=>{
          axios.post('/illustration/upload/images', fd, {headers: {'Content-Type': 'multipart/form-data'}}).then(res => {
            res = res.data
            console.log("接受到返回信息：",res)
            //上传成功后返回的数据,
            if(res.code === 200){
              let tagString = ""
              //组装多标签字符串
              this.ruleForm.tags.forEach(tag =>{
                tagString += tag + ",";
              })
              //组装上传后的列表
              let list = res.data;
              list.forEach((url,index) =>{
                this.ruleForm.imgFileList[index].pic_src = "http://localhost:29001" + url
              })
              this.$nextTick(()=>{
                console.log("组装后的str:",tagString)
                tagString.slice(0,tagString.length - 1);
                const param = {
                  user_id:this.curLoginUserId,
                  //图集信息
                  picolt_name:this.ruleForm.name,
                  brief_intro:this.ruleForm.desc,
                  picolt_tag:tagString,
                  picolt_cover:this.ruleForm.imgFileList[0].pic_src,
                  //图片信息
                  uploadPicList:this.ruleForm.imgFileList
                }
                console.log("submit前：",param)
                // 执行向后端发送提交生成图集的信息
                uploadPicolt(param).then(res=>{
                  if(res.code === 200){
                    console.log("获取到上传返回信息",res.data);
                    if(res.data){
                      this.loading = false;
                      this.resetAll()
                      this.$message.success("提交成功！")
                    } else{
                      this.loading = false;
                      this.$message.error("提交失败！")
                    }
                  }else{
                    this.loading = false;
                    this.$message.error("网络中断！")
                  }
                })
              })
            }else{
              this.loading = false;
              this.$message.error("上传失败！")
            }
          })
        })

      })
    },
    resetAll(){
      this.ruleForm.imgFileList = [];
      this.ruleForm.name = '';
      this.ruleForm.desc = '';
      this.ruleForm.tags = [];
    },
    //validator校验器方法:
    imgArrayValidator(rule,value,callback){
      // 只判断铅笔是办公用品，只是例子
      if(value===null || value === undefined || value.length === 0){
        callback(new Error("上传的图集至少包含一张图片"))
      }else if(value.length > this.limit){
        callback(new Error("上传的图集至多包含" + this.limit + "张图片"));
      }else
        callback();
    },
    imgArrayNameValidator(rule,value,callback){
      let illegalNameIndexList = []
      value.forEach((item,index) => {
        if(item.pic_name.length > 15)
          illegalNameIndexList.push(index + 1);
      })
      this.$nextTick(()=>{
        if(illegalNameIndexList.length > 0){
          let indexStr = " "
          illegalNameIndexList.forEach(name => {
            indexStr += name + " "
          })
          this.$nextTick(()=>{
            callback(new Error("第"+indexStr+"张图片存在违规名称，请重新检查！"))
          })
        }else
          callback()
      })
    },
    //tool类方法
    open(){
      this.isDisplay = true
    },
    close(){
      this.isDisplay = false
    },
    docSimpleName(docName){
      return docSimpleName(docName);
    }
  },
  created() {
    this.initData(this.person);
    this.$bus.$on('openUploadBox',()=>{
      this.open()
    })
  },
  computed:{
    ...mapState({
      tag_list: state => state.illustration.tag_list,
      type_list: state => state.illustration.type_list
    }),
    options(){
      return this.tag_list.slice(1,this.tag_list.length)
    },
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
    },
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
  right: calc(50vw - 382px);
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
  max-width: 672px;
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
// dialog 去除遮罩层 弹窗底下可点击
/deep/.el-dialog__wrapper {
  pointer-events: none;
}
/deep/.el-dialog {
  pointer-events: auto;
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
  width: 630px;
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
.upload-drag {
  width: 100%;
}
.form-header {
  margin-bottom: 14px;
  color: #333;
  font-size: 20px;
  font-weight: 500;
}
.form-header-word {
  align-self: center;
  margin-bottom: 24px;
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  white-space: nowrap;
  text-align: left;
}
</style>
