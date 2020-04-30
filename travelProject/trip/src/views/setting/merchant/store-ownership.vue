<template>
    <FullPage title="门店归属列表" class="storeOwnership"
              @change-router="$router.push('/setting/merchant/ascription')">
        <div class="head">
            <span>查找门店</span>
            <Search v-model="postData.Key" placeholder="输入门店名称或负责人名称" @on-search="handleSearch"></Search>
        </div>
        <Table  ref="selection" :columns="columns" :data="tableData" :loading="loading"
                :max-height="$bus.clientHeight - 260" stripe  disabled-hover>
            <template slot-scope="{ row }" slot="SiteName">
                {{row.SiteProvince + row.SiteCity + row.SiteArea + row.SiteName}}
            </template>
             <template slot-scope="{ row }" slot="BelongName">
                {{row.BelongProvince + row.BelongCity + row.BelongArea + row.BelongName}}
            </template>
            <template slot-scope="{ row, index }" slot="Action">
                <Button type="text"  @click="transfer(index,row.SiteId)">转移归属</Button>
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
        <div class="bottom">
          <Button type="primary" @click="transfer(index,row.SiteId)">转移归属</Button>
        </div>  
    </FullPage>
</template>

<script>
import FullPage from '@/components/fullscreen-page'
import Search from '@/components/search'
import { getSiteBelongDetail } from '@/api/setting.js'
export default {
    name: 'storeOwnership',
    components: { FullPage, Search },
    data(){
        return{
            loading: false,
            postData: {
                PageIndex: 1,
                PageSize: 10,
                Key: "",
                BelongId: ""
            },
            total: 1,
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '编号',
                    key: 'SiteCode',
                    minWidth: 130,
                    align: 'center'
                },
                {
                    title: '门店名称',
                    slot: 'SiteName',
                    minWidth: 150,
                    className: 'nameColumn',
                    align: 'center'
                },
                {
                    title: '负责人',
                    key: 'ContactName',
                    minWidth: 120,
                    align: 'center'
                },
                {
                    title: '联系电话',
                    key: 'Tel',
                    minWidth: 120,
                    align: 'center'
                },
                {
                    title: '归属配置',
                    slot: 'BelongName',
                    minWidth: 150,
                    className: 'nameColumn',
                    align: 'center'
                },
                {
                    title: '操作',
                    slot: 'Action',
                    minWidth: 80,
                    align: 'center'
                }
            ],
            tableData: [],
        }
    },
    created(){
        this.postData.BelongId = this.$route.query.id;
        this.getTableData();
    },
    methods: {
        getTableData(){
            this.loading = true;
            getSiteBelongDetail(this.postData).then(res => {
                this.loading = false;
                this.tableData = res.Data.SiteBelongs;
                this.total = res.Data.Total;
            }).catch(err => {
                this.loading = false;
            })
        },

        handleSearch(){
            this.postData.PageSize = pageSize;
            this.postData.PageIndex = 1;
            this.getTableData();
        },
        handleChange(e){
            this.postData.PageIndex = e;
            this.getTableData();
        },
        pageSizeChanged(pageSize){
            this.postData.PageSize = pageSize;
            this.postData.PageIndex = 1;
            this.getTableData();
        },

        transfer(){

        }
    }
}
</script>
<style lang="less">
    .storeOwnership{
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
    .storeOwnership{
        box-sizing: border-box;
        padding-bottom: 80px;
        .head{
            display: flex;
            align-items: center;
            >span{
                font-size: 16px;
                padding-right: 10px;
            }
        }
        .ivu-table-wrapper{
            .ivu-btn{
                color: #3275F5;
            }
        }
        .bottom{
            background: #fff;
            border-top: 1px solid #E4E4E4;
            display: flex;
            justify-content: center;
            padding: 15px 0;
            position: fixed;
            bottom: 10px;
            left: 10px;
            right: 10px;
            z-index: 99;
            > .ivu-btn{
                height: 40px;
                width: 200px;
            }
        }
    }
</style>