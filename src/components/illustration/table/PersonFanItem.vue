<template>
  <div class="tab-list-item">
    <div class="tab-left">
      <div class="img-container" @click="intoPersonalPage(person.user_id)">
        <Potrait
          :width="64"
          :potrait_src="person.potrait_src"
          :click-handler="()=>intoPersonalPage(person.user_id)"
          style="margin-top: 1px"
        />
      </div>
      <div class="user-info-dom">
        <span class="user-info">{{ displayName }}
          <i v-if="person.gender === 1" class="qin-iconman" style="color: #409eff"/>
          <i v-else-if="person.gender === 0" class="qin-iconwoman" style="color: #f50b2e"/>
        </span>
      </div>
    </div>
    <div v-if="person.user_id !== this.curLoginUserId">
      <el-button class="attentionBtn color-222" v-if="!person._person_attention" @click="attentionClickHandler(person.user_id)">关注</el-button>
      <el-button class="attentionBtn color-666" v-else-if="person._person_attention" @click="attentionClickHandler(person.user_id)">
        已关注
      </el-button>
    </div>
  </div>
</template>

<script>
import {checkObj} from "@/common/uctil";
import Potrait from "@/components/illustration/potrait/Potrait";

export default {
  name: "PersonFanItem",
  components: {Potrait},
  props:{
    tranPerson:Object,
    changeAttitude:Function,
    rootPersonId:String,
    itemType:String,
  },
  data(){
    return {
      person:{}
    }
  },
  inject: ['routerRefresh'],
  methods:{
    intoPersonalPage:function (person_id){
      console.log("点击了头像：",person_id)
      this.$router.push({
        path:'/personalPage',
        query:{
          person_id:person_id
        }
      })
      this.$nextTick(()=>{
        this.routerRefresh();
      })
    },
    attentionClickHandler:function (person_id){
      if(this.person._person_attention === true){
        let str = "是否取关用户<span style='color: red'>" + this.displayName + "</span>？"
        this.myConfirm(str, () => this.changeAttention(person_id))
      }else
        this.changeAttention(person_id)
    },
    changeAttention(person_id){
      this.changeAttitude(person_id);//向后端请求并落实关注或取关操作
      //渲染按钮
      this.person._person_attention = !this.person._person_attention
      if(this.person._person_attention){//点击按钮后变为已关注时，需要在关注栏添加该对象
        this.$emit('pushItem',{item:JSON.parse(JSON.stringify(this.person))});
        this.$message.success("关注成功")
      }else{//点击按钮后变为关注时，需要在关注栏移除该对象
        this.$emit('removeItem',{item:JSON.parse(JSON.stringify(this.person))});
        this.$message.success("取关成功")
      }
    },
  },
  created() {
    console.log("获取到Person:",this.tranPerson)
    this.person = this.tranPerson;
  },
  computed:{
    displayName(){
      if(checkObj(this.person.user_name))
        return this.person.user_name
      else {
        return this.person.phone_number.slice(0,3) + "****" +
          this.person.phone_number.slice(this.person.phone_number.length - 3,this.person.phone_number.length)
      }
    },
    //判断当前是否有对象登录
    hasLoginUser(){
      return checkObj(localStorage.getItem("curLoginUser"))
    },
    //获取当前登录对象id,未登录返回空值
    curLoginUserId(){
      return this.hasLoginUser?JSON.parse(localStorage.getItem("curLoginUser")).user_id:null
    },
  }
}
</script>

<style scoped>
  .tab-list-item {
    justify-content: space-between;
    align-items: center;
    display: flex;
    margin-bottom: 1rem;
  }

  .tab-left{
    align-items: center;
    display: flex;
    box-sizing: border-box;
    border: 0 solid #e5e7eb;
  }

  .attentionBtn {
    transition-property: color,background-color,border-color,text-decoration-color,fill,stroke;
    transition-timing-function: cubic-bezier(.4,0,.2,1);
    transition-duration: .15s;
    --tw-text-opacity: 1;
    color: rgb(153,153,153);
    font-weight: 400;
    font-size: .875rem;
    line-height: 1.25rem;
    background-color: #f4f5f9;
    --tw-bg-opacity: 1;
    border-radius: 103px;
    width: 92px;
    height: 2.5rem;
    border: none;
    -webkit-appearance: button;
    text-transform: none;
    overflow: visible;
    font-family: sans-serif;
    margin: 0;
    cursor: pointer;
    background-image: none;
  }

  .attentionBtn:hover {
    color: rgb(5, 96, 245)
  }

  .img-container {
    border-color: #0000000d;
    border-width: 1px;
    border-radius: 9999px;
    cursor: pointer;
    display: inline-block;
    position: relative;
    box-sizing: border-box;
  }

  .user-info-dom {
    height: 45px;
    display: flex;
    margin-left: 0.75rem;
    flex-direction: column;
    justify-content: space-between;
    text-align: left;
  }
  .user-info {
    --tw-text-opacity: 1;
    color: rgb(34 ,34 ,34);
    font-weight: 500;
    font-size: 1rem;
    line-height: 3rem;
    box-sizing: border-box;
  }
  .color-666{
    color:#999
  }
  .color-222{
    color:#222
  }
</style>
