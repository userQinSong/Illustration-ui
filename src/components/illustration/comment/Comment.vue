<template>
  <div style="position: relative">
    <div class="comment-title">
      <h3 class="font-medium">讨论<span class="comment-count">{{simplyNumber(this.totalCommentCount)}}</span> </h3>
      <div class="comment-cat-dom">
        <div class="spanBtn" style="color: #333">最热</div>
        <div class="spanBtn">|</div>
        <div class="spanBtn">最新</div>
      </div>
    </div>
    <CommentInput
      v-if="hasLoginUser"
      :blog_id="blog_id"
      :renew-way="getAllCommentsInCurrentPage"
    />
    <div class="comment-list" @scroll="scrollBottom">
      <div class="comment-list-container">
        <div class="comment-list-box comment-operate-item">
          <div v-for="comment in commentList">
            <!-- 评论根目录 -->
            <CommentRoot
              :blog_id="blog_id"
              :comment="comment"
              :rootParentId="comment.id"
              :renew-root-by-id="renewRootById"
              :key="comment.id"
              :renew-way="getAllCommentsInCurrentPage"
            ></CommentRoot>
            <!-- 评论子目录 -->
            <CommentChildList :blog_id="blog_id"
                              :root="comment"
                              :display-count="3"
                              :renew-root-by-id="renewRootById"/>
          </div>
        </div>
        <div class="endWordDom">
          暂时没有更多评论
        </div>
      </div>
    </div>
    <div class="whiteBack"/>
  </div>
</template>

<script>
import CommentChild from "@/components/illustration/comment/CommentChild";
import {getComments} from "@/network/illustration/comment";
import {getCommentById} from "@/network/illustration/comment"
import {getCommentTotalCount} from '@/network/illustration/comment';
import CommentRoot from "@/components/illustration/comment/CommentRoot";
import CommentInput from "@/components/illustration/comment/CommentInput";
import CommentHidden from "@/components/illustration/comment/CommentHidden";
import CommentChildList from "@/components/illustration/comment/CommentChildList";
import {getAllCommentsInCurrentPage} from "@/network/illustration/comment";
import {checkObj, simpleNumber} from "@/common/uctil";

export default {
  name: "Comment",
  components: {CommentChildList, CommentHidden, CommentInput, CommentRoot, CommentChild},
  data() {
    return {
      commentList:[],
      totalCommentCount:0,
      //分页
      pageNum:1,
      pageSize:3,
      hasNextPage:true,
    }
  },
  props:{
    blog_id:String
  },
  methods: {
    simplyNumber(num){
      return simpleNumber(num)
    },
    getMoreData(){
      this.pageNum += 1;
      console.log("pageNum:",this.pageNum)
      this.getCommentList();
    },
    getCommentList(){
      console.log('addComment',{
        blog_id:this.blog_id,
        user_id:this.curLoginUserId,
        pageNum:this.pageNum,
        pageSize:this.pageSize
      })
      getComments({
          blog_id:this.blog_id,
          user_id:this.curLoginUserId,
          pageNum:this.pageNum,
          pageSize:this.pageSize
        }).then(res => {
        if(res.code === 200){
          console.log("获取comment成功！",res.data)
          this.hasNextPage = res.data.hasNextPage
          res.data.list.forEach(item => {
            this.commentList.push(JSON.parse(JSON.stringify(item.commentVo)))
          })
        }else{
          console.log("获取comment失败！",res.error)
        }
      })
    },
    //更新root类型的评论时只需要重新获取当前所展示的评论总数的所有评论列表
    getAllCommentsInCurrentPage(){
      getAllCommentsInCurrentPage({
        blog_id:this.blog_id,
        user_id:this.curLoginUserId,
        pageNum:this.pageNum,
        pageSize:this.pageSize
      }).then(res=>{
        if(res.code === 200){
          console.log("获取当前页码为"+this.pageNum+"的评论列表成功！",res.data)
          this.commentList = JSON.parse(JSON.stringify(res.data))
          this.getCommentCount(this.blog_id);
        }else{
          console.log("获取当前页码为"+this.pageNum+"的评论列表失败！",res.error)
        }
      })
    },
    //更新子评论时只需获取改变的root节点，让其重新生成子评论树
    renewRootById(root_id){
      getCommentById({
        id:root_id,
      }).then(res => {
        if(res.code === 200){
          console.log("更新comment成功！",res.data)
          this.commentList.forEach((item,index) => {
            if(item.id === res.data.id){
              console.log("找到了");
              this.commentList.splice(index,1,res.data)
            }
          })
          this.getCommentCount(this.blog_id);
        }else{
          console.log("更新comment失败！",res.error)
        }
      })
    },
    //获取评论总数
    getCommentCount(blog_id){
      getCommentTotalCount({blog_id:blog_id}).then(res => {
        if(res.code === 200) {
          console.log("获取评论总数成功！",res.data)
          this.totalCommentCount = res.data
        }else{
          console.log("获取评论总数失败！")
        }
      })
    },
    /** 判断滚动到底部 */
    scrollBottom(e) {
      const { scrollTop, scrollHeight, clientHeight } = e.srcElement
      const marginBottom = 164;
      // 滚动距离顶部高度 + 可视区域高度 >= 滚动内容高度，说明滚动到底
      if (scrollTop + clientHeight + marginBottom >= scrollHeight) {
        console.log("拉到底了")
        if(this.hasNextPage)
          this.getMoreData()
        else
          return;
      }
    },
  },
  created() {
    this.getCommentCount(this.blog_id);
    this.getCommentList();
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
::-webkit-scrollbar {
  width: 3px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 255, 0.1);
  border-radius: 3px;
}


.comment-title {
  margin-top: 36px;
  display: flex;
  justify-content: space-between;
}
.comment-count {
  margin-left: 6px;
  color: #999;
  font-size: 16px;
  font-weight: 400;
}
.comment-cat-dom {
  display: flex;
  align-items: center;
  height: 36px;
  color: #999;
  font-weight: 400;
  font-size: 14px;
  font-style: normal;
}
.comment-cat-dom .spanBtn {
  margin-right: 12px;
  cursor: pointer;

}

.comment-list {
  max-height: 600px;
  padding-right: 17px;
  overflow-y: auto;
  padding-left: 3px;
  margin-bottom: 100px;
}

.whiteBack {
  height: 72px;
  position: absolute;
  bottom: 0;
  margin-top: 0;
  pointer-events: none;
  z-index: 2;
  width: 100%;
  background: linear-gradient(0deg,#fff 35.94%,hsla(0,0%,100%,0) 112.25%);
}

.endWordDom {
  color: #999;
  font-size: 14px;
  text-align: center;
  padding: 46px 0 118px;
}


</style>
