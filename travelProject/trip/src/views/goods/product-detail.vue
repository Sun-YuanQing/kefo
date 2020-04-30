<template>
    <FullPage :title="title" class="productDetail"
              :style="{'padding-bottom': formData.AuditStatus==-1 || option ? '15px' : '80px'}"
              @change-router="$router.back()">
        <div class="mainContent">
            <img :src="formData.CoverPhoto" alt="" >
            <div class="detail">
                <h3>{{formData.Name}}</h3>
                <div>
                    <ul :class="{'combine': formData.Type==4 && formData.Status != 1}">
                        <li>产品状态：
                            <span v-if="classes">{{formData.AuditStatus == 0 ? '未审核通过' : '审核中'}}</span>
                            <span v-else-if="storeType=='1'">{{formData.Status==0?'已下架':formData.Status==1?'已上架':'待上架'}}</span>
                            <span v-else>{{formData.Status==0?'已下线':formData.Status==1?'已上线':'待上线'}}</span>
                        </li>
                        <li v-if="formData.Status=='2'">{{storeType=='1' ? '上架时间：' : '上线时间：'}}
                            <span>{{formData.ShelfTime}}</span>
                        </li>
                        <li v-if="formData.Status=='0'">{{storeType=='1' ? '下架原因' : '下线原因'}}
                            <span>{{formData.OffReason || ''}}</span>
                        </li>
                        <template v-if="formData.Type==4">
                            <li v-if="formData.Type==1">到达方式：<span>{{formData.ArrivalWay==1?'直达':'选择性直达'}}</span></li>
                            <li>创建日期：<span>{{formData.CreateTime}}</span></li>
                        </template>
                    </ul>
                    <ul v-if="formData.Type==1 || formData.Type==2">
                        <li>产品性质：<span>{{formData.ProductPropertyStr}}</span></li>
                        <li>产品分类：<span>{{formData.TravelProductTypeName}}</span></li>
                        <li>出游类型：<span>{{formData.TravelTypeName}}</span></li>
                        <li v-if="formData.Type==1">到达方式：<span>{{formData.ArrivalWay==1?'直达':'选择性直达'}}</span></li>
                        <li v-if="formData.Type==2">供应商家：<span>{{formData.SupplierName}}</span></li>
                        <li>出发地点：<span>{{formData.DeparturePlace}}</span></li>
                        <li>创建日期：<span>{{formData.CreateTime}}</span></li>
                    </ul>
                    <ul v-if="formData.Type==3 || formData.Type==5" class="other">
                        <li>产品分类：<span>{{formData.TravelProductTypeName}}</span></li>
                        <template v-if="formData.Type==3">
                            <li v-if="classes">商品共享：<span>{{formData.Share==0?'不共享':'共享'}}
                                    <span v-if="formData.Authorize==1" style="padding-left: 15px;">{{formData.ArrivalWay==1?'直达':'选择性直达'}}</span>
                                </span>
                            </li>
                            <li v-else>授权门店：<span>{{formData.Authorize==0?'不授权':'授权'}}
                                    <span v-if="formData.Authorize==1" style="padding-left: 15px;">{{formData.ArrivalWay==1?'直达':'选择性直达'}}</span>
                                </span>
                            </li>
                        </template>
                        <li>创建日期：<span>{{formData.CreateTime}}</span></li>
                    </ul>
                    <ul class="price" v-if="formData.Type==4">
                        <li>总价值<span>￥{{formData.allTotal}}</span></li>
                        <li>售价<span>￥{{formData.ComposeSalePrice}}</span></li>
                        <li>成本价<span>￥{{formData.ComposeCostPrice}}</span></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="tableWrap" v-if="formData.Type!=4">
             <Table  :columns="mergeColumns" :data="priceArray" disabled-hover></Table>
        </div>
        <div class="combinedcontent" v-if="formData.Type==4">
            <div class="line"></div>
            <h3 style="padding-top: 40px;">组合内容</h3>
            <!-- 线路 -->
            <div class="tableWrap" v-if="formData.LineProduct.length>0">
                <Table  :columns="lineProductColumns" :data="formData.LineProduct" disabled-hover></Table>
            </div>
            <!-- 其他 -->
            <div class="tableWrap" v-if="formData.OtherProduct.length>0">
                <Table  :columns="otherProductColumns" :data="formData.OtherProduct" disabled-hover></Table>
            </div>
            <div v-if="formData.GiveLineProduct.length>0 || formData.GiveOtherProduct.length>0">
                <h3>赠送</h3>
                <div class="tableWrap" v-if="formData.GiveLineProduct.length>0">
                    <Table  :columns="lineProductColumns" :data="formData.GiveLineProduct" disabled-hover></Table>
                </div>
                <div class="tableWrap" v-if="formData.GiveOtherProduct.length>0">
                    <Table  :columns="otherProductColumns" :data="formData.GiveOtherProduct" disabled-hover></Table>
                </div>
            </div>
        </div>
        <Form  ref="productForm" :label-width="85" class="form">
            <div class="line"></div>
            <FormItem label="展示图片：" prop="DisplayPhoto" style="padding-top: 40px;">
                <ul class="imgList">
                    <li v-for="(file,index) in formData.DisplayPhoto" :key="index">
                        <img class="item" :src="file">
                    </li>
                </ul>
            </FormItem>
            <FormItem v-if="formData.Type==4" label="组合说明：" prop="TravelProfile">
                <div class="textareaWrap">{{formData.TravelProfile}}</div>
            </FormItem>
            <FormItem v-if="formData.Type!=4" :label="formData.Type==3 ? '简介：' : formData.Type==5 ? '产品说明' : '行程简介：'" prop="TravelProfile">
                <div class="textareaWrap" v-html="formData.TravelProfile"></div>
            </FormItem>
            <FormItem v-if="formData.Type!=4" label="详情图：" prop="TravelPhoto">
                <ul class="imgList">
                    <li v-for="(file,index) in formData.TravelPhoto" :key="index">
                        <img :src="file">
                    </li>
                </ul>
            </FormItem>
            <FormItem v-if="formData.Type!=4" label="" prop="TravelPdf">
                <ul class="imgList pdfList">
                    <li v-for="(file,index) in formData.TravelPdf" :key="index">
                        <a href="#" target="_blank">
                            <img src="@/assets/pdf-big.svg" alt="" >
                        </a>
                    </li>
                </ul>
            </FormItem>
        </Form>
        <Form  v-if="formData.Type==3 && formData.Logistics.SetShip" ref="productForm" :label-width="85" class="form">
            <div class="line"></div>
            <FormItem  label="物流设置：" prop="" style="padding-top: 40px;">
                <div class="textareaWrap">
                    {{formData.Logistics.StorePickUp ? "支持门店自提" : "不支持门店自提"}}
                    {{formData.Logistics.FreeShipping ? "全国包邮" : "全国统一运费" + formData.Logistics.ShipPrice+"元"}}
                </div>
            </FormItem>
        </Form>
        <div class="bottom" v-if="option != 1 && formData.AuditStatus != -1">
            <Button type="primary" @click="$router.push({path: '/editProduct',
                     query: {type: formData.Type,id: formData.Id,classes: classes}})">编辑</Button>
        </div>
    </FullPage>
