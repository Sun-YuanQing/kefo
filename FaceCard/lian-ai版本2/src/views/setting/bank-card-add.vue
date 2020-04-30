<template>
    <div class="bank-card-add">
        <Header title="添加银行卡"></Header>
        <Form ref="formValidate" :model="formData" :rules="ruleValidate" :label-width="70" class="form">
            <FormItem label="持卡人" prop="BankCardUser">
                <Input v-model="formData.BankCardUser" :maxlength="16"></Input>
            </FormItem>
            <FormItem label="卡号" prop="BankCard">
                <Input v-model="formData.BankCard" :maxlength="19"></Input>
            </FormItem>
            <FormItem label="银行" prop="BankName">
                <Input v-model="formData.BankName" :maxlength="20"></Input>
            </FormItem>
            <FormItem label="">
                <Button type="primary" @click="handleSubmit('formValidate')">确定</Button>
            </FormItem>
        </Form>

    </div>
</template>
<script>
import Header from 'src/components/route-header'
export default {
    components: { Header },
    data(){
        const validateBanckNum = (rule, value, callback) => {
                var num = /^\d*$/; //全数字
                //开头6位
                var strBin = "10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";
                if (!value) {
                    callback(new Error('请输入银行卡卡号'));
                }else{
                    

                    if(this.formData.BankCard.length < 16 || this.formData.BankCard.length > 19 ) {
                        callback('银行卡号长度必须在16到19之间');
                    }else if(!num.exec(this.formData.BankCard)) {
                        callback('银行卡号必须全为数字间');
                    }else if(strBin.indexOf(this.formData.BankCard.substring(0, 2)) == -1) {
                        callback('银行卡号开头6位不符合规范');
                    }else{
                        callback();
                    }
                }

            };
        return{
            able: false,
            formData:{
                "BankName": "",
                "BankCard": "",
                "BankCardUser": "",
                "BankId": ""  //添加为空
            },
            
            ruleValidate: {
                BankCardUser: [
                        { required: true, message: '请输入持卡人姓名', trigger: 'blur' }
                    ],
                BankName: [
                        { required: true, message: '请输入银行名字', trigger: 'blur' }
                    ],
                BankCard: [
                        { required: true, message: '请输入银行卡卡号', trigger: 'blur' },
                        { validator: validateBanckNum, trigger: 'blur' }
                    ],
            },
            
        }
    },
    created(){
       let bankId = this.$route.query.bankId;
      
    },
    methods: {
    
        handleSubmit(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    //this.$Message.success('Success!');
                    let url = '/CashOut/EditBank';
                    this.$axios.post(url, this.formData, { loading: false })
                    .then(res => {
                        let {Code,Data,Message} = res.data
                        if (Code === '0') {
                            this.$router.back();
                        } else {
                            this.$Message.error(Message)
                        }
                    })
                    .catch(err => {
                        this.$Message.error(err);
                    });
                } else {
                    //this.$Message.error('Fail!');
                }
            })
        }
    }
}
</script>


<style lang="less" scoped>
    .bank-card-add{
        width: 100%;
        height: 100%;
        overflow: auto;
        .form{
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 50px;
            .ivu-input-wrapper{
                width: 320px;
            }
            .ivu-btn{
                width: 320px;
                height: 40px;
                line-height: 40px;
            }
            
        }
        
    }
    @media screen and(max-width: 576px){
        .bank-card-add .form{
            .ivu-input-wrapper{
                width: 220px;
            }
            .ivu-btn{
                width: 220px;
                height: 40px;
                line-height: 40px;
            }
        }
    }
</style>