<template>
    <!-- 选择产品名称 -->
        <Modal v-model="isShowModal" width="760" :mask-closable="false"
               class="priceModal" @on-cancel="preStep">
            <p slot="header" style="font-size: 18px;">产品规格</p>
            <div class="content">
                <template v-if="type != '3'">
                    <div class="th">
                        <div style="width: 40%">产品名称</div>
                        <div style="width: 40%">时间</div>
                        <div style="width: 20%">价格</div>
                    </div>
                    <div class="tdWrap">
                        <div class="td" v-for="(type,index) in typePriceList" 
                            :class="{'selected': type.Id == selectedProduct.Id}"
                            :key="index" @click="rowClick(type)">
                            <div style="width: 40%">{{type.Name}}</div>
                            <div style="width: 40%">{{type.DepartureDate}}</div>
                            <div style="width: 20%">￥{{type.Price}}</div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="th">
                        <div style="width: 30%">产品名称</div>
                        <div style="width: 20%">类型</div>
                        <div style="width: 30%">有效时间</div>
                        <div style="width: 20%">价格</div>
                    </div>
                    <div class="tdWrap">
                        <div class="td" v-for="(type,index) in typePriceList" 
                            :class="{'selected': type.Id == selectedProduct.Id}"
                            :key="index" @click="rowClick(type)">
                            <div style="width: 30%">{{type.Name}}</div>
                            <div style="width: 20%">{{type.TypeName}}</div>
                            <div style="width: 30%">{{type.DepartureDate}}</div>
                            <div style="width: 20%">￥{{type.Price}}</div>
                        </div>
                    </div>
                </template>
                <div class="dataNone" v-if="isLoad && typePriceList.length==0">暂无数据</div>
            </div>
            <Spin size="large" fix v-if="loading"></Spin>
            <div slot="footer" class="foot">
                <Button  @click="preStep">上一步</Button>
                <Button type="primary" @click="toSure">确定</Button>
            </div>
        </Modal>
</template>
<script>
import { getTypePriceById } from '@/api/goods.js'
export default {
    props:{
        isShow: false,
        isPreStep: false,
        type: ""
    },
    data(){
        return{
            isShowModal: this.isShow,
            loading: false,
            isLoad: false,
            total:0,
            typePriceList: [],
            selectedProduct: {},
        }
    },
    watch: {
        isShow(val){
            this.isShowModal = val;
        }
    },
    created(){
        
    },
    methods: {
        //弹窗产品价格
        getPriceList(postData){
            this.loading = true;
            this.typePriceList = [];
            getTypePriceById(postData).then(res => {
                this.loading = false;
                this.isLoad = true;
                this.typePriceList = res.Data.TypePrice;
                this.total = res.Data.Total;
            }).catch(err => {
                this.loading = false;
            })
        },
        preStep(){
            this.$emit('preStep');
        },
        rowClick(data){
            this.selectedProduct = data;
        },
        toSure(){
            if(Object.keys(this.selectedProduct).length==0){
                this.$Message.warning("请先选择一个产品");
            }else{
                this.$emit('productChange',this.selectedProduct);
            }
            
        }

    }
}
</script>
<style lang="less">

</style>
<style lang="less" scoped>
    .priceModal{
        .content{
            padding: 10px;
            line-height: 40px;
            .th{
                font-weight: 700;
            }
            .tdWrap{
                max-height: 300px;
                overflow-y: auto;
            }
            .td{
                cursor: pointer;
                background-color: #fff;
                margin-bottom: 10px;
                > div{
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
            .td.selected {
                border: 1px solid #3275F5;
                position: relative;
                overflow: hidden;
                &::after {
                    content: '';
                    width: 35px;
                    height: 35px;
                    border: 1px solid #3275F5;
                    background-color: #3275F5;
                    position: absolute;
                    right: 0;
                    bottom: -1px;
                    transform: rotate(45deg) translate(72%);
                    z-index: 7;
                }

                &::before {
                    content: '✔';
                    position: absolute;
                    right: 1px;
                    bottom: -11px;
                    color: #fff;
                    z-index: 9;
                    font-size: 13px;
                }
            }
            .th,.td{
                display: flex;
                >div{
                    box-sizing: border-box;
                    padding: 0 20px;
                }

            }
            .dataNone{
                background-color: #fff;
                line-height: 40px;
                text-align: center;
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