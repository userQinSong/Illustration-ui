<template>
  <div class="comment-list-child"
       v-if="root.child != null"
       v-loading="loading"
       element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)"
  >
      <div v-for="(child,index) in displayList">
        <el-collapse-transition>
          <CommentChild
            :blog_id="blog_id"
            :comment="child"
            :rootParentId="root.id"
            :renew-root-by-id="renewRootById"
            v-if="root.child != null"
            :key="child.id"
            v-show="index < limitDisplay"
          />
        </el-collapse-transition>
      </div>

      <CommentHidden v-show="displayList.length >= limitDisplay"
                   :change-type="changeType"
                   :hidden-type="hiddenType"
                   :total-count="displayList.length"/>
  </div>

</template>

<script>
import CommentChild from "@/components/illustration/comment/CommentChild";
import CommentHidden from "@/components/illustration/comment/CommentHidden";
import {checkObj} from "@/common/uctil";
export default {
  name: "CommentChildList",
  components: {CommentChild,CommentHidden},
  data(){
    return {
      displayList:[],
      limitDisplay:3,
      rootComment:{},
      loading:true,
      hiddenType:true,
    }
  },
  props:{
    root:Object,
    blog_id:String,
    displayCount:Number,
    renewRootById:Function,
  },
  created() {
    console.log("更新了root数据重新组装")
    this.rootComment = this.root;
    if(this.rootComment.child != null)
      this.resolveTree(this.rootComment.child);
    this.limitDisplay = this.displayCount
    this.$nextTick(res => {
      this.loading=false;
    })
  },
  methods:{
    resolveTree(list){
      if(checkObj(list)){
        for(let i = 0 ; i < list.length ; i++){
          let child = list[i];
          this.displayList.push(child);
          if(child.child !==null)
            this.resolveTree(child.child)
        }
      }
    },
    changeLimit(value){
      this.limitDisplay = value
    },
    changeType(){
      this.hiddenType = !this.hiddenType;
      if(this.hiddenType)
        this.changeLimit(this.displayCount)
      else
        this.changeLimit(this.displayList.length)
    }
  },
  computed:{
    rootStringFy(){return JSON.stringify(this.root)},
    rootParse(){return JSON.parse(this.rootStringFy)}
  },
  watch: {
    // 要监听的数据，可以是数组、对象、或者普通的变量
    rootStringFy: {
      handler() {
        //newList是改变后的新数组
        console.log("发现数据更新！")
        if(this.root != null){
          this.loading = true;
          this.rootComment = this.rootParse
          this.displayList = [];
          this.resolveTree(this.rootComment.child);
          this.$nextTick(res => {
            console.log("组装后的list",this.displayList)
            if(!this.hiddenType)
              this.changeLimit(this.displayList.length);
            console.log("组装后的limit",this.limitDisplay)
            this.loading = false;
          })
        }
      },
    },
  },
}
</script>

<style scoped>
/*.slide-enter-active {*/

/*  animation: slide-in 0.5s ease;*/
/*}*/
/*.slide-leave-active {*/

/*  animation: slide-out 0.5s ease;*/
/*}*/
/*@keyframes slide-in {*/
/*  from {*/
/*    opacity: 0;*/
/*    transform: translateY(-50%);*/
/*  }*/
/*  to {*/
/*    opacity: 1;*/
/*    transform: translateY(0);*/
/*  }*/
/*}*/

/*@keyframes slide-out {*/
/*  from {*/
/*    opacity: 1;*/
/*    transform: translateY(0);*/
/*  }*/
/*  to {*/
/*    opacity: 0;*/
/*    transform: translateY(-50%);*/
/*  }*/
/*}*/
.comment-list-child {
  margin-left: calc(40px + 0.75em);
  min-height: 30px;
}
</style>
