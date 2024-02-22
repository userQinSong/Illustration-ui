<template>
  <div style="padding: 0 10px" class="rt-songs" ref="scroll" v-loading="loading">
    <div class="cigarList">
      <ShopListItem
        v-for="item in shopsList"
        :key="item.shop_id"
        :item="item"
        :wth="18"
        :topShow="false"
        :userShow="true"
      ></ShopListItem>
    </div>
    <el-pagination
      layout="prev, pager, next"
      :page-size="limit"
      :total="totals"
      @current-change="handleCurrentChange"
      style="text-align:center;margin: 0 auto 20px;"
    ></el-pagination>
  </div>
</template>

<script>
import {getShops,getHaveShops} from "@/network/cigarShop/shops";
import ShopListItem from "@/components/cigarShop-user/shopList/ShopListItem";
export default {
  name: "ShopsPage",
  components: {
    ShopListItem,
  },
  data() {
    return {
      shopsList:[],
      totals: 0,
      limit: 30,
      offset: 0,
      cat: "全部",
      curIndex: 0,
      loading:true,
    };
  },
  methods: {
    getShops() {
      if(this.curUser.rank === 0){
        getShops().then((res) => {
          this.shopsList = res.data
          this.loading = false;
        })
      }else if(this.curUser.rank === 1){
        getHaveShops(this.curUser.user_id).then((res) => {
          this.shopsList = res.data
          this.loading = false;
        })
      }
      console.log("得到Shops",this.shopsList)
    },
    //切换页码
    handleCurrentChange(newPage) {
      this.offset = (newPage - 1) * this.limit;
      this.getSongList(this.limit, this.offset, this.cat);
      //返回顶部
       this.$refs.scoll.scrollTop = 0;
    },
  },
  created() {
    this.$store.commit("path/setPath",[this.$route.meta.title])
    this.getShops();
  },
  beforeDestroy() {
    // console.log("离开了");
    //离开清除 不然耗性能
    document.removeEventListener("scroll", this.handleScroll, true);
  },
  computed: {
    //获取当前厂商
    curUser(){
      return this.$store.getters["shopCar/curUser"]
    },
    curShop(){
      return this.$store.getters["shopCar/curShop"]
    },
  },
};
</script>
<style scoped>
.active {
  color: red;
}
.cigarList {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.title {
  font-size: 13px;
  margin-top: 8px;
}
.title span {
  margin: 0 8px;
}
.rt-songs {
  width: 100%;
  height: auto;
  max-height: 530px;
  overflow: auto;
  margin: 0 auto;
}
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
