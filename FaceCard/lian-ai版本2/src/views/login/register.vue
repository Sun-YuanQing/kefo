<template>
   <div class="register">
       <Header title="注册"></Header>
       <div class="container">
           <Form ref="registerForm" :model="formValidate" :rules="ruleValidate" :label-width="0" class="form">
                <FormItem label="" prop="LoginName">
                    <Input v-model="formValidate.LoginName" ref="LoginName" :maxlength="11" placeholder="手机号">
                        <img src="@/assets/phone-icon.svg" alt="" slot="prefix">
                    </Input>
                </FormItem>
                <FormItem label="" prop="AuthCode" class="authCode">
                    <Input v-model="formValidate.AuthCode" placeholder="验证码">
                        <img src="@/assets/verify-icon.svg" alt="" slot="prefix">
                    </Input>
                    <div class="captcha-num">
                        <span @click="getCode()" class="captcha" v-if="getCodeFlag">获取验证码</span>
                        <span v-if="!getCodeFlag">重新发送（{{time}}s）</span>
                    </div>
                </FormItem>
                <FormItem label="" prop="PassWord">
                    <Input v-model="formValidate.PassWord" type="password" placeholder="密码(最少6位)">
                        <img src="@/assets/secret-icon.svg" alt="" slot="prefix">
                    </Input>
                </FormItem>
                <FormItem label="" prop="PassWord2">
                    <Input v-model="formValidate.PassWord2" type="password" placeholder="再次输入密码">
                        <img src="@/assets/secret-icon.svg" alt="" slot="prefix">
                    </Input>
                </FormItem>
                <FormItem>
                    <Button @click="handleSubmit('registerForm')"
                            style="margin-top: 10px;"
                            type="primary"
                            size="large"
                            long >
                        <span class="login-word">确定</span>
                    </Button>
                </FormItem>
            </Form>
            
       </div>
    </div> 
</template>
<script>
import Header from '@/components/route-header'
import { validateName,validatePsw,validateCode} from '@/utils/validate'
export default {
    components: {Header},
    data () {
        const validatePsw2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else {
                if(value !== this.formValidate.PassWord){
                    callback(new Error('两次输入密码不一致'));
                }
                callback();
            }
        };
        return {
            // submitting: false,
            getCodeFlag: true,  //获取验证码，true需要获取，false已经获取
            time: 60,
            formValidate: {
                "LoginName": '',
                "PassWord": '', 
                "PassWord2": '', 
                "AuthCode": ''
            },
            ruleValidate: {
                LoginName: [
                    { validator: validateName, trigger: 'blur' }
                ],
                PassWord: [
                    { validator: validatePsw, trigger: 'blur' },
                    { type: 'string',min: 6,message: '密码至少6位', trigger: 'blur' }
                ],
                PassWord2: [
                    { validator: validatePsw2, trigger: 'blur' },
                    { type: 'string',min: 6,message: '密码至少6位', trigger: 'blur' }
                ],
                AuthCode: [
                    { validator: validateCode, trigger: 'blur' },
                ],
            }
        }
    },
    methods: {
     
        handleSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.register();
                } else {
                    // this.$Message.error('Fail!');
                }
            })
        },

        register(){
            let url = '/User/HandlePassword';
            let postData = {
                ...this.formValidate,
                IsRegistered: true //是否注册  注册为true 重置密码为false
            };
            this.submitting = true;
            this.$axios.post(url, postData).then(res => {
                this.submitting = false;
                if (res.data.Code === '0') {
                    localStorage.setItem("currentUserNname",this.formValidate.LoginName);
                    this.$Message.success('注册成功')
                    const self = this;
                    setTimeout(function(){
                        self.$router.push('/login')
                    },2000)
                } else {
                    this.$Message.error(res.data.Message)
                
                }
            }).catch(err => {
                console.error(err);
            });
        },

        getCode(){
            if(!this.formValidate.LoginName){
            this.$refs.LoginName.focus();
            this.$Message.info('请先输入正确的手机号码')
            }else{
            let url = '/SMS/Send';
            let postData = {
                TelePhone: this.formValidate.LoginName
            }
            this.$axios.post(url,postData).then(res => {
                let { Data,Code,Message } = res.data;
                if(Code == 0){
                this.$Message.info('验证码已经发生到手机')
                this.getCodeFlag = false;
                this.time = 60;
                this.codeTimeOut(60);
                }else{
                this.$Message.error(Message)
                }
            }).catch(err => {
                this.$Message.info('网络错误！')
            })
            }
            
        },
        codeTimeOut(time) {
            var _this = this;
            setInterval(function() {
                _this.time = time--;
                if (_this.time <= 0) {
                _this.getCodeFlag = true;
                }
            }, 1000);
        },

        
      
    },
    
    
}
</script>
<style lang="less">
    .register{
        .authCode .ivu-form-item-content{
            display: flex;
        }
        .ivu-input{
            padding-left: 34px;
        }
        .ivu-input-prefix{
            position: absolute;
            top: 7px;
            left: 3px;
        }
    }
    
</style>
<style lang="less" scoped>
    .register{
        width: 100%;
        height: 100%;
        position: relative;
        .container{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: calc(100% - 44px);
            overflow: auto;
            box-sizing: border-box;
            
            .form{
                display: flex;
                flex-direction: column;
                .ivu-input-wrapper{
                    width: 320px;
                }
                .authCode{
                    .ivu-input-wrapper{
                        width: 180px;
                        
                    }
                    .captcha-num  {
                        width: 130px;
                        margin-left: 10px;
                        cursor: pointer;
                        .captcha{
                            background: #3b4356;
                        }
                        span{
                            white-space: nowrap;
                            background: #efefef;
                            border-radius: 4px;
                            color: #ccc;
                            height: 40px;
                            line-height: 40px;
                            width: 130px;
                            text-align: center;
                            display: inline-block;
                        }
                    }
                }
                
            }
            .ivu-btn{
                height: 40px;
            }
            
        }
    }
</style>
