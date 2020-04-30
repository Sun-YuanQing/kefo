<template>
    <div class="timeCard">
        <div class="head" >
            <span style="color:#3275F5;cursor: pointer;padding-right: 10px;" @click="getList">{{classes=="1" ? "添加项目/服务" : "添加产品"}}</span>
            <span v-if="childClass == '1'">设置此卡支持的项目/服务{{isLimitNum ? '' : type=='2'?'和折扣':'和可用次数'}}</span>
            <span v-if="childClass == '2'">设置此卡支持的产品和折扣</span>
            <span v-if="childClass == '3'">设置购卡赠送的项目/服务次数</span>
            <span v-if="childClass == '4'">设置购卡赠送的产品数量<span style="color: #999;font-size: 13px;">（到店领取）</span></span>
            
        </div>
        <div v-if="array.length>0">
            <Table :columns="columns" :data="array" disabled-hover></Table>
            <template>
                <!-- 折扣 -->
                <div class="setting" v-if="type=='2' && (childClass == '2' || childClass == '1')">
                    <span style="padding-right: 10px;">批量设置</span>
                    <InputNumber :max="9.9" :min="0"  v-model="volume" @on-change="changeNum"
                                style="width: 100px;font-size: 14px"></InputNumber><span>&nbsp;折</span>
                </div>

                <!-- 单项 -->
                <div class="setting" v-else-if="isSingle && !isLimitNum">
                    <span style="padding-right: 10px;">批量设置</span>
                    <InputNumber :max="9999999" :min="1" :precision="0" v-model="volume" @on-change="changeNum"
                                style="width: 100px;font-size: 14px"></InputNumber><span v-if="classes=='1'">&nbsp;次</span>
                </div>

                <!-- 多项 -->
                <div class="setting" v-else-if="!isSingle && childClass=='1' && !isLimitNum">
                    <span style="padding-right: 10px;">以上{{array.length}}个项目/服务共</span>
                    <InputNumber :max="9999999" :min="1" :precision="0" v-model="tolNum" @on-change="changeNum"
                                style="width: 100px;font-size: 14px"></InputNumber>&nbsp;次
                    <span style="color: #999;">（划卡时每做1个项目/服务划扣1次，若做2个项目/服务划扣2次</span>
                </div>
            </template>
            
            <template>
                <div class="total" v-if="!isSingle">合计：￥{{minTotal.toFixed(2)}} ~ ￥{{maxTotal.toFixed(2)}}</div>
                <div class="total" v-else-if="type == '2' && (childClass=='1' || childClass=='2')">合计：￥{{minTotal.toFixed(2)}}
                    <span style="padding-left: 20px;">折后价：￥{{discountTotal.toFixed(2)}}</span>
                </div>
                <div class="total" v-else>合计：￥{{minTotal.toFixed(2)}}</div>
            </template>
            
            
        </div>
        
        <Modal v-model="isAdd" width="705" class="addModel" :mask-closable="false">
            <p slot="header" style="text-align:center;font-size: 18px;">{{classes=="1" ? "添加项目/服务" : "添加产品"}}</p>
            <div>
                <div class="checkedAll">
                    <p :class="{selected: checkedAll}" @click="selectedAll"></p>
                    <span>全选</span>
                </div>
                <ul>
                    <li v-for="(item,index) in modalList" :key="index"  
                        :class="{selected:item.selected}"
                        @click="selectProject(index)">
                        <span class="name">{{item.Name}}</span>
                        <amount :value="item.Price" style="padding-left: 10px;color: inherit;"/>
                    </li>
                    
                </ul>
                <Spin size="large" fix v-if="spinShow"></Spin>
            </div>
            
            <div slot="footer" style="text-align:center">
                <Button type="primary" style="width: 200px;line-height: 40px;" @click="addProject">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import Pager from 'src/components/pager'
