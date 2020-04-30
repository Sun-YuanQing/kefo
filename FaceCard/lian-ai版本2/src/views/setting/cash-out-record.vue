<template>
    <div class="cash-out">
        <Header title="提现"></Header>
        <div class="content-wrap">
            <Row class="condition">
                <Col :xs="24" :sm="8">
                    <div>
                        <p style="font-size: 14px;">提现总额(线上充值）</p>
                        <div class="amount">
                            <span style="font-size: 30px">{{Math.floor(statistic.TotalAmout)}}</span>
                            <span style="font-size: 22px">.{{statistic.TotalAmout.toFixed(2).substr(-2, 2)}}</span>
                        </div>
                    </div>
                </Col>
                <Col :xs="24" :sm="8">
                    <div>
                        <p style="font-size: 14px;">已提现</p>
                        <div class="amount">
                            <span style="font-size: 30px">{{Math.floor(statistic.CashOutAmout)}}</span>
                            <span style="font-size: 22px">.{{statistic.CashOutAmout.toFixed(2).substr(-2, 2)}}</span>
                        </div>
                    </div>
                </Col>
                <Col :xs="24" :sm="8">
                    <div>
                        <p style="font-size: 14px;">可提现</p>
                        <div class="amount">
                            <span style="font-size: 30px">{{Math.floor(statistic.RemainAmout)}}</span>
                            <span style="font-size: 22px">.{{statistic.RemainAmout.toFixed(2).substr(-2, 2)}}</span>
                            <Button style="margin-left: 15px;padding: 0 30px;" :to="{path: '/cashOut',query:{amout: statistic.RemainAmout}}">提现</Button>
                        </div>
                    </div>
                </Col>
            </Row>
            <div class="table-wrap">
                <div class="title">
                    <p>提现记录</p>
                </div>
                <div style="flex: 1; overflow: scroll">
                    <Table  :columns="columns" :data="tableData" 
                            :max-height="maxHeight"
                            stripe  disabled-hover></Table>
                </div>
                <footer>
                    <Pager :total="total" @on-change="onPageChange"></Pager>
                </footer>
            </div>
        </div>
    </div>
</template>
<script>
import Header from 'src/components/route-header'
import Pager from 'src/components/pager'
export default {
    components: { Header,Pager },
    data(){
        return{
            statistic: {
                 "TotalAmout": 0,
                "CashOutAmout": 0,
                "RemainAmout": 0
            },
            maxHeight: 300,
            total: 10,
            columns:[
                {
                    title: '交易流水',
                    key: 'UserName',
                    minWidth: 110,
                    fixed: 'left'
                },
                {
                    title: '类别',
                    key: 'UserName',
                    minWidth: 100
                },
                {
                    title: '账号',
                    key: 'UserName',
                    minWidth: 120
                },
                {
                    title: '提现金额(元)',
                    key: 'Amount',
                    minWidth: 160
                },
               {
                    title: '提现时间',
                    key: 'CashOutTime',
                    minWidth: 180
                },
                {
                    title: '交易完成时间',
                    key: 'CashOutTime',
                    minWidth: 180
                },
                {
                    title: '状态',
                    key: 'Status',
                    minWidth: 120,
                    render: (h, params) => {
                            return h('div', {
                                style: {
                                        color: params.row.Status=='正在处理' ? '#E94E27' : '#333'
                                    },
                            },params.row.Status);
                        }
                },
                 {
                    title: '姓名',
                    key: 'UserName',
                    minWidth: 100
                },
                {
                    title: '收款',
                    key: 'CashType',
                    minWidth: 180
                },
            ],
            tableData: [],
            
        }
    
    },
    created(){
        var height = document.documentElement.clientHeight || document.body.clientHeight;
        this.maxHeight = height-375;
        this.onPageChange();
        this.getStatistic();
    },
    methods: {
        onPageChange(){
            const url = '/CashOut/GetCashList';
            this.$axios.post(url).then(res => {
                if (res.data.Code === '0') {
                    const data = res.data.Data;
                    this.tableData = data;
                } else {
                    this.$Message.error(res.data.Message);
                }
            }).catch(e => {
                throw new Error(e)
            })
        },
        getStatistic(){
            const url = '/CashOut/GetCashOutStatistic';
            this.$axios.post(url).then(res => {
                if (res.data.Code === '0') {
                    const data = res.data.Data;
                    this.statistic = data;
                } else {
                    this.$Message.error(res.data.Message);
                }
            }).catch(e => {
                throw new Error(e)
            })
        }
    },

}
</script>
<style lang="less">
    .ivu-table th {
        background-color: #eee;
    }
</style>
<style lang="less" scoped>
.cash-out{
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: #F7F8FA; 
    .content-wrap{
        margin: 10px;
        .condition{
            background: #fff;
            border-radius: 8px;
            .ivu-col{
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                padding: 50px 0;
                >div{
                    min-width: 132px;
                }
                .amount{
                    font-weight: 700;
                    font-size: 30px;
                    img{
                        padding-left: 18px;
                    }
                }
            }
        }
        .table-wrap{
            padding: 10px 10px 0;
            box-sizing: border-box;
            background-color: #fff;
            position: relative;
            .title{
                display: flex;
                justify-content: space-between;
                margin: 15px;
                p{
                    font-size: 16px;
                    font-weight: 700;
                }
            }
        }
        .table-wrap::before{
            content: "";
            width: calc(100% - 20px);
            height: 1px;
            background-color: #e4e4e4;
            position: absolute;
            top: 0;
            left: 10px;
        }
    }
}
</style>


