<template>
  <div class="comment-input" style="position: relative;width: 100%;">
    <el-input clearable
              :placeholder="placeholder"
              type="textarea"
              :maxlength="500"
              resize="none"
              :rows="1"
              :autosize="{ minRows: 1, maxRows: 2}"
              v-model="inputText"
    />
    <div class="send-dom" @click="sendMsg">
      <span class="send-dom-word">发送</span>
    </div>
  </div>
</template>

<script>
import {sendComment} from "@/network/illustration/comment";
import {checkObj} from "@/common/uctil";

export default {
  name: "CommentReply",
  props:{
    inputType: {
      type: Boolean,
      default() {
        return false;
      }
    },
    replyDisplayChange:Function,
    blog_id:String,
    parentComment:Object,
    rootParentId:Number
  },
  data(){
    return {
      inputText:'',
      placeholder:'',
    }
  },
  created() {
    if(this.parentComment == null){
      this.placeholder = '善语结善缘，恶言伤人心'
    }else
      this.placeholder = '回复 @' + this.parentComment.userName;
  },
  methods:{
    sendMsg(){
      if(!this.hasLoginUser){
        this.$message.error("当前用户未登录，不可操作！")
        return;
      }
      //当为常规消息input时
      if(!this.inputType) {
        if (this.inputText !== '' && this.inputText !== null) {
          let param = {
            blog_id: this.blog_id,
            user_id: this.curLoginUserId,
            content: this.inputText,
            parent_id:this.parentComment.id,
            root_parent_id:this.rootParentId
          }
          sendComment(param).then(res => {
            if(res.code === 200){
              this.$message.success("发送评论成功！");
              console.log("新增comment成功！")
              this.renew();
            }else{
              this.$message.success("发送评论失败！");
              console.log("新增comment失败",res.error)
            }
          })
        }
      }else{//当为用户发布消息框时
        if (this.inputText !== '' && this.inputText !== null) {
          let param = {
            blog_id: this.blog_id,
            user_id: this.curLoginUserId,
            content: this.inputText,
            parent_id:null,
            root_parent_id:null
          }
          console.log("@当前用户发送评论：",param)
          sendComment(param).then(res => {
            if(res.code === 200){
              console.log("新增comment成功！");
              this.inputText = '';
              this.$parent.renewWay();
            }else{
              console.log("新增comment失败",res.error)
            }
          })
        }
      }
    },
    renew(){
      this.inputText = '';
      this.$parent.replyDisplayChange();
      this.$parent.renewRootById(this.rootParentId);
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
.comment-input {
  width: 100%;
  height: 43.6px !important;
  max-height: 60px !important;
  border: 1px solid transparent;
  caret-color: #999;
  background: #f2f5f9;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  -webkit-tap-highlight-color: transparent;
  line-height: 1.55;
  appearance: none;
  resize: none;
  box-sizing: border-box;
  font-size: 0.875rem;
  color: rgb(0, 0, 0);
  display: block;
  text-align: left;
  transition: border-color 100ms ease 0s;
  min-height: 2.25rem;
  border-radius: 0.25rem;
}
/deep/ .el-textarea__inner {
  line-height: 33.6px;
  padding-right: 50px;
}

.send-dom {
  padding-left: 1rem;
  padding-right: 1rem;
  width: 40px;
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  display: flex;
  cursor: pointer;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
}

.send-dom-word {
  color: #999;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.25rem;
}
</style>
