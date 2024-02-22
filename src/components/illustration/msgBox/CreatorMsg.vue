<template>
  <div class="out_frame"
       v-loading="loading">
    <Potrait
      :width="72"
      :potrait_src="creator.potrait_src"
      :click-handler="()=>intoPersonalPage(creator.user_id)"
    />
    <div class="info-msg">
      <div class="info-line creator-title">
        {{ creator.user_name }}
      </div>
      <div v-if="creator.rank === 0" class="info-line tag-card-0">
        <div class="tag-inner-line">
          <img class="tag-inner-img" style="width: 21px" :src="require('@/assets/img/illustration/normalUser.png')"/>
          普通用户
        </div>
      </div>
      <div v-else-if="creator.rank === 1" class="info-line tag-card-1">
        <div class="tag-inner-line">
          <img class="tag-inner-img" :src="require('@/assets/img/illustration/vip.png')"/>
          原创者
        </div>
      </div>
      <div v-else-if="creator.rank === 2" class="info-line tag-card-2">
        <div class="tag-inner-line">
          <img class="tag-inner-img" :src="require('@/assets/img/illustration/manager.png')"/>
          管理员
        </div>
      </div>
      <div class="info-line creator-info-line">
        <div class="creator-info-dom">
          <i class="qin-iconuser">{{simpleNumber(creator.be_attention)}}</i>
        </div>
        <div class="creator-info-dom">
          <i class="qin-iconheart">{{simpleNumber(totalBeLikeCount)}}</i>
        </div>
        <div class="creator-info-dom">
          <i class="qin-iconupload">{{simpleNumber(totalUploadCount)}}</i>
        </div>
        <div class="creator-info-dom">
          <i class="qin-icondownload">{{simpleNumber(totalDownCount)}}</i>
        </div>
      </div>
      <div class="attention_button cursor" v-if="!attBtnLoading && curLoginUserId !== creator.user_id" @click="changeAttention(creator_id)">
        <span class="btn-word">
          <i class="qin-iconadduser">
             <span v-if="!isAttention" style="color: #173fff">关注</span>
             <span v-if="isAttention" style="color:#687fee">已关注</span>
          </i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import {checkObj, simpleNumber} from "@/common/uctil";
import {imgPreloader} from "@/common/imgPreloader";
import {
  attentionOnePerson,
  changeAttentionOnePerson,
  getAttentionOnePerson,
  getPersonInfo
} from "@/network/illustration/person";
import Potrait from "@/components/illustration/potrait/Potrait";

export default {
  name: "CreatorMsgBox",
  components: {Potrait},
  props: {
    creator_id:String,
  },
  data(){
    return {
      loading:true,
      attBtnLoading:true,
      creator:{},
      isAttention:false
    }
  },
  created() {
    this.$bus.$on("changePersonMsgBox",()=>{
      this.getCreatorInfo(this.creator_id);
    })
  },
  methods:{
    //关注某个用户
    changeAttention(person_id){
      let unChangeAttention = this.isAttention
      this.isAttention = !this.isAttention
      if(this.isAttention)
        this.$bus.$emit("creatorChangeAttentionCount",1)
      else
        this.$bus.$emit("creatorChangeAttentionCount",-1)
      changeAttentionOnePerson({user_id: person_id,attitude_person_id: this.curLoginUserId}).then(res => {
        if(res.code === 200){
          if(unChangeAttention){
            //如果是'已关注按钮'
            this.$message.success("取关成功！")
          } else
            this.$message.success("关注成功！")
        }else{
          this.$message.error("网络问题，更改失败")
          this.isAttention = !this.isAttention
        }
      })
    },
    //获取创建者基本信息
    getCreatorInfo(id){
      getPersonInfo({user_id:id}).then(res => {
        if(res.code === 200){
          console.log("获取到的Creator详情：",res.data)
          this.creator = res.data;
          this.loading = false
        }else{
          console.log('CreatorMsg 获取用户信息失败！',res.error);
        }
      })
    },
    intoPersonalPage:function (person_id){
      this.$router.push(
        {
          path:'/personalPage',
          query:{person_id:person_id}
        }
      )
    },
    simpleNumber(num){
      return simpleNumber(num);
    },
    getAttentionMsg(){
      getAttentionOnePerson({user_id:this.creator_id,attitude_person_id:this.curLoginUserId}).then(res => {
        if(res.code === 200){
          console.log("获取某人的关注信息成功！")
          this.isAttention = res.data;
          this.attBtnLoading = false;
        }else{
          console.log("获取某人的关注信息失败！")
        }
      })
    }
  },
  watch:{
    creator_id:{
      immediate:true,
      handler(value){
        if(checkObj(value)) {
          console.log("CreatorMsgBox发现新creator_id",value)
          this.loading = true
          this.getCreatorInfo(value);
          this.getAttentionMsg()
        }
      }
    }
  },
  computed:{
    totalDownCount(){
      return this.creator.pic_be_down_count + this.creator.picolt_be_down_count
    },
    totalBeLikeCount(){
      return this.creator.pic_be_like_count + this.creator.picolt_be_like_count
    },
    totalUploadCount(){
      return this.creator.pic_upload + this.creator.picolt_upload;
    },
    hasLoginUser(){
      return checkObj(localStorage.getItem("curLoginUser"))
    },
    curLoginUserId(){
      return this.hasLoginUser?JSON.parse(localStorage.getItem("curLoginUser")).user_id:null
    }
  },
}
</script>

