<template>
  <div class="out_frame" :style="{width:width+'px'}" v-cloak>
    <div class="slider-item" v-for="(item,index) in picList" :key="item.pic_id + (new Date().getTime())" v-cloak>
      <el-image
        class="inner_pic_display_dom"
        :style="{width:inner_pic_width+'px',height:item.height + 'px'}"
        :src="item.pic_src"
        v-show="curDisplayIndex === index"
        fit="fill"
        :preview-src-list="[item.pic_src]"
      ></el-image>
    </div>
    <div class="right cursor" @click="scrollToRight" v-show="this.picList.length > 1">
      <i class="qin-iconarrowright"/>
    </div>
    <div class="left cursor" @click="scrollToLeft" v-show="this.picList.length > 1">
      <i class="qin-iconarrowleft"/>
    </div>
  </div>
</template>

<script>
import {checkObj} from "@/common/uctil";

export default {
  name: "SinglePicSwiper",
  props:{
    width:Number,
    displayCount:{type:Number,default:1},
    displayIndex:Number,
    pic_list:Array,
    downloadFunc:Function,
    renewPicList:Function
  },
  data(){
    return {
      show: true,
      curDisplayPic:{},
      curDisplayIndex:0,
      picList:[],
      //加载组件参数
      loading:true,
      //表示展览栏内部每个图片长度
      inner_pic_width:500,
    }
  },
  methods: {
    changeCurIndex(index){
      this.$emit("update:displayIndex", index); // 触发update:data将子组件值传递给父组件
    },
    scrollToLeft() {
      this.scrollChange(-1);
    },
    scrollToRight() {
      this.scrollChange(1)
    },
    scrollChange(changeNum){
      this.curDisplayIndex += changeNum;
      if (this.curDisplayIndex < 0) {
        this.curDisplayIndex = this.picList.length - 1;
      }else if(this.curDisplayIndex > this.picList.length - 1){
        this.curDisplayIndex = 0;
      }
      this.changeCurIndex(this.curDisplayIndex);
    }
  },
  created() {
    this.inner_pic_width = this.width
  },
  watch:{
    displayIndex(newVal){
      this.curDisplayIndex = newVal
    },
    pic_list:{
      deep:true,
      immediate:true,
      handler(newList){
        if(checkObj(newList)){
          this.picList = newList;
        }
      }
    }
  }
}
</script>

<style scoped>

[v-cloak] {
  display: none;
}

.out_frame {
  position: relative;
  overflow:hidden;
}
.display_list {
  width: auto;
  display: flex;
  flex-shrink: 0;
  flex-direction: row;
  justify-content: space-between;
  vertical-align: middle;
}

.pic-display-back {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.inner_pic_display_dom {
  width: 100%;
  border-radius: 15px;
  background-color: #888888;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.left,
.right {
  position: absolute;
  top: 50%;
  margin-top: -15px;
  width: 25px;
  height: 25px;
  line-height: 25px;
  background-color: hsla(0,0%,100%,.6);
  text-decoration: none;
  border: none;
  color: rgba(0,0,0,.8);
  transition-property: color,background-color,border-color,text-decoration-color,fill,stroke;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
  transition-duration: .15s;
}

/* 设置向左翻页按钮的样式 绝对定位位置 和 圆角状态样式  */
.left {
  right: 42px;
  top: 30px;
  border-radius: 999px;
}

/* 设置向右翻页按钮样式 主要是 绝对定位位置 和 圆角状态样式 */
.right {
  right: 10px;
  top: 30px;
  text-align: center;
  /* 复合写法设置圆角矩形 : 左上角 右上角 右下角 左下角 */
  border-radius: 999px;
}

/* 按钮移动后的样式 背景颜色加深一倍 */
.left:hover,
.right:hover {
  background: rgba(0, 0, 0, .4);
  color:white
}
</style>
