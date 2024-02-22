<template>
  <div style="width: auto;height: 470px"
       v-loading="chart_loading"
       :id="id"
  >
  </div>
</template>

<script>
import echarts from 'echarts'
import {getLineMsgPack} from "@/network/illustration/analysis";
const colors = ['#aa4b17', '#1897a3']
export default {
  name: 'LineChart_RemainTime',
  created() {
    console.log("当前props:",this.id,this.search_type,this.search_year,this.chart_loading)
    this.getAnalysisMsg()
  },
  props:{
    id:String,
    group_by:String,
    search_type:String,
    search_year:Number,
    title:String
  },
  methods: {
    echartsInit () {
      // 在生命周期中挂载
      echarts.init(document.getElementById(this.id)).setOption(this.option)
    },
    initData(){
      if(this.search_type === 'user'){
        console.log("user数据包：",this.curYearlineChartVos,this.lastYearLineChartVos)
      }
      //0代表去年的数据
      this.option.xAxis[0].data = this.lastYearLineChartVos.map(item => {return item.group_name})
      this.option.series[0].data = this.lastYearLineChartVos.map(item => {return item.group_value})
      //1代表今年的数据
      this.option.xAxis[1].data = this.curYearlineChartVos.map(item => {return item.group_name})
      this.option.series[1].data = this.curYearlineChartVos.map(item => {return item.group_value})
      this.$nextTick(()=>{
        this.chart_loading = false;
        this.echartsInit()
      })
    },
    getAnalysisMsg(){
      getLineMsgPack({
        search_type:this.search_type,
        begin_year:this.search_year,
        end_year:this.search_year,
        group_by:this.group_by
      }).then(res=>{
        console.log("返回信息：",res)
        if(res.code === 200){
          console.log("获取数据分析信息包成功！",res.data)
          //组装折线图（需要今年和前年的数据）
          this.curYearlineChartVos = res.data.curYearMsgPack.lineChartVos;
          this.lastYearLineChartVos = res.data.lastYearMsgPack.lineChartVos;
          this.initData()
        }else{
          console.log("获取数据分析信息包失败")
        }
      })
    },
  },
  data () {
    return {
      chart_loading:true,
      curYearlineChartVos:[],
      lastYearLineChartVos:[],
      // option配置
      option: {
        color: colors,
        backgroundColor:'',//背景颜色透明
        tooltip: {
          trigger: 'none',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {},
        grid: {
          top: 70,
          bottom: 50
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: colors[0]
              }
            },
            axisPointer: {
              label: {
                formatter: params => {
                  return (
                    params.seriesData[0].seriesName.slice(0,-6) + '  ' +
                    params.value +
                    (params.seriesData.length ? '：' + params.seriesData[0].data : '')
                  )
                }
              }
            },
            // prettier-ignore
            data: ['2015-1', '2015-2', '2015-3', '2015-4', '2015-5', '2015-6', '2015-7', '2015-8', '2015-9', '2015-10', '2015-11', '2015-12']
          },
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: colors[1]
              }
            },
            axisPointer: {
              label: {
                formatter: params => {
                  return (
                    params.seriesData[0].seriesName.slice(0,-6) + '  ' +
                    params.value +
                    (params.seriesData.length ? '：' + params.seriesData[0].data : '')
                  )
                }
              }
            },
            // prettier-ignore
            data: ['2016-1', '2016-2', '2016-3', '2016-4', '2016-5', '2016-6', '2016-7', '2016-8', '2016-9', '2016-10', '2016-11', '2016-12']
          },
        ],
        yAxis: [
          {
            name: 's',
            type: 'value',
            splitLine:{show: false},//去除网格线
          },
        ],
        series: [
          {
            name:this.title + '(' + (this.search_year - 1) + ')',
            type: 'line',
            smooth: true,
            emphasis: {
              focus: 'series'
            },
            itemStyle: {
              color: '#ee62a4',
              normal: {
                lineStyle: {        // 系列级个性化折线样式
                  width: 2,
                  type: 'solid',
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#f60522'
                  }, {
                    offset: 1,
                    color: '#f3c10a'
                  }]),//线条渐变色
                }
              },
            },//线条样式
            data: [
              2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
            ]
          },
          {
            name: this.title + '(' + this.search_year + ')',
            type: 'line',
            smooth: true,
            xAxisIndex: 1,
            emphasis: {
              focus: 'series',
            },
            itemStyle: {
              color: '#6A5ACD',
              normal: {
                lineStyle: {        // 系列级个性化折线样式
                  width: 2,
                  type: 'solid',
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#6A5ACD'
                  }, {
                    offset: 1,
                    color: '#5ccda5'
                  }]),//线条渐变色
                }
              },
            },//线条样式
            data: [
              3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7
            ]
          },
        ]
      }
    }
  },
}
</script>

<style scoped>

</style>
