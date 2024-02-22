<template>
  <div class="title-img" v-if="hasSurePotraitSrc">
    <div class="img-display"
         :style="{'width':width+'px','height':width+'px',padding:(has_draw?2:0) + 'px'}"
         @click="clickHandler">
      <img :src="potrait_src"
           @load="preLoadImage"
           v-loading="loading"
           :style="{
           'width':(has_draw?(width-4):width) + 'px',
           'height':(has_draw?(width-4):width) + 'px',
           'border-width':(has_draw?3.33:0) + 'px'
           }"
      />
    </div>
  </div>
</template>

<script>
import {imgPreloader} from "@/common/imgPreloader";
import {checkObj} from "@/common/uctil";

export default {
  name: "Potrait",
  props:{
    potrait_src:String,
    clickHandler:{
      type:Function,
      default(){
        return null
      }
    },
    width:Number,
    has_draw:{
      type:Boolean,
      default(){
        return false
      }
    }
  },
  data(){
    return {
      loading:true,
    }
  },
  methods:{
    preLoadImage(){
      imgPreloader(this.potrait_src).then(res => {
        console.log("加载成功")
        this.loading = false;
      }).catch(error => {
        console.log("加载失败")
        this.preLoadImage();
      })
    },
  },
  computed:{
    hasSurePotraitSrc(){
      return checkObj(this.potrait_src)
    }
  }
}
</script>

<style scoped>
.title-img {
  background-color: rgb(255, 255, 255);
  border-radius: 9999px;
  cursor: pointer;
  position: relative;
}
.img-display {
  width: 80px;
  height: 80px;
  background: linear-gradient(to right, rgb(233, 243, 247), rgba(70, 72, 73, 0.8));
  border-radius: 9999px;
  justify-content: center;
  align-items: center;
  display: flex;
  padding: 2px;
}

.img-display img {
  width: calc(76px);
  height: calc(76px);
  /*border-width: 3.33px;*/
  border-color: rgb(255, 255, 255);
  object-fit: cover;
  border-style: solid;
  border-radius: 9999px;
  justify-content: center;
  align-items: center;
  display: flex;
  vertical-align: middle;
  max-width: 100%;
}
</style>
