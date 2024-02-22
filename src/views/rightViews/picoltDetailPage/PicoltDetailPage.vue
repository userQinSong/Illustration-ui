<template>
  <div style="padding: 0"
       class="rt-songs"
       ref="scroll"
       v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(255, 255, 255, 1)"
  >
    <div class="main-page">
      <ShadeMsgBox
        ref="shadeBox"
        :pic_list="singlePicList"
        :blog-id="blogDetail.user_id"
      />
      <div class="title-msg">
        <!--      标题栏-->
        <div class="title_line">
          <div class="span-dom title">{{ picoltDetail.picolt_name }}</div>
          <img class="recommend_img" :src="require('@/assets/img/illustration/recommend2.png')"/>
          <div class="span-dom small-button" >
            <el-button class="set-other-btn un-pointer">
              <i class="qin-icondownload" style="font-size: 14px">&nbsp;{{ simplyNumber(picoltDetail.picolt_download) }}</i>
            </el-button>
          </div>
          <div class="span-dom small-button">
            <el-button class="set-other-btn un-pointer">
              <i class="qin-iconpic" style="font-size: 14px">&nbsp;{{ simplyNumber(picoltDetail.picolt_count) }}</i>
            </el-button>
          </div>
          <div class="span-dom small-button" @click="changeLike">
            <el-button class="set-other-btn" v-if="!picoltAttitude._like">
              <i class="qin-iconheart" style="font-size: 14px">&nbsp;{{ simplyNumber(picoltDetail.picolt_love) }}</i>
            </el-button>
            <el-button class="set-other-btn" v-if="picoltAttitude._like">
              <i class="qin-iconheart-fill color-red" style="font-size: 14px">&nbsp;{{ simplyNumber(picoltDetail.picolt_love) }}</i>
            </el-button>
          </div>
        </div>
        <!--      标签栏-->
        <div style="display: flex;flex-direction: row;margin-top: 7px">
          <el-tag v-for="item in tag_list" class="un-pointer">{{item}}</el-tag>
        </div>
      </div>
      <!--      主体信息-->
      <div class="main-msg">
<!--        左边大盒子-->
        <div style="width: 775px">
          <div class="ant-tabs-nav">
            <div class="ant-tab-dom">
              最近更新：{{picoltDetail.renew_time}}
            </div>
            <div class="ant-tab-dom">
              首次发布：{{picoltDetail.create_time}}
            </div>
          </div>
          <div class="pic-show-box">
            <PicSwiper
              :display-count=2
              :width=775
              :pic_list="picList"
              :click-fn="openShadeBox"
            />
          </div>
          <div class="picolt_introduction" v-if="picoltDetail.brief_intro !== null && picoltDetail.brief_intro !== ''">
            <span>简介：</span>{{picoltDetail.brief_intro}}
          </div>
          <Comment :blog_id="blog_id"/>
        </div>
<!--        右边大盒子-->
        <div class="creator-box">
          <CreatorMsgBox :creator_id="blogDetail.user_id"/>
          <div class="btn-line">
            <el-button class="gray-btn" @click="changeLike">
              <i class="qin-iconheart" v-if="!picoltAttitude._like"> 添加至喜欢</i>
              <i class="qin-iconheart-fill color-red" v-else-if="picoltAttitude._like"> 已添加</i>
            </el-button>
            <el-button class="gray-btn blue el-progress" style="margin-right: 0" @click="downloadAllImages">
              <i class="qin-icondownload">&nbsp;下载（{{ getTotalPicSize }}）</i>
              <el-progress
                :percentage="percentage"
                type="circle"
                :stroke-width="2"
                :width="30"
                v-show="percentage > 0"
              ></el-progress>
              <ProgressColor :style="{'width':0,'height':0}"/>
            </el-button>
          </div>
<!--          校验栏-->
          <div class="verify-line">
            <div class="verify-line-left">
              <img
                style="width: 14px;height: 14px"
                :src="require('@/assets/img/illustration/verify.png')"
                alt=""/>
              <span class="ver-word" style="margin-left: 2px">已验证：2024/01/02</span>
            </div>
            <div class="verify-line-right">
              <span class="ver-word">safetensors</span>
            </div>
          </div>
          <Description :picoltDetail="picoltDetail" v-loading="picolt_loading" v-if="!picolt_loading"/>
          <ToleranceRange/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PicSwiper from "@/components/illustration/lunbo/PicSwiper";
