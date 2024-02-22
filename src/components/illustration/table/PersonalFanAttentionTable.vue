<template>
  <div ref="shade" class="shade_outFrame" v-show="isDisplay">
    <button class="cancelButton" @click="close">
      <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIiBmaWxsPSJub25lIj4KICA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEzLjMzMTcgMTIuMjYwMUMxMy4wMzg4IDExLjk2NzIgMTIuNTYzOSAxMS45NjcyIDEyLjI3MSAxMi4yNkMxMS45NzgxIDEyLjU1MjkgMTEuOTc4IDEzLjAyNzggMTIuMjcwOSAxMy4zMjA3TDE0LjkzODEgMTUuOTg4NUwxMi4yNzQ0IDE4LjY1MjJDMTEuOTgxNSAxOC45NDUxIDExLjk4MTUgMTkuNDIgMTIuMjc0NCAxOS43MTI5QzEyLjU2NzMgMjAuMDA1OCAxMy4wNDIxIDIwLjAwNTggMTMuMzM1IDE5LjcxMjlMMTUuOTk4NyAxNy4wNDkyTDE4LjY2NTYgMTkuNzE2N0MxOC45NTg0IDIwLjAwOTYgMTkuNDMzMyAyMC4wMDk3IDE5LjcyNjIgMTkuNzE2OEMyMC4wMTkxIDE5LjQyMzkgMjAuMDE5MiAxOC45NDkxIDE5LjcyNjMgMTguNjU2MUwxNy4wNTkzIDE1Ljk4ODZMMTkuNzI0NCAxMy4zMjM1QzIwLjAxNzIgMTMuMDMwNiAyMC4wMTcyIDEyLjU1NTggMTkuNzI0NCAxMi4yNjI5QzE5LjQzMTUgMTEuOTcgMTguOTU2NiAxMS45NyAxOC42NjM3IDEyLjI2MjlMMTUuOTk4OCAxNC45Mjc4TDEzLjMzMTcgMTIuMjYwMVoiIGZpbGw9IiNBMUFCQzkiIGZpbGwtb3BhY2l0eT0iMC44Ii8+CiAgPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTMiIHN0cm9rZT0iI0ExQUJDOSIgc3Ryb2tlLW9wYWNpdHk9IjAuOCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K"/>
    </button>
    <div class="mannuel_model_inner" @click.stop>
      <div class="shade_section">
        <div class="section_box">
          <div class="mainContent">
            <el-tabs v-model="activeName"
                     @tab-click="handleClick"
                     :stretch = true
            >
              <el-tab-pane name="fans" :disabled="activeName==='fans'">
                <span slot="label">
                  <span :class="{
                    'initialColor':!(activeName==='fans')}">
                    粉丝
                    <span :class="{
                      'blueColor':(activeName==='fans'),
                      'initialColor':!(activeName==='fans')}">
                    {{totalFansCount}}
                    </span>
                  </span>
                </span>
                <div v-infinite-scroll="loadMore"
                     v-show="loading"
                     :infinite-scroll-disabled="!fanHasNextPage"
                     infinite-scroll-distance="30"
                     class="tab-container">
                  <PersonFanItem v-for="item in fansList"
                                 :tran-person="item"
                                 :key="'fans'+item.fans_id"
                                 :change-attitude="changeAttitude"
                                 :root-person-id="person.user_id"
                                 item-type="fans"
                                 @pushItem="listPushItem"
                                 @removeItem="listRemoveItem"
                  />
                  <div class="endWordDom">
                    到底了
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane name="attention"
                           :disabled="activeName==='attention'">
                <span slot="label">
                  <span :class="{
                    'initialColor':!(activeName==='attention')}">
                    关注
                    <span :class="{
                      'blueColor':(activeName==='attention'),
                      'initialColor':!(activeName==='attention')}">
                    {{totalAttCount}}
                    </span>
                  </span>
                </span>
                <div v-infinite-scroll="loadMore"
                     v-show="loading"
                     :infinite-scroll-disabled="!attHasNextPage"
                     infinite-scroll-distance="30"
                     class="tab-container">
                  <PersonFanItem v-for="item in attList"
                                 :tran-person="item"
                                 :key="'attention'+item.attention_id"
                                 :change-attitude="changeAttitude"
                                 :root-person-id="person.user_id"
                                 item-type="attention"
                                 @pushItem="listPushItem"
                                 @removeItem="listRemoveItem"
                  />
                  <div class="endWordDom">
                    到底了
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import PersonFanItem from "@/components/illustration/table/PersonFanItem";
import {getConcernPersonListByUserId} from "@/network/illustration/person";
import {checkObj} from "@/common/uctil";
import {changeAttentionOnePerson} from "@/network/illustration/person";

