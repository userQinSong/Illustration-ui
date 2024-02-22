<template>
  <div class="info-grid">
    <div class="text-left">
      <div class="item-info-title">
        插画名称
        <span class="en-info-hint">Name</span>
      </div>
      <div class="item-info-content">
        <span v-if="displayMsg.pic_name !== '' && displayMsg.pic_name !==null">{{ displayMsg.pic_name }}</span>
        <span v-else>--</span>
      </div>
    </div>
    <div class="text-left">
      <div class="item-info-title">
        插画类型
        <span class="en-info-hint">Type</span>
      </div>
      <div class="label_result" v-if="displayMsg.pic_type !== '' && displayMsg.pic_type !==null">
        <div class="label_res_type">
          <span>{{ displayMsg.pic_type }}</span>
        </div>
      </div>
      <div class="item-info-content" v-else>
        <span>--</span>
      </div>
    </div>
    <div class="text-left">
      <div class="item-info-title">
        插画尺寸
        <span class="en-info-hint">Size</span>
      </div>
      <div class="item-info-content">
        {{ displayMsg.rowWidth }} x {{ displayMsg.rowHeight }} px
      </div>
    </div>
    <div class="text-left">
      <div class="item-info-title">
        空间大小
        <span class="en-info-hint">Space</span>
      </div>
      <div class="item-info-content">
        {{simplySpaceSize(displayMsg.pic_space_size,3)}}
      </div>
    </div>
    <div class="text-left">
      <div class="item-info-title">
        上传时间
        <span class="en-info-hint">Upload time</span>
      </div>
      <div class="item-info-content">
        {{ displayMsg.add_time }}
      </div>
    </div>
    <div class="text-left">
      <div class="item-info-title">
        下载数量
        <span class="en-info-hint">Download</span>
      </div>
      <div class="item-info-content">
        {{ simplyNumber(displayMsg.down_count) }}
      </div>
    </div>
  </div>
</template>

<script>
import {checkObj, spaceNumFormat} from "@/common/uctil";
import {simpleNumber} from "@/common/uctil";

export default {
  name: "PicDetail",
  data(){
    return{
      displayMsg:{},
      pic_type:"平面插画"
    }
  },
  props:{
    curDisplayMsg:Object,
  },
  methods:{
    simplyNumber(num){
      return simpleNumber(num)
    },
    simplySpaceSize(num,digit=1){
      return spaceNumFormat(num,digit)
    },
    display(){
      console.log("curDisplayMsg:",this.curDisplayMsg)
    }
  },
  created() {
    this.displayMsg = this.curDisplayMsg
    console.log("picDetail:",this.displayMsg)
  },
  watch:{
    curDisplayMsg:{
      deep:true,
      handler(newVal){
        if(checkObj(newVal)){
          this.displayMsg = newVal
        }
      }
    }
  }
}
</script>

<style scoped>

.info-grid {
  row-gap: 1.5rem;
  column-gap: 3.5rem;
  grid-template-columns: repeat(2,minmax(0,1fr));
  display: grid;
}

.text-left {
  text-align: left;
}

.item-info-title{
  color: #333;
  font-weight: 500;
  font-size: .75rem;
  line-height: 1rem;
  margin-bottom: 0.375rem;
}

.item-info-content{
  color: #666;
  font-weight: 500;
  font-size: .875rem;
  line-height: 1.25rem;
}

.en-info-hint {
  margin-left: 0.375rem;
  font-weight: 400;
  font-size: .75rem;
  line-height: 1rem;
  color: #999;
}

.label_result {
  padding: 2px 7px 2px 7px;
}
.label_res_type {
  display: inline-block;
  height: 17px;
  margin-left: -8px;
  padding: 1px 8px;
  line-height: 17px;
  border: none;
  color: #2d28ff;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  background: linear-gradient(90deg,rgba(45,40,255,.1),rgba(26,125,255,.1));
  border-radius: 10px;
}
</style>
