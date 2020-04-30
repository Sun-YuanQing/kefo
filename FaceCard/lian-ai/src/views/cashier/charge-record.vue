<template>
    <div class="charge-record">
        <Header title="今日消耗金额"></Header>
        <div ref="tableWrap" class="table-wrap">
            <div style="flex: 1; overflow: scroll">
                <Table  :columns="columns" :data="tableData" 
                        :max-height="maxHeight"
                        :loading="loading"
                        stripe  disabled-hover></Table>
            </div>
            <div class="tatal-amount">合计：{{totalAmount}}</div>
            <footer>
                <Pager :total="total" @on-change="onPageChange"></Pager>
            </footer>
        </div>
    </div>
</template>

<script>
import Header from 'src/components/route-header'
import Pager from 'src/components/pager'
export default {
    components: { Header,Pager },
    data() {
        return {
            maxHeight: 300,
            total: 10,
            totalAmount: 0,
            loading: false,
            propsData: {
                "PageIndex": "1",
                "PageSize": "10",
                "Date": "",
                "LevelOne": "2" ,// 1 收款 2. 消耗
                "LevelTwo": "0",  // 1.收银 2.充值
                "LevelThree": "1" // 1.扣卡 2. 现金 3.微信 4.支付宝   5.APP 6.小程序
            },
            columns:[
                {
                    title: '交易编号',
                    key: 'RecordNo',
                    minWidth: 170,
                    fixed: 'left'
                },{
                    title: '用户编号',
                    key: 'Code',
                    minWidth: 170
                },{
                    title: '手机号',
                    key: 'Phone',
                    minWidth: 160
                },{
                    title: '姓名',
                    key: 'Name',
                    minWidth: 100
                },{
                    title: '类型',
                    key: 'Type',
                    minWidth: 120
                },{
                    title: '方式',
                    key: 'SourceType',
                    minWidth: 120
                },{
                    title: '金额(元)',
                    key: 'Amount',
                    minWidth: 120
                },{
                    title: '时间',
                    key: 'CreatedTime',
                    minWidth: 190
                }
            ],
            tableData:[],
        }
    },
    created(){
        var date = new Date()
        date.setTime(date.getTime());
        this.propsData.Date = date.getFullYear()+"-" + (date.getMonth()+1) + "-" + date.getDate();
        var height = document.documentElement.clientHeight || document.body.clientHeight;
        this.maxHeight = height-195;
        this.onPageChange({PageIndex:1,PageSize: 10})
    },
    methods:{
        onPageChange({PageIndex,PageSize}){
            this.loading = true;
            this.propsData = { ...this.propsData, PageIndex, PageSize }
            const url = '/Report/GetConsumeRecordsBySourceType';
            this.$axios.post(url,this.propsData).then(res => {
                this.loading = false;
                if (res.data.Code === '0') {
                    const data = res.data.Data;
                    this.tableData = data.Statistics;
                    this.total = data.Total;
                    this.totalAmount = data.TotalAmount;
                } else {
                    this.$Message.error(res.data.Message);
                }
            }).catch(e => {
                throw new Error(e)
            })
        },
    }
}
</script>
<style>
.ivu-table th {
 background-color: #eee;
}
</style>
<style lang="less" scoped>
    .charge-record{
        width: 100%;
        height: 100%;
        background-color: #F7F8FA; 
        overflow: auto;
    }
    .tatal-amount{
        background-color: #f8f8f9;
        line-height: 40px;
        font-weight: 700;
        display: flex;
        padding-right: 22%;
        justify-content: flex-end;
    }
    .table-wrap{
        padding: 10px 10px 0;
        margin: 10px;
        box-sizing: border-box;
        background-color: #fff;
        .title{
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            p{
                font-size: 16px;
                font-weight: 700;
            }
            .filter{
                display: flex;
                .ivu-date-picker{
                    margin-left: 10px;
                }
            }
        }
    }
</style>

