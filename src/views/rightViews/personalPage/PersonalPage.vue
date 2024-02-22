<template>
  <div v-if="isCanGetSureUser"
       class="fullPage"
       v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(255, 255, 255, 1)"
  >
    <WaterFallLayout
      ref="waterFall"
      :get-list="getNewList"
      :pointer-fn="curSearchType==='picolt'?intoPicolt:showPicDetail"
      :imgs-array="imgsArray"
      :item-type="curSearchType"
      class="title-layout"
    >
      <div>
        <PicBackLine :back_img_url="curPerson.big_back_img"/>
        <PersonalMsgBox
          class="mainContent"
          v-if="!loading"
          :person-data="curPerson"
          :renew-person-msg="getPersonMsg"
        />
        <CategoryButtons
          class="mainContent mag-bot-10"
          :array="categoryArray"
          :click-fn="changeCategory"
          default-label="发布"
        />
        <div class="longLine mainContent"/>
        <div class="tabs-line mainContent">
          <el-tabs
            v-model="curSearchType"
            @tab-click="changeTab"
          >
            <el-tab-pane label="图集" name="picolt"/>
            <el-tab-pane label="图片" name="pic"/>
          </el-tabs>
        </div>
      </div>
      <ShadeMsgBox
        ref="shadeBox"
        v-if="curSearchType === 'pic' && !pictures_loading"
        :pic_list="picArray"
        :blog-id="null"
      />
    </WaterFallLayout>
  </div>
  <el-empty v-else-if="!isCanGetSureUser"
            description="用户未登录">
      当前没有信息
  </el-empty>
</template>

<script>
import PicBackLine from "@/components/illustration/picBackLine/PicBackLine";
import PersonalMsgBox from "@/components/illustration/msgBox/PersonalMsgBox";
import WaterFallLayout from "@/components/illustration/layoutDisplay/waterFall/WaterFallLayout";
import {getPicListByUserId, getPicoltList} from "@/network/illustration/picolts";
import CategoryButtons from "@/components/illustration/catagory/CategoryButtons";
import {getPersonInfo} from "@/network/illustration/person";
import ShadeMsgBox from "@/components/illustration/msgBox/ShadeMsgBox";
import {checkObj} from "@/common/uctil";
import PersonFanAttentionTable from "@/components/illustration/table/PersonalFanAttentionTable";
export default {
  name: "PersonalPage",
  components: {PersonFanAttentionTable, ShadeMsgBox, WaterFallLayout,PersonalMsgBox, PicBackLine,CategoryButtons},
  data() {
    return {
      curPersonId:'',
      isCanGetSureUser:false,
      curPerson:{},
      curSearchType:"picolt",
      loading:true,
      pictures_loading:true,
      search_picolt_tag:'',
      search_picolt_name:'',
      search_upload:1,
      search_like:0,
      //按钮数组
      categoryArray:['发布','喜欢'],
      //插画数组
      picoltVoArray: [],
      //图片数组,用于waterfall展示
      imgsArray:[],
      //专门用于图片数组
      picArray:[],
      //分页
      pageNum:1,
      pageSize:30,
    };
  },
  methods:{
    changeCategory(catName){
      console.log("personalPage获取到词条1：",catName === '发布')
      console.log("personalPage获取到词条2：",catName === '喜欢')
      if(catName === '发布'){
        this.search_upload = 1;
        this.search_like = 0;
      }else if(catName === '喜欢'){
        this.search_like = 1;
        this.search_upload = 0;
      }
      this.renewImgsList();
      this.getNewList();
    },
    //用于获取插画集列表
    getPicoltList(){
      getPicoltList({
        user_id:this.curPersonId,
        attitude_person_id:this.hasLoginUser?JSON.parse(localStorage.getItem("curLoginUser")).user_id:null,
        search_upload:this.search_upload,
        search_like:this.search_like,
        picolt_name:this.search_picolt_name,
        picolt_tag:this.search_picolt_tag,
        pageNum:this.pageNum,
        pageSize:this.pageSize
      }).then(res => {
        if(res.code === 200){
          console.log("获取插画集成功",res.data)
          res.data.list.forEach(item => {
            this.imgsArray.push({
              picolt_count: item.picolt.picolt_count,
              picolt_cover: item.picolt.picolt_cover,
              picolt_download: item.picolt.picolt_download,
              picolt_collect:item.picolt.picolt_collect,
              picolt_id: item.picolt.picolt_id,
              picolt_love: item.picolt.picolt_love,
              picolt_name: item.picolt.picolt_name,
              picolt_type: item.picolt.picolt_type,
              potrait_src: item.creator.potrait_src,
              user_id:item.creator.user_id,
              user_name: item.creator.user_name,
              is_like:item.attitude._like,
              is_collect:item.attitude._collect,
            });
          })
          this.pageNum++
        }else{
          console.log('获取插画集失败')
        }
      })
    },
    //用于获取图片集列表
    getPicList(){
      getPicListByUserId({
        user_id:this.curPersonId,
        attitude_person_id:this.hasLoginUser?JSON.parse(localStorage.getItem("curLoginUser")).user_id:null,
        search_upload:this.search_upload,
        search_like:this.search_like,
        pageNum:this.pageNum,
        pageSize:this.pageSize
      }).then(res => {
        if(res.code === 200){
          console.log("@@获取插画列表成功",res.data)
          res.data.list.forEach(item => {
            //图片布置water-fall
            this.imgsArray.push({
              picolt_cover: item.picVo.pic_src,
              picolt_download: item.picVo.down_count,
              picolt_collect:item.picVo.collect_count,
              picolt_id: item.picVo.pic_id,
              picolt_love: item.picVo.like_count,
              picolt_name: item.picVo.pic_name,
              picolt_type: item.picVo.pic_type,
              is_like:item.attitude._like,
              is_collect:item.attitude._collect,
              potrait_src: item.user.potrait_src,
              user_id:item.user.user_id,
              user_name: item.user.user_name
            });
            //图片布置picArray用于点击查看图片详情
            this.picArray.push({
              ...item.picVo,
              _like:item.attitude._like,
              _collect:item.attitude._collect,
              user_id:item.user.user_id,
            })
          })
          this.pageNum++
          this.$nextTick(()=>{
            this.pictures_loading = false;
          })
        }else{
          console.log('获取插画列表失败')
        }
      })
    },
    intoPicolt(picolt_id){
      this.$router.push(
        {
          name:'PicoltDetailPage',
          params:{picolt_id:picolt_id}
        }
      )
    },
    showPicDetail(id,user_id){
      console.log("点击了展示图片详情:",id,user_id)
      this.$refs.shadeBox.openWithPicId(id)
    },
    async getPersonMsg(person_id){
      if(checkObj(person_id)){
        getPersonInfo({user_id:person_id}).then(res => {
          if(res.code === 200){
            console.log("获取到id:"+person_id+"的用户信息",res.data)
            this.curPerson = res.data;
            this.loading = false;
          }else{
            console.log("获取id:"+person_id+"的用户信息失败！",res.error)
          }
        })
      }else
        await this.getPersonMsg(this.loginUser.user_id);
    },
    changeTab(tab,event){
      if(tab.name === 'picolt')
        this.curSearchType = 'picolt'
      else if(tab.name === 'pic')
        this.curSearchType = 'pic'
    },
    getNewList(){
      if(this.curSearchType === 'picolt'){
        this.getPicoltList()
      }else if(this.curSearchType === 'pic'){
        this.getPicList()
      }
    },
    renewImgsList(){
      this.imgsArray = [];
      this.pageNum = 1;
      this.picArray=[];
    },
    setLocalWatcher(){
      let _this=this;
      window.addEventListener("setItemEvent",function(e){
        if(e.key==="curLoginUser"){
          console.log("监测到localStorage变化：",e.newValue);
          if(checkObj(e.newValue)){
            _this.$router.go(0)
          }else{
            _this.isCanGetSureUser = false;
          }
        }
      })
    }
  },
  created() {
    this.setLocalWatcher();
    //先看路由里面有人物id没，有就直接渲染
    if(checkObj(this.$route.query.person_id)){
      this.isCanGetSureUser = true;
      this.curPersonId = this.$route.query.person_id
    } //再看当前是否有已经登录的用户，有就直接登录
    else if(checkObj(this.loginUser)){
      this.isCanGetSureUser = true;
      this.curPersonId = this.loginUser.user_id//模拟获取从localStorage上的当前用户
    }//已经确定了当前没有任何用户进入该页面时，打开登录窗口，并阻止该页面加载
    else{
      this.isCanGetSureUser = false;
      this.$bus.$emit("openLoginForm");
    }
    this.$nextTick(()=>{
      if(this.isCanGetSureUser){
        console.log("实际获得到:",this.curPersonId)
        this.getPersonMsg(this.curPersonId);
      }
    })
  },
  watch:{
    curSearchType(newVal){
      this.renewImgsList();
      this.getNewList()
    },
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
    }
  },
}
</script>

