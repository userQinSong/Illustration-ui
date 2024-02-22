<template>
  <div class="relative" @mouseenter="changeHiddenType" @mouseleave="changeHiddenType">
    <div class="relative">
      <div class="bigImgContainer">
        <img class="w-full h-full object-cover" :src="back_img_url" @load="preLoadImage" v-loading="loading"/>
        <div class="hidden-box" v-if="!isHidden">
          <span class="flex items-center hint">
            <i class="qin-iconpic icon-border_picture mr-1.5" style="color: inherit; font-size: 20px;"></i>
            <span class="text-base">上传图片</span>
          </span>
          <div class="text-xs font-normal text-[#ffffffcc]">
            建议尺寸3000x420px
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {imgPreloader} from "@/common/imgPreloader";

export default {
  name: "PicBackLine",
  data(){
    return {
      loading:true,
      isHidden: true
    }
  },
  props:{
    back_img_url:String
  },
  methods:{
    changeHiddenType(){
      this.isHidden = !this.isHidden
    },
    preLoadImage(){
      imgPreloader(this.back_img_url).then(res => {
        console.log("加载成功")
        this.loading = false;
      }).catch(error => {
        console.log("加载失败")
        this.preLoadImage();
      })
    },
  }
}
</script>

<style scoped lang="less">
.relative {
  position: relative;
}

.ant-spin-container {
  position: relative;
  transition: opacity 0.3s;
  box-sizing: border-box;
}

.bigImgContainer {
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  overflow: hidden;
  height: 170px;
  position: relative;
  box-sizing: border-box;
  cursor: pointer;
  .object-cover {
    -o-object-fit: cover;
    object-fit: cover;
  }
  .w-full {
    width: 100%;
  }
  .h-full {
    height: 100%;
  }
  img {
    border-style: none;
    vertical-align: middle;
  }
  img, video {
    max-width: 100%;
    height: auto;
  }
  audio, canvas, embed, iframe, img, object, svg, video {
    display: block;
    vertical-align: middle;
  }
  .justify-center {
    justify-content: center;
  }
  .items-center {
    align-items: center;
  }
  .hidden-box {
    display: flex;
    justify-content: center;
    flex-direction: column;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    --tw-text-opacity: 1;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.6) 100%);
    color: rgb(255,255,255);
  }
  .liblibfont {
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: inherit;
    font-size: 20px;
  }
  .mr-1\.5 {
    margin-right: 0.375rem;
  }
  .text-base {
    font-size: 1rem;
    line-height: 2rem;
  }
  .text-\[\#ffffffcc\] {
    color: #ffffffcc;
  }
  .font-normal {
    font-weight: 400;
  }
  .text-xs {
    font-size: .75rem;
    line-height: 1rem;
  }
}
</style>