export default {
  name: "PersonFanAttentionTable",
  components: {PersonFanItem},
  data(){
    return {
      activeName:"fans",
      isDisplay:false,
      loading: true,
      //粉丝列表数据
      fansList:[],
      fanPageNum:1,
      fanHasNextPage:true,
      totalFansCount:0,
      //关注列表数据
      attList:[],
      attPageNum:1,
      attHasNextPage:true,
      totalAttCount:0,
      //每页大小
      pageSize:10
    }
  },
  props:{
    person:Object,
    changeAttitude:Function
  },
  methods:{
    initData(person){
      if(checkObj(person)){
        //分别初始化粉丝栏和关注栏
        this.pushMoreConcernPersonData(person,'fans',this.fanPageNum)
        this.pushMoreConcernPersonData(person,'attention',this.attPageNum)
      }
    },
    handleClick(tab, event) {
    },
    open(beginType){
      console.log("打开了",beginType)
      this.activeName = beginType
      this.isDisplay = true
    },
    close(){
      this.isDisplay = false
    },
    loadMore(){
      if(this.activeName === 'fans' && this.fanHasNextPage){
        this.pushMoreConcernPersonData(this.activeName,this.fanPageNum)
      }else if(this.activeName === 'attention' && this.attHasNextPage){
        this.pushMoreConcernPersonData(this.activeName,this.attPageNum)
      }
    },
    pushMoreConcernPersonData(person,search_user_type,pageNum){
      getConcernPersonListByUserId({
        attitude_person_id:this.curLoginUserId,
        user_id:person.user_id,
        search_user_type:search_user_type,
        pageNum:pageNum,
        pageSize:this.pageSize
      }).then(res => {
        if(res.code === 200){
          console.log("获取到某关系列表：",res.data)
          if(search_user_type === 'fans'){
            this.fanHasNextPage =res.data.hasNextPage
            this.totalFansCount = res.data.total
            res.data.list.forEach(item => {
              this.fansList.push(item.userConcernVo)
            })
            this.$nextTick(() => {
              console.log("add 粉丝列表：",this.fansList)
              this.fanPageNum += 1
            })
          }else if(search_user_type === 'attention'){
            this.attHasNextPage =res.data.hasNextPage
            this.totalAttCount = res.data.total
            res.data.list.forEach(item => {
              this.attList.push(item.userConcernVo)
            })
            this.$nextTick(() => {
              console.log("add 关注列表：",this.attList)
              this.attPageNum += 1
            })
          }else
            console.log("当前activeName不存在：",this.activeName)
        }else{
          console.log("获取关系列表失败！",res.error)
        }
      })
    },
    listFansPush(item){
      //粉丝列表中增加元素
      this.fansList.unshift(item)
    },
    listFansRemove(obj){
      //粉丝列表中移除元素
      this.fansList = this.fansList.filter(item=>{
        return item.user_id !== obj.user_id
      })
    },
    listPushItem(param){
      if(checkObj(param.item)){
        console.log("添加前获得param item:",param.item);
        //只有在当前登录用户为当前展示界面时才进行列表的增添和删除
        if(this.person.user_id === this.curLoginUserId){
          this.totalAttCount += 1
          this.attList.unshift(param.item);
        }
        //如果粉丝列表也有该用户，应为粉丝行为不受自身控制，不能从粉丝列表移除，但需要更改渲染状态为'已关注'
        this.displayPersonAttention(param.item.user_id,true);
      } else{
        this.$message.error("列表更新参数错误")
      }
    },
    listRemoveItem(param){
      if(checkObj(param.item)){
        console.log("删除前获得param:",param);
        console.log("删除前获得param item:",param.item);
        //只有在当前登录用户为当前展示界面时才进行列表的增添和删除
        if(this.person.user_id === this.curLoginUserId){
          this.totalAttCount -= 1
          this.attList = this.attList.filter(item => {
            return item.user_id !== param.item.user_id
          })
        }
        //如果粉丝列表也有该用户，应为粉丝行为不受自身控制，不能从粉丝列表移除，但需要更改渲染状态为'关注'
        this.displayPersonAttention(param.item.user_id,false);
        this.$nextTick(()=>{
          console.log("删除后获得attlist:",this.attList);
        })
      }else{
        this.$message.error("列表更新参数错误")
      }
    },
    displayPersonAttention(targetPersonId,setValue){
      this.fansList.forEach(item => {
        if(item.user_id === targetPersonId)
          item._person_attention = setValue
      })
      this.attList.forEach(item =>{
        if(item.user_id === targetPersonId)
          item._person_attention = setValue
      })
    }
  },
  created() {
    this.initData(this.person);
  },
  computed:{
    hasLoginUser(){
      return checkObj(localStorage.getItem("curLoginUser"))
    },
    curLoginUserId(){
      return this.hasLoginUser?JSON.parse(localStorage.getItem("curLoginUser")).user_id:null
    }
  },
}
</script>

<style lang="less" scoped>
.shade_outFrame {
  transition-property: opacity;
  transition-duration: 200ms;
  transition-timing-function: ease;
  opacity: 1;
  background-color: rgba(0,0,0,.851);
  position: fixed;
  inset: 0rem;
  border-radius: 0rem;
  z-index: 200;
  pointer-events: auto;
}

