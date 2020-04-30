<template>
    <div class="ascription">
        <div class="buttonWrap">
            <Button @click="toEdit(1)">+添加归属配置</Button>
        </div>
        <Table  :columns="columns" :data="tableData" :loading="loading"
                :max-height="$bus.clientHeight-315" stripe  disabled-hover>
            <template slot-scope="{ row }" slot="Name">
                {{row.Province + row.City + row.Area + row.Name}}
            </template>
            <template slot-scope="{ row, index }" slot="Action">
                <Button type="text"  @click="$router.push({path: '/storeOwnership',query: {id: row.Id}})">详情</Button>
                <Button type="text"  @click="toEdit(2,index)">修改</Button>
                <Button type="text"  @click="remove(index,row)">删除</Button>
            </template>
        </Table>
        <Page
            :total="total"
            :current="pageIndex"
            :page-size="pageSize"
            placement="top"
            show-total
            show-sizer
            @on-change="handleChange"
            @on-page-size-change="pageSizeChanged"/>

        <Modal v-model="showEdit" width="500" :mask-closable="false" 
               class="ascriptionModal" @on-cancel="cancel">
            <p slot="header" style="text-align:center;font-size: 18px;">{{type==1 ? '新增' : '修改'}}归属配置</p>
            <Form ref="editedForm" :model="formData" :rules="ruleValidate" :label-width="80">
                <FormItem prop="Province" label="区域" class="row">
                    <v-distpicker :province="formData.Province" 
                                    :city="formData.City" 
                                    :area="formData.Area"
                                    @province="onChangeProvince" 
                                    @city="onChangeCity" 
                                    @area="onChangeArea"></v-distpicker>
                </FormItem>
                <FormItem prop="Name" label="部门">
                    <Input v-model="formData.Name" />
                </FormItem>
            </Form>
            <Spin size="large" fix v-if="isSpin"></Spin>
            <div slot="footer" class="foot">
                <Button  @click="cancel">取消</Button>
                <Button type="primary" @click="handleSubmit">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import VDistpicker from 'v-distpicker'
import { getSiteBelong, addSiteBelong, deleteSiteBelong } from '@/api/setting.js'
const FORMDATA = {
                    Province: '',
                    City: '',
                    Area: '',
                    Name: ''
                }
export default {
    name: 'ascription',
    components:{ VDistpicker },
    data(){
        return{
            showEdit: false,
            type: 1, //1、新增，2、修改
            formData: FORMDATA,
            ruleValidate: {
                Name: [
                        { required: true, message: '请输入部门', trigger: 'blur' },
                        { type: 'string', max: 30, message: '最多输入30字', trigger: 'blur' }
                    ]
            },
            total: 1,
            pageIndex: 1,
            pageSize: 10,
            loading: false,
            columns: [
                {
                    title: '序号',
                    type: 'index',
                    width: 80,
                    align: 'center'
                },
                {
                    title: '归属配置',
                    slot: 'Name',
                    minWidth: 250,
                    align: 'center',
                    className: 'nameColumn',
                },
                {
                    title: '门店数量',
                    key: 'SiteNum',
                    minWidth: 100,
                    align: 'center'
                },
                {
                    title: '创建时间',
                    key: 'CreateTime',
                    minWidth: 150,
                    align: 'center'
                },
                {
                    title: '操作',
                    slot: 'Action',
                    minWidth: 220,
                    align: 'center'
                }
            ],
            tableData: [],
            isSpin: false
        }
    },
    created(){
        this.getTableData();
    },
    methods:{
        getTableData(){
            this.loading = true;
            getSiteBelong(this.pageIndex,this.pageSize).then(res => {
                this.loading = false;
                this.tableData = res.Data.SiteBelongs;
                this.total = res.Data.Total;
            }).catch(err => {
                this.loading = false;
            })
        },
        handleChange(e){
            this.pageIndex = e;
            this.getTableData();
        },
        pageSizeChanged(pageSize){
            this.pageSize = pageSize;
            this.pageIndex = 1;
            this.getTableData();
        },
        //省市区修改
        onChangeProvince(data) {
            this.formData.Province = data.value;
        },
        onChangeCity(data) {
            this.formData.City = data.value;
        },
        onChangeArea(data) {
            this.formData.Area = data.value;
        },

        cancel(){
            this.showEdit=false;
            this.formData.Province = "";
            this.formData.City = "";
            this.formData.Area = "";
            this.$refs['editedForm'].resetFields();
        },
        
        toEdit(type,index){
            this.showEdit = true;
            this.type = type;
            if(type == 1){
                this.formData = FORMDATA;
            }else{
                this.formData = {...this.tableData[index]}
                // JSON.parse(JSON.stringify(this.tableData[index]));
            }
        },

        remove(index,row){
            this.$Modal.confirm({
                title: '删除归属配置',
                content: '<p>确认将“'+row.Province + row.City + row.Area + row.Name+'”归属配置删除?</p>',
                onOk: () => {
                    this.$Spin.show();
                    deleteSiteBelong(row.Id).then(res => {
                        this.$Spin.hide();
                        this.$Message.success('删除成功');
                        this.pageSize = 10;
                        this.pageIndex = 1;
                        this.getTableData();
                    }).catch(err => {
                        this.$Spin.hide();
                    })
                    // this.tableData.splice(index,1)
                }
            })
        },

        handleSubmit(){
             this.$refs['editedForm'].validate((valid) => {
                if (valid) {
                    this.isSpin = true;
                    addSiteBelong(this.formData).then(res => {
                        this.isSpin = false;
                        this.$Message.success('添加成功');
                        this.showEdit = false;
                        this.$refs['editedForm'].resetFields();
                        this.pageSize = 10;
                        this.pageIndex = 1;
                        this.getTableData();
                   }).catch(err => {
                       this.isSpin = false;
                   })
                   
                } else {
                    // this.$Message.error('有必填信息未填写');
                }
            })
        }
    }
}
</script>
<style lang="less">
    .ascription{
        .ivu-table-wrapper{
                .ivu-table td.nameColumn  div{
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
    }
    .ascriptionModal{
        .ivu-input{
            height: 40px;
            line-height: 40px;
        }
        .distpicker-address-wrapper{
            select{
                width: 26.8%;
            }
        }
    }
</style>
<style lang="less" scoped>
    .ascription{
        padding: 10px 30px 0;
        .buttonWrap{
            display: flex;
            justify-content: flex-end;
        }
        .ivu-table-wrapper{
            .ivu-btn{
                color: #3275F5;
            }
        }
    }
    .ascriptionModal{
        .ivu-input-wrapper{
            width: 320px;
        }
        @media screen and (max-width: 768px) {
            .ivu-input-wrapper{
                width: 200px;
            }
        }
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