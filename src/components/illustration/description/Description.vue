<template>
  <div class="outFrame_description">
    <div class="descrip_title">详情</div>
    <div class="descrip_main">
      <div class="describ_item">
        <div class="label_card" style="padding-top: 16px">
          内容标签
        </div>
        <div class="label_result" style="padding-top: 17px">
          {{picoltDetail.picolt_tag}}
        </div>
      </div>
      <div class="describ_item">
        <div class="label_card">
          下载数
        </div>
        <div class="label_result">
          {{ picoltDetail.picolt_download }}
        </div>
      </div>
      <div class="describ_item">
        <div class="label_card">
          总图数
        </div>
        <div class="label_result">
          {{ picoltDetail.picolt_count }}
        </div>
      </div>
      <div class="describ_item">
        <div class="label_card" style="padding-bottom: 16px">
          点赞数
        </div>
        <div class="label_result" style="padding-bottom: 16px">
          {{ picoltDetail.picolt_love }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Description",
  props:{
    picoltDetail:Object
  },
  data(){
    return {
      detail:{}
    }
  },
  methods:{
    initData(){
      this.detail = this.picoltDetail
    }
  },
  created() {
    this.initData();
    this.$bus.$on("changeDescriptionLove",(count)=>{
      this.detail.picolt_love += count;
    })
    this.$bus.$on("changeDescriptionDown",(count)=>{
      this.detail.picolt_download += count;
    })
    this.$bus.$on("changeDescriptionCount",(count)=>{
      this.detail.picolt_count += count;
    })
  }
}
</script>

<style scoped>
  .outFrame_description {
    margin-top: 16px;
    overflow: hidden;
    border: 1px solid #e6e9ed;
    border-radius: 8px;
  }
  .descrip_title {
    height: 40px;
    padding: 0 17px;
    font-weight: 500;
    font-size: 14px;
    font-family: "PingFang SC";
    font-style: normal;
    line-height: 40px;
    text-align: left;
  }
  .descrip_main {
    box-sizing: border-box;
    font-size: 12px;
    border-top: 1px solid #e6e9ed;
  }
  .describ_item {
    display: flex;
    justify-content: flex-start;
  }
  .label_card {
    flex-shrink: 0;
    width: 92px;
    padding-bottom: 5px;
    padding-left: 16px;
    border-right: 1px solid #e6e9ed;
    color: #666;
    font-weight: 400;
    text-align: left;
    padding-top: 10px;
  }
  .label_result {
    padding: 11px 10px 5px 13px;
  }
  .label_res_type {
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
