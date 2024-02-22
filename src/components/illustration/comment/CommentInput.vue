<template>
  <div class="comment-input-line">
    <div class="comment-input-img">
      <Potrait
        :width="44"
        :potrait_src="loginUser.potrait_src"
        :click-handler="()=>intoPersonalPage(loginUser.user_id)"
      />
    </div>
    <CommentReply :blog_id="blog_id" :parent-comment="null" :input-type="true"/>
  </div>
</template>

<script>
import CommentReply from "@/components/illustration/comment/CommentReply";
import {checkObj} from "@/common/uctil";
import {imgPreloader} from "@/common/imgPreloader";
import Potrait from "@/components/illustration/potrait/Potrait";

export default {
  name: "CommentInput",
  components: {Potrait, CommentReply},
  props:{
    blog_id:String,
    renewWay:Function,
    potrait_src:'',
  },
  data(){
    return {
      pic_loading:true
    }
  },
  methods:{
    intoPersonalPage:function (person_id){
      this.$router.push(
        {
          name:'PersonalPage',
          params:{person_id:person_id}
        }
      )
    },
  },
  created() {
    //预加载图片
    imgPreloader(this.loginUser.potrait_src).then(res => {
      console.log("加载成功！")
      this.pic_loading = false;
    }).catch(error=>{
      console.log("加载失败！")
    })
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

<style scoped>
.comment-input-line {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  margin-bottom: 0.5rem;
}
.comment-input-img {
  display: flex;
  justify-content: center;
  flex-direction: column;
  border: none;
  padding: 1px;
  background-clip: padding-box,border-box;
  background-origin: padding-box,border-box;
  background-image: linear-gradient(90deg,#3c7ef7,#62c8fa);
  border-radius: 9999px;
  vertical-align: center;
  cursor: pointer;
  position: relative;
}
.title-img {
  display: inline-block;
  width: 44px;
  height: 44px;
  max-width: 44px;
  border-radius: 999px;
  border: 2px solid #fff;
}
</style>
