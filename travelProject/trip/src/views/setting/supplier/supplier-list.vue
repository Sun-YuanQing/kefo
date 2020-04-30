<template>
    <div class="supplierList">
        <div class="head">
            <div class="searchWrap">
                <div>
                    <span>查找供应商</span>
                    <Search v-model="postData.Name" placeholder="输入供应商名称或编号" 
                            @on-search="handleSearch"></Search>
                </div>
                <div>
                    <span>状态</span>
                    <Select v-model="postData.Status" style="width: 120px" @on-change="handleSearch">
                        <Option :value="-1">全部</Option>
                        <Option :value="0">无效</Option>
                        <Option :value="1">启用</Option>
                    </Select>
                </div>
            </div>
            <Button @click="$router.push('/editSupplier')">+新增</Button>
        </div>
        <div class="tableWrap">
            <Table  :columns="columns" :data="tableData" :loading="loading"
                    :max-height="$bus.clientHeight-335" stripe  disabled-hover>
                <template slot-scope="{ row, index }" slot="Status">
                    <i-switch v-model="row.Status" :true-value="1" :false-value="0"
                    @on-change="changeStatus($event,index,row.Id)"></i-switch>
                </template>
                <template slot-scope="{ row }" slot="Action">
                    <Button type="text" @click="$router.push({path: '/supplierDetail',query: {id: row.Id}})">详情</Button>
                </template>
            </Table>
            <Page
                :total="total"
                :current="postData.PageIndex"
                :page-size="postData.PageSize"
                placement="top"
                show-total
                show-sizer
                @on-change="handleChange"
                @on-page-size-change="pageSizeChanged"/>
        </div>
    </div>
</template>
<script>
import Search from '@/components/search'
import { getSuppliers, editSupplierStatus } from '@/api/setting.js'
export default {
    components: { Search },
    data(){
        return{
            postData: {
                Name: '',
                Status: -1,
                PageIndex: 1,
                PageSize: 10
            },
            total: 0,
            columns:[
                {
                    title: '序号',
                    type: 'index',
                    width: 80,
                    align: 'center'
                },
                {
                    title: '供应商名称',
                    key: 'Name',
                    minWidth: 220,
                    align: 'center'
                },
                {
                    title: '类型',
                    key: 'TypeName',
                    minWidth: 160,
                    align: 'center'
                },
                {
                    title: '负责人',
                    key: 'Leader',
                    minWidth: 120,
                    align: 'center'
                },
                {
                    title: '联系电话',
                    key: 'Telephone',
                    minWidth: 130,
                    align: 'center'
                },
                {
                    title: '合同有效期',
                    key: 'ExpiryDate',
                    minWidth: 180,
                    align: 'center'
                },
                {
                    title: '状态',
                    slot: 'Status',
                    minWidth: 120,
                    align: 'center'
                },
                {
                    title: '操作',
                    slot: 'Action',
                    minWidth: 160,
                    align: 'center'
                }
            ],
            tableData: [
                {
                    Address: "陕西西安",
                    BusinessLicense: null,
                    ContractEndTime: "/Date(1571500800000)/",
                    ContractFile: null,
                    ContractStartTime: "/Date(1568044800000)/",
                    ExpiryDate: "2019.09-2019.10",
                    Id: "e44348ac0da44ebdaac4f60f8bd37d1f",
                    Leader: "徐旭",
                    Name: "供应商1",
                    Number: "",
                    Remark: "测试",
                    SiteId: null,
                    Telephone: "15888888888",
                    Type: null,
                    TypeName: "供应商类型1",
                }
            ],
            loading: false,
        }
    },
    created(){
        this.getData();
    },
    methods: {
        getData(){
            this.loading = true;
            getSuppliers(this.postData).then(res => {
                this.loading = false;
                this.tableData = res.Data.Suppliers;
                this.total = res.Data.Total;
            }).catch(err => {
                this.loading = false;

            })
        },

        //页码切换
        handleChange(e){
            this.postData.PageIndex = e;
            this.getData();
        },

        //每页条数切换
        pageSizeChanged(pageSize){
            this.postData = { ...this.postData,PageIndex: 1,PageSize: pageSize};
            this.getData();
        },
        handleSearch(){
            this.postData = { ...this.postData,PageIndex: 1,PageSize: 10};
            this.getData();
        },

        changeStatus(e,index,id){
            editSupplierStatus(id,e).then(res => {
                if(res.Code==0){
                    this.tableData[index].Status  = e;
                    this.$Message.success(e == 1 ? '启用成功' : '禁用成功')
                }else{
                    this.getData();
                }
                
            }).catch(err => {
                this.getData();
            })
        }
    }
}
</script>
<style lang="less" scoped>
    .supplierList{
        .head{
            display: flex;
            justify-content: space-between;
            .searchWrap{
                display: flex;
                >div{
                    display: flex;
                    align-items: center;
                    >span{
                        padding-right: 10px;
                    }
                    &:first-of-type{
                        margin-right: 20px;
                    }
                }
            }
            .ivu-btn{
                width: 90px;
                height: 36px;
                line-height: 36px;
            }
        }
        .ivu-table-wrapper{
            .ivu-btn{
                color: #3275F5;
            }
        }
        
    }
</style>