</template>
<script>
const COLUMNS = [
                    {
                        title: '日期',
                        key: 'DepartureDate',
                        minWidth: 160,
                        className: 'nameColumn',
                        align: 'left'
                    },
                    {
                        title: '产品类型',
                        key: 'ItemType',
                        minWidth: 100,
                        align: 'left',
                    },
                    {
                        title: '产品名称',
                        key: 'Name',
                        minWidth: 120,
                        className: 'nameColumn',
                        align: 'left'
                    },
                    {
                        title: '出游类型',
                        key: 'TravelTypeName',
                        minWidth: 120,
                        align: 'left'
                    },
                    {
                        title: '类型',
                        key: 'TravelTypeName',
                        minWidth: 120,
                        align: 'left'
                    },
                    {
                        title: '价格',
                        key: 'SalePrice',
                        minWidth: 100,
                        align: 'left',
                        render: (h, params) => {
                                return h('div', '￥'+params.row.SalePrice);
                            }
                    }
                ]

import FullPage from '@/components/fullscreen-page'
import { getProductById } from '@/api/goods.js'
import { getStoreType } from '@/utils/auth.js' 
import { formatProjectType } from '@/utils/format.js'
export default {
    name: "productDetail",
    components: { FullPage },
    data(){
        return{
            title: "",
            storeType: "",
            id: "",
            type: "",
            classes: "", //1分店上传商品 2总店审核商品
            option: "", //从优选页面进来的
            formData: {},
            lineProductColumns: COLUMNS.slice(0,4).concat(COLUMNS.slice(5)),
            otherProductColumns: COLUMNS.slice(0,2).concat(COLUMNS.slice(4)),
            priceArray: [],
        }
    },
    created(){
        this.id = this.$route.query.id;
        this.classes = this.$route.query.classes; 
        this.option = this.$route.query.option;
        this.type = this.$route.query.type;
        this.storeType = getStoreType();
        this.title = formatProjectType(this.type) + '详情'
        this.getDetail();
    },
    computed:{
        mergeColumns(){
            return [
                {
                    title: this.type==3 ? '上架时间' : this.type==5 ? '价格日期' : '出发日期', 
                    key: 'DepartureDate',
                    minWidth: 180,
                    render: (h, params) => {
                                return h('div', params.row.DepartureDate || '永久有效');
                            }
                },{
                    title: '类型',
                    key: 'VisitorTypeName',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', {
                            attrs: {
                                class:'subCol'
                            },
                        }, [
                            h('ul', this.priceArray[params.index].VisitorTypePrice.map(item => {
                                return h('li', {
                                }, item.VisitorTypeName)
                            }))
                        ]);
                    }
                },{
                    title: '售价',
                    key: 'SalePrice',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('div', {
                            attrs: {
                                class:'subCol'
                            },
                        }, [
                            h('ul', this.priceArray[params.index].VisitorTypePrice.map(item => {
                                return h('li', {
                                }, '￥'+item.SalePrice.toFixed(2))
                            }))
                        ]);
                    }
                },{
                    title: '成本价',
                    key: 'CostPrice',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('div', {
                            attrs: {
                                class:'subCol'
                            },
                        }, [
                            h('ul', this.priceArray[params.index].VisitorTypePrice.map(item => {
                                return h('li', {
                                }, '￥'+item.CostPrice.toFixed(2))
                            }))
                        ]);
                    }
                }]
        },

        //allTotal,otherProductTotal,giveLineTotal,giveLineProductTotal,giveOtherProductTotal
        allTotal(){
            if(this.formData.Type == '4'){
                return this.giveLineTotal + this.otherProductTotal + this.giveLineProductTotal + this.giveOtherProductTotal;
            }
        },
        giveLineTotal(){
            if(this.formData.Type == '4'){
                let total = 0;
                this.formData.LineProduct.forEach(item => {
                    total += item.SalePrice;
                })
                return total;
            }
        },
        otherProductTotal(){
            if(this.formData.Type == '4'){
                let total = 0;
                this.formData.OtherProduct.forEach(item => {
                    total += item.SalePrice;
                })
                return total;
            }
        },
        giveLineProductTotal(){
            if(this.formData.Type == '4'){
                let total = 0;
                this.formData.GiveLineProduct.forEach(item => {
                    total += item.SalePrice;
                })
                return total;
            }
        },
        giveOtherProductTotal(){
            if(this.formData.Type == '4'){
                let total = 0;
                this.formData.GiveOtherProduct.forEach(item => {
                    total += item.SalePrice;
                })
                return total;
            }
        }
    },
    methods: {
        getDetail(){
            this.$Spin.show();
            getProductById(this.id).then(res => {
                this.$Spin.hide();
                this.formData = res.Data.TravelProduct;
                // this.type = this.formData.Type;
                // this.title = formatProjectType(this.type) + '详情'
                this.priceArray = this.formData.TypePrice.map(item => {
                    if(item.UnifiedSale==1){
                        //统一售价
                        return {
                            ...item,
                            VisitorTypePrice: [{
                                VisitorTypeName: "产品统一售价",
                                SalePrice: item.SalePrice,
                                CostPrice: item.CostPrice
                            }]
                        }

                    }else{
                        return {...item}
                    }
                })
            }).catch(err => {
                this.$Spin.hide();
            })
        },
    }
}
</script>
<style lang="less">
    .productDetail{
        .ivu-table-wrapper{
            margin-bottom: 15px;
            .ivu-table td.nameColumn > div{
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .tableWrap{
            .ivu-table:before{
                height: 0;
            }
            .ivu-table th, .ivu-table td{
                height: 35px;
                background-color: #fff;
                border-bottom: 10px solid #f9f9f9;
                box-sizing: border-box;
            }
            .subCol>ul{
                padding: 8px 0;
                &>li{
                    list-style:none;
                    line-height: 36px;
                    overflow-x: hidden;
                }
            }
            
        }

        .combinedcontent{
            .ivu-table td{
                height: 54px;
            }
        }
    }
    .ql-size-12px{
        font-size: 12px;
    }
    .ql-size-14px{
        font-size: 14px;
    }
    .ql-size-16px{
        font-size: 16px;
    }
    .ql-size-18px{
        font-size: 18px;
    }
    .ql-size-19px{
        font-size: 19px;
    }
    .ql-size-20px{
        font-size: 20px;
    }
    .ql-size-22px{
        font-size: 22px;
    }
    .ql-size-24px{
        font-size: 24px;
    }
    .ql-size-26px{
        font-size: 26px;
    }
    .ql-font-Arial{
        font-family: Arial;
    }
    .ql-font-Microsoft-YaHei{
        font-family: Microsoft-YaHei;
    }
    .ql-font-SimSun{
        font-family: SimSun;
    }
    .ql-font-SimHei{
        font-family: SimHei;
    }
    .ql-font-Times-New-Roman{
        font-family: Times-New-Roman;
    }
</style>
<style lang="less" scoped>
    .productDetail{
        box-sizing: border-box;
        .mainContent{
            display: flex;
            align-items: center;
            margin: 25px 0;
            img{
                border-radius: 4px;
                width: 250px;
                max-height: 139px;
                margin-right: 30px;
            }
            .detail{
                width: calc(100% - 280px);
                h3{
                    font-size: 17px;
                    line-height: 32px;
                    margin-bottom: 8px;
                }
                ul{
                    display: flex;
                    flex-wrap: wrap;
                    width: 100%;
                    li{
                        width: 33.333%;
                        color: #999;
                        line-height: 28px;
                        span{
                            color: #333;
                        }
                    }
                    &.combine li{
                        width: 25%;
                    }
                    @media screen and (max-width: 1200px){
                        &.combine li{
                            width: 50%;
                        }
                    }
                    @media screen and (max-width: 992px){
                        li{
                            width: 50%;
                        }
                    }
                    &:first-of-type li span{
                        color: #E94E27;
                    }
                }
                .price{
                    background-color: #F9F9F9;
                    padding: 0 30px;
                    margin-top: 15px;
                    flex-wrap: nowrap;
                    
                    li{
                        line-height: 40px;
                        span{
                            padding-left: 5px;
                        }
                    }
                }
            }
        }
        @media screen and (max-width: 576px){
            .mainContent{
                flex-wrap: wrap;
                .detail{
                    width: 100%;
                }
                img{
                    margin-right: 0;
                }
            }
        }
        .tableWrap{
            background-color: #F9F9F9;
            padding: 15px 20px 1px;
            margin: 30px 0 20px;
        }
        .combinedcontent{
            position: relative;
            .tableWrap{
                margin-top: 15px;
            }
        }
        .form{
            position: relative;
            .imgList{
                display: flex;
                flex-wrap:wrap;
                li{
                    width: 200px;
                    margin-right: 20px;
                    margin-bottom: 10px;
                    position: relative;
                    border-radius: 4px;
                    img{
                        width: 200px;
                        border-radius: 4px;
                    }
                }
                
            }
            .imgWrap{
                img{
                    border-radius: 4px;
                    width: 200px;
                }
            }
            .pdfList{
                display: flex;
                flex-wrap:wrap;
                li{
                    width: 85px;
                    height: 90px;
                    margin-right: 20px;
                    margin-bottom: 10px;
                    position: relative;
                    border-radius: 4px;
                    img{
                        width: 85px;
                    }
                    
                }
            }

        }
        .line{
            position: absolute;
            left: -28px;
            right: -28px;
            height: 10px;
            background-color: #F7F8FA;
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