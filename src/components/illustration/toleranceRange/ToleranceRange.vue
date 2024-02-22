<template>
  <div class="outFrame_tolerance">
    <div class="tol_title">
      许可范围
    </div>
    <div class="tol_info_line">
      <img class="tol_info_img" :src="require('@/assets/img/illustration/can.png')" alt="" />
      <div class="tol_info_word">可使用生图</div>
    </div>
    <div class="tol_info_line">
      <img class="tol_info_img" :src="require('@/assets/img/illustration/ucan.png')" alt="" />
      <div class="tol_info_word">不可进行融合</div>
    </div>
    <div class="tol_info_line">
      <img class="tol_info_img" :src="require('@/assets/img/illustration/ucan.png')" alt="" />
      <div class="tol_info_word">不可自行出售生成的图片</div>
    </div>
    <div class="tol_info_line">
      <img class="tol_info_img" :src="require('@/assets/img/illustration/ucan.png')" alt="" />
      <div class="tol_info_word">直接出售或融合后再出售均不被允许</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ToleranceRange"
}
</script>

<style scoped>
.outFrame_tolerance {
  text-align: left;
  margin-top: 16px;
  padding: 0 17px;
}

.tol_title {
  height: 20px;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 8px;
}

.tol_info_line {
  display: flex;
  align-items: center;
  height: 14px;
  margin-bottom: 6px;
  color: #999;
}

.tol_info_img {
  width: 12px;
  height: 12px;
  margin-right: 6px;
}

.tol_info_word {
  font-size: 12px;
  transform-origin: left;
}

</style>
