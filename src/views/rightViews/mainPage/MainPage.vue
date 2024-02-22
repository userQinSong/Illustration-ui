<template>
  <WaterFallLayout
    ref="waterFall"
    :get-list="getPicoltList"
    :pointer-fn="intoPicolt"
    :imgs-array="imgsArray"
    item-type="picolt"
    :padding-num="19"
    class="title-layout"
  >
    <Carousel :items="lunbos" :interval="interval" style="margin-top: 10px"/>
    <div class="center-content" :style="{flex:1}">
      <div class="title_line">
        <div class="span-dom title" style="margin-left: 10px">插画广场</div>
      </div>
      <CategoryButtons
        :array="tag_list"
        :click-fn="changeCategory"/>
    </div>
  </WaterFallLayout>
</template>

<script>
import Carousel from "@/components/illustration/lunbo/Carousel";
import CategoryButtons from "@/components/illustration/catagory/CategoryButtons";
import WaterFallLayout from "@/components/illustration/layoutDisplay/waterFall/WaterFallLayout";
import {getPicoltList} from "@/network/illustration/picolts";
import {getTagList} from "@/network/illustration/cats";
import {checkObj} from "@/common/uctil";
import {mapState} from "vuex";

export default {
  name:"MainPage",
  components: {
    Carousel,
    WaterFallLayout,
    CategoryButtons,
  },
  data() {
    return {
      loading_tags:true,
      search_picolt_tag:'',
      search_picolt_name:'',
      categoryArray:[],
      //上一次获取数据时所记录的高度
      //轮播
      //轮播信息组
      lunbos: [
        {
          url: 'https://liblibai-online.vibrou.com/img/148ecce3d0a74e3ca867307cd77bc1cd/72f1e8493bd8820840991c3edca09543387da12b680d9fc542bb88756f578df7.jpg',
          title: '标题一',
          description: '描述一'
        },
        {
          url: 'https://liblibai-online.vibrou.com/img/0c15de7562ea4a3f876c3b8dfeb9e6a6/1d54ad65bfa1f2f5e38f562dc5bf4289611224611af16d780bbc2998f1a2bf2a.png',
          title: '标题二',
          description: '描述二'
        },
        {
          url: 'https://img2.baidu.com/it/u=2529954454,3715771455&fm=253&fmt=auto&app=138&f=JPEG?w=1188&h=500',
          title: '标题三',
          description: '描述三'
        }
      ],
      //轮播间隔
      interval: 3000,
      //插画广场
      //插画数组
      picoltVoArray: [],
      imgsArray:[],
      //分页
        pageNum:1,
        pageSize:20,
    };
  },
  methods:{
    //用于获取插画集列表
    async getPicoltList(){
      getPicoltList({
        attitude_person_id:this.hasLoginUser?JSON.parse(localStorage.getItem("curLoginUser")).user_id:null,
        picolt_name:this.search_picolt_name,
        picolt_tag:this.search_picolt_tag,
        pageNum:this.pageNum,
        pageSize:this.pageSize
      }).then(res => {
        if(res.code === 200){
          console.log("获取插画集成功",res.data)
          let addArray = [];
          res.data.list.forEach(item => {
            addArray.push({
              picolt_count: item.picolt.picolt_count,
              picolt_cover: item.picolt.picolt_cover,
              picolt_download: item.picolt.picolt_download,
              picolt_collect:item.picolt.picolt_collect,
              picolt_id: item.picolt.picolt_id,
              picolt_love: item.picolt.picolt_love,
              picolt_name: item.picolt.picolt_name,
              picolt_type: item.picolt.picolt_type,
              potrait_src: item.creator.potrait_src,
              user_name: item.creator.user_name,
              is_like:item.attitude._like,
              is_collect:item.attitude._collect,
            });
          })
          this.imgsArray.push(...addArray);
          console.log("@ad",this.imgsArray)
          this.pageNum++
        }else{
          console.log('获取插画集失败')
        }
      })
    },
    intoPicolt(picolt_id){
      this.$router.push(
        {
          name:'PicoltDetailPage',
          params:{picolt_id:picolt_id}
        }
      )
    },
    changeCategory(catName){
      console.log("点击了，分类名称为"+catName)
      this.search_picolt_tag = catName;
      this.renewImgsList();
      this.getPicoltList();
    },
    renewImgsList(){
      this.imgsArray = [];
      this.pageNum = 1;
    },
  },
  computed:{
    ...mapState({
      tag_list: state => state.illustration.tag_list,
      type_list: state => state.illustration.type_list
    }),
    hasLoginUser(){
      return checkObj(localStorage.getItem("curLoginUser"))
    },
  }
}
</script>

