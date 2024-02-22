<template>
  <el-carousel
    :interval="4000"
    type="card"
    height="200px"
  >
    <el-carousel-item v-for="item in items" :key="item.image" class="carousel">
      <CarouselCard :msg="item"/>
    </el-carousel-item>
  </el-carousel>
</template>

<style scoped>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__arrow {
    border: none;
    outline: 0;
    padding: 0;
    margin: 0;
    height: 36px;
    width: 36px;
    cursor: pointer;
    transition: .3s;
    border-radius: 50%;
    /*background-color: rgba(31,45,61,.11);*/
    background-color: rgba(31,45,61,.61);
    color: #fff;
    position: absolute;
    top: 50%;
    z-index: 10;
    transform: translateY(-50%);
    text-align: center;
    font-size: 12px;
  }

  .el-carousel__arrow:hover {
    background-color: rgba(31,45,61,.81);
  }

  .el-carousel__item {
    background: none;
  }

  .el-card__body {
    border: 1px #d900ff solid;
  }

  .el-carousel--horizontal {
    overflow-x: hidden;
    height: 240px;
    text-align: center;
  }
</style>

<script>
import CarouselCard from "@/components/illustration/lunbo/CarouselCard";
export default {
  components: {CarouselCard},
  props:{
    items: {
      type: Array,
      default() {
        return {};
      },
    },
  }
}
</script>
