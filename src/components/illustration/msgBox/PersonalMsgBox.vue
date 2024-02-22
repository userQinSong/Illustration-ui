<template>
  <div class="personalInfo">
    <div class="out-main">
      <div class="title-img-dom">
        <Potrait
          :width="80"
          :click-handler="editPersonalMsg"
          :potrait_src="person.potrait_src"
          :has_draw="true"
        />
        <div class="right-dom" v-if="hasLoginUser && !isLoginUser" @click="handleChangeAttention(person.user_id)">
          <span v-if="!hasAttentionCurDisplayUser">关注</span>
          <span v-if="hasAttentionCurDisplayUser">已关注</span>
        </div>
        <div class="right-dom" v-if="hasLoginUser && isLoginUser" @click="editPersonalMsg">
          编辑资料
        </div>
      </div>
      <div>
        <div class="content-name">{{person.user_name}}
          <i v-if="person.gender === 1" class="qin-iconman" style="color: #409eff"/>
          <i v-else-if="person.gender === 0" class="qin-iconwoman" style="color: #f50b2e"/>
        </div>
        <div class="brief_place" v-if="person.brief!==null && person.brief!=='' && person.brief !== undefined">
          个人简介：{{person.brief}}
        </div>
        <ul class="content-info">
          <li class="content-li">
            <span class="content-span" @click="searchAllFans(person.user_id)">
              <span class="left_span">{{simplyNumber(person.be_attention)}}</span>
              <span class="right_span">粉丝</span>
            </span>
          </li>
          <li class="content-li">
            <span class="content-span" @click="searchAllAttention(person.user_id)">
              <span class="left_span">{{ simplyNumber(person.attention) }}</span>
              <span class="right_span">关注</span>
            </span>
          </li>
          <li class="content-li">
            <el-tooltip class="item"
                        effect="light"
                        transition="el-zoom-in-bottom"
                        :content="simplyNumber(person.picolt_be_like_count) +' 图集喜爱数 | ' +
                        simplyNumber(person.pic_be_like_count) + ' 图片喜爱数'"
                        placement="top">
              <div slot="content" class="content-span">
                <i class="qin-iconheart-fill color-red flex-line-dom"/>
                <div class="flex-line-dom">{{simplyNumber(person.picolt_be_like_count)}}图集喜爱数</div>
                <div class="flex-line-dom border-none">{{simplyNumber(person.pic_be_like_count)}}图片喜爱数</div>
              </div>
              <span class="content-span">
                <span class="left_span">{{ simplyNumber(totalBeLikeCount)}}</span>
                <span class="right_span">作品获喜爱数</span>
              </span>
            </el-tooltip>
          </li>
          <li class="content-li">
            <el-tooltip class="item"
                        effect="light"
                        transition="el-zoom-in-bottom"
                        :content="simplyNumber(person.picolt_upload) +' 图集上传数 | ' +
                        simplyNumber(person.pic_upload) + ' 图片上传数'"
                        placement="top">
              <div slot="content" class="content-span">
                <i class="qin-iconupload color-purple flex-line-dom"/>
                <div class="flex-line-dom">{{simplyNumber(person.picolt_upload)}}图集上传数</div>
                <div class="flex-line-dom border-none">{{simplyNumber(person.pic_upload)}}图片上传数</div>
              </div>
              <span class="content-span">
                <span class="left_span">{{ simplyNumber(totalUploadCount)}}</span>
                <span class="right_span">作品上传数</span>
              </span>
            </el-tooltip>
          </li>
          <li class="content-li">
            <el-tooltip class="item"
                        effect="light"
                        transition="el-zoom-in-bottom"
                        placement="top">
              <div slot="content" class="content-span">
                <i class="qin-icondownload color-blue flex-line-dom"/>
                <div class="flex-line-dom">{{simplyNumber(person.picolt_be_down_count)}}图集下载数</div>
                <div class="flex-line-dom border-none">{{simplyNumber(person.pic_be_down_count)}}图片下载数</div>
              </div>
              <span class="content-span">
                <span class="left_span">{{ simplyNumber(totalDownCount) }}</span>
                <span class="right_span">作品被下载数</span>
              </span>
            </el-tooltip>
          </li>
        </ul>
      </div>
    </div>
    <PersonFanAttentionTable
      ref="fansShadeBox"
      :person="person"
      :change-attitude="changeAttention"
    />
  </div>
