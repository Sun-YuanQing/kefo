<template>
    <div  class="distributorDetail">
        <Header title="分销员详情" @change-router="$router.back()"></Header>
        <div class="contentWrap">
            <div class="detailWrap">
                <div class="distributorInfo">
                    <img class="avatar" :src="require('@/assets/avatar.svg')" alt="">
                    <div class="detail">
                        <div class="name">
                            <span>{{detailData.Name || '—'}}</span>
                            <span>分销员</span>
                        </div>
                        <div class="phone">{{detailData.Phone || '—'}}</div>
                        <Row>
                            <Col :sm="24" :md="12"><i>店名</i><span>{{detailData.SiteName || '—'}}</span></Col>
                            <Col :sm="24" :md="12"><i>门店宣言</i><span>{{detailData.SiteDesc || '—'}}</span></Col>
                            <Col :sm="24" :md="12">
                                <i>备注</i>
                                <span>{{detailData.Remark || '—'}}</span>
                                <b @click="isEditRemark=true;editedRemark=detailData.Remark;">编辑</b>
                            </Col>
                        </Row>
                    </div>
                </div>
                <Row class="statisticsInfo">
                    <Col :sm="24" :md="12" :lg="6">总销售额（元）<span>{{detailData.Sales}}</span></Col>
                    <Col :sm="24" :md="12" :lg="6">累计提成（元）<span>{{detailData.Income}}</span></Col>
                    <Col :sm="24" :md="12" :lg="6">加入时间<span>2{{detailData.CreateTime}}</span></Col>
                    <Col :sm="24" :md="12" :lg="6">来源<span>{{detailData.Source}}</span></Col>
                </Row>
            </div>
            <div class="infoWrap">
                <div class="head">
                    <ul>
                        <li v-for="item in ['1','2']" :key="item" :name="item" 
                            :class="item==active ? 'active' : ''" @click="selectChange(item)">
                            {{item == '1' ? '客户（'+customerTotal+'人）' : '提成明细'}}
                        </li>
                    </ul>
                    <div class="searchWrap" v-if="active==1">
                        <span>查找</span>
                        <Search v-model="customerPostData.KEY" placeholder="输入客户姓名或联系电话" @on-search="handleSearch"></Search>
                    </div>
                </div>
                <div class="tableWrap" v-if="active=='1'">
                    <Table  :columns="customerColumns" :data="customerData" :loading="loading"
                            :max-height="$bus.clientHeight-465" stripe  disabled-hover>
                        <template slot-scope="{ }" slot="Action">
                            <Button type="text">详情</Button>
                        </template>
                    </Table>
                    <Page
                        :total="customerTotal"
                        :current="customerPostData.PageIndex"
                        :page-size="customerPostData.PageSize"
                        placement="top"
                        show-total
                        show-sizer
                        @on-change="handleCustomerChange"
                        @on-page-size-change="customerPageSizeChanged"/>
                </div>
                <div class="tableWrap" v-else>
                    <Table  :columns="royaltyColumns" :data="royaltyData" :loading="loading"
                            :max-height="$bus.clientHeight-455" stripe  disabled-hover>
                    </Table>
                    <Page
                        :total="royaltyTotal"
                        :current="royaltyColumns.PageIndex"
                        :page-size="royaltyColumns.PageSize"
                        placement="top"
                        show-total
                        show-sizer
                        @on-change="handleRoyaltyChange"
                        @on-page-size-change="royaltyPageSizeChanged"/>
                </div>
            </div>
        </div>

        <!-- 备注 -->
        <Modal v-model="isEditRemark" width="460" :mask-closable="false"  @on-cancel="isEditRemark=false;">
            <Form  :label-width="80" style="margin-top: 50px;">
                <FormItem label="备注">
                    <Input v-model="editedRemark" type="text" maxlength="5"  placeholder="最多5个字"/>
                </FormItem>
            </Form>
            <div slot="footer" class="foot">
                <Button type="primary" @click="submitRemark">确定</Button>
            </div>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </Modal>

    </div>
