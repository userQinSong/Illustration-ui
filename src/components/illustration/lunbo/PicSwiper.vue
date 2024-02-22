<template>
  <div class="out_frame" :style="{width:width+'px'}" v-loading="loading" v-if="!loading">
    <div class="display_list"
           :style="{width:inner_pic_total_width+'px',transform:'translateX(' + swipMove + 'px)',transition:'all '+ move_gap_time + 's'}">
        <div class="pic-display-back"
             v-for="(item,index) in picList"
             :style="{
             width:inner_pic_width+'px',
             height:maxPicHeight+'px',
           }">
          <el-image
            class="inner_pic_display_dom"
            :key="item.pic_src"
            :style="{height:picList[index].height + 'px',cursor:'pointer'}"
            :src="item.pic_src"
            fit="fill"
            v-cloak
            @click="clickFn(item.pic_id)"
          ></el-image>
        </div>
    </div>
    <div class="right cursor" @click="scrollToRight" @mouseover="prepareRight()" v-show="isShowButton">
      <i class="qin-iconarrowright"/>
    </div>
    <div class="left cursor" @click="scrollToLeft" @mouseover="prepareLeft()" v-show="isShowButton">
      <i class="qin-iconarrowleft"/>
    </div>
  </div>
</template>

<script>

import {checkObj, preloadPics} from "@/common/uctil";

