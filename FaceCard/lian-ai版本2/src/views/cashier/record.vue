<template>
    <div class="cash-record">
        <Header title="提现记录"></Header>
        <div ref="tableWrap" class="table-wrap">
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
</template>

<script>
import Header from 'src/components/route-header'
import Pager from 'src/components/pager'
export default {
    components: { Header,Pager },
    data(){
        return {
            maxHeight: 300,
            total: 10,
            columns:[
                {
                    title: '姓名',
                    key: 'UserName'
                },
                {
                    title: '收款',
                    key: 'CashType'
                },{
                    title: '提现金额',
                    key: 'Amount'
                },{
                    title: '提现时间',
                    key: 'CashOutTime'
                },{
                    title: '状态',
                    key: 'Status',
                    render: (h, params) => {
                            return h('div', {
                                style: {
                                        color: params.row.Status=='正在处理' ? '#E94E27' : '#333'
                                    },
                            },params.row.Status);
                        }
                },
            ],
            tableData: [],
            
        }
        
    },
    created(){
        var height = document.documentElement.clientHeight || document.body.clientHeight;
        this.maxHeight = height-124;
        this.onPageChange()
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
        }
    },
}
</script>

<style lang="less" scoped>
    .table-wrap{
        padding: 10px;
        box-sizing: border-box;
        height: 100%;
    }
    
    
    
</style>

