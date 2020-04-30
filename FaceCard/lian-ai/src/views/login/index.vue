<template>
  <div class="login" ref="login">
    <div class="form-container">
        <img src="@/assets/logo.svg" alt="">
        <Form ref="formValidate" :model="formValidate" 
             :rules="ruleValidate" :label-width="0" class="form">
            <FormItem label="" prop="LoginName">
                <Input v-model="formValidate.LoginName" ref="LoginName" :maxlength="11"
                 @on-keydown.enter="handleSubmit('formValidate')" placeholder="手机号">
                    <img src="@/assets/phone-icon.svg" alt="" slot="prefix">
                </Input>
            </FormItem>
            <FormItem label="" prop="PassWord">
                <Input v-model="formValidate.PassWord" type="password"
                @on-keydown.enter="handleSubmit('formValidate')" placeholder="密码">
                    <img src="@/assets/secret-icon.svg" alt="" slot="prefix">
                </Input>
            </FormItem>
            <FormItem class="btn">
                <Button @click="handleSubmit('formValidate')"
                    style="margin-top: 10px;"
                    type="primary"
                    size="large"
                    long
                    :loading="submitting">
                    <span class="login-word">登录</span>
                </Button>
            </FormItem>
            
        </Form>
      
      <div class="link">
        <router-link to="/forget" style="color: #ccc;">忘记密码?</router-link>
        <router-link to="/register" style="color: #333;">免费注册</router-link>
      </div>
      <div class="agreement">登录即表示您已阅读并同意<a href="https://www.linkedsign.cn/Beauty/userConcer.html">《菲卡时代用户协议》</a></div>
    </div>
    
  </div>
</template>

<script>
  import { validateName,validatePsw} from '@/utils/validate'
  export default {
    name: 'login',
    data() {
      return {
            submitting: false,
            getCodeFlag: true,  //获取验证码，true需要获取，false已经获取
            time: 60,
            formValidate: {
                "LoginName": '',
                "PassWord": '', 
            },
            ruleValidate: {
                LoginName: [
                    { validator: validateName, trigger: 'blur' }
                ],
                PassWord: [
                    { validator: validatePsw, trigger: 'blur' },
                    { type: 'string',min: 4,message: '密码至少4位', trigger: 'blur' }
                ]
            }
       
      };
    },
    beforeCreate() {
      localStorage.removeItem('token')
      localStorage.removeItem('loginToken')
    },
    created() {
      this.formValidate.LoginName = localStorage.getItem("currentUserNname");
    },
    methods: {
        handleSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.doLogin();
                } else {
                    // this.$Message.error('Fail!');
                }
            })
        },
        doLogin() {
            this.submitting = true;
            // let url = '/User/Login';
            let url = '/User/PcLogin' ;
            this.$axios
            .post(url, this.formValidate, { loading: false })
            .then(res => {
                this.submitting = false;
                if (res.data.Code === '0') {
                   localStorage.setItem('loginToken', res.data.Data.Token);
                   localStorage.setItem("currentUserNname",this.formValidate.LoginName);
                   this.$router.push('/selectStore');
                   
                    // localStorage.token = res.data.Data.Token;
                    // localStorage.siteId = res.data.Data.SiteId;
                    // this.$router.push('/index')
                } else {
                    this.$Message.error(res.data.Message)
                    
                }
            })
            .catch(err => {
                this.submitting = false;
                console.error(err,99);
            });
        },
        
        }
  };
</script>
<style lang="less">
    .login{
        .ivu-input{
            padding-left: 34px;
        }
        .ivu-input-prefix{
            position: absolute;
            top: 7px;
            left: 3px;
        }
        .btn.ivu-form-item{
            margin-bottom: 0;
        }
    }
    
</style>

<style scoped lang="less">
  .login {
    display: flex;
    overflow: auto;
    color: #1b1b1b;
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;
  }

  .agreement{
    align-self: center;
    color: #999;
    margin-top: 10px;
    font-size: 13px;
    a{
      color: #333;
    }
  }

  .form-container {
    display: flex;
    flex-direction: column;
    > img{
      padding-bottom: 50px;
    }
    form {
      width: 100%;
      .ivu-input-wrapper{
            width: 320px;
        }
    }
    .link{
      width: 100%;
      margin: 10px 0 20px;
      a{
        display: inline-block;
        width: 50%;
        text-align: center;
        font-size: 14px;
        position: relative;
        &:nth-of-type(1)::before{
          content: "";
          width: 1px;
          height: 16px;
          background: #ccc;
          position: absolute;
          right: 0;
          top: 3px;
        }
      }
      
    }

    

    .ivu-btn {
      height: 40px;
    }

  }
  

  
  
</style>