.mannuel_model_inner {
  padding: 0;
  border-radius: 0.75rem;
  overflow: hidden;
  margin-top: 70px;
  position: fixed;
  width: 100%;
  top: 0px;
  bottom: 0px;
  max-height: 100%;
  z-index: 200;
  pointer-events: none;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  align-items: flex-start;
}

.shade_section {
  transition-property: transform, opacity;
  transition-duration: 200ms;
  transition-timing-function: ease;
  transform-origin: center center;
  opacity: 1;
  transform: scale(1);
  background-color:#fff;
  border-radius: 0.75rem;
  overflow-x: hidden;
  outline: 0;
  -webkit-tap-highlight-color: transparent;
  display: block;
  text-decoration: none;
  color: rgb(0, 0, 0);
  box-sizing: border-box;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0.0625rem 0.1875rem, rgba(0, 0, 0, 0.05) 0px 2.25rem 1.75rem -0.4375rem, rgba(0, 0, 0, 0.04) 0px 1.0625rem 1.0625rem -0.4375rem;
  pointer-events: all;
  flex: 0 0 556px;
  max-width: 100%;
  max-height: calc(100vh - (5vh * 2));
}

.section_box {
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: #fff;
  border-radius: 0.75rem;
  margin-top: 0.5rem;
}

.mainContent {
  padding: 0 2rem 43px 2rem;
  --tw-bg-opacity: 1;
  background-color: rgb(255,255,255);
  width: 100%;
  max-height: 712px;
  margin: auto;
}

/deep/ .el-tabs{
  .el-tabs__header{
    padding: 0;
    position: relative;
    margin: 0;
    border-bottom: 1px solid rgb(236, 237, 245);
    .el-tabs__nav-wrap{
      .el-tabs__nav-scroll{
        .el-tabs__nav{
          .el-tabs__active-bar{
            display: none;
          }
          .el-tabs__item{
            color:#666;
            font-weight: 400;
            font-size: 1.25rem;
            line-height: 1.75rem;
            border: 0;
            transition-property: color,background-color,border-color,text-decoration-color,fill,stroke;
            transition-timing-function: cubic-bezier(.4,0,.2,1);
            transition-duration: .15s;
            -webkit-appearance: button;
            background-image: none;
            height: 4rem;
            -webkit-tap-highlight-color: transparent;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
            cursor: pointer;
            appearance: none;
            background-color: transparent;
            text-align: left;
            text-decoration: none;
            box-sizing: border-box;
            position: relative;
            padding: 0.625rem 1rem;
            white-space: nowrap;
            z-index: 0;
            display: flex;
            -webkit-box-align: center;
            align-items: center;
            -webkit-box-pack: center;
            justify-content: center;
            line-height: 1;
            margin-bottom: -0.125rem;
            border-radius: 0.25rem 0.25rem 0 0;
          }
          .el-tabs__item.is-active{
          }
          .el-tabs__item.is-active::after {
            content: " ";
            background: linear-gradient(83deg, rgb(23, 62, 255) 0%, rgb(27, 125, 255) 100%);
            height: 5px;
            width: 79px;
            margin-bottom: 3px;
            border-radius: 999px;
            position: absolute;
            bottom: 0;
          }
        }
      }
    }
  }
  .el-tabs__nav-wrap::after{
    display: none;
  }
}

.tab-container {
  padding-top: 10px;
  min-height: 400px;
  max-height: 400px;
  overflow-y: auto;
}

.endWordDom {
  color: #999;
  font-size: 14px;
  text-align: center;
  padding: 46px 0 118px;
}

.totalWord {
  color: rgb(34, 34, 34);
  font-weight: 500;
  font-size: 1.25rem;
  line-height: 1.75rem;
  padding-bottom: 0;
}

.blueColor {
  color: rgb(49, 98, 255);;
}

.initialColor {
  color: #666;
}

.cancelButton {
  top: 70px;
  right: calc(50vw - 322px);
  position: absolute;
  -webkit-tap-highlight-color: transparent;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  cursor: pointer;
  appearance: none;
  font-size: 1rem;
  text-align: left;
  text-decoration: none;
  box-sizing: border-box;
  border-radius: 0.25rem;
  padding: 0;
  line-height: 1;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  min-height: 1.375rem;
  min-width: 1.375rem;
  border: 0.0625rem solid transparent;
  background-color: transparent;
  color: rgb(134, 142, 150);
  margin-left: auto;
  margin-right: 0px;
  width: 2.25rem;
  height: 2.25rem;
  text-transform: none;
  overflow: visible;
}

button:not(.rigid) {
  transition-property: color,background-color,border-color,text-decoration-color,fill,stroke;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
  transition-duration: .15s;
}
[type=button], [type=reset], [type=submit], button {
  -webkit-appearance: button;
  background-image: none;
}

.cancelButton img {
  height: 32px;
  width: 32px;
  border-style: none;
  vertical-align: middle;
  max-width: 100%;
  display: block;
}
</style>