<style scoped lang="less">
.mainContent {
  margin-left: 1.5rem;
  margin-right: 1.5rem;
  position: relative;
  display: block;
}
.longLine {
  border-bottom: 1px solid #ecedf5;
  margin-bottom: 8px;
}
.tabs-line {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.tabs {
  text-align: center;
  position: relative;
}
.el-tabs{
  display: inline-block;
  position: relative;
  height: 23px;
  --tw-bg-opacity: 1;
  justify-content: center;
  align-items: center;
  background-color: rgb(241,242,248);
  font-weight: 400;
  border-radius: 30px;
  padding: 3px;
  color: #000;
}

.mag-bot-10{
  margin-bottom: 10px;
}

::v-deep .el-tabs__item {
  line-height: 23px !important;
  font-size: .75rem;
  text-align: center;
  height: auto;
}
/* 去除灰色横条 */
::v-deep .el-tabs__nav-wrap::after {
  position: static !important;
}
/* 设置滑块颜色 */
::v-deep .el-tabs__active-bar{
  height: 0;
  background-color: rgb(255, 255, 255) !important;
}
/* 设置滑块停止位置 */
::v-deep .el-tabs__active-bar.is-top{
  height: 23px;
  width: 64px ! important;
  border-radius: 17px;
  top: 0 !important;
  left: -20px !important;
  position: absolute !important;
  z-index: 1;
}
/* 设置当前选中样式 */
::v-deep .el-tabs__item.is-active{
  font-weight: 500;
  color:rgb(34, 34, 34) !important;
  z-index: 2;
}
/* 设置未被选中样式 */
::v-deep .el-tabs__item{
  padding: 0 19px !important;
  width: 64px;
  box-sizing: border-box;
  display: inline-block;
  position: relative !important;
  font-weight: 400;
  color:#666;
  z-index: 2;
}

.fullPage {
  width: 100%;
  height: 100vh;
}
</style>
