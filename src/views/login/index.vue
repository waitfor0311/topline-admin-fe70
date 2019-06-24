<template>
  <div class="login-wrap">
    <!-- 给组件加class 会作用在根元素上 -->
    <div class="form-wrap">
      <div class="form-head">
         <img src="./logo_index.png" alt="黑马头条号">
      </div>
      <el-form
        class="login-form"
        ref="form"
        :model="form"
        :rules="rules"
      >
        <el-form-item prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <!-- el-col 栅格布局。一共24 列：span 用来指定占用大小 :offset 用来指定偏移量 -->
          <el-col :span="14">
            <el-input v-model="form.code" placeholder="请输入验证码"></el-input>
          </el-col>
          <el-col :offset="1" :span="9">
            <!-- <el-button @click="handleSendCode">获取验证码</el-button> -->
          <el-button
            @click="handleSendCode"
            :disabled="!!codeTimer"
            > {{ codeTimer ? `剩余${codeTimeSeconds}秒`:'获取验证码' }}</el-button>
          </el-col>
        </el-form-item>
        <el-form-item prop="agree">
         <el-checkbox class="agree-checkbox" v-model="form.agree"></el-checkbox>
         <span class="agree-text">我已阅读并同意<a href="#">用户协议</a>和<a href="#">隐私条款</a></span>
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
const initCodeTimeseconds = 60
export default {
  name: 'AppLogin',
  data () {
    return {
      form: { // 表单数据对象
        mobile: '',
        code: '',
        agree: ''
      },
      rules: { // 验证规则对象
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          // { len: 11, message: '长度必须11位', trigger: 'blur' }
          { pattern: /\d{11}/, message: '请输入有效的手机号', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          // { len: 6, message: '长度必须6位', trigger: 'blur' }
          { pattern: /\d{6}/, message: '请输入有效的验证码', trigger: 'blur' }
        ],
        agree: [
          { required: true, message: '请同意用户协议' },
          { pattern: /true/, message: '请同意用户协议' }
        ]
      },
      codeTimer: null, // 倒计时定时器
      codeTimeSeconds: initCodeTimeseconds // 倒计时事件
    }
  },
  methods: {
    handleLogin () {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        this.submitLogin()
      })
    },
    submitLogin () {
      axios({
        method: 'POST',
        url: 'http://ttapi.research.itcast.cn/mp/v1_0/authorizations',
        data: this.form
      }).then(res => {
        // console.log(res.data)
        this.$message({
          message: '登录成功',
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
      // 验证手机号是否有效
      this.$refs['form'].validateField('mobile', errorMessage => {
        if (errorMessage.trim().length > 0) {
          return
        }
        // 验证通过，初始化显示验证码
        this.showGeetest()
      })
    },
    /**
     * 验证通过，初始化显示人机交互验证码 */
    showGeetest () {
      // 函数中的function内部的this指向window
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
        }, captchaObj => {
          captchaObj.onReady(() => {
          // 验证码ready之后才能调用verify方法显示验证码
            captchaObj.verify() // 弹出验证内容框
          }).onSuccess(() => {
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
              this.codeCountDown()
            })
          }).onError(function () {
          // your code
          })
          // 在这里注册”发送验证码“ 的按钮点击事件
        })
      })
    },
    /**
     * 验证码倒计时
     */
    codeCountDown () {
      this.codeTimer = window.setInterval(() => {
        this.codeTimeSeconds--
        if (this.codeTimeSeconds <= 0) {
          // 清除定时器
          window.clearInterval(this.codeTimer)
          this.codeTimeSeconds = initCodeTimeseconds
          this.codeTimer = null // 讲存储的定时器引用的变量重新赋值为null
        }
      }, 1000)
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
