<template>
  <div class="topBar">
    {{this.$store.getters["path/currentPath"]}}
  </div>
</template>

<script>
import LeftMenu from "views/left/LeftMenu";
export default {
  name: "RightRouteBar",
  data() {
    return {
      transitionName: "",
      timeLineHeight: "",
    };
  },
  methods: {},
  mounted() {
  },
};
</script>
<style  scoped>
  .topBar {
    width: 100%;
    height: 30px;
    padding: 10px 20px;
    border-bottom: 1px solid #bfbebe;
    font-size: 18px;
    color: #666666;
    border-bottom-width: thin;
    box-shadow: 0px 1px 10px 0px rgba(0,0,0,0.2);
    margin-bottom: 10px;
    text-align: left;
    line-height: 30px;
  }
</style>