import CreatorMsgBox from "@/components/illustration/msgBox/CreatorMsg";
import Description from "@/components/illustration/description/Description";
import ToleranceRange from "@/components/illustration/toleranceRange/ToleranceRange";
import CommentInput from "@/components/illustration/comment/CommentInput";
import Comment from "@/components/illustration/comment/Comment";
import {changePicoltAttitude, getPicListByPicoltId} from "@/network/illustration/picolts";
import {getPicoltDetail} from "@/network/illustration/picolts";
import {checkObj, getBase64} from "@/common/uctil";
import {simpleNumber} from "@/common/uctil";
import {spaceNumFormat} from "@/common/uctil";
import JSZip from 'jszip'
import saveAs from 'file-saver'
import MySwiper from "@/components/illustration/lunbo/PicSwiper";
import ProgressColor from "@/common/progressColor";
import SinglePicSwiper from "@/components/illustration/lunbo/SinglePicSwiper";
import ShadeMsgBox from "@/components/illustration/msgBox/ShadeMsgBox";

export default {
  name: "PicoltDetailPage",
  components: {
    ShadeMsgBox,
    SinglePicSwiper,
    ProgressColor, MySwiper, Comment, CommentInput, ToleranceRange, Description, CreatorMsgBox, PicSwiper},
  data(){
    return {
      pic_loading:true,
      picolt_loading:true,
      picList:[],//大轮播栏
      singlePicList:[],//单体小轮播
      downloadImgList:[],//下载图片列表
      localSuffixList:[],//本地后缀列表
      picoltDetail:{},//图集的详细信息
      blogDetail:{},//博主详细信息
      relationDetail:{},//博主与图集关系详细信息
      picoltAttitude:{},//博主关于本图集的态度（喜欢，收藏）
      blog_id:"",//博主id
      carouselHeight: '',//轮播图高度
      tag_list:["动漫","二次元","风趣"],//图集标签列表
      change_attitude_array:["like","collect","down"],
      percentage:0, //进度条的占比
    }
  },
  created() {
    if(this.$route.params.picolt_id != null)
      this.blog_id = this.$route.params.picolt_id;
    else
      //在页面加载时读取localStorage里的状态信息
      this.blog_id = localStorage.getItem("picolt_id");
    window.addEventListener("beforeunload",()=>{
      localStorage.setItem("picolt_id",this.blog_id)
    })
    this.getPicList(this.blog_id);//获取图片列表信息，用于展示大轮播图，与图片详情单轮播图
    this.getPicoltDetail(this.blog_id);//获取插画集详情
  },
  methods: {
    simplyNumber(num){
      return simpleNumber(num)
    },
    openShadeBox:function(pic_id){
      this.$refs.shadeBox.openWithPicId(pic_id);
    },
    changeLike(){
      if(!this.hasLoginUser){
        this.$message.error("当前用户未登录，不可操作！")
        return;
      }
      this.picoltAttitude._like = !this.picoltAttitude._like
      if(this.picoltAttitude._like){
        this.picoltDetail.picolt_love += 1
      } else{
        this.picoltDetail.picolt_love -= 1
      }
      this.sendChangePicoltAttitude(this.change_attitude_array[0])
    },
    sendChangePicoltAttitude(changeType,add_down_count=0){
      changePicoltAttitude({
          picolt_id:this.blog_id,
          attitude_person_id:this.curLoginUserId,
          change_type:changeType,
          add_down_count:add_down_count
        }).then(res => {
        if(res.code === 200){
          if(changeType === this.change_attitude_array[0]){
            if(this.picoltAttitude._like){
              this.$message.success("添加至喜爱成功！");
            } else
              this.$message.success("取消喜爱成功！")
          }else if(changeType === this.change_attitude_array[2]){
            this.$message.success("下载图集成功！");
          }
          this.$bus.$emit("changePersonMsgBox")
        }else{
          this.$message.error("网络波动！修改喜爱信息失败")
        }
      })
    },
    //获取图片列表信息----用于展示图集下所有图片
    getPicList(picolt_id){
      getPicListByPicoltId({
        picolt_id:picolt_id,
        attitude_person_id:this.curLoginUserId,
      }).then(res => {
        if(res.code === 200){
          console.log("获取插画集："+picolt_id+"成功！",res.data)
          this.picList = [];
          this.singlePicList = [];
          res.data.forEach(item => {
            this.picList.push({
              ...item.picVo
            })
            this.singlePicList.push({
              ...item.picVo,
              _like:checkObj(item.attitude)?item.attitude._like:false,
              _collect:checkObj(item.attitude)?item.attitude._collect:false,
              user_id:item.user.user_id,
            })
          })
          this.$nextTick(()=>{
            if(this.picList.length !== 0)
              this.pic_loading = false;
          })
        }else{
          console.log("获取插画集："+picolt_id+"失败！",res.error)
        }
      })
    },
    //获取图集信息详情---绑定一个picolt_loading用于图集详情加载
    getPicoltDetail(picolt_id){
      getPicoltDetail({
        picolt_id:picolt_id,
        attitude_person_id:this.hasLoginUser?JSON.parse(localStorage.getItem("curLoginUser")).user_id:null,
      }).then(res => {
        if(res.code === 200){
          console.log("获取picoltDetail详情成功！",res.data)
          this.relationDetail = res.data.relation//博主与图集关系详细
          this.tag_list = res.data.tagArray;//图集标签栏
          this.blogDetail = res.data.creator;//博主信息
          this.picoltDetail = res.data.picolt;//图集信息
          this.picoltAttitude = res.data.attitude;
          this.$nextTick(()=>{
            this.picolt_loading = false;
          })
        }else {
          console.log("获取picoltDetail详情失败！",res.error)
        }
      })
    },

    showDownloadHint(url,fileName){
      var a = document.createElement("a"); // 生成一个a元素
      var event = new MouseEvent("click"); // 创建一个单击事件
      a.download = fileName || "photo"; // 设置图片名称
      a.href = url; // 将生成的URL设置为a.href属性
      a.dispatchEvent(event); // 触发a的单击事件
      console.log("下载图片结束：",fileName)
    },
    downloadAllImages(){
      if(!this.hasLoginUser){
        this.$message.error("当前用户未登录，无法下载")
        return
      }
      this.localSuffixList = [];
      if(this.percentage === 0){
        this.downloadImgList = [];
        this.picList.forEach((item,index) => {
          let tailSuffix = item.pic_src.substring(item.pic_src.lastIndexOf('.'))
          if(tailSuffix.substring(0,4) === '.com')
            tailSuffix = ".jpg"
          this.localSuffixList[index] = tailSuffix;
          this.downloadImgList.push(this.preResolveUploadImage(item.pic_src));
        })
        this.$nextTick(()=>{
          this.handleDownloadAll(this.downloadImgList);
        })
      }else return
    },
    preResolveUploadImage(url){
      return "http://localhost:8080/illustration/upload/getUploadImg/" + window.btoa(url);
    },
    // 批量下载图片
    handleDownloadAll(imgList) {
      const that = this
      var imgBase64 = []
      var zip = new JSZip()
      var img = zip.folder(that.picoltDetail.picolt_name)
      const percentageAdd = Math.floor(100/imgList.length);
      for (var i = 0; i < imgList.length; i++) {
        console.log("正在执行" + imgList[i] + "的解析工作")
        getBase64(imgList[i])
          .then(base64 => {
            imgBase64.push(base64.substring(22))
            this.percentage += percentageAdd;
          }, err => {
            console.log(err) // 打印异常信息
          })
      }
      function tt () {
        setTimeout(()=> {
          if (imgList.length === imgBase64.length) {
            for (var i = 0; i < imgList.length; i++) {
              // 设置文件名
              img.file(
                imgList[i].substring(imgList[i].lastIndexOf('/') + 1,imgList[i].length) + that.localSuffixList[i],
                imgBase64[i],
                { base64: true }
                )
            }
            zip.generateAsync({ type: 'blob' }).then(function (content) {
              // see FileSaver.js
              saveAs(content,  that.picoltDetail.picolt_name+'.zip')
              that.$message.success(`成功下载${imgList.length}张图片！`)
              //向后端添加该用户对当前下载图集的下载次数加1
              that.sendChangePicoltAttitude(that.change_attitude_array[2],1)
              that.picoltDetail.picolt_download += 1
              that.$bus.$emit("changePersonMsgBox")
              that.percentage = 100;
              setTimeout(()=>{
                that.percentage = 0
              },1000)
            })
          } else {
            tt()
          }
        }, 100);
      }
      tt()
    },
  },
  computed:{
    getTotalPicSize(){
      let totalSpaceSize = 0;
      this.picList.forEach(item => {
        totalSpaceSize += item.pic_space_size;
      })
      return spaceNumFormat(totalSpaceSize)
    },
    loading(){
      return this.picolt_loading
    },
    hasLoginUser(){
      return checkObj(localStorage.getItem("curLoginUser"))
    },
    curLoginUserId(){
      return this.hasLoginUser?JSON.parse(localStorage.getItem("curLoginUser")).user_id:null
    }
  }
};
</script>
<style scoped lang="less">
.title span {
  margin: 0 8px;
}
.rt-songs {
  width: 100%;
  height: 100%;
  text-align: center;
  margin: 0 auto;
}
.main-page {
  /*width: calc(100% + 5px);*/
  display: inline-block;
  width: 1219px;
  height: 1300px;
  margin-top: 10px;
  padding: 10px 22px 5px 22px;
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

.set-other-btn{
  color: #606266;
  background-color: #e5e7eb;
  padding: 5px 15px;
  border: none;
  border-radius: 20px;
}
.recommend_img {
  width: 75px;
  height: 37.5px;
  margin-right: -10px;
  border-style: none;
  vertical-align: middle;
}

.un-pointer {
  cursor: default;
}

.l-icon {
  width: 14px;
  height: 14px;
  margin-top: 2px
}

.el-tag {
  flex-shrink: 0;
  box-sizing: content-box;
  height: 21px;
  margin-right: 7px;
  margin-bottom: 10px;
  padding: 2px 8px;
  color: #557abf;
  font-size: 12px;
  font-weight: 500;
  line-height: 21px;
  border-radius: 4px;
  border-top: none;
  background: #ebf2ff;
}

.small-button {
  margin-left: 10px;
  margin-top: 3px;
}

.title_msg{
  margin-top: 10px;
  padding-left: 22px;
  padding-right: 22px;
  margin-bottom: 6px;
}

.pic-show-box {
  width: auto;
}

.ant-tabs-nav {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding-bottom: 7px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 15px;
}

.ant-tab-dom {
  color: #999;
  font-size: 12px;
  font-weight: 400;
  word-wrap: break-word;
  padding-top: 18px;
}

.main-msg {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.creator-box {
  height: 200px;
  flex: 1;
  margin-left: 20px;
  margin-top: 18px;
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
  border: none;
  font-size: 16px;
  padding: 0;
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

.verify-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 14px;
  margin-top: 4px;
  color: #999;
}

.verify-line-left {
  display: flex;
  align-items: center;
}

.verify-line-right {
  display: flex;
  align-items: center;
}

.ver-word {
  transform-origin: left;
  font-size: 12px;
}

.picolt_introduction {
  padding: 10px;
  max-height: 276px;
  margin-top: 14px;
  overflow: hidden;
  text-align: left;
  line-height: 30px;
  word-break: break-all;
  word-wrap: break-word;
  font-family: PingFang SC;
}

.dismantle /deep/ .el-progress-circle {
  // 进度条颜色
  svg > path:nth-child(2) {
    stroke: url(#dismantle);  // 该url() 中填入的是, 对应组件中的 id 名
  }
}
.blue /deep/ .el-progress-circle {
  // 进度条颜色
  svg > path:nth-child(2) {
    stroke: url(#blue);  // 该url() 中填入的是, 对应组件中的 id 名
  }
}
</style>