<style scoped>
  .out_frame{
    position: relative;
    display: flex;
    flex-direction: row;
    padding: 16px;
    border-radius: 15px;
    background: #eff1f3;
    border: 0 solid #e5e7eb;
  }
  .info-msg {
    flex: 1;
    height: 100%;
    position: relative;
    display: flex;
    margin-left: 12px;
    flex-direction: column;
    justify-content: space-between;
  }
  .info-line {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }
  .creator-title {
    width: 188px;
    height: 21px;
    overflow: hidden;
    color: #222;
    font-weight: 600;
    font-size: 18px;
    line-height: 21px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .tag-card-0{
    width: fit-content;
    margin-top: 5px;
    color: #5c5c5c;
    font-weight: 400;
    background: linear-gradient(94.11deg, #ccd0d2 10.52%, #cbddef 107.96%);
    border-radius: 4px;
    transform: skew(-10deg);
  }
  .tag-card-1{
    width: fit-content;
    margin-top: 5px;
    color: #895a04;
    font-weight: 400;
    background: linear-gradient(94.11deg, #e0bc7c 10.52%, #c9b38d 107.96%);
    border-radius: 4px;
    transform: skew(-10deg);
  }
  .tag-card-2{
    width: fit-content;
    margin-top: 5px;
    color: #f5848d;
    font-weight: 400;
    background: linear-gradient(94.11deg, #4a2082 10.52%, #1169c9 107.96%);
    border-radius: 4px;
    transform: skew(-10deg);
  }
  .tag-inner-line{
    display: flex;
    align-items: center;
    height: 22px;
    padding: 0 8px 0 5px;
    font-size: 14px;
    line-height: 22px;
    transform: skew(10deg);
  }
  .tag-inner-img {
    width: 18px;
    margin-top: -1px;
    margin-right: 1px;
  }

  .creator-info-line {
    display: flex;
    margin-top: 11px;
  }

  .creator-info-dom i{
    display: flex;
    align-items: center;
    height: 13px;
    color: #999;
    margin-right: 9px;
    font-size: 12px;
  }

  .attention_button{
    position: absolute;
    top: 0;
    right: 0;
    transition-property: color,background-color,border-color,text-decoration-color,fill,stroke;
    transition-timing-function: cubic-bezier(.4,0,.2,1);
    transition-duration: .15s;
    height: 34px;
    border-radius: 17px;
    border: 1px solid #173fff;
    min-width: 88px;
    box-sizing: border-box;
    overflow: hidden;
    background: #fff;
    color: #173fff;
  }
  .attention_button:hover {
    border: 1px solid #687fee;
  }
  .btn-word {
    white-space: nowrap;
    height: 100%;
    overflow: hidden;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
  }
</style>
