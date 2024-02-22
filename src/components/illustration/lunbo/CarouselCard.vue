<template>
  <el-row>
    <el-col :span="24">
      <el-card :body-style="{ padding: '0px' ,height: '190px'}" class="color-box">
        <el-image :src="msg.url" type="cover" style="width: 100%;height: 200px"/>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name:"CarouselCard",
  data() {
    return {
      currentDate: new Date()
    };
  },
  props:{
    msg: {
      type: Object,
      default() {
        return {};
      },
    },
  }
}
</script>

<style scoped>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}
.right-t2 {
  height: 18px;
  padding: 5px;
  position: absolute;
  top: 0px;
  right: 1px;
  font-size: 15px;
  background-image: linear-gradient(to right, #30cfd0 0%, #330867 100%);
  color: #fff;
  display: flex;
  justify-content: flex-end;
}

.color-box {
  border: 3px solid transparent;
  border-radius: 15px;
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
  background-image: linear-gradient(to right, #fff, #fff),
  linear-gradient(to right, #8f41e9, #578aef);
}
</style>


