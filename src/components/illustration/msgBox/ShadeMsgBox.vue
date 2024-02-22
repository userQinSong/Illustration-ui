<template>
  <div ref="shade" class="shade_outFrame" v-show="isDisplay">
    <button class="cancelButton" @click="close">
      <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIiBmaWxsPSJub25lIj4KICA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEzLjMzMTcgMTIuMjYwMUMxMy4wMzg4IDExLjk2NzIgMTIuNTYzOSAxMS45NjcyIDEyLjI3MSAxMi4yNkMxMS45NzgxIDEyLjU1MjkgMTEuOTc4IDEzLjAyNzggMTIuMjcwOSAxMy4zMjA3TDE0LjkzODEgMTUuOTg4NUwxMi4yNzQ0IDE4LjY1MjJDMTEuOTgxNSAxOC45NDUxIDExLjk4MTUgMTkuNDIgMTIuMjc0NCAxOS43MTI5QzEyLjU2NzMgMjAuMDA1OCAxMy4wNDIxIDIwLjAwNTggMTMuMzM1IDE5LjcxMjlMMTUuOTk4NyAxNy4wNDkyTDE4LjY2NTYgMTkuNzE2N0MxOC45NTg0IDIwLjAwOTYgMTkuNDMzMyAyMC4wMDk3IDE5LjcyNjIgMTkuNzE2OEMyMC4wMTkxIDE5LjQyMzkgMjAuMDE5MiAxOC45NDkxIDE5LjcyNjMgMTguNjU2MUwxNy4wNTkzIDE1Ljk4ODZMMTkuNzI0NCAxMy4zMjM1QzIwLjAxNzIgMTMuMDMwNiAyMC4wMTcyIDEyLjU1NTggMTkuNzI0NCAxMi4yNjI5QzE5LjQzMTUgMTEuOTcgMTguOTU2NiAxMS45NyAxOC42NjM3IDEyLjI2MjlMMTUuOTk4OCAxNC45Mjc4TDEzLjMzMTcgMTIuMjYwMVoiIGZpbGw9IiNBMUFCQzkiIGZpbGwtb3BhY2l0eT0iMC44Ii8+CiAgPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTMiIHN0cm9rZT0iI0ExQUJDOSIgc3Ryb2tlLW9wYWNpdHk9IjAuOCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K"/>
    </button>
    <div class="mannuel_model_inner" @click.stop>
      <div class="shade_section">
        <div class="section_box">
          <div class="left-box" v-if="!loading" v-loading="loading">
            <SinglePicSwiper
              :display-count=1
              :width="pic_width"
              :pic_list="picList"
              :display-index.sync="currentIndex"
            />
            <div class="btn-line">
              <el-button class="gray-btn"
                         @click="likeImgae(curDisplayUserMsg)"
              >
                <i v-if="!curDisplayUserMsg._like" class="qin-iconlike">&nbsp;喜欢（{{getLikeCount}}）</i>
                <i v-if="curDisplayUserMsg._like" class="qin-iconheart-fill color-red">&nbsp;已添加（{{getLikeCount}}）</i>
              </el-button>
              <el-button class="gray-btn" style="margin-right: 0"
                         @click="downloadImage(curDisplayUserMsg)">
                <i class="qin-icondownload">&nbsp;下载（{{ getDownLoadSpaceSize }}）</i>
              </el-button>
            </div>
          </div>
          <div class="right-box">
            <CreatorMsgBox v-if="!loading_user" :creator_id="creatorId"/>
            <PicDetail
              style="margin-top: 0.75rem"
              v-if="!loading"
              :cur-display-msg="curDisplayUserMsg"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SinglePicSwiper from "@/components/illustration/lunbo/SinglePicSwiper";
import CreatorMsgBox from "@/components/illustration/msgBox/CreatorMsg";
import {checkObj, getBase64, spaceNumFormat} from "@/common/uctil";
import {simpleNumber} from "@/common/uctil";
import PicDetail from "@/components/illustration/description/PicDetail";
import {changePicAttitude} from "@/network/illustration/picolts";
import {preloadPics} from "@/common/uctil";