</template>

<script>
import {checkObj, simpleNumber} from "@/common/uctil";
import {imgPreloader} from "@/common/imgPreloader";
import PersonFanAttentionTable from "@/components/illustration/table/PersonalFanAttentionTable";
import {changeAttentionOnePerson, getAttentionOnePerson} from "@/network/illustration/person";
import PersonalEditForm from "@/components/illustration/form/PersonalEditForm";
import Potrait from "@/components/illustration/potrait/Potrait";

export default {
  name: "PersonalMsgBox",
  components: {PersonalEditForm, PersonFanAttentionTable,Potrait},
  props:{
    personData:Object,
    renewPersonMsg:Function
  },
  data(){
    return {
      loading:true,
      person: {},
      hasAttentionCurDisplayUser:false
    }
  },
  created() {
    this.person = this.personData
    this.getHasAttentionCurUser()
    this.$bus.$on('changePersonMsgBox',()=>{
      if(checkObj(this.person.user_id)){
        this.renewPersonMsg(this.person.user_id);
      }
    })
    console.log("PersonMsgBox:",this.person)
  },
  methods:{
    simplyNumber(num){
      return simpleNumber(num)
    },
    editPersonalMsg(){
      //打开编辑栏
      this.$bus.$emit('openEditPersonalBox');
    },
    setBusListener(){
      this.$bus.$on('renewEdit',(param)=>{
        if(param.user_id === this.person.user_id){//如果当前展示的页面的用户id等于刚编辑完信息的用户id，那么即时更新
          this.person.user_name = param.edited_username
          this.person.brief = param.edited_brief
        }
      })
    },
    getHasAttentionCurUser(){
      getAttentionOnePerson({user_id:this.person.user_id,attitude_person_id:this.curLoginUserId}).then(res =>{
        if(res.code === 200){
          console.log("获取当前展示用户和当前登录用户是否关注信息成功！",res.data)
          this.hasAttentionCurDisplayUser = res.data
        }else{
          console.log("获取当前展示用户和当前登录用户是否关注信息失败！")
        }
      })
    },
    searchAllFans(){
      this.$refs.fansShadeBox.open("fans");
    },
    searchAllAttention(){
      this.$refs.fansShadeBox.open("attention");
    },
    handleChangeAttention(person_id){
      this.changeAttention(person_id);//向后端请求并落实关注或取关操作
      //渲染按钮
      this.hasAttentionCurDisplayUser = !this.hasAttentionCurDisplayUser
      let listChangeItem = {
        ...this.curLoginUser,
        attention_id:this.person.user_id,
        fans_id:this.curLoginUserId,
        _person_attention:this.hasAttentionCurDisplayUser
      };
      if(this.hasAttentionCurDisplayUser){//点击按钮后变为已关注时，需要在关注栏添加该对象
        this.$refs.fansShadeBox.listFansPush(listChangeItem);
        this.person.be_attention += 1
        this.$message.success("关注成功")
      }else{//点击按钮后变为关注时，需要在关注栏移除该对象
        this.$refs.fansShadeBox.listFansRemove(listChangeItem);
        this.person.be_attention -= 1
        this.$message.success("取关成功")
      }
    },
    //关注某人：attention_id代表被关注的人的id，fans_id代表粉丝方id
    changeAttention(person_id){
      changeAttentionOnePerson({user_id: person_id,attitude_person_id: this.curLoginUserId}).then(res => {
        if(res.code === 200){
          if(this.person.user_id === this.curLoginUserId)
            this.renewPersonMsg(this.person.user_id)
        }else{
          console.log("终端更新关注状态失败！")
          this.$message.error("终端更新关注状态失败！")
        }
      })
    },
  },
  computed:{
    totalDownCount(){
      return this.person.pic_be_down_count + this.person.picolt_be_down_count
    },
    totalBeLikeCount(){
      return this.person.pic_be_like_count + this.person.picolt_be_like_count
    },
    totalUploadCount(){
      return this.person.pic_upload + this.person.picolt_upload;
    },
    //判断当前展示对象是否为当前登录对象
    isLoginUser(){
      return JSON.parse(localStorage.getItem("curLoginUser")).user_id === this.person.user_id;
    },
    //判断当前是否有对象登录
    hasLoginUser(){
      return checkObj(localStorage.getItem("curLoginUser"))
    },
    //获取当前登录对象id,未登录返回空值
    curLoginUserId(){
      return this.hasLoginUser?JSON.parse(localStorage.getItem("curLoginUser")).user_id:null
    },
    curLoginUser(){
      return this.hasLoginUser?JSON.parse(localStorage.getItem("curLoginUser")):null;
    },
    //判断person组装是否完毕
    personCompelete(){
      return checkObj(this.person)
    }
  },
  watch:{
    personData:{
      deep:true,
      handler(newVal){
        console.log("personMsgBox:更新了")
        this.person = newVal
      }
    }
  }
}
</script>