export default {
    props:{
        dataList:{
            type: Array,
            default: [],
            required: true
        },
        type: {
            type: String,
            default: '1',     //1次卡，2折扣卡 3体验卡
            required: true
        },
        classes: {
            type: String,
            default: '1',     //1服务 2产品
            required: true
        },
        childClass: {
            type: String,
            default: '1',     //1权益服务  2权益产品 3赠送服务  4赠送产品
            required: true
        },
        isSingle: {         
            type: Boolean,  //单项 多项
            default: true,     
            required: false
        },
        isLimitNum: {
            type: Boolean,  //权益服务不限制次数
            default: false,     
            required: false
        },
        toTalNum: {
            type: Number,  //权益服务限制次数
            default: 1,     
            required: false
        }
                                

        
    },
    data(){
        return {
                array: [],
                // array: JSON.parse(JSON.stringify(this.dataList)),
                tolNum: this.toTalNum,
                spinShow: false,
                modalList: [],
                isAdd: false,
                volume: 1,
                checkedAll: false,
                columns: [],
                originalColumns: [
                {
                    title: this.classes=='1' ? '项目/服务名称' : '产品名称',
                    key: 'ItemName',
                    minWidth: 180,
                    fixed: 'left',
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
                    minWidth: 150,
                    render: (h, params) => {
                            return h('div', [
                                h('InputNumber', {
                                    props: {
                                        min: 1,
                                        max: 9999999,
                                        precision: 0,
                                        value: params.row.ItemNum
                                    },
                                    style: {
                                        width: '90px',
                                        fontSize: '14px'
                                    },
                                    on:{
                                        input: (val) => {
                                            this.array[params.index].ItemNum = val==null ? 1 : val;
                                            this.$emit('arrayChange',this.array,this.childClass,this.minTotal,this.maxTotal)
                                        }
                                    }
                                }),
                                h('span',{
                                    style: {
                                        paddingLeft: '5px',
                                    },
                                },params.row.ItemUnit)
                            ])
                        },
                },
                {
                    title: "折扣",
                    key: 'ItemNum',
                    minWidth: 150,
                    render: (h, params) => {
                            return h('div', [
                                h('InputNumber', {
                                    props: {
                                        min: 0,
                                        max: 9.9,
                                        value: params.row.ItemNum
                                    },
                                    style: {
                                        width: '90px',
                                        fontSize: '14px'
                                    },
                                    on:{
                                        input: (val) => {
                                            this.array[params.index].ItemNum = val==null ? 9 : val;
                                            this.$emit('arrayChange',this.array,this.childClass,this.minTotal,this.maxTotal,this.discountTotal)
                                        }
                                    }
                                }),
                                h('span',{
                                    style: {
                                        paddingLeft: '5px',
                                    },
                                },params.row.ItemUnit)
                            ])
                        },
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
                                price = params.row.ItemPrice * params.row.ItemNum/10
                            }
                            return h('span', {}, '￥'+price.toFixed(2))
                        }
                },
                {
                    title: '操作',
                    key: 'action',
                    minWidth: 120,
                    align: 'center',
                    render: (h, params) => {
                            return h('Button', {
                                    props: {
                                        type: 'text',
                                    },
                                    style: {
                                        color: '#3275F5'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index,params.row.Id,params.row.ItemName)
                                        }
                                    }
                                }, '删除')
                        }
                },
            ],
         }
    },
    watch: {
      // 因为不能直接修改 props 里的属性，所以不能直接把 formData 通过v-model进行绑定
      // 在这里我们需要监听 formData，当它发生变化时，立即将值赋给 data 里的 form
      dataList: {
        immediate: true,
        handler (val) {
          this.array = val;
          if(val.length != this.modalList.length){
              this.checkedAll = false;
          }
        }
      }
    },
    computed: {
        minTotal(){ 
            let value = 0;
            if(!this.isSingle){
                let minVal = Math.min.apply(Math, this.array.map(item => item.ItemPrice));
                return minVal *  this.tolNum;
            }else{ 
                if(this.isLimitNum || (this.type == '2' && (this.childClass=='1' || this.childClass=='2'))){ //折扣 不限制次数卡
                    this.array.forEach(item => {
                        value += item.ItemPrice;
                    })
                    return value;
                }else{
                    this.array.forEach(item => {
                        value += item.ItemPrice * item.ItemNum;
                    })
                    return value;
                }
            }
        },
        maxTotal(){
            if(!this.isSingle){
                let maxVal = Math.max.apply(Math, this.array.map(item => item.ItemPrice));
                return maxVal *  this.tolNum;
            }else{
                return 0;
            }
        },
        discountTotal(){
            if(this.type == '2' && (this.childClass=='1' || this.childClass=='2')){
                let value = 0;
                this.array.forEach(item => {
                    value += item.ItemPrice * (item.ItemNum/10);
                })
                return value;
            }else{
                return 0;
            }
        }
    },
    created(){
        this.init();
    },
    methods: {
        init(){
            this.columns = JSON.parse(JSON.stringify(this.originalColumns));
            if(this.type=='2' && (this.childClass == '1' || this.childClass == '2')){ //折扣卡
                this.columns = this.originalColumns.slice(0,2).concat(this.originalColumns.slice(3)) ;
            }else if((!this.isSingle && this.childClass=='1') || this.isLimitNum){  //多项、折扣
                this.columns = this.originalColumns.slice(0,2).concat(this.originalColumns.slice(5)) ;
            }else{
                this.columns = this.originalColumns.slice(0,3).concat(this.originalColumns.slice(5)) ;
            }
            this.$emit('arrayChange',this.array,this.childClass,this.minTotal,this.maxTotal,this.discountTotal);
        },
        getList(){
            this.isAdd = true;
            this.spinShow = true;
            let url = this.classes == '1' ? '/Lable/GetServicesBySiteId' :'/Lable/GetProductsBySiteId'
            this.axios.post(url, { PageIndex: 1, PageSize: 999999999 })
            .then(res => {
                this.spinShow = false;
                if (res.data.Code === '0') {
                    let data = this.classes == '1' ? res.data.Data.Services : res.data.Data.Products;
                    this.modalList =  data.filter(item => item.Status == '0');
                    this.modalList = this.modalList.map(item => {
                        let flag = this.array.findIndex(list => list.ItemId == item.Id)
                        return {...item,selected: flag == -1 ? false : true}
                    })
                } else {
                    this.$Message.error(res.data.Message);
                }
            })
            .catch(e => {
                throw new Error(e)
            })
        },
        selectProject(index){
            this.modalList[index].selected = !this.modalList[index].selected;
        },
        selectedAll(){
            this.checkedAll = !this.checkedAll;
            this.modalList = this.modalList.map(item => {
                
                return {...item,selected: this.checkedAll ? true : false}
            })
        },
        changeNum(val){
            this.array = this.array.map(item => {
                return {...item,ItemNum: val}
            })
           this.$emit('arrayChange',this.array,this.childClass,this.minTotal,this.maxTotal,this.discountTotal,this.tolNum);
        },
        remove(index,id,name){
            // console.log(index,id)
            this.$Modal.confirm({
                title: '请确认是否删除'+name+'?',
                onOk: () => {
                    if(id){
                        this.spinShow = true;
                        let url = 'CardProject/DelCardItem?Id='+ id;
                        this.axios.post(url).then(res => {
                            this.spinShow = false;
                            let { Code, Message } = res.data;
                            if (Code === '0') {
                                this.$Message.success("删除成功");
                                this.array.splice(index,1);
                                this.$emit('arrayChange',this.array,this.childClass,this.minTotal,this.maxTotal,this.discountTotal);
                            } else {
                                this.$Message.error(Message);
                            }
                        })
                        .catch(e => {
                            throw new Error(e)
                        })
                    }else{
                        this.array.splice(index,1);
                        this.$emit('arrayChange',this.array,this.childClass,this.minTotal,this.maxTotal,this.discountTotal);
                    }
                    
                }
            })
        },
        addProject(){
            this.init();
            this.modalList.forEach((item,index) => {
                let flag = this.array.findIndex(list => list.ItemId == item.Id)
                if(item.selected && flag == -1){
                    let unit =  this.classes == "1" ? "次" : item.Unit;
                    if(this.type=='2' && (this.childClass == '1' || this.childClass == '2')){
                        unit = '折';
                    }
                    this.array.push({
                        ItemId: item.Id,
                        ItemName: item.Name,
                        ItemPrice: item.Price,
                        ItemUnit: unit,
                        ItemNum: this.volume,
                    })
                }
            })
            this.$emit('arrayChange',this.array,this.childClass,this.minTotal,this.maxTotal,this.discountTotal);
            this.isAdd = false;
        }
    }
}
</script>
<style lang="less">
    .timeCard{
        .ivu-table-wrapper{
            // border-top: 1px solid #dcdee2;
            // border-left: 1px solid #dcdee2;
            // border-right: 1px solid #dcdee2;
            // border-bottom: 0;
            // box-sizing: border-box;
        }
        .ivu-table th, .ivu-table td{
            border-bottom: 1px solid #dcdee2;
        }
    }
    .addModel{
        .big-num{
            font-size: 18px;
        }
    }