export default {
  name: "ShadeMsgBox",
  components: {PicDetail, CreatorMsgBox, SinglePicSwiper},
  data(){
    return {
      picList:[],
      pic_width:320,
      change_attitude_array:["like","collect","down"],
      isDisplay:false,
      currentIndex:0,
      creatorId:'',
      loading:true,
      loading_user:true,
      changeItem: {
        //用于修改waterfall-list的某元素值，需要设置如下对象
        /*必须*/id:null,
        user_name:null,
        potrait_src:null,
        pic_src:null,
        pic_name:null,
        pic_count:null,
        like_count:null,
        down_count:null,
        is_like:null
      }
    }
  },
  props:{
    pic_list: Array,
    blogId:String,
  },
  methods:{
    //态度模块
      preResolveUploadImage(url){
        return "http://localhost:8080/illustration/upload/getUploadImg/" + window.btoa(url);
      },
      //下载模块
      downloadImage:function (param) {
        if(!this.hasLoginUser) {
          this.$message.error("当前用户未登录，无法下载")
          return
        }
        let suffix = param.pic_src.substring(param.pic_src.lastIndexOf('.'),param.pic_src.length)
        getBase64(this.preResolveUploadImage(param.pic_src)).then(base64 => {
          this.showDownloadHint(base64,param.pic_name + suffix)
          param.down_count += 1
          this.displayDown(param)
          this.attitudeChangeHandler(param,"down")
        })
      },
      //喜欢模块
      likeImgae:function (param) {
        if(!this.hasLoginUser) {
          this.$message.error("当前用户未登录，请登录再试")
          return
        }
        this.displayLike(param)
        this.attitudeChangeHandler(param,"like");
      },
      showDownloadHint(url,fileName){
        var a = document.createElement("a"); // 生成一个a元素
        var event = new MouseEvent("click"); // 创建一个单击事件
        a.download = fileName || "photo"; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
        this.$message.success("下载成功！")
        console.log("下载图片结束：",fileName)
      },
      attitudeChangeHandler(param,changeType){
        changePicAttitude({
          pic_id:param.pic_id,
          attitude_person_id:this.loginUser.user_id,
          change_type:changeType,
          add_down_count:1
        }).then(res => {
          if(res.code === 200){
            if(changeType === this.change_attitude_array[0]){
              if(this.curDisplayUserMsg._like){
                this.$message.success("添加至喜爱成功！");
              } else
                this.$message.success("取消喜爱成功！")
            }else if(changeType === this.change_attitude_array[2]){
              this.$message.success("下载图片成功！");
            }
            this.$bus.$emit('changePersonMsgBox')
          }else{
            this.$message.error("网络波动！修改喜爱信息失败")
          }
        })
      },
      displayLike(param){
        param._like = !param._like
        if(param._like){
          param.like_count += 1
        }else{
          param.like_count -= 1
        }
        this.$nextTick(()=>{
          let changeItem = JSON.parse(JSON.stringify(this.changeItem))
          changeItem.id = param.pic_id
          changeItem.like_count = param.like_count
          changeItem.is_like = param._like
          this.$nextTick(()=>{
            this.$bus.$emit('changeListItem',changeItem);
          })
        })
      },
      displayDown(param){
        let changeItem = JSON.parse(JSON.stringify(this.changeItem))
        changeItem.id = param.pic_id
        changeItem.down_count = param.down_count
        this.$nextTick(()=>{
          this.$bus.$emit('changePersonMsgBox',changeItem)
          this.$bus.$emit('changeListItem',changeItem);
        })
      },
    //格式化文字模块
      simplySpaceNum(num) {
        return spaceNumFormat(num);
      },
      simplyNumber(num){
        return simpleNumber(num);
      },
    //打开,关闭方法模块
      openWithPicId(pic_id){
        this.picList.forEach((item,index) => {
          if(item.pic_id === pic_id)
            this.currentIndex = index
        })
        this.$nextTick(()=>{
          this.isDisplay = true;
        })
      },
      close(){
        this.isDisplay = false;
      },
    // 预加载 设置并保存图片宽高
      preload(){
        preloadPics(this.picList,this.pic_width).then(resp => {
          console.log("获取到了预组装图片请求后的图片resp:",resp)
          this.picList = resp;
          this.$nextTick(()=>{
            this.loading = false;
            this.preLoadCreator()
          })
        })
      },
      preLoadCreator(){
        this.creatorId = this.curDisplayUserMsg.user_id;
        this.loading_user = false;
      }
  },
  computed:{
    hasLoginUser(){
      return checkObj(localStorage.getItem("curLoginUser"))
    },
    loginUser(){
      if(checkObj(localStorage.getItem("curLoginUser"))){
        return JSON.parse(localStorage.getItem("curLoginUser"))
      }else
        return null;
    },
    getDownLoadSpaceSize(){
      if(this.picList.length > this.currentIndex)
        return this.simplySpaceNum(this.picList[this.currentIndex].pic_space_size);
      else
        return
    },
    getLikeCount(){
      if(this.picList.length > this.currentIndex)
        return this.simplyNumber(this.picList[this.currentIndex].like_count)
      else
        return
    },
    curDisplayUserMsg(){
      return this.picList[this.currentIndex]
    }
  },
  watch:{
    pic_list:{
      deep:true,
      immediate:true,
      handler(newList,oldList){
        console.log("进入watch:",newList)
        if(checkObj(newList) && newList.length !== 0){
          this.picList = newList;
          this.creatorId = this.picList[this.currentIndex].user_id
          this.loading_user = false;
          //发现更新后重新组装宽高
          this.preload();
          console.log("watch后：isDisplay",this.isDisplay)
        }
      }
    },
    currentIndex:{
      handler(newIndex){
        //图片改变后自动切换创建者
        let obj = this.picList[newIndex];
        if(checkObj(obj)){
          console.log("发现pic_list自带user_id:",obj.user_id)
          this.creatorId = obj.user_id
        }
      }
    }
  },
}
</script>

