<template>
    <div class="dataList" v-if="dataList.CardItem">
        <div v-if="dataList.CardItem.UnionDisc" class="discount" @click="selectItem(dataList.serviceIndex)">
            <template v-if="dataList.serviceIndex != -1">
                <img v-if="selectedJson.Id == configArr[dataList.serviceIndex].Id"
                     src="@/assets/select-single.svg" alt="">
                <span v-else class="selected"></span>
            </template>
            <p>
                全店统一{{dataList.CardItem.Discount}}折优惠
            </p>
        </div>
        <div v-if="dataList.CardItem.ServiceItem && dataList.CardItem.ServiceItem.length>0">
            <p class="title"  @click="selectItem(dataList.serviceIndex)">
                <template v-if="dataList.serviceIndex != -1">
                    <img v-if="selectedJson.Id == configArr[dataList.serviceIndex].Id"  
                            src="@/assets/select-single.svg" alt="">
                    <span v-else class="selected"></span>
                </template>
                项目/服务权益</p>
            <div class="tableWrap">
                <Table  :columns="projectColumns" disabled-hover
                        :row-class-name="rowClassName"
                        :data="dataList.CardItem.ServiceItem"></Table>
            </div>
           
        </div>

        <div v-if="dataList.CardItem.ProductItem && dataList.CardItem.ProductItem.length>0">
            <p class="title" @click="selectItem(dataList.productIndex)">
                <template v-if="dataList.productIndex != -1">
                    <img v-if="selectedJson.Id == configArr[dataList.productIndex].Id" 
                         src="@/assets/select-single.svg" alt="">
                    <span v-else class="selected"></span>
                </template>
                产品权益</p>
            <div class="tableWrap">
                <Table  :columns="productColumns" disabled-hover
                        :row-class-name="rowClassName1"
                        :data="dataList.CardItem.ProductItem"></Table>
            </div>
        </div>

        <div class="present">
            <p class="tip" v-if="feiKaCard && (dataList.CardItem.GiveServiceItem.length>0 || dataList.CardItem.GiveProductItem.length>0)">
                <img src="../../../assets/tip.svg" alt="">
                <span>完成以上权益之后才可使用赠送项目/服务、产品哦~</span>
            </p>
            <div v-if="dataList.CardItem.GiveServiceItem && dataList.CardItem.GiveServiceItem.length>0">
                <p class="title" @click="selectItem(dataList.giveServiceIndex)">
                    <template v-if="dataList.giveServiceIndex != -1">
                        <img v-if="selectedJson.Id == configArr[dataList.giveServiceIndex].Id"
                             src="@/assets/select-single.svg" alt="">
                        <span v-else class="selected"></span>
                    </template>
                    赠送项目/服务</p>
                <div class="tableWrap">
                    <Table  :columns="presentProjectColumns" disabled-hover
                            :row-class-name="rowClassName1"      
                            :data="dataList.CardItem.GiveServiceItem"></Table>
                </div>
            </div>
            
            <div v-if="dataList.CardItem.GiveProductItem && dataList.CardItem.GiveProductItem.length>0">
                <p class="title" @click="selectItem(dataList.giveProductIndex)">
                    <template v-if="dataList.giveProductIndex != -1">
                        <img v-if="selectedJson.Id == configArr[dataList.giveProductIndex].Id" 
                             src="@/assets/select-single.svg" alt="">
                        <span v-else class="selected"></span>
                    </template>
                    赠送产品</p>
                <div class="tableWrap">
                    <Table  :columns="presentProductColumns" disabled-hover
                            :row-class-name="rowClassName1"
                            :data="dataList.CardItem.GiveProductItem" ></Table>
                </div>
            </div>
            
        </div>
        
    </div>