</style>
<style lang="less" scoped>
    .timeCard{
        margin-bottom: 15px;
        .head{
            margin-bottom: 15px;
        }
        .setting{
            margin-top: 25px;
            border: 1px solid #dcdee2;
            padding: 12px 15px;
        }
        .total{
            width: 320px;
            margin-top: 20px;
            line-height: 48px;
            background: #f9f9f9;
            padding: 0 15px;
        }
        @media screen and (max-width:576px){
            .total{
                width: 200px;
            }
            
        }
        
    }
    .addModel{
        .checkedAll{
            display: flex;
            align-items: center;
            margin: 0 10px 15px;
            p{
                width: 18px;
                height: 16px;
                border: 1px solid #c7c7c7;
                margin-right: 10px;
                border-radius: 2px;
            }
            .selected{
                position: relative;
                &::before{
                    width: 18px;
                    height: 16px;
                    position: absolute;
                    left: 0;
                    top: 0;
                    content: "";
                    background-image: url(../../../assets/selected-icon.svg);
                    background-size: 100% 100%;
                    
                }
            }
            span{
                color: #999;
                font-size: 16px;
            }
        }
        ul{
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            max-height: 660px;
            overflow-y: scroll;
            li{
                width: 200px;
                padding: 13px 5px;
                box-sizing: border-box;
                text-align: center;
                border: 1px solid #e4e4e4;
                background-color: #F7F8FA;
                margin: 0 10px 20px;
                font-size: 16px;
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                justify-content: center;
                .name{
                    max-width: 100px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
            .selected {
                border: 1px solid #3275f5;
                position: relative;
                overflow: hidden;
                &::after {
                content: "";
                    width: 35px;
                    height: 35px;
                    border: 1px solid #3275f5;
                    background-color: #3275f5;
                    position: absolute;
                    right: 0;
                    bottom: -1px;
                    transform: rotate(45deg) translate(72%);
                    z-index: 7;
                }
                &::before {
                    content: "✔";
                    position: absolute;
                    right: 1px;
                    bottom:0;
                    color: #fff;
                    z-index: 9;
                    font-size: 13px;
                }
            }
        }
        @media screen and (max-width:700px){
            ul{
                justify-content: center;
                li{
                    width: 220px;
                }
            }
        }
    }
</style>