<style scoped>
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
  overflow-y: auto;
  outline: 0;
  -webkit-tap-highlight-color: transparent;
  display: block;
  text-decoration: none;
  color: rgb(0, 0, 0);
  box-sizing: border-box;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0.0625rem 0.1875rem, rgba(0, 0, 0, 0.05) 0px 2.25rem 1.75rem -0.4375rem, rgba(0, 0, 0, 0.04) 0px 1.0625rem 1.0625rem -0.4375rem;
  pointer-events: all;
  flex: 0 0 820px;
  max-width: 100%;
  max-height: calc(100vh - (5vh * 2));
}

.section_box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  background-color: #fff;
  border-radius: 0.75rem;
  width: 820px;
  margin-top: 0.5rem;
}

*, *::before, *::after {
  box-sizing: border-box;
}

.left-box {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.right-box {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 474px;
  height: 500px;
  margin-left: 20px;
}

.btn-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  margin-bottom: 8px;
}

.gray-btn {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 56px;
  font-weight: 500;
  font-size: 16px;
  padding: 0;
  border: none;
  background: #eceef5;
  border-radius: 8px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  color: #222;
}

.gray-btn:hover {
  background: #f1f2f8;
}

.cancelButton {
  top: 70px;
  right: calc(50vw - 455px);
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

button:not(.rigid) {
  transition-property: color,background-color,border-color,text-decoration-color,fill,stroke;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
  transition-duration: .15s;
}
[type=button], [type=reset], [type=submit], button {
  -webkit-appearance: button;
  background-image: none;
}

.cancelButton img {
  height: 32px;
  width: 32px;
  border-style: none;
  vertical-align: middle;
  max-width: 100%;
  display: block;
}
</style>
