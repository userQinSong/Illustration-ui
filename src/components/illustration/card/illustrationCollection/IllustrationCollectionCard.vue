<template>
  <el-card class="tab-item" :body-style="{padding:0}">
    <el-image :src="item.url" type="fill" lazy/>
    <div>
      <p class="content">{{ item.content }}</p>
      <div class="tips">
        <div class="tipsLeft">
          <span style="color: #f56c6c">¥</span>
          <span style="color: #f56c6c; font-size: 22px; margin-left: 10px">{{
              item.money
            }}</span>
        </div>
        <div class="tipsRight">销量: {{ item.sales_volume }}</div>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "illustrationCollectionCard",
  props:{
    item:{
      type:Object,
      default() {
        return {};
      },
    }
  }
}
</script>

<style scoped>
/* 描述 */
.content {
  text-align: left;
  color: #5c5c5c;
  font-size: 14px;
  margin-top: 10px;
  padding: 0 10px 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  /* 将对象作为弹性伸缩盒子模型显示 */
  display: -webkit-box;
  /* 限制在一个块元素显示的文本的行数 */
  /* -webkit-line-clamp 其实是一个不规范属性，使用了WebKit的CSS扩展属性，该方法适用于WebKit浏览器及移动端；*/
  -webkit-line-clamp: 2;
  /* 设置或检索伸缩盒对象的子元素的排列方式 */
  -webkit-box-orient: vertical;
}
/* 价格和销量 */
.tips {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  margin: 10px 0;
}
.tipsRight {
  padding: 3px 7px;
  background-color: #ff9a00;
  color: #fff;
  border-radius: 8px;
  font-size: 14px;
}

/* 每个小盒子 */
.tab-item {
  position: absolute;
  height: auto;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  background: white;
  /* 元素不能中断显示 */
  break-inside: avoid;
  text-align: center;
}
.tab-item img {
  width: 100%;
  height: auto;
}
</style>