</template>
<script>
export default {
    props: {
        dataList:{
            type: Object,
            default: () => {},
            required: true
        },
        configArr:{
            type: Array,
            default: [],
        },
        selectedItem: {
            type: Object,
            default: () => {},
        },
        itemId:{
            type: String,
            default: ''
        },
        feiKaCard:{
            type: Boolean,
            default: false
        }
    },
    data(){
        return{
            selectedJson: {},
            COLUMNS: [{
                    title: '项目/服务名称',
                    key: 'ItemName',
                    minWidth: 180,
                },{
                    title: '价格',
                    key: 'ItemPrice',
                    minWidth: 100,
                    render: (h, params) => {
                            return h('span', {}, '￥'+params.row.ItemPrice.toFixed(2))
                        }
                },{
                    title: '次数',
                    key: 'ItemNum',
                    minWidth: 100,
                    render: (h, params) => {
                            return h('span', {}, params.row.ItemNum + params.row.ItemUnit)
                        }
                },{
                    title: '已用',
                    key: 'UsedNum',
                    minWidth: 100,
                    render: (h, params) => {
                            return h('span', {}, params.row.UsedNum + params.row.ItemUnit)
                        }
                },{
                    title: '剩余',
                    slot: 'RemainNum',
                    minWidth: 100,
                    render: (h, params) => {
                            let num = params.row.RemainNum;
                            return num>0 ? h('span', {style: {
                                        color: '#E94E27'
                                    },}, params.row.RemainNum + params.row.ItemUnit) : h('span', {}, '已用完')
                        }
                },{
                    title: '状态',
                    key: 'Receive',
                    minWidth: 100,
                    align: 'right',
                    render: (h, param) => {
                        const item = param.row;
                        if(!this.dataList.CardItem.UsedUp){
                            return <span>暂不能用</span>
                        }else{
                            if(item.Receive){
                                return <span>已经领取</span>
                            }else{
                                return h('Button', {
                                        props: {
                                            shape: 'circle',
                                            size: 'small'
                                        },
                                        style: {
                                            fontSize: '14px',
                                            color: '#fff',
                                            backgroundColor: '#3275F5'
                                        },
                                        on: {
                                            click: () => {
                                                this.getPresent(param.index,param.row.Id)
                                            }
                                        }
                                    }, '领取')
                            }
                        }
                        
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
                            h('ul', this.dataList.CardItem.ServiceItem[params.index].list.map(item => {
                                let statusColor = item.ItemId == this.itemId || !this.itemId ? '1' : '.3';
                                return h('li', {
                                    style: {
                                        opacity: statusColor
                                    }
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
                            h('ul', this.dataList.CardItem.ServiceItem[params.index].list.map(item => {
                                let statusColor = item.ItemId == this.itemId || !this.itemId ? '1' : '.3';
                                return h('li', {
                                    style: {
                                        opacity: statusColor
                                    }
                                }, '￥'+(item.ItemPrice || 0).toFixed(2))
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
                },{
                    title: '已用',
                    key: 'UsedNum',
                    minWidth: 100,
                    render: (h, params) => {
                            return h('span', {}, params.row.UsedNum + params.row.ItemUnit)
                        }
                },{
                    title: '剩余',
                    slot: 'RemainNum',
                    minWidth: 100,
                    render: (h, params) => {
                        let num = params.row.RemainNum;
                        return num>0 ? h('span', {style: {
                                    color: '#E94E27'
                                },}, params.row.RemainNum + params.row.ItemUnit) : h('span', {}, '已用完')
                    }
                }],

            projectColumns:[],
            productColumns:[
                {
                    title: '产品名称',
                    key: 'ItemName',
                    minWidth: 180,  
                },{
                    title: '价格',
                    key: 'ItemPrice',
                    minWidth: 100,
                    render: (h, params) => {
                            return h('span', {}, '￥'+params.row.ItemPrice.toFixed(2))
                        }
                },{
                    title: '折扣',
                    key: 'ItemNum',
                    minWidth: 100,
                    render: (h, params) => {
                            return h('span', {}, params.row.ItemNum + params.row.ItemUnit)
                        }
                }
            ],
            presentProjectColumns: [],
            //赠送产品
            presentProductColumns: [{
                    title: '产品名称',
                    key: 'ItemName',
                    minWidth: 180,
                },{
                    title: '价格',
                    key: 'ItemPrice',
                    minWidth: 100,
                    render: (h, params) => {
                            return h('span', {}, '￥'+params.row.ItemPrice.toFixed(2))
                        }
                },{
                    title: '数量',
                    key: 'ItemNum',
                    minWidth: 100,
                    render: (h, params) => {
                            return h('span', {}, params.row.ItemNum + params.row.ItemUnit)
                        }
                },{
                    title: '状态',
                    slot: 'Receive',
                    align: 'right',
                    minWidth: 100,
                    render: (h, param) => {
                        const item = param.row;
                        if(this.feiKaCard && !this.dataList.CardItem.UsedUp){
                            return <span>暂不能用</span>
                        }else{
                            if(item.Receive){
                                return <span>已经领取</span>
                            }else{
                                return h('Button', {
                                        props: {
                                            shape: 'circle',
                                            size: 'small'
                                        },
                                        style: {
                                            fontSize: '14px',
                                            color: '#fff',
                                            backgroundColor: '#3275F5'
                                        },
                                        on: {
                                            click: () => {
                                                this.getPresent(param.index,param.row.Id)
                                            }
                                        }
                                    }, '领取')
                            }
                        }
                        
                    }
                }],

        }
    },
    watch:{
        selectedItem: {
            immediate: true,
            handler (val) {
                this.selectedJson = val;
            }
        }
    },
    created(){
        if(this.dataList.CardItem){
            //产品权益
            if(this.dataList.ChildType=='多项有限次'){
                this.projectColumns = this.mergeColumns;
                let arr = this.dataList.CardItem.ServiceItem;
                this.dataList.CardItem.ServiceItem = [{
                        list: [...arr], 
                        ItemNum:  arr[0].ItemNum,
                        ItemUnit: arr[0].ItemUnit,
                        UsedNum: arr[0].UsedNum,
                        RemainNum: arr[0].RemainNum,

                }]
            }else if(this.dataList.Unlimited){ //不限次数
                this.projectColumns = this.COLUMNS.slice(0,2);
            }else if(this.dataList.ClassType=='折扣卡'){ //非统一折扣的折扣卡
                this.projectColumns = [...this.COLUMNS.slice(0,2),{
                                        title: '折扣',
                                        key: 'ItemNum',
                                        minWidth: 100,
                                        render: (h, params) => {
                                                return h('span', {}, params.row.ItemNum + params.row.ItemUnit)
                                            }
                                    }];
            }else{
                this.projectColumns = this.COLUMNS.slice(0,5);
            };
            
            //赠送服务
            if(this.feiKaCard && !this.dataList.CardItem.UsedUp){
                this.presentProjectColumns = this.COLUMNS.slice(0,3).concat(this.COLUMNS.slice(5));
            }else{
                this.presentProjectColumns = this.COLUMNS.slice(0,5);
            }

            // 匹配
            if(this.dataList.CardItem.UnionDisc){
                this.dataList.serviceIndex = this.configArr.findIndex(item => 
                    item.UnionDisc && item.UserCardProjectId==this.dataList.UserCardProjectId)
            }
            if(this.dataList.CardItem.ServiceItem && this.dataList.CardItem.ServiceItem.length>0){
                // console.log(77,this.dataList)
                this.dataList.serviceIndex = this.configArr.findIndex(item => 
                    item.UserCardProjectId==this.dataList.UserCardProjectId && item.Class=='1')
            };
            if(this.dataList.CardItem.ProductItem && this.dataList.CardItem.ProductItem.length>0){
                this.dataList.productIndex = this.configArr.findIndex(item => 
                    item.UserCardProjectId==this.dataList.UserCardProjectId && item.Class=='2')
            };
            if(this.dataList.CardItem.GiveServiceItem && this.dataList.CardItem.GiveServiceItem.length>0){
                this.dataList.giveServiceIndex = this.configArr.findIndex(item => 
                    item.UserCardProjectId==this.dataList.UserCardProjectId && item.Class=='3')
            };
            if(this.dataList.CardItem.GiveProductItem && this.dataList.CardItem.GiveProductItem.length>0){
                this.dataList.giveProductIndex = this.configArr.findIndex(item => 
                    item.UserCardProjectId==this.dataList.UserCardProjectId && item.Class=='4')
            };

        }

    },
    methods:{
        selectItem(index){
            if(this.itemId && index != -1){
                this.selectedJson = this.configArr[index];
                this.$emit('changeConfig',this.selectedJson)
            }
        },
        getPresent(index,id){
            this.$Spin.show();
            const url = '/UserCardProject/CollectProduct';
            this.$axios.post(url, { UserProjectItemId: id }).then(res => {
                let {Code,Data,Message} = res.data;
                this.$Spin.hide();
                if (Code === '0') {
                    this.dataList.CardItem.GiveProductItem[index].Receive = true;
                } else {
                    this.$Message.error(Message);
                }
            }).catch(e => {
                throw new Error(e)
            })
        },
        rowClassName(row, index) {
            if(this.dataList.ChildType!='多项有限次'){
                if (this.itemId && row.ItemId != this.itemId) {
                    return 'disabled';
                }else{
                    return '';
                }
            }
            
        },
        rowClassName1(row, index) {
            if (this.itemId && row.ItemId != this.itemId) {
                return 'disabled';
            }else{
                return '';
            }
            
        }
    }
}
</script>
<style lang="less">
    .dataList{
        .tableWrap{
            .ivu-table th, .ivu-table td{
                height: 59px;
                background-color: #fff;
                border-bottom: 10px solid #f9f9f9;
            }
            .ivu-table .disabled td{
                opacity: 0.3;
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
    }
</style>
<style lang="less" scoped>
    .dataList{
        border-top: 10px solid #F7F8FA;
        font-size: 14px;
        .discount{
            text-align: center;
            line-height: 44px;
            background-color: #FFF6F4;
            color: #E94E27;
            font-weight: 600;
            font-size: 16px;
        }
        .title{
            margin: 25px 0 15px 15px;
            font-weight: 700;
            display: flex;
            align-items: center;
            .selected{
                width: 16px;
                height: 16px;
                border: 1px solid #333;
                border-radius: 50%;
                margin-right: 5px;
            }
            img{
                margin-right: 5px;
            }
        }
        .tip{
            display: flex;
            align-items: center;
            color: #E94E27;
            margin-top: 30px;
            img{
                margin-right: 10px;
            }
        }
        .tableWrap{
            background-color: #F9F9F9;
            padding: 33px 23px;
        }
        
    }
</style>