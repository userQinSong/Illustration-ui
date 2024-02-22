<template>
  <vue-waterfall-easy
    :imgsArr="img_list"
    srcKey="picolt_cover"
    @scrollReachBottom="getList"
    @click="clickFn"
    :defaultWidth="defaultWidth"
    :lazyDistance="300"
    :maxCols="maxCol"
  >
    <div slot="waterfall-head">
      <div class="slot-title">
        <div class="slot-info" :style="{'max-width':computeMaxWidth+'px'}">
          <div :style="{'padding-left':paddingNum+'px','padding-right':paddingNum+'px'}">
            <slot>

            </slot>
          </div>
        </div>
      </div>
    </div>
    <div class="img-info" slot-scope="props">
      <div class="img-bottom-line">
        <div class="img-msg">
          <div class="img-title">{{props.value.picolt_name}}</div>
          <div class="img-info-line">
            <div class="creator-msg">
              <Potrait
                :width="18"
                :potrait_src="props.value.potrait_src"
              />
              <div class="creator-name">{{props.value.user_name}}</div>
            </div>
            <div style="display: flex;justify-content: flex-start">
              <div class="img-icon-line">
                <i class="qin-iconheart icon-word" v-if="!props.value.is_like">{{simplyNumber(props.value.picolt_love)}}</i>
                <i class="qin-iconheart-fill icon-word" v-else-if="props.value.is_like">{{simplyNumber(props.value.picolt_love)}}</i>
              </div>
              <div class="img-icon-line" style="color: white">
                <i class="qin-icondownload icon-word">{{simplyNumber(props.value.picolt_download)}}</i>
              </div>
              <div class="img-icon-line" style="color: white" v-show="itemType === 'picolt'">
                <i class="qin-iconpic icon-word">{{simplyNumber(props.value.picolt_count)}}</i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="rt-word" v-show="itemType === 'picolt'">
        <img
          :src="require('@/assets/img/illustration/recommend.png')"
          style="width: 50px;height: 50px"
          alt="推荐"/>
      </div>
    </div>
  </vue-waterfall-easy>
</template>

<script>
import vueWaterfallEasy from "vue-waterfall-easy";
import {checkObj, simpleNumber} from "@/common/uctil";
import Potrait from "@/components/illustration/potrait/Potrait";
export default {
  name:"WaterFallLayout",
  components: {
    Potrait,
    vueWaterfallEasy,
  },
  data(){
    return {
      defaultWidth:240,
      maxCol:5,
      img_list:[],
    }
  },
  created() {
    this.getList();
    this.$bus.$on('changeListItem',(changeItem)=>{
      //changeItem {id,user_name,potrait_src,pic_src,pic_name,pic_count,like_count,down_count,is_like}
      this.img_list.forEach((item)=>{
        if(item.picolt_id === changeItem.id){
          item.user_name = changeItem.user_name===null?item.user_name:changeItem.user_name
          item.potrait_src = changeItem.potrait_src===null?item.potrait_src:changeItem.potrait_src
          item.picolt_cover = changeItem.pic_src===null?item.picolt_cover:changeItem.pic_src
          item.picolt_name = changeItem.pic_name===null?item.picolt_name:changeItem.pic_name
          item.picolt_love = changeItem.like_count===null?item.picolt_love:changeItem.like_count
          item.picolt_download = changeItem.down_count===null?item.picolt_download:changeItem.down_count
          item.is_like = changeItem.is_like===null?item.is_like:changeItem.is_like
        }
      })
    })
  },
  props:{
    getList:Function,
    pointerFn:Function,
    picoltVoArray:Array,
    imgsArray:Array,
    itemType:String,
    paddingNum:{
      type:Number,
      default(){
        return 0;
      }
    },
  },
  methods: {
    clickFn(event, { index, value }) {
      // 阻止a标签跳转
      event.preventDefault();
      // 只有当点击到图片时才进行操作
      if (event.target.tagName.toLowerCase() == "img") {
        console.log("img clicked", index, value);
        if(this.itemType === 'picolt')
          this.pointerFn(value.picolt_id);
        else if(this.itemType === 'pic') {
          this.pointerFn(value.picolt_id, value.user_id)
        }
      }
    },
    simplyNumber(num){
      return simpleNumber(num)
    }
  },
  computed:{
    computeMaxWidth(){
      return this.defaultWidth * this.maxCol + 120
    },
  },
  watch:{
    imgsArray:{
      deep:true,
      immediate:true,
      handler(newList){
        if(checkObj(newList)){
          console.log("waterfall获取到新list")
          this.img_list = newList;
        }
      }
    }
  }
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
html,
body,
#app {
  height: 100%;
  width: 100%;
  .vue-waterfall-easy-container[data-v-ded6b974] {
    width: 100%;
    height: 100%;
    margin: 0 auto;
  }
  .waterfall {
    width: calc(100% - 50px);
    position: relative;
    overflow: visible;
    .img-info {
      position: relative;
      right: 0;
      height: 45px;
      background-color: #63e4b9;
      line-height: 45px;
    };
  };
  .vue-waterfall-easy-container .vue-waterfall-easy-scroll[data-v-ded6b974] {
    width: 100%;
    height: calc(100% - 51.78px);
    overflow-y: visible !important;
    -webkit-overflow-scrolling: touch;
  }
  img {
    transition: all 0.4s ease-in-out;//这里表示动画的时间为2s
  }
  .img-bottom-line {
    display: inline-block;
    width: calc(100% - 20px) ;
    height: 60px;
    padding: 10px 0;
    position: absolute;
    bottom: 10px;
    font-family: 宋体;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    left: 10px;
    color: white;
    background-image: linear-gradient(to bottom, rgba(193,194,197,0) 0%, rgba(16,17,19,0.75) 100%);
    .img-msg{
      width: 100%;
      height: 35px;
      position: absolute;
      bottom: 17px;
      .img-title {
        text-align: left;
        margin-bottom: 7px;
        padding-left: 8px;
        padding-right: 8px;
        font-size: 16px;
        font-weight: bold;
      }
      .img-info-line {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 0 8px;
        .creator-msg{
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          font-size: 12px;
          .creator-img {
            width: 18px;
            height: 18px;
            border-radius: 20px;
          }
          .creator-name {
            padding-top: 3.7px;
            margin-left: 2px;
          }
        }
        .l-icon {
          width: 14px;
          height: 14px;
          margin-top: 2px
        }
      }
    }
  }

  .img-icon-line {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    font-size: 13px;
    line-height: 18px;
    padding: 0;
    margin-left: 3px;
    .icon-word {
      font-size: 12px;
      color: white;
      margin-left: 4px;
    }
  }
  .rt-word {
    display: inline-block;
    position: absolute;
    right: 20px;
    top: 7px;
  }
  .vue-waterfall-easy-container .vue-waterfall-easy a.img-inner-box[data-v-ded6b974] {
    -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
  }
  .vue-waterfall-easy-container .vue-waterfall-easy a.img-inner-box[data-v-ded6b974]:hover {
    img{
      transform: scale(1.1);
    }
  }
}

.l-img {
  border-radius: 9999px;
  width: 18px;
  height: 18px;
  border-style: none;
  vertical-align: middle;
  max-width: 100%;
}

.slot-title {
  width: 100%;
  display: flex;
  justify-content: center;
}

.slot-info {
  width: 100%;
  padding-bottom: 10px;
}

.tag-img {
  width: 17px;
  height: 17px;
  vertical-align: top;
}
</style>

