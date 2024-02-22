<template>
  <div>
    <el-form
      ref="form"
      label-width="70px"
      :inline="true"
      class="login-container"
      :model="form"
      :rules="rules"
    >
      <h1 class="login_title">登 录</h1>

      <el-form-item
        label="手机号"
        prop="CellPhone"
        ref="phone"
      >
        <el-input v-model="form.CellPhone" placeholder="请输入手机号">
          <el-select v-model="territory" class="select-dom">
            <el-option label="+86" :value="86"></el-option>
          </el-select>
        </el-input>
      </el-form-item>

      <el-form-item
        label="验证码"
        prop="VerificationCode"
      >
        <el-input v-model="form.VerificationCode" placeholder="请输入验证码">
          <el-button slot="suffix" :disabled="disabled" @click="getCode">
            <span class="Time">{{btnTxt}}</span>
          </el-button>
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click="submit" class="login_button" type="primary">一 键 登 录 注 册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {GetPhone} from "@/network/illustration/person";
import {checkObj, getCurrentTimeSeconds} from "@/common/uctil";

export default {
  name: "LoginForm",
  created() {
    this.form.CellPhone = this.loginUser.phone_number
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      // 判断输入框中是否输入手机号
      if (!value) {
        callback(new Error('手机号不能为空'))
      }
      //正则表达式进行验证手机号，从1开始，第二位是35789中的任意一位，以9数字结尾
      if (!/^1[35789]\d{9}$/.test(value)) {
        callback(new Error('手机号格式不正确'))
      }
      callback()
    }
    return {
      btnTxt: "获取验证码",
      // 是否禁用  即点击之后一段时间内无法再点击
      disabled: false,
      time: 0,
      territory:86,
      form: {
        CellPhone: '',
        VerificationCode: '111111',
      },
      rules: {
        CellPhone: [
          { required: true, trigger: 'blur', message: '请输入11位手机号'},
          { required: true, trigger: 'blur', min: 11, max: 11, message: '长度不符合'},
          { required: true, trigger: 'blur', validator: validatePhone}
        ],
        VerificationCode: [
          { required: true, trigger: 'blur', message: '请输入6位验证码'},
          { required: true, trigger: 'blur', min: 6, max: 6,message: '验证码错误'}
        ],
      }
    }
  },
  props:{
    closeFn:Function,
  },
  methods: {
    //获取手机验证码方法
    getCode() {
      // 校验手机号码
      if (!this.form.CellPhone) {
        //号码校验不通过
        this.$message({
          message: '请输入手机号',
          type:'warning',
        });
        //正则判断 从1开始，第二位是35789中的任意一位，以9数字结尾
      } else if (!/1[35789]\d{9}/.test(this.form.CellPhone)) {
        // 失去焦点后自动触发校验手机号规则
      } else {
        this.time = 60;
        this.disabled = true;
        //调用倒计时方法
        this.timer();
        // 封装的axios接口
      }
    },
    // 倒计时方法
    timer() {
      if (this.time > 0) {
        this.time--;
        this.btnTxt = this.time + "s后重新获取验证码";
        setTimeout(this.timer, 1000);
      } else {
        this.time = 0;
        this.btnTxt = "获取验证码";
        this.disabled = false;
      }
    },
    // 提交按钮
    submit() {
      GetPhone({
        CellPhone: this.form.CellPhone,
      }) .then((res) => {
        if (res.code === 200) {
          this.$message({
            message: '验证成功',
            type: 'success',
          })
          localStorage.setItem("curLoginUser",JSON.stringify(res.data));
          localStorage.setItem("login_time", getCurrentTimeSeconds() + '')
          this.closeFn();
        } else {
          this.$message({
            message: '发送失败',
            type: 'warning',
          })
          console.log("发现登录失败回馈：")
        }
      })
    },
  },
  computed:{
    loginUser(){
      if(checkObj(localStorage.getItem("curLoginUser"))){
        return JSON.parse(localStorage.getItem("curLoginUser"))
      }else
        return {phone_number:''}
    }
  },
}
</script>

<style lang="less" scoped>
.login-container {
  width: 400px;
  border:1px solid #eaeaea;
  padding: 35px 35px 15px 35px;
  border-radius: 15px;
  box-shadow: 0 0 25px #cac6c6;
  background-color: #ffffff;
  box-sizing: border-box;
  /deep/ .el-input__inner {
    width: 120%;
    border: 0px;
    border-bottom: 1px solid;
  }
  .el-button {
    border: 0px;
    margin: -80px;
    .span {
      margin-left: 50px;
    }
  }
  .login_title {
    text-align: center;
    margin-bottom: 40px;
    font-size: 26px;
    font-weight: 600;
    line-height: 32px;
    color: #333;
  }
  .el-input {
    width: 198px;
  }
  .login_button {
    margin-left: 90px;
    margin-top: 10px;
  }
  .time {
    width: 50px;
  }
}

.select-dom {
  width: 70px;
  height: 30px;
}

</style>
