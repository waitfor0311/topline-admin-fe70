<template>
  <div class="login-wrap">
    <!-- 给组件加class 会作用在根元素上 -->
    <div class="form-wrap">
      <div class="form-head">
         <img src="./logo_index.png" alt="黑马头条号">
      </div>
      <el-form class="login-form" ref="form" :model="form">
        <el-form-item>
          <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <!-- el-col 栅格布局。一共24 列：span 用来指定占用大小 :offset 用来指定偏移量 -->
          <el-col :span="14">
            <el-input v-model="form.code" placeholder="请输入验证码"></el-input>
          </el-col>
          <el-col :offset="1" :span="9">
            <el-button @click="handleSendCode">获取验证码</el-button>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button class="btn-login" type="primary" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import '@/vendor/gt'
export default {
  name: 'AppLogin',
  data () {
    return {
      form: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    handleLogin () {
      // const { mobile, code } = this.form
      axios({
        method: 'POST',
        url: 'http://ttapi.research.itcast.cn/mp/v1_0/authorizations',
        data: this.form
      }).then(res => {
        // console.log(res.data)
        this.$message({
          message: '恭喜成功',
          type: 'success'
        })
        this.$router.push({
          name: 'home'
        })
      })
        .catch((e) => {
          this.$message.error('登陆失败，手机号或验证码错误')
        })
    },
    handleSendCode () {
      const { mobile } = this.form
      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        const { data } = res.data
        window.initGeetest({
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: data.new_captcha,
          product: 'bind' // 隐藏，直接弹出
        }, function (captchaObj) {
          captchaObj.onReady(function () {
          // 验证码ready之后才能调用verify方法显示验证码
            captchaObj.verify() // 弹出验证内容框
          }).onSuccess(function () {
          // your code
            const {
              geetest_challenge: challenge,
              geetest_seccode: seccode,
              geetest_validate: validate } = captchaObj.getValidate()
            axios({
              method: 'GET',
              url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${mobile}`,
              params: {
                challenge,
                validate,
                seccode
              }
            }).then(res => {
              console.log(res.data)
            })
          }).onError(function () {
          // your code
          })
          // 在这里注册”发送验证码“ 的按钮点击事件
        })
      })
    }
  }
}
</script>
<style lang="less">
  .login-wrap {
    height: 100%;
    background-color: rgb(150, 245, 245);
    display: flex;
    justify-content: center;
    align-items: center;
    .form-head {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    img {
      width: 200px;
    }
  }
  .form-wrap {
    width: 400px;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    .btn-login {
      width: 100%;
    }
  }
}

</style>
