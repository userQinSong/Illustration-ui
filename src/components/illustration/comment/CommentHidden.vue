<template>
  <div class="hidden-line">
    <div class="textDivider" @click="changeType">
      <div v-if="hiddenType">共{{totalCount}}条回复，点击查看</div>
      <div v-if="!hiddenType">收起剩余评论</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommentHidden",
  props:{
    totalCount:Number,
    changeType:Function,
    hiddenType:Boolean
  },
  data(){
    return {
      totalDisplay:0,
    }
  },
  created() {
    this.totalDisplay = this.totalCount
  },
}
</script>

<style scoped>
.hidden-line {
  font-weight: 400;
  font-size: .875rem;
  line-height: 1.25rem;
  text-align: left;
  margin-left: 2.25rem;
  color:#666;
  cursor: pointer;
  -webkit-font-smoothing: antialiased;
}

.textDivider {
  display: block;
  height: 1px;
  width: 100%;
  margin: 24px 0;
  border-top: 1px solid #e6e9ed;
  position: relative;
}

.textDivider div {
  transform: translateY(-50%);
  position: absolute;
  background-color: #fff;
  padding: 0 12px 0 0;
  font-weight: 400;
  color: #666;
  font-size: 14px;
}
</style>
