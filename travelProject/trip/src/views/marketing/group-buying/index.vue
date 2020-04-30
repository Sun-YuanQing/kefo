<template>
    <FullPage class="groupBuying" title="拼团列表" @change-router="$router.push('/marketing')">
       <div class="head">
            <div class="searchWrap">
                <Search v-model="postData.Key" placeholder="输入商品名称" 
                            @on-search="handleSearch"></Search>
                <div>
                    <Select v-model="postData.SeckState" style="width: 120px" @on-change="handleSearch">
                        <Option value="-1">全部</Option>
                        <Option value="0">未开始</Option>
                        <Option value="1">进行中</Option>
                        <Option value="-2">已结束</Option>
                    </Select>
                </div>
            </div>
            <Button @click="isAddGroupBuying=true;">+新增</Button>
        </div>
        <div class="tableWrap">
            <Table  :columns="columns" :data="tableData" :loading="loading"
                    :row-class-name="rowClassName"
                    :max-height="$bus.clientHeight-185" stripe  disabled-hover>
                <template slot-scope="{ row, index }" slot="State">
                    <i-switch v-model="row.State" :true-value="'1'" :false-value="'0'"
                    @on-change="changeState($event,index,row.Id)"></i-switch>
                </template>
                <template slot-scope="{ row }" slot="Action">
                    <Button type="text" @click="$router.push({path: '/groupBuyingDetail',query: {id: row.Id}})">详情</Button>
                    <Button type="text" @click="recommend(row.Id,row.Recommend)">{{row.Recommend ? '取消推荐' : '首页推荐'}}</Button>
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
        <!-- 新增拼团 -->
        <Modal v-model="isAddGroupBuying" width="532" :mask-closable="false" 
               class="groupBuyingModal" @on-cancel="isAddGroupBuying=false;selectedType=''">
            <p slot="header" style="text-align:center;font-size: 18px;">选择添加商品类型</p>
            <ul class="typeList">
                <li v-for="(type,index) in typeList" :key="index"
                    :class="{'selected': type.Type==selectedType}" 
                    @click="selectedType=type.Type;">
                    {{type.Name}}
                </li>
            </ul>
            <div slot="footer" class="foot">
                <Button  @click="isAddGroupBuying=false;selectedType=''">取消</Button>
                <Button type="primary" @click="addGroupBuying">确定</Button>
            </div>
        </Modal>
    </FullPage>
</template>
<script>
import FullPage from '@/components/fullscreen-page'
import Search from '@/components/search'
import { getGroupBuyingList, setGroupBuyingUpOrDown } from '@/api/marketing.js'
import { recommendProduct, getProjectType } from '@/api/goods.js'
export default {
    components: { FullPage, Search },
    data(){
        return{
            loading: false,
            total: 0,
            postData: {
                Key: '',
                SeckState: '-1',
                PageIndex: 1,
                PageSize: 10
            },
            tableData: [],
            columns: [
                {
                    title: '序号',
                    type: 'index',
                    width: 80,
                    align: 'center'
                },
                {
                    title: '商品名称',
                    key: 'ProductName',
                    minWidth: 120,
                    className: 'nameColumn',
                    align: 'center'
                },
                {
                    title: '活动时间',
                    key: 'StartTime',
                    minWidth: 320,
                    align: 'center',
                    render: (h, params) => {
                        return h("div",  params.row.StartTime + '至' + params.row.EndTime)
                    }
                },
                {
                    title: '开团数',
                    key: 'OpenNum',
                    minWidth: 120,
                    align: 'center'
                },
                {
                    title: '成团数',
                    key: 'SuccessNum',
                    minWidth: 120,
                    align: 'center'
                },
                {
                    title: '活动状态',
                    key: 'AssemState',
                    minWidth: 120,
                    align: 'center',
                    render: (h, params) => {
                        return h("div",  params.row.AssemState == 0 ? '未开始' : params.row.AssemState == 1 ? '进行中' : '已结束')
                    }
                },
                {
                    title: '是否启用',
                    slot: 'State',
                    minWidth: 120,
                    align: 'center'
                },
                {
                    title: '操作',
                    slot: 'Action',
                    minWidth: 200,
                    align: 'center'
                }
            ],
            isAddGroupBuying: false,
            selectedType:'',
            productTypeList: [],
            cardTypeList: [
                {
                    value: '5',
                    label: '次卡',
                },
                {
                    value: '6',
                    label: '折扣卡',
                },
                {
                    value: '7',
                    label: '体验卡',
                }
            ],
        }
    },
    computed: {
        typeList(){
            return this.productTypeList;
        }
    },
    created(){
        this.getProjectTypeList()
        this.getData();
    },
    methods: {
        //获取当前的一级分类
        getProjectTypeList(){
            getProjectType(true).then(res => {
                this.productTypeList = res.Data.ProjectTypes

            }).catch(err => {
                
            })
        },
        getData(){
            this.loading = true;
            getGroupBuyingList(this.postData).then(res => {
                this.loading = false;
                this.tableData = res.Data.SiteAssems;
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

        //是否启用
        changeState(e,index,id){
            setGroupBuyingUpOrDown(id,e).then(res => {
                if(res.Code==0){
                    this.tableData[index].State  = e;
                    this.$Message.success(e == 1 ? '启用成功' : '禁用成功');
                }else{
                    this.getData();
                }
                
            }).catch(err => {
                this.getData();
            })
        },

        //新增拼团
        addGroupBuying(){
            if(!this.selectedType){
                this.$Message.warning('请选择商品类型')
            }else{
                this.$router.push({path: '/editGroupBuying',query: {type: this.selectedType}})
            }
            
        },

        rowClassName(row, index){
            if(row.AssemState=='-2'){
                return 'activityEnd';
            }else{
                return '';
            }
        },

        //推荐
        recommend(id,flag){
            console.log(flag)
            this.$Modal.confirm({
                title: flag ? '请确认是否取消推荐？' : '请确认是否推荐？',
                onOk: () => {
                    this.$Spin.show();
                    let postData = {
                        Type: "3",//1商品  2.秒杀 3.拼团
                        Id: id,// 1商品Id  2.秒杀Id 3. 拼团id
                        Recommend: flag ? false : true // 推荐 true/取消推荐
                    }
                    recommendProduct(postData).then(res => {
                        this.$Spin.hide();
                        this.$Message.success(flag ? '取消推荐成功' : '推荐成功');
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
  .groupBuying .content{
    height: calc(100% - 64px) !important;
    .ivu-table-wrapper{
        .ivu-table td.nameColumn > div{
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .ivu-table .activityEnd td{
            color: #999;
        }
    }
  }
</style>
<style lang="less" scoped>
    .groupBuying{
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
    .groupBuyingModal{
        .typeList{
            display: flex;
            flex-wrap: wrap;
            li{
                width: 110px;
                height: 40px;
                line-height: 40px;
                background-color: #F7F8FA;
                border: 1px solid #E4E4E4;
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
            }
            .selected{
                color: #fff;
                background-color: #333;
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