<template>
   <div class="store">
       <!-- <div class="title">个人信息</div> -->
       <Header title="个人信息"></Header>
       <div class="container">
           <Form ref="formValidate" :model="personalInfo" :rules="ruleValidate" :label-width="50" class="form">
                <FormItem label="账号" prop="Phone">
                    <div>{{phone}}</div>
                </FormItem>
                <FormItem label="姓名" prop="UserName">
                    <Input v-model="personalInfo.UserName" ></Input>
                </FormItem>
                <FormItem label="性别" prop="Sex">
                    <Select v-model="personalInfo.Sex">
                        <Option value="1">男</Option>
                        <Option value="0">女</Option>
                    </Select>
                </FormItem>
                <FormItem label="邮箱" prop="Email">
                    <Input v-model="personalInfo.Email" type="email"></Input>
                </FormItem>
                <FormItem>
                    <Button @click="handleSubmit('formValidate')"
                            style="margin-top: 10px;"
                            type="primary"
                            size="large"
                            long :loading="submitting">
                        <span class="login-word">修改</span>
                    </Button>
                </FormItem>
            </Form>
            
       </div>
    </div> 
</template>
<script>
import Header from '@/components/route-header'
import EventBus from 'src/components/EventBus'
export default {
    components: {Header},
    data () {
        const validateName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入姓名'));
            } else {
                callback();
            }
        };
        const validateSex = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请选择性别'));
            } else {
                callback();
            }
        };
        const validateEmail = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入邮箱'));
            } else {
                callback();
            }
        };
        return {
            submitting: false,
            phone: "",
            ruleValidate: {
                UserName: [
                    { validator: validateName, trigger: 'blur' }
                ],
                Sex: [
                    { validator: validateSex, trigger: 'change' }
                ],
                Email: [
                    { validator: validateEmail, trigger: 'blur' },
                     { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                ],
            },
            personalInfo: {
                Email: '',
                Sex: '',
                UserName: '',
            }
        }
    },
    created(){
        this.phone = localStorage.getItem("currentUserNname");
        this.personalInfo = this.$route.query;
    },
    methods: {
     
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
                if (valid) {
                    this.updated();
                } else {
                    // this.$Message.error('Fail!');
                }
            })
        },
        updated(){
            this.submitting = true;
            let url = "/User/UpdateAdminUser";
            this.axios.post(url,this.personalInfo)
            .then(res => {
                let { Data,Code,Message } = res.data;
                this.submitting = false;
                if(Code == 0){
                    this.$Message.success('修改信息成功')
                    this.$router.back()
                }else{
                    this.$Message.error(Message)
                }
            }).catch(err => {
                this.submitting = fasle;
                console.log(err)
            })
        }
      
    },
    
    
}
</script>
<style lang="less">
    .ivu-select-single .ivu-select-selection{
        height: 40px;
        width: 230px;
        line-height: 40px;
    }
</style>
<style lang="less" scoped>
    .store{
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
                    width: 230px;
                }
            }
            .ivu-btn{
                width: 230px;
                height: 40px;
            }
            
        }
    }
</style>
