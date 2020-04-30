<template>
    <div class="uploadProduct">
        <div class="radioWrap">
            <RadioGroup v-model="postData.Type" type="button" @on-change="radioChange">
                <Radio  :label="type.Type" v-for="type in typeList" 
                        :key="type.Type">{{type.Name}}</Radio>
            </RadioGroup>
        </div>
        <div class="infoWrap">
            <div class="head">
                <div class="searchWrap">
                    <div>
                        <span>产品名称</span>
                        <Search v-model="postData.Name" placeholder="输入产品名称" 
                                @on-search="handleSearch"></Search>
                    </div>
                </div>
                <div>
                    <Button @click="isAdd=true;">+新增商品</Button>
                </div>
                
            </div>
            <div class="tableWrap">
                <Table  :columns="columns" :data="tableData" :loading="loading"
                        :max-height="$bus.clientHeight-335" stripe  disabled-hover>
                    <template slot-scope="{ row }" slot="Type">
                        <div>{{row.Type | productTypes}}</div>
                    </template>
                    <template slot-scope="{ row }" slot="AuditStatus">
                        <div :style="{color: row.AuditStatus==-1 ? '#E94E27' : ''}">{{row.AuditStatus == 0 ? '未审核通过' : '审核中'}}</div>
                        <div v-if="row.AuditStatus == 0">原因：{{row.AuditReason}}</div>
                    </template>
                    <template slot-scope="{ row }" slot="Action">
                        <Button type="text" @click="$router.push({path: '/productDetail',query: {type: row.Type,id: row.Id,classes: 1}})">详情</Button>
                        <Button type="text" :style="{color: row.AuditStatus==-1 ? '#999' : '#3275F5'}"  @click="deleteProduct(row.Id,row.AuditStatus,row.Name)">删除</Button>
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

        <Modal v-model="isAdd" width="460" :mask-closable="false" 
               class="productListModal" @on-cancel="isAdd=false;addType=2;">
            <p slot="header" style="text-align:center;font-size: 18px;">选择添加产品类型</p>
            <ul class="typeList">
                <li v-for="(type,index) in typeList.slice(1)" :key="index"
                    :class="{'active': type.Type==addType}" @click="changeAddType(type.Type)">
                    {{type.Name}}
                </li>
            </ul>
            <div slot="footer" class="foot">
                <Button  @click="isAdd=false;addType=2;">取消</Button>
                <Button type="primary" @click="sureType">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import Search from '@/components/search'
import { getAuditProducts, deleteTravelProductById,getProjectType } from '@/api/goods.js'
import { allColumns, notDirectColumns, otherColumns } from './product-check-columns.js'
export default {
    name: "uploadProduct",
    components: { Search },
    data(){
        return{
            isAdd: false,
            addType: '2',
            postData: {
                Type: '-1',  //1.直营  2.非直营  3.其他 4. 组合 -1全部
                Name: '',
                PageIndex: 1,
                PageSize: 10
            },
            loading: false,
            total: 0,
            tableData:[],
            columns: [],
            typeList: [
                {
                    Type: '-1',
                    Name: '全部产品'
                },
            ]
        }
    },
    created(){
        this.getProjectTypeList();
        this.update('-1')
        this.getData();
    },
    methods:{
        getProjectTypeList(){
            getProjectType(false,true).then(res => {
                this.typeList = [{Type: '-1',Name: '全部产品'},...res.Data.ProjectTypes]
            }).catch(err => {

            })
        },
        sureType(){
            if(!this.addType){
                this.$Message.warning('请选择产品类型')
            }else{
                this.isAdd = false;
                this.$router.push({ path: '/editProduct', query: {type: this.addType,classes: 1}})
            }
            
        },
        radioChange(e){
            this.postData.PageIndex = 1;
            this.update(e);
            this.getData();
        },
        changeAddType(type){
            this.addType = type;
        },
        update(e) {
            switch(e.toString()){
                case '-1':
                    this.columns = allColumns;
                    break;
                case '2':
                    this.columns = notDirectColumns;
                    break;
                case '3':
                    this.columns = otherColumns;
                    break;
                default:
                    this.columns = allColumns;
            }
        },

        getData(){
            this.loading = true;
            getAuditProducts(this.postData).then(res => {
                this.loading = false;
                this.tableData = res.Data.TravelProduct;
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

        //删除
        deleteProduct(id,status,name){
            if(status==-1) return;
            this.$Modal.confirm({
                title: '产品删除后不可恢复，确定要删除产品：' + name + ' 吗？',
                width: 560,
                onOk: () => {
                    deleteTravelProductById(id).then(res => {
                        this.$Spin.hide();
                        this.$Message.success('成功删除产品：'+name);
                        this.getData();
                    }).catch(err => {
                        this.$Spin.hide();
                    })
                }
            })
        },

        
    }
}
</script>
<style lang="less">
    .uploadProduct{
        .ivu-table-wrapper{
            .ivu-table td.nameColumn > div{
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
</style>
<style lang="less" scoped>
    .uploadProduct{
        height: 100%;
        .radioWrap{
            padding: 20px 40px;
            border-bottom: 10px solid #F7F8FA;
        }
        .infoWrap{
            box-sizing: border-box;
            padding: 20px 15px 0;
            height: calc(100% - 82px);
            overflow: auto;
            .head{
                padding-left: 20px;
                padding-right: 3px;
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
        
    }
    .productListModal{
        .typeList{
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            li{
                width: 128px;
                height: 40px;
                line-height: 40px;
                background-color: #F7F8FA;
                border-radius: 4px;
                margin-bottom: 10px;
                margin-right: 15px;
                text-align: center;
                padding: 0 10px;
                box-sizing: border-box;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                cursor: pointer;
                &:last-of-type{
                    margin-right: 0;
                }
                &.active{
                    background-color: #333;
                    color: #fff;
                }
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