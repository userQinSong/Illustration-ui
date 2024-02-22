<template>
  <div class="form-main">
    <el-form :model="curDisplayMsg"
             :rules="rules"
             ref="ruleForm"
             class="demo-ruleForm"
             @submit.native.prevent
             validate-on-rule-change
    >
      <el-form-item label="插画名称">
        <el-input v-model="curDisplayMsg.pic_name"
                  @input="$emit('update:cur-display-msg.pic_name',curDisplayMsg.pic_name)"
                  maxlength="15"
                  show-word-limit
        ></el-input>
        <el-input style="display: none" type="text"/>
      </el-form-item>
      <el-form-item label="空间大小">
        <el-input :value="space_size"
                  disabled
                  show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="插画类型">
        <el-select v-model="curDisplayMsg.pic_type"
                   placeholder="请选择"
                   :popper-append-to-body="false"
                   @change="$emit('update:cur-display-msg.pic_type',curDisplayMsg.pic_type)">
          <el-option
            v-for="item in type_list"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {spaceNumFormat} from "@/common/uctil";
import {getTypeList} from "@/network/illustration/cats";
import {mapState} from "vuex";

export default {
  name: "PicEditForm",
  props:{
    curDisplayMsg:Object
  },
  data(){
    return {
      rules: {
        name: [
          { required: true, message: '请填写名称', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        desc: [
          { required: false, message: '简介不能含有违规字符', trigger: 'blur' }
        ],
      },
      space_size:'',
    }
  },
  created() {
    this.getTags();
    this.space_size =spaceNumFormat( this.curDisplayMsg.pic_space_size)
  },
  methods:{
    getTags(){
      getTypeList().then(res => {
        if(res.code === 200){
          console.log("获取type成功！",res.data)
          this.options = res.data
          this.$nextTick(()=>{
            this.opt_loading = false;
          })
        }else{
          console.log("获取tag失败！",res.data)
        }
      })
    },
    publish(){

    }
  },
  computed:{
    ...mapState({
      tag_list: state => state.illustration.tag_list,
      type_list: state => state.illustration.type_list
    }),
  }
}
</script>

<style scoped>
.form-main {
  margin: 10px 20px;
  max-height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
}

.flex-row {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.flex-button {
  width: 220px;
}

.blue-back {
  background-color: rgb(23,62,255);
}

.white-word {
  color: #fff;
}
.input-color {
  background-color: #f2f5f9;
}
</style>
