<template>
    <Modal :value="isShow"  width="420" @on-cancel="cancel"
          :mask-closable="false" :footer-hide="true" class="merge">
          <!-- title:1、有userid和faceid 的修改会员 
                     2、没有userid和faceid的添加会员 
                     3、有userid，没faceid的添加会员，即虚拟会员转会员，
                     4、有faceid的添加会员 -->
      <p slot="header" class="title">{{title == '1' ? '修改会员' : '添加会员'}}</p>
      <Form ref="addForm" :model="addForm" :rules="ruleValidate" 
            :label-width="60" class="merge-form">
        <FormItem label="手机" prop="Phone">
            <Input v-model="addForm.Phone" required :maxlength="11" :disabled="title == '1' ? true :false"/>
        </FormItem>
        <FormItem label="姓名" prop="UserName">
            <Input v-model="addForm.UserName" :maxlength="12"/>
        </FormItem>
        <FormItem label="生日" prop="Birthday" >
             <DatePicker v-model="addForm.Birthday" format="yyyy-MM-dd" 
             @on-change="dateChange"
             type="date" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="性别" prop="Sex">
            <Select v-model="addForm.Sex" style="width: 200px;">
                <Option value="1" selected>男</Option>
                <Option value="0">女</Option>
            </Select>
        </FormItem>
        <FormItem label="邮箱" prop="Email" type="email" >
            <Input v-model="addForm.Email"/>
        </FormItem>
        <FormItem label="备注" prop="Remark">
            <Input v-model="addForm.Remark" />
        </FormItem>
        <FormItem label="" prop="">
            <Button type="primary" @click="handleSubmit('addForm')" :loading="loading"
            style="width: 200px; height: 40px;margin-top: 20px;">确定</Button>
        </FormItem>
      </Form>
    </Modal>
</template>
<script>
import { validateName} from '@/utils/validate'
export default {
    props: {
        isShow: {
            type: Boolean,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        form: {
            type: Object,
            required: false
        }
    },
    
   
    data(){
        return{
            loading: false,
            addForm: {
                    "Phone": "",
                    "UserName": "",
                    "Birthday": "",
                    "Email": "",
                    "Remark": "",
                    "Sex": '1'
            },
            ruleValidate: {
                Phone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: validateName, trigger: 'blur' }
                ],
                Email: [
                    { type: 'email', message: '输入的邮箱格式不正确', trigger: 'blur' }
                ],
            }
        }
    },
    watch: {
        form: {
            handler(val){
                if(this.form){
                    let data = Object.assign({},this.form);
                    // console.log(data)
                    this.addForm =  {
                            "UserId": data.UserId,
                            "FaceId": data.FaceId,
                            "Phone": data.Phone,
                            "UserName": data.UserName,
                            "Birthday": data.Birthday,
                            "Email": data.Email,
                            "Remark": data.Remark,
                            "Sex": data.Sex
                        }
                }
            },
            deep: true
        }
    },
    
    methods:{
        dateChange(val){
            //  console.log(this.addForm,this.form)
            this.$set(this.addForm ,'Birthday',val)
        },
        cancel(){
            this.$emit('cancel-add');
            this.$refs['addForm'].resetFields();
        },
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    let url = '/User/UpdateUserByFaceId';
                    this.$axios.post(url, this.addForm).then(res => {
                        this.loading = false;
                        if (res.data.Code === '0') {
                            const title = this.title == '1' ? '修改会员' : '添加会员'
                            this.$Message.success(title + "成功");
                            this.$emit('cancel-add');
                            this.$emit('chang-info',Object.assign({},this.addForm)) 
                            this.$refs['addForm'].resetFields();
                        } else {
                            this.$Message.error(res.data.Message);
                        }
                    }).catch(e => {
                        this.loading = false;
                        throw new Error(e)
                    })
                } else {
                    // this.$Message.error('Fail!');
                }
            })
        },
    }
}
</script>
<style lang="less">
.ivu-select-single .ivu-select-selection{
  width: 200px;
  height: 40px;
  line-height: 40px;
}
</style>

<style lang="less" scope>
    .merge{
        .merge-form{
            width: 280px;
            margin:  0 auto;
            max-height: 80vh;
            overflow-y: scroll;
        }
    }
</style>