</template>
<script>
import Header from '@/components/route-header'
import Search from '@/components/search'
import { getDistributionDetail, getDistributionCustomers, getDistributionIncome, editDistributionRemark } from '@/api/marketing.js'
export default {
    name: "distributorDetail",
    components: { Header, Search },
    data(){
        return{
            id: '',
            detailData: {
                Id: "",
                Name: "",
                Photo: "",
                Phone: "",
                SiteName: "", //企业名称
                SiteDesc: "", //企业宣言
                Remark: "enen", //备注
                Sales: 0,
                Income: 0,
                CreateTime: "",
                Source: "",
                Status: 0,
                Reason: null
            },
            active: '1',
            spinShow: false,
            isEditRemark: false,
            editedRemark: "",
            customerPostData: {
                KEY: '',  // 搜索
                PageIndex: 1,
                PageSize: 10,
                DisID: ''
            },
            royaltyPostData: {
                PageIndex: 1,
                PageSize: 10,
                DisID: '', 
            },
            loading: false,
            customerTotal: 0,
            royaltyTotal: 0,
            customerData:[],
            royaltyData:[],
            customerColumns: [
                {
                    title: '排名',
                    key: 'Rank',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '姓名',
                    key: 'Name',
                    minWidth: 120,
                    className: 'nameColumn',
                    align: 'left'
                },
                {
                    title: '联系电话',
                    key: 'Phone',
                    minWidth: 120,
                    align: 'left'
                },
                // {
                //     title: '等级',
                //     key: 'Name',
                //     minWidth: 120,
                //     align: 'left'
                // },
                {
                    title: '性别',
                    key: 'Sex',
                    minWidth: 80,
                    align: 'left'
                },
                {
                    title: '消费(元)',
                    key: 'Sales',
                    minWidth: 130,
                    align: 'left',
                },
                {
                    title: '到访(次)',
                    key: 'Visits',
                    minWidth: 130,
                    align: 'left',
                },
                {
                    title: '操作',
                    slot: 'Action',
                    minWidth: 120,
                    align: 'center'
                }
            ],
            royaltyColumns: [
                {
                    title: '商品名称',
                    key: 'Name',
                    minWidth: 200,
                    className: 'nameColumn',
                    align: 'left'
                },
                {
                    title: '订单完成时间',
                    key: 'OrderTime',
                    minWidth: 180,
                    align: 'left'
                },
                {
                    title: '成交(元)',
                    key: 'Sales',
                    minWidth: 130,
                    align: 'left',
                },
                {
                    title: '提成(元)',
                    key: 'Income',
                    minWidth: 130,
                    align: 'left',
                }
            ],
            
        }
    },
    created(){
        let id = this.$route.query.id
        this.customerPostData.DisID = id;
        this.royaltyPostData.DisID = id;
        this.id = id;
        this.getCustomerData();
        this.getDetail();
    },
    methods:{
        //分销员详情
        getDetail(){
            this.$Spin.show();
            getDistributionDetail(this.id).then(res => {
                this.$Spin.hide();
                this.detailData = res.Data.DistributionDetail;
            }).catch(err => {
                this.$Spin.hide();
            })
        },

        selectChange(e){
            this.active = e;
            if(e=='1'){
                this.customerPostData = { ...this.customerPostData,PageIndex: 1,PageSize: 10};
                this.getCustomerData();
            }else{
                this.royaltyPostData = { ...this.royaltyPostData,PageIndex: 1,PageSize: 10};
                this.getRoyaltyData();
            }
        },

        //客户信息
        getCustomerData(){
            this.loading = true;
            getDistributionCustomers(this.customerPostData).then(res => {
                this.loading = false;
                this.customerData = res.Data.DistributionCustomer;
                this.customerTotal = res.Data.Total;
            }).catch(err => {
                this.loading = false;
            })
        },

        //提成信息
        getRoyaltyData(){
            this.loading = true;
            getDistributionIncome(this.royaltyPostData).then(res => {
                this.loading = false;
                this.royaltyData = res.Data.Income;
                this.royaltyTotal = res.Data.Total;
            }).catch(err => {
                this.loading = false;
            })
        },

        //页码切换
        handleCustomerChange(e){
            this.customerPostData.PageIndex = e;
            this.getCustomerData();
        },
        handleRoyaltyChange(e){
            this.royaltyPostData.PageIndex = e;
            this.getRoyaltyData();
        },

        //每页条数切换
        customerPageSizeChanged(pageSize){
            this.customerPostData = { ...this.customerPostData,PageIndex: 1,PageSize: pageSize};
            this.getCustomerData();
        },

        royaltyPageSizeChanged(pageSize){
            this.royaltyPostData = { ...this.royaltyPostData,PageIndex: 1,PageSize: pageSize};
            this.getRoyaltyData();
        },

        handleSearch(){
            this.customerPostData = { ...this.customerPostData,PageIndex: 1,PageSize: 10};
            this.getCustomerData();
        },


        //修改备注
        submitRemark(){
            this.spinShow = true;
            editDistributionRemark({Id: this.id,Remark: this.editedRemark}).then(res => {
                this.spinShow = false;
                this.isEditRemark = false;
                this.detailData.Remark = this.editedRemark;
                this.$Message.success( '修改备注成功');
            }).catch(err => {
                this.spinShow = false;
            })
        },

    }
}
</script>
<style lang="less">
    .distributorDetail{
        .ivu-table-wrapper{
            .ivu-table td.nameColumn > div{
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
    .ivu-form .ivu-form-item-label{
        color: #333;
        font-weight: 700;
    }
</style>
<style lang="less" scoped>
    .distributorDetail{
        height: 100%;
        .contentWrap{
            min-height: calc(100% - 44px);
            max-height: calc(100% - 44px);
            padding: 10px;
            box-sizing: border-box;
            background-color: #F7F8FA;
            overflow-y: auto;
        }
        .detailWrap{
            background-color: #fff;
            padding: 20px 30px ;
            margin-bottom: 10px;
            border-radius: 4px;
            .distributorInfo{
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                .avatar{
                    width: 140px;
                    height: 160px;
                    border-radius: 4px;
                    margin-right: 20px;
                }
                .detail{
                    width: calc(100% - 160px);
                    .name{
                        span{
                            &:nth-of-type(1){
                                font-size: 20px;
                                font-weight: 700;
                            }
                            &:nth-of-type(2){
                                display: inline-block;
                                font-size: 14px;
                                color: #4D85FF;
                                line-height: 22px;
                                height: 22px;
                                width: 66px;
                                text-align: center;
                                border-radius: 22px;
                                border: 1px solid #4D85FF;
                                margin-left: 15px;
                            }
                        }
                    }
                    .phone{
                        font-size: 28px;
                        font-weight: 700;
                        line-height: 2;
                    }
                    .ivu-row{
                        width: 100%;
                        font-size: 14px;
                        .ivu-col{
                            font-size: 16px;
                            color: #999;
                            // padding: 5px;
                            line-height: 32px;
                            display: flex;
                            align-items: center;
                            span{
                                color: #4a4a4a;
                            }
                            i{
                                font-style: normal;
                                display: inline-block;
                                width: 80px;
                            }
                            &:nth-of-type(3){
                                span{
                                    display: inline-block;
                                    max-width: calc(100% - 200px);
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                }
                                b{
                                    font-weight: normal;
                                    padding-left: 30px;
                                    color: #4D85FF;
                                    cursor: pointer;
                                }
                            }

                        }
                    }
                }
            }
            .statisticsInfo{
                background-color: #f9f9f9;
                line-height: 44px;
                padding: 0 30px;
                font-size: 16px;
                color: #999;
                span{
                    padding-left: 10px;
                    color: #333;
                    font-weight: 700;
                }
            }
        }
        .infoWrap{
            background-color: #fff;
            box-sizing: border-box;
            padding: 20px 30px 10px;
            border-radius: 4px;
            .head{
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
                ul{
                    display: flex;
                    font-size: 17px;
                    li{
                        padding-left: 30px;
                        box-sizing: border-box;
                        color: #666;
                        height: 30px;
                        line-height: 30px;
                        cursor: pointer;
                        &.active{
                            color: #000;
                            font-weight: 700;
                            position: relative;
                            &::before{
                                position: absolute;
                                left: 50%;
                                bottom: -2px;
                                // transform: translate(-50%);
                                content: "";
                                width: 30px;
                                height: 4px;
                                border-radius: 4px;
                                background-color: #0899AC;
                            }
                        }
                    }
                }
                .searchWrap{
                    display: flex;
                    align-items: center;
                    span{
                        font-size: 16px;
                        padding-right: 10px;
                    }
                }
            }
            .ivu-table-wrapper{
                .ivu-btn{
                    color: #3275F5;
                }
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
            // &:first-of-type{
            //     margin-right: 20px;
            // }
        }
    }
    
    
</style>