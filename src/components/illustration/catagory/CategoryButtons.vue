<template>
  <div>
    <el-radio-group v-model="chooseName"
                    class="CategoryLine"
                    @change="changeCat($event)"
    >
      <el-radio-button v-for="cat in categoryArray"
                       flex="1"
                       :label="cat"
                       :name="cat"
      >{{cat === null || cat === ''?"全部":cat}}</el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>

export default {
  name: "CategoryButtons",
  data(){
    return {
      categoryArray:[],
      chooseName:'',
    }
  },
  props:{
    array:Array,
    clickFn:Function,
  },
  methods:{
    changeCat:function (catName){
      console.log("change到",catName)
      this.chooseName = catName;
      this.clickFn(catName);
    }
  },
  created() {
    this.categoryArray = this.array
    console.log("categoryArray:",this.categoryArray)
    this.chooseName = this.categoryArray[0];
  },
}
</script>

<style scoped lang="less">
  .CategoryLine {
    width: 100%;
    height: auto;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: flex-start;
    margin-bottom: -10px;
  }

  ::v-deep .el-radio-group {
    border-radius:4px;
    .el-radio-button__inner {//修改按钮样式
      font-size: .875rem;
      line-height: 1.25rem;
      border-radius: 9999px;
      --tw-bg-opacity: 1;
      padding: 3px 12px;
      color:#222;
      border: 0 !important;
      margin-right: 0.5em;
      margin-bottom: 0.5em;
    }
    .el-radio-button__orig-radio:checked+.el-radio-button__inner {
      color: #FFF;
      background-color: black !important;
      box-shadow: none;
    }
    .el-radio-button__inner:hover {
      background-color: #e5e7eb;
    }
  }
</style>
