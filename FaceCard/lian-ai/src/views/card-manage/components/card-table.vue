<template>
    <div class="tableWrap">
        <Table  :columns="columns" :data="array" disabled-hover></Table>
    </div>
</template>
<script>
export default {
    props: {
        tableData:{
            type: Array,
            default: [],
            required: true
        },
        type: {
            type: String,
            default: '1',     //1次卡，2折扣卡 3体验卡
            required: true
        },
        childType: {
            type: String,
            default: '',     
            required: false
        },
        classes: {
            type: Number,
            default: '1',     //1服务 2产品
            required: true
        },
        childClass: {
            type: Number,
            default: '1',     //1权益 2赠送
            required: true
        },
        toTalNum: {
            type: Number,  //权益服务限制次数
            default: 1,     
            required: false
        }
    },
    data(){
        return{
            originalColumns: [
                {
                    title: this.classes=='1' ? '项目/服务名称' : '产品名称',
                    key: 'ItemName',
                    minWidth: 180,
                },
                {
                    title: '价格',
                    key: 'ItemPrice',
                    minWidth: 100,
                    render: (h, params) => {
                            return h('span', {}, '￥'+params.row.ItemPrice.toFixed(2))
                        }
                },
                {
                    title: this.classes=='1' ? '数量' : '次数',
                    key: 'ItemNum',
                    minWidth: 120,
                    render: (h, params) => {
                            return h('span', {}, params.row.ItemNum + params.row.ItemUnit)
                        }
                },
                {
                    title: '折扣',
                    key: 'ItemNum',
                    minWidth: 120,
                    render: (h, params) => {
                            return h('span', {}, params.row.ItemNum + params.row.ItemUnit)
                        }
                },
                {
                    title: '折后价',
                    key: 'ItemPrice',
                    minWidth: 100,
                    render: (h, params) => {
                            let price = 0;
                            if(params.row.ItemNum==0){
                                price = params.row.ItemPrice;
                            }else{
                                price = params.row.ItemPrice * params.row.ItemNum/10;
                            }
                            return h('span', {}, '￥'+price.toFixed(2))
                        }
                }],

            //多项有限次卡
            mergeColumns:[
                {
                    title: '项目/服务名称',
                    key: 'ItemName',
                    minWidth: 180,
                    render: (h, params) => {
                        return h('div', {
                            attrs: {
                                class:'subCol'
                            },
                        }, [
                            h('ul', this.array[params.index].list.map(item => {
                                return h('li', {
                                }, item.ItemName)
                            }))
                        ]);
                    }
                },{
                    title: '价格',
                    key: 'ItemPrice',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('div', {
                            attrs: {
                                class:'subCol'
                            },
                        }, [
                            h('ul', this.array[params.index].list.map(item => {
                                return h('li', {
                                }, '￥'+item.ItemPrice.toFixed(2))
                            }))
                        ]);
                    }
                },{
                    title: '次数',
                    key: 'ItemNum',
                    minWidth: 100,
                    render: (h, params) => {
                            return h('span', {}, params.row.ItemNum + params.row.ItemUnit)
                        }
                }],

        }
    },
    computed: {
        array(){
            if(this.type=="1" && this.childClass=="1" && this.childType.includes('多项有限次')){
                //多项有限次卡服务权益
                if(this.tableData.length>0){
                    return [{ 
                            list: [...this.tableData], 
                            ItemNum: this.toTalNum,
                            ItemUnit: this.tableData[0].ItemUnit
                            }];
                }

            }else{

                return  this.tableData;
            }
        },
        columns(){
            // let column = JSON.parse(JSON.stringify(this.originalColumns))
            //多项有限次卡服务权益
            if(this.type=="1" && this.childClass=="1" && this.childType.includes('多项有限次') ){
                return this.mergeColumns;
            }else if(this.type=="2" && this.childClass=="1"){ //折扣卡权益
                return this.originalColumns.slice(0,2).concat(this.originalColumns.slice(3));
            }else {
                return this.originalColumns.slice(0,3);
            }
        }

    },
    created(){
        
    },
    methods:{
        
    }
}
</script>
<style lang="less">
    .tableWrap{
        .ivu-table th, .ivu-table td{
            height: 59px;
            background-color: #fff;
            border-bottom: 10px solid #f9f9f9;
        }
        .subCol>ul{
            padding: 15px 0;
            &>li{
                list-style:none;
                line-height: 36px;
                overflow-x: hidden;
            }
        }
        
    }
</style>
<style lang="less" scoped>
.tableWrap{
    background-color: #F9F9F9;
    padding: 33px 23px;
}
</style>