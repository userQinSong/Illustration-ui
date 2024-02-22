<template>
  <div class="comment-root" v-if="!displayComment.isDelete">
    <div class="root-img-dom">
      <Potrait
        :width="40"
        :potrait_src="displayComment.potraitSrc"
        :click-handler="()=>intoPersonalPage(displayComment.userId)"
      />
    </div>
    <div class="root-msg">
      <div class="root-msg-name">{{ displayComment.userName }}</div>
      <div class="root-msg-content">{{ displayComment.content }}</div>
      <div class="root-msg-bottom">
        <span>{{displayComment.createTime}}</span>
        <div class="root-bottom-right-dom">
          <span v-if="displayComment.attitudeDisplay === 1">
            <i class="qin-iconlike-fill color-blue" @click="likeHandle">{{simpleNumber(displayComment.likeCount)}}</i>
            <i class="qin-iconunlike" @click="unlikeHandle">{{simpleNumber(displayComment.unlikeCount)}}</i>
          </span>
          <span v-if="displayComment.attitudeDisplay === 0">
            <i class="qin-iconlike1" @click="likeHandle">{{simpleNumber(displayComment.likeCount)}}</i>
            <i class="qin-iconunlike" @click="unlikeHandle">{{simpleNumber(displayComment.unlikeCount)}}</i>
          </span>
          <span v-if="displayComment.attitudeDisplay === -1">
            <i class="qin-iconlike1" @click="likeHandle">{{simpleNumber(displayComment.likeCount)}}</i>
             <i class="qin-iconunlike-fill color-blue" @click="unlikeHandle">{{simpleNumber(displayComment.unlikeCount)}}</i>
          </span>
          <i class="qin-icondelete" @click="removeComment">删除</i>
          <i class="qin-iconcomment" @click="replyDisplayChange">回复</i>
        </div>
      </div>
      <transition name="slide">
        <CommentReply
          :blog_id="blog_id"
          :parent-comment="displayComment"
          :root-parent-id="rootParentId"
          style="margin-top: 10px;"
          v-show="replyDisplay"
          :key="displayComment.id"
        />
      </transition>
    </div>
  </div>
</template>

<script>
import CommentReply from "@/components/illustration/comment/CommentReply";
import {changeAttitude, removeComment} from "@/network/illustration/comment";
import {simpleNumber} from "@/common/uctil";
import {checkObj} from "@/common/uctil";
import Potrait from "@/components/illustration/potrait/Potrait";

