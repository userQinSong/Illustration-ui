<template>
  <div>
    <!--块类统计-->
    <div class="title_line">
      <i class="font-big span-dom title qin-icondatabase-fill" style="margin-left: 10px">
        数据汇总
      </i>
    </div>
    <div
      v-loading="total_loading"
    >
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="box-card">
            <div class="inline">
              <h3>累计浏览时长</h3>
              <div>
                <i class="qin-icontime-circle color-green-deep"></i>
                <span>{{ totalWebsiteMsgInfo.totalRemainTime }}</span><span> s</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div class="inline">
              <h3>累计注册用户数</h3>
              <div>
                <i class="qin-iconteam color-blue-deep"></i>
                <span>{{ totalWebsiteMsgInfo.totalUserCount }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div class="inline">
              <h3>累计上线插画数</h3>
              <div>
                <i class="qin-iconpic color-orange-deep"></i>
                <span>{{ totalWebsiteMsgInfo.totalPicCount }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div class="inline">
              <h3>累计发布评论数</h3>
              <div>
                <i class="qin-iconmessage color-purple-deep"></i>
                <span>{{ totalWebsiteMsgInfo.totalCommentCount }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="box-card">
            <div class="inline">
              <h3>本月浏览时长</h3>
              <div>
                <i class="qin-icontime-circle color-green"></i>
                <span>{{ totalWebsiteMsgInfo.monthRemainTime }}</span><span> s</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div class="inline">
              <h3>本月新增用户数</h3>
              <div>
                <i class="qin-iconteam color-blue"></i>
                <span>{{ totalWebsiteMsgInfo.monthUserCount }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div class="inline">
              <h3>本月上线插画数</h3>
              <div>
                <i class="qin-iconpic color-orange"></i>
                <span>{{ totalWebsiteMsgInfo.monthPicCount }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div class="inline">
              <h3>本月新增评论数</h3>
              <div>
                <i class="qin-iconmessage color-purple"></i>
                <span>{{ totalWebsiteMsgInfo.monthCommentCount }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="box-card">
            <div class="inline">
              <h3>今日浏览时长</h3>
              <div>
                <i class="qin-icontime-circle color-green-light"></i>
                <span>{{ totalWebsiteMsgInfo.dayRemainTime }}</span><span> s</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div class="inline">
              <h3>今日新增用户数</h3>
              <div>
                <i class="qin-iconteam color-blue-light"></i>
                <span>{{ totalWebsiteMsgInfo.dayUserCount }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div class="inline">
              <h3>今日上线插画数</h3>
              <div>
                <i class="qin-iconpic color-orange-light"></i>
                <span>{{ totalWebsiteMsgInfo.dayPicCount }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div class="inline">
              <h3>今日新增评论数</h3>
              <div>
                <i class="qin-iconmessage color-purple-light"></i>
                <span>{{ totalWebsiteMsgInfo.dayCommentCount }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!--数据分析-->
    <div class="title_line">
      <i class="font-big span-dom title qin-iconfund-fill" style="margin-left: 10px">
        数据分析
      </i>
    </div>
    <!--acharts统计图-->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="浏览时长分析" name="remain_time">
        <el-row :gutter="20"
                style="margin-bottom: 50px"
                v-if="activeName === searchTypeArray[0]"
        >
          <el-col :span="16">
            <el-card class="box-card">
              <!--group_by:year-->
              <!--search_type:remain_time-->
              <LineChart
                :id="lineChartIdArray[0]"
                :group_by="groupByArray[0]"
                :search_type="searchTypeArray[0]"
                :search_year="cur_year"
                :title="lineChartTitleArray[0]"
              />
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="box-card">
              <!--group_by:hour-->
              <!--search_type:remain_time-->
              <PieChart
                :id="pieChartIdArray[0]"
                :group_by="groupByArray[1]"
                :search_type="searchTypeArray[0]"
                :search_year="cur_year"
                :title="pieChartTitleArray[0]"
              />
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="用户习惯分析" name="user">
        <el-row :gutter="20"
                style="margin-bottom: 50px"
                v-if="activeName === searchTypeArray[1]"
        >
          <el-col :span="16">
            <el-card class="box-card">
              <!--group_by:year-->
              <!--search_type:remain_time-->
              <LineChart
                :id="lineChartIdArray[1]"
                :group_by="groupByArray[0]"
                :search_type="searchTypeArray[1]"
                :search_year="cur_year"
                :title="lineChartTitleArray[1]"
              />
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="box-card">
              <!--group_by:pic-->
              <!--search_type:remain_time-->
<!--              <PieChart-->
<!--                :id="pieChartIdArray[1]"-->
<!--                :group_by="groupByArray[2]"-->
<!--                :search_type="searchTypeArray[1]"-->
<!--                :search_year="cur_year"-->
<!--                :title="pieChartTitleArray[1]"-->
<!--              />-->
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="图片统计分析" name="pic">图片统计分析</el-tab-pane>
      <el-tab-pane label="评论类型分析" name="comment">评论类型分析</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import SixDimensionChart from "@/components/illustration/echarts/sixDimensionChart/SixDimensionChart";
import {getTotalMsgInfo} from "@/network/illustration/analysis";
import LineChart from "@/components/illustration/echarts/lineChart/LineChart";
import PieChart from "@/components/illustration/echarts/pieChart/PieChart";

export default {
  name: 'DataCenter',
  components: {
    PieChart,
    SixDimensionChart,
    LineChart
  },
  data(){
    return {
      cur_year:2024,
      searchTypeArray:['remain_time','user','pic','comment'],
      groupByArray:['year','hour','pic','picolt'],

      pieChartIdArray:['pieChart_remainTime','pieChart_user'],
      lineChartIdArray:['lineChart_remainTime','lineChart_user'],
      pieChartTitleArray:['网络浏览时长分布','用户喜爱插画类型分布'],
      lineChartTitleArray:['浏览时长','注册人数'],
      activeName:"remain_time",
      totalWebsiteMsgInfo:{},
      total_loading:true,
    }
  },
  methods:{
    getTotalMsgInfo(){
      getTotalMsgInfo().then(res => {
        if(res.code === 200){
          console.log("获取到总数据集成功！",res.data)
          this.totalWebsiteMsgInfo = res.data
          this.total_loading = false;
        }else{
          console.log("获取到总数据集失败！",res.error)
        }
      })
    },
    handleClick(){

    }
  },
  created() {
    this.cur_year = new Date().getFullYear()
    this.getTotalMsgInfo()
  }
}
</script>

<style scoped>
.el-card{
  margin-bottom: 20px;
  border-radius: 10px;
  text-align: center;
  border:none
}

.inline {
  display: inline-block;
  text-align: left;
  line-height: 30px;
}


</style>