export default {
  name: "MySwiper",
  props:{
    width:{type:Number,default:500},
    displayCount:{type:Number,default:1},
    pic_list:Array,
    clickFn:Function,
    prePicLoadFn:Function
  },
  data(){
    return {
      picList:[],
      //加载组件参数
      loading:true,
      //滑动块左间隔，用于margin-left的距离大小范围在（-inner_pic_total_width , 0）px
      swipMove:0,
      //表示展示中剩余个数（不能把展览栏全部占掉）
      needAddCount:0,
      //表示除余后剩余还有多少个图片
      remainCount:0,
      //表示预加载方法中的当前加载数量
      loadedCount:0,
      //表示预处理后最长的图片长度
      maxPicHeight:0,
      //表示展览栏内部每个图片长度
      inner_pic_width:'',
      //每个图片间的间距
      inner_pic_gap:10,
      //内部展览栏总长度
      inner_pic_total_width:0,
      //滑动间距时间
      move_gap_time:0.5,
      //是否展示左右按钮
      isShowButton:false,
    }
  },
  methods: {
// 预加载 设置并保存图片宽高
    preLoadPics() {
      preloadPics(this.picList,this.inner_pic_width).then(resp=>{
        console.log("获取到返回信息：",resp)
        this.picList = resp;
        this.$nextTick(()=>{
          this.maxPicHeight = this.getMaxPicHeight(this.picList);
          this.preloadedPics();
        })
      })
    },
    preloadedPics() {
      //对已预装好的图片数组进行由高到低的高度排序
      this.picList.sort(this.compare('height'))
      let tailRemainArray = this.picList.slice(this.picList.length-this.remainCount,this.picList.length);
      let headNeedArray = this.picList.slice(0,this.needAddCount);
      this.picList = tailRemainArray.concat(this.picList).concat(headNeedArray);
      console.log("picswiper组装好了：",this.picList)
      this.$nextTick(()=>{
        this.loading = false;
      })
    },
    compare(attr) {
      return function(a,b){
        var val1 = a[attr];
        var val2 = b[attr];
        return val2 - val1;
      }
    },
    preloadFrame(){
      if(this.displayCount > 1) {
        //固定每个图片框大小（初始间距预计为10）
        this.inner_pic_width = Math.round((this.width - this.inner_pic_gap)/this.displayCount);
        if(this.picList.length > this.displayCount){
          //图片除余残余数
          this.remainCount = this.picList.length % this.displayCount;
          //图片需要补齐数量
          this.needAddCount = this.displayCount - (this.picList.length % this.displayCount);
          //更新新间距（由于Math.round会产生误差，所以进行一次更新间距）
          this.inner_pic_gap = (this.width - this.displayCount*this.inner_pic_width)/((this.displayCount - 1) === 0?1:(this.displayCount - 1));
          //是否展示左右按钮
          this.isShowButton = true
        }
        //计算展示栏总长度
        this.inner_pic_total_width = (this.inner_pic_width + this.inner_pic_gap) * (this.picList.length + (this.needAddCount + this.remainCount)) - this.inner_pic_gap;
      }else
        this.inner_pic_width = this.width
    },
    getMaxPicHeight(picList){
      let res = 0;
      this.picList.forEach(item => {
        if(item.height > res)
          res = item.height
      })
      this.$nextTick(()=>{
        return res;
      })
    },
    scrollToLeft() {
      this.move_gap_time = 0.5;
      let testMove = this.swipMove + this.moveLen;
      if(this.swipMove > this.leftLimit){
        this.swipMove += this.remainAddOffLen;
        this.$nextTick(() => {
          setTimeout(() => { // 通过延时障眼法,归原过渡时间,执行真正的“上一张”函数
            this.move_gap_time = 0;
            this.swipMove = this.rightLimit
          }, this.move_gap_time * 1000)
        })
      }else if(testMove === this.leftLimit){
        this.swipMove = testMove;
        this.$nextTick(() => {
          setTimeout(() => { // 通过延时障眼法,归原过渡时间,执行真正的“上一张”函数
            this.move_gap_time = 0;
            this.swipMove = this.rightLimit
          }, this.move_gap_time * 1000)
        })
      }else{
        this.swipMove = testMove;
      }
    },
    scrollToRight() {
      this.move_gap_time = 0.5;
      let testMove = this.swipMove - this.moveLen;
      if(testMove <= this.rightLimit){
        this.swipMove = testMove;
        this.$nextTick(() => {
          setTimeout(() => { // 通过延时障眼法,归原过渡时间,执行真正的“上一张”函数
            this.move_gap_time = 0;
            this.swipMove = 0
          }, this.move_gap_time * 1000)
        })
      }else if(this.swipMove === 0 && this.remainCount !== 0)
        this.swipMove -= this.remainAddOffLen
      else
        this.swipMove = testMove;
    },
    prepareLeft(){
      if(this.swipMove === 0){
        this.move_gap_time = 0;
        this.swipMove = this.rightLimit
      }
    },
    prepareRight(){
      if(this.swipMove === this.rightLimit){
        this.move_gap_time = 0;
        this.swipMove = 0;
      }
    },
    renewDatas(){
        this.picList=[],
        //加载组件参数
        this.loading=true,
        //滑动块左间隔，用于margin-left的距离大小范围在（-inner_pic_total_width , 0）px
        this.swipMove=0,
        //表示展示中剩余个数（不能把展览栏全部占掉）
        this.needAddCount=0,
        //表示除余后剩余还有多少个图片
        this.remainCount=0,
        //表示预加载方法中的当前加载数量
        this.loadedCount=0,
        //表示预处理后最长的图片长度
        this.maxPicHeight=0,
        //表示展览栏内部每个图片长度
        this.inner_pic_width='',
        //每个图片间的间距
        this.inner_pic_gap=10,
        //内部展览栏总长度
        this.inner_pic_total_width=0,
        //滑动间距时间
        this.move_gap_time=0.5,
        //是否展示左右按钮
        this.isShowButton=false
    },
    displayAll(){
      this.preloadFrame();
      this.$nextTick(()=>{
        this.preLoadPics();
        this.move_gap_time = 0
        this.swipMove = -this.remainAddOffLen
      })
    }
  },
  computed: {
    moveLen(){
      return this.width + this.inner_pic_gap;
    },
    needAddOffLen(){
      return this.needAddCount * (this.inner_pic_gap + this.inner_pic_width);
    },
    remainAddOffLen(){
      return this.remainCount * (this.inner_pic_gap + this.inner_pic_width);
    },
    leftLimit() {
      return this.remainCount === 0?0:-this.width-this.inner_pic_gap;
    },
    rightLimit() {
      return -this.inner_pic_total_width + this.width;
    },
  },
  watch:{
    pic_list:{
      deep:true,
      immediate:true,
      handler(newVal){
        if(checkObj(newVal)){
          console.log("获取到pic_list:",newVal)
          this.renewDatas();
          this.picList = newVal.map(item =>{
            return item;
          })
          this.$nextTick(()=>{
            this.displayAll();
          })
        }
      }
    }
  }
}
</script>

<style scoped>
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
  width: 50px;
  height: 30px;
  line-height: 30px;
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
  left: 0;
  border-radius: 0 15px 15px 0;
}

/* 设置向右翻页按钮样式 主要是 绝对定位位置 和 圆角状态样式 */
.right {
  right: 0;
  text-align: center;
  /* 复合写法设置圆角矩形 : 左上角 右上角 右下角 左下角 */
  border-radius: 15px 0 0 15px;
}

/* 按钮移动后的样式 背景颜色加深一倍 */
.left:hover,
.right:hover {
  background: rgba(0, 0, 0, .4);
  color:white
}
</style>