export default {
  name: "CommentRoot",
  components: {Potrait, CommentReply},
  data(){
    return{
      userId:"user_1",
      displayComment:{},
      replyDisplay:false,
    }
  },
  props: {
    blog_id:String,
    comment:Object,
    renewRootById:Function,
    rootParentId:Number,
    renewWay:Function
  },
  created() {
    this.displayComment = this.comment;
  },
  methods:{
    replyDisplayChange(){
      this.replyDisplay = !this.replyDisplay;
    },
    simpleNumber(num){
      return simpleNumber(num)
    },
    intoPersonalPage:function (person_id){
      this.$router.push(
        {
          path:'/personalPage',
          query:{person_id:person_id}
        }
      )
    },
    removeComment() {
      if(!this.hasLoginUser){
        this.$message.error("当前用户未登录，不可操作！")
        return;
      }
      let str = "是否删除用户<span style='color: red'>" + this.comment.userName + "</span>的该条评论？删除后其底下的回复评论也会随之删除"
      this.myConfirm(str,
        () => removeComment({
          comment_id:this.comment.id,
          child:this.comment.child
        }).then(res => {
          if(res.code === 200){
            this.$message.success('删除成功！');
            console.log("删除成功！")
            this.renewRootById(this.rootParentId);
          }else{
            this.$message.success('删除失败！');
            console.log("删除失败！")
          }
        })
      )
    },
    unlikeHandle(){
      if(!this.hasLoginUser){
        this.$message.error("当前用户未登录，不可操作！")
        return;
      }
      if(this.displayComment.attitudeDisplay === -1){// (1)当前是不喜欢状态
        this.displayComment.attitudeDisplay = 0;//从不喜欢中取消
        this.displayComment.unlikeCount -= 1//不喜欢数目-1
      } else if(this.displayComment.attitudeDisplay === 0){// (2)当前是无状态
        this.displayComment.attitudeDisplay = -1;//从无状态转至不喜欢
        this.displayComment.unlikeCount += 1//不喜欢数目+1
      } else{//(3)当前是喜欢态
        this.displayComment.attitudeDisplay = -1;//从喜欢态转至不喜欢
        this.displayComment.unlikeCount += 1//不喜欢数目+1
        this.displayComment.likeCount -= 1//喜欢数目-1
      }
      this.$nextTick(()=>{
        this.changeAttitude();
      })
    },
    likeHandle(){
      if(!this.hasLoginUser){
        this.$message.error("当前用户未登录，不可操作！")
        return;
      }
      if(this.displayComment.attitudeDisplay === 1){// (1)当前是喜欢状态
        this.displayComment.attitudeDisplay = 0;//从喜欢中取消
        this.displayComment.likeCount -= 1//喜欢数目-1
      } else if(this.displayComment.attitudeDisplay === 0){// (2)当前是无状态
        this.displayComment.attitudeDisplay = 1;//从无状态转至喜欢
        this.displayComment.likeCount += 1//喜欢数目+1
      } else{//(3)当前是不喜欢态
        this.displayComment.attitudeDisplay = 1;//从不喜欢态转至喜欢
        this.displayComment.likeCount += 1//喜欢数目+1
        this.displayComment.unlikeCount -= 1//不喜欢数目-1
      }
      this.$nextTick(()=>{
        this.changeAttitude();
      })
    },
    changeAttitude(){
      let param = {userId:this.curLoginUserId,id:this.displayComment.id,attitudeDisplay:this.displayComment.attitudeDisplay}
      changeAttitude(param).then(res =>{
        if(res.code === 200){
          this.$emit("评论态度修改成功！")
        }else
          console.log("评论态度修改失败！",res.error)
      })
    }
  },
  computed:{
    hasLoginUser(){
      return checkObj(localStorage.getItem("curLoginUser"))
    },
    curLoginUserId(){
      return this.hasLoginUser?JSON.parse(localStorage.getItem("curLoginUser")).user_id:null
    }
  }
}
</script>

<style scoped>
.slide-enter-active {

  animation: slide-in 0.5s ease;
}
.slide-leave-active {

  animation: slide-out 0.5s ease;
}
@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(-50%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.comment-root{
  display: flex;
  margin-top: 1rem;
  border: 0 solid #e5e7eb;
}

.root-img-dom {
  display: inline-block;
  border: none;
  background: #fff;
  border-radius: 9999px;
  align-self: baseline;
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
}

.root-img {
  object-fit: cover;
  position: relative;
  width: 40px;
  height: 40px;
  max-width: 40px;
  border-radius: 9999px;
  border-style: none;
  vertical-align: middle;
}

.root-msg {
  width: 100%;
  margin-left: 0.75rem;
  box-sizing: border-box;
  border: 0 solid #e5e7eb;
}

.root-msg-name{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: 7px;
  font-size: 14px;
  font-weight: 500;
}

.root-msg-content {
  font-weight: 400;
  font-size: .875rem;
  line-height: 1.25rem;
  text-align: left;
  white-space: pre-wrap;
  word-break: break-all;
  -webkit-font-smoothing: antialiased;
}

.root-msg-bottom {
  display: flex;
  margin-top: 4px;
  color: #999;
  font-weight: 400;
  font-size: .75rem;
  line-height: 1rem;
  justify-content: space-between;
}

.root-bottom-right-dom {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.root-bottom-right-dom i{
  font-size: 13px;
  cursor: pointer;
  margin-left: 10px;
}

.color-blue {
  color: #409eff;
}

</style>
