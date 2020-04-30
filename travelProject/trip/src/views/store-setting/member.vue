<template>
    <div class="memberSetting">
        <h3>会员标签</h3>
        <p class="tip">点击+可新增会员标签，点击默认值可编辑/删除会员标签</p>
        <ul>
            <li v-for="(type,index) in typeList" :key="index" @click="toEdite(2,index)">
                <p>{{type.Name}}</p>
                <img src="@/assets/delete-icon2.svg" alt="" @click.stop="deleteType(index,type.Id,type.Name)">
            </li>
            <li class="add" @click="toEdite(1)">+</li>
        </ul>
        <Modal v-model="isEdit" width="460" :mask-closable="false" 
               class="visitorTypeModal" @on-cancel="cancel">
            <p slot="header" style="text-align:center;font-size: 18px;">{{type==1 ? '新增' : '修改'}}</p>
            <Form ref="editedForm" :model="editItem" :rules="ruleValidate" :label-width="80">
                <FormItem prop="Name" label="名称">
                    <Input v-model="editItem.Name"  placeholder="名称限10个字"/>
                </FormItem>
            </Form>
            <div slot="footer" class="foot">
                <Button  @click="cancel">取消</Button>
                <Button type="primary" @click="editType">保存</Button>
            </div>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </Modal>
    </div>
</template>
<script>
const EDItITEM = {
        Id: "",
        Name: "",
}
import{ getLabelBySiteId, addLabel, delLabel } from '@/api/store-setting.js'
export default {
    data(){
        return{
            typeList: [],
            isEdit: false,
            type: 1,
            editItem: {},
            ruleValidate: {
                Name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                    { type: 'string', max: 10, message: '名称限制10个字', trigger: 'blur' }
                ],
            },
            spinShow: false,
        }
    },
    created(){
        this.getTypes();
    },
    methods: {
        //会员类别列表
        getTypes(){
            this.$Spin.show();
            getLabelBySiteId().then(res => {
                this.$Spin.hide();
                this.typeList = res.Data;
            }).catch(err => {
                this.$Spin.hide();
            })
        },

        toEdite(type,index){
            this.isEdit = true;
            this.type = type;
            if(type==1){
                this.editItem = EDItITEM;
            }else{
                this.editItem = { ...this.typeList[index] };
            }
        },

        cancel(){
            this.isEdit=false;
            this.$refs['editedForm'].resetFields();
        },

        editType(){
            // console.log(this.editItem)
            this.$refs['editedForm'].validate((valid) => {
                if (valid) {
                    this.spinShow = true;
                    addLabel(this.editItem).then(res => {
                        this.spinShow = false;
                        this.isEdit = false;
                        this.$Message.success(this.type == 1 ? '新增成功' : '修改成功');
                        this.getTypes();
                        this.$refs['editedForm'].resetFields();
                    }).catch(err => {
                        this.spinShow = false;
                    })
                } else {
                    this.$Message.error('有必填信息未填写');
                }
            })
            
        },

        deleteType(index,id,name){
            this.$Modal.confirm({
                title: '请确认是否删除'+name,
                onOk: () => {
                    this.$Spin.show();
                    delLabel(id).then(res => {
                        this.$Spin.hide();
                        this.typeList.splice(index,1);
                        this.$Message.success('成功删除'+name);
                    }).catch(err => {
                        this.$Spin.hide();
                    })
                }
            })
            
        }
    }
}
</script>
<style lang="less">
    .visitorTypeModal{
        .ivu-form-item {
            .row{
                width: 320px;
            }
            @media screen and (max-width: 768px){
                .row{
                    width: 230px;
                }
            }
        }
        .ivu-form{
            .auto .ivu-input-wrapper,.auto .ivu-input-number{
                width: 100%;
            }
        }
    }
</style>
<style lang="less" scoped>
    .memberSetting{
        padding: 20px 40px;
        .tip{
            color: #999;
            line-height: 2;
        }
        ul{
            display: flex;
            flex-wrap: wrap;
            li{
                border: 1px solid #e4e4e4;
                width: 160px;
                height: 50px;
                padding: 0 10px;
                box-sizing: border-box;
                line-height: 50px;
                text-align: center;
                border-radius: 4px;
                font-size: 16px;
                color: #333;
                font-weight: 700;
                margin-top: 20px;
                margin-right: 20px;
                cursor: pointer;
                position: relative;
                p{
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
                img{
                    position: absolute;
                    right: -9px;
                    top: -9px;
                    z-index: 9;
                }
            }
            .add{
                border: 1px dotted #e4e4e4;
                color: #0899AC;
                font-weight: normal;
                font-size: 26px;
            }
        }
    }
    .visitorTypeModal{
        .foot{
            text-align: center;
            .ivu-btn{
                width: 120px;
                height: 40px;
                line-height: 40px;
                font-size: 16px;
                &:first-of-type{
                    margin-right: 20px;
                }
            }
        }
    }
</style>