<style scoped lang="less">
  .personalInfo {
    position: relative;
    padding-bottom: 31px;
    gap: 0.75rem;
    align-items: center;
    display: flex;
    margin-left: 1px;
    margin-right: 1px;
  }
  .title-img-dom {
    display: flex;
    align-items: center;
    justify-content: center;
    top: -44px;
    position: absolute;
  }
  .out-main {
    padding-top: 50px;
  }

  .title-img {
    background-color: rgb(255, 255, 255);
    padding: 0.25rem;
    border-radius: 9999px;
    cursor: pointer;
    margin-right: 22px;
    position: relative;
  }
  .img-display {
    width: 80px;
    height: 80px;
    background: linear-gradient(to right, rgb(233, 243, 247), rgba(70, 72, 73, 0.8));
    border-radius: 9999px;
    justify-content: center;
    align-items: center;
    display: flex;
    padding: 2px;
  }

  .img-display img {
    width: calc(76px);
    height: calc(76px);
    border-width: 3.33px;
    border-color: rgb(255, 255, 255);
    object-fit: cover;
    border-style: solid;
    border-radius: 9999px;
    justify-content: center;
    align-items: center;
    display: flex;
    vertical-align: middle;
    max-width: 100%;
  }

  .right-dom {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 6px;
    line-height: 17px;
    color: #fff;
    font-weight: 500;
    font-size: 12px;
    font-style: normal;
    padding: 5px 18px;
    cursor: pointer;
    border-radius: 20px;
    background: linear-gradient(90deg,#1f66df,#3faeff);
  }

  .content-box{
    margin-top: 46px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .content-name {
    --tw-text-opacity: 1;
    color: rgb(34,34,34);
    font-weight: 700;
    font-size: 1.25rem;
    line-height: 1.75rem;
    text-align: left;
  }

  .content-info {
    gap: 1rem;
    display: flex;
    margin-top: 12px;
    list-style: none;
    padding: 0;
  }
  .content-info li {
    align-items: center;
    display: flex;
  }

  .content-span {
    align-items: center;
    cursor: pointer;
    display: flex;
  }

  .content-span .left_span {
    font-family: "Kumbh Sans";
    --tw-text-opacity: 1;
    color: rgb(34,34,34);
    font-weight: 600;
    font-size: 1rem;
    line-height: 1.5rem;
    margin-right: 0.25rem;
  }

  .content-span .right_span {
    color: #666;
    --tw-text-opacity: 1;
    line-height: 22px;
    font-weight: 400;
    font-size: .75rem;
  }
</style>

<style lang="less">
.el-tooltip__popper.is-light {
  background: #FFF;
  box-shadow: 0px 0px 3px 1px rgba(0,0,0,0.05);
  border-radius: 4px;
  padding: 2px;
  opacity: 1;
  margin-bottom: 2px;
  border-top:1px solid rgba(0,0,0,0.1);
  border-right: 1px solid rgba(0,0,0,0.1);
  border-left: 1px solid rgba(0,0,0,0.1);
  border-bottom: none;
  color: #666;
  font-size: .75rem;
  &[x-placement^=top] .popper__arrow:after {
    border-top-color: #FFF;
    background: none;
  }
  &[x-placement^=top] .popper__arrow {
    border-top-color: rgba(0,0,0,0.1);
  }
}

.flex-line-dom {
  padding: 5px 10px;
  border-right: 0.0625rem solid rgb(233, 236, 239);
}
.border-none {
  border: none;
}

.brief_place {
  --tw-text-opacity: 1;
  color: rgb(115,115,115);
  letter-spacing: -.28px;
  font-weight: 500;
  font-size: .875rem;
  line-height: 1.25rem;
  margin-top: 3px;
  text-align: left;
}

</style>
