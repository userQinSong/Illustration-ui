<template>
  <div style="width: auto;height: 325px" :id="id"
       v-loading="chart_loading">
  </div>

</template>

<script>
import echarts from 'echarts'
import {getPieMsgPack} from "@/network/illustration/analysis";
export default {
  name: 'PieChart',
  created() {
    this.getAnalysisMsg(this.search_year)
  },
  props:{
    id:String,
    group_by:String,
    search_type:String,
    search_year:Number,
    title:String,
  },
  methods: {
    echartsInit () {
      // 在生命周期中挂载
      echarts.init(document.getElementById(this.id)).setOption(this.option)
    },
    initData(){
      //0代表去年的数据
      this.option.series[0].data = this.curYearPieChartVos.map(item =>{return {value:item.group_value,name:item.group_name}})
      this.$nextTick(()=>{
        this.chart_loading = false;
        this.echartsInit()
      })
    },
    getAnalysisMsg(){
      getPieMsgPack({
        search_type:this.search_type,
        begin_year:this.search_year,
        end_year:this.search_year,
        group_by:this.group_by,
        pie_count:this.pie_count
      }).then(res=>{
        console.log("返回信息：",res)
        if(res.code === 200){
          console.log("获取数据分析信息包成功！",res.data)
          //组装折线图（需要今年和前年的数据）
          this.curYearPieChartVos = res.data.curYearMsgPack.pieChartVos;
          this.initData()
        }else{
          console.log("获取数据分析信息包失败")
        }
      })
    },
  },
  data () {
    return {
      curYearPieChartVos:[],
      chart_loading:true,
      pie_count:5,
      // option配置
      option: {
        title: {
          text: this.title + "(" + this.search_year + ")",
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
        },
        legend:{
          bottom: '0',
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 1048, name: 'Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union' },
              { value: 300, name: 'Video' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }
  },
}
</script>

<style scoped>

</style>
