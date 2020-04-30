<template>
    <div class="mainWrap preference">
        <div class="headMemu">
            <div class="breadcrumb">
                <span>优选中心</span>
                <span style="font-size: 14px;">（今日新增商品
                    <span style="color: #000;font-weight: 700;font-size: 18px;padding-left: 5px;">{{dayCount}}</span>
                    ）</span>
            </div>
            <div class="headWrap">
                <Menu mode="horizontal" theme="light" 
                      :active-name="postData.Type"
                      @on-select="changeTab">
                    <MenuItem name="all">全部商品</MenuItem>
                    <Submenu name="product">
                        <template slot="title">产品</template>
                        <MenuItem name="-1">全部产品</MenuItem>
                        <MenuItem v-for="type in productTypeList"  :key="type.Type" :name="type.Type">{{type.Name}}</MenuItem>
                    </Submenu>
                    <!-- <Submenu name="card">
                        <template slot="title">卡项</template>
                        <MenuItem name="6">全部卡项</MenuItem>
                    </Submenu> -->
                </Menu>
                <div class="btnWrap">
                    <Button v-if="storeType=='1'" @click="isAddProduct=true;">添加商品</Button>
                    <template v-else>
                        <template v-if="isSelected"> 
                            <Button @click="addToLibrary">加入商品库</Button>
                            <Button @click="onlineGoods">上线商品</Button>
                            <Button @click="selectedProducts=[];isSelected=false;">取消选择</Button>
                        </template>
                        <Button v-else  @click="isSelected=true">选择商品</Button>
                    </template>
                    <!-- <Select v-model="postData.SourceType" style="width: 120px;">
                        <Option value="-1">全部</Option>
                        <Option value="1">总部</Option>
                        <Option value="2">门店经理</Option>
                    </Select> -->
                    <img src="@/assets/search-icon.svg" alt="" style="cursor: pointer;"
                         @click="$router.push('/findGoods')">
                </div>
            </div>
        </div>
        <div class="contentWrap">
            <Scroll :on-reach-bottom="loadMore" :height="$bus.clientHeight-131">
                <Spin size="large" fix v-if="spinShow">
                    <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                    <div>加载中...</div>
                </Spin>
                <transition-group name="list-transition" tag="div" class="list">
                    <div class="item list-transition-item"
                        v-for="product in productList" :key="product.Id"
                        :class="{'selected': selectedProducts.includes(product.Id)}"
                        @click="selectProduct(product.Id,product.BranchStatus,product.Type)">
                        <div class="imgWrap">
                            <img :src="product.CoverPhoto" alt="">
                            <div class="maskWrap" v-if="storeType==2 && product.BranchStatus != 0">
                                {{product.BranchStatus==1 ? '已上线' : '已加入商品库'}}
                            </div>
                            <!-- <div class="type"><i></i>{{product.TypeName}}</div> -->
                        </div>
                        <div class="info" :style="{'color': product.BranchStatus=='0' ? '#333' : '#999'}">
                            <p class="name">
                                <span :style="{'color': product.BranchStatus=='0' ? '#3275F5' : '#999'}">
                                    <i>「</i>{{product.TypeName}}<i>」</i></span>
                                {{product.Name}}
                            </p>
                            <div>
                                <div class="price">
                                    成本价：<span :style="{'color': product.BranchStatus=='0' ? '#0899AC' : '#999'}">
                                        <i>￥</i>{{product.MinPrice}}</span>{{product.OtherPrice}}
                                </div>
                                <div class="date">{{product.Type == '3' ? '有效日期：' : '出发日期：'}}{{product.DepartureDate || '永久有效'}}</div>
                            </div>
                            
                        </div>
                    </div>
                </transition-group>
                <div class="finished" v-if="isFinished">没有更多数据了</div>
            </Scroll>
        </div>
        <!-- 选择商品类型 -->
        <Modal v-model="isAddProduct" width="532" :mask-closable="false" 
               class="preferenceModal" @on-cancel="isAddProduct=false;selectedType=''">
            <p slot="header" style="text-align:center;font-size: 18px;">选择商品类型</p>
            <ul class="typeList">
                <li v-for="(type,index) in typeList" :key="index"
                    :class="{'selected': type.Type==selectedType}" 
                    @click="selectedType=type.Type;">
                    {{type.Name}}
                </li>
            </ul>
            <div slot="footer" class="foot">
                <Button  @click="isAddProduct=false;selectedType=''">取消</Button>
                <Button type="primary" @click="addProduct">确定</Button>
            </div>
        </Modal>

        <!-- 完善资料 -->
        <div v-if="isPerfect" class="perfectInfo">
            <div class="perfectBody">
                <p>详细的商家资料更有助于开店哦～</p>
                <p @click="$router.push('/setting')">去完善资料&nbsp;&nbsp;>></p>
                <img src="@/assets/indicate.svg" alt="">
            </div>
        </div>
        
    </div>
</template>
<script>
import { getSelectionCenter, addBranchProduct, getDayCount } from '@/api/preference.js'
import { getSearchVal, removeSearchVal, getStoreType } from '@/utils/auth.js'
import { transformProductType } from '@/utils/transform.js'
import { getProjectType } from '@/api/goods.js'
export default {
    name: 'preference',
    data(){
        return {
            storeType: '',
            isSelected: false,
            selectedProducts: [],
            dayCount: 0,
            spinShow: false,
            postData: {
                Type: "all",  //1 直营  2.非直营 3、其他 4组合
                SourceType: "-1", //1.总部  2.门店
                PageIndex: 1,
                PageSize: 12,
                Name: ""
            },
            isAddProduct: false,
            selectedType: '',
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
            productList: [],
            isFinished: false, //是否加载完了
            isPerfect: false,
        }
    },
    computed: {
        typeList(){
            return this.productTypeList;
        }
    },
    created(){
        this.storeType = getStoreType();
        this.getProjectTypeList();
        this.postData.Name = getSearchVal();
        this.changeTab('all');
        this.getCount();
    },
    methods: {
        //获取当前的一级分类
        getProjectTypeList(){
            this.$Spin.show();
            getProjectType(true).then(res => {
                this.$Spin.hide();
                this.productTypeList = res.Data.ProjectTypes;
            }).catch(err => {

            })
        },
        addProduct(){
            if(this.name=='2') return;
            this.$router.push({path: '/editProduct',query: {type: this.selectedType}})
        },
        changeTab(e){
            this.productList = [];
            this.postData = {
                ...this.postData,
                Type: e,
                PageIndex: 1,
                PageSize: 12,
            }
            this.getDataList();
        },

        getCount(){
            getDayCount().then(res => {
                this.dayCount = res.Data.Count;
            })
        },
        getDataList(){
            if(this.postData.PageIndex==1){
                this.spinShow = true;
            }
            getSelectionCenter({...this.postData,Type: this.postData.Type == 'all' ? '-1' : this.postData.Type}).then(res => {
                this.spinShow = false;
                let { TravelProduct } = res.Data;
                if(!TravelProduct || TravelProduct.length==0){
                    //数据加载完全了，就让数据截停
                    this.isFinished=true;
                }else{
                    this.isFinished = false;
                    let arr = TravelProduct.map(item =>{
                        let minPrice='',otherPrice=''
                        if(item.Price.indexOf('/') != -1){
                            minPrice = item.Price.split('/')[0];
                            otherPrice = item.Price.slice(minPrice.length)
                        }else{
                            minPrice = item.Price;
                        }
                        return {
                            ...item,
                            MinPrice: minPrice,
                            OtherPrice: otherPrice,
                            TypeName: transformProductType(item.Type)
                        }
                    })
                    this.productList = this.productList.concat(arr);
                }
                removeSearchVal();
            }).catch(err => {

            })
            
        },
        
        loadMore(){
            if(this.isFinished) return;
            this.postData.PageIndex++;
            this.getDataList();
        },

        selectProduct(id,status,type){
            if(this.isSelected && status==0){
                if(this.selectedProducts.includes(id)){
                    let index = this.selectedProducts.findIndex(item => item==id);
                    this.selectedProducts.splice(index);
                }else{
                    this.selectedProducts.push(id);
                }
            }else if(!this.isSelected){
                this.$router.push({
                        path: '/productDetail',
                        query: {type: type,id: id,option: 1}
                    })
            }
        },

        //加入产品库
        addToLibrary(){
            if(this.selectedProducts.length==0){
                this.$Message.warning('至少选择一个产品');
            }else{
                let postData = {
                    Status: '2',  // 1上线 2加入商品库传
                    TravelProductIds: this.selectedProducts
                }
                this.addBranch(postData);
            }
            
        },

        //上线商品
        onlineGoods(){
            if(this.selectedProducts.length==0){
                this.$Message.warning('至少选择一个产品');
            }else{
                let postData = {
                    Status: '1',  // 1上线 2加入商品库传
                    TravelProductIds: this.selectedProducts
                }
                this.addBranch(postData);
            }
        },

        addBranch(postData){
            this.$Spin.show();
            addBranchProduct(postData).then(res => {
                this.$Spin.hide();
                this.isSelected = false;
                this.$Message.success(postData.Status==1 ? '上线成功' : '成功加入商品库');
                this.selectedProducts = [];
                this.postData = {
                    ...this.postData,
                    PageIndex: 1,
                    PageSize: 12,
                }
                this.productList = [];
                this.getDataList();
            }).catch(err => {
                
            })
        },
    }
}
</script>
<style lang="less">

</style>
<style lang="less" scoped>
    .preference{
        position: relative;
        .headWrap{
            display: flex;
            justify-content: space-between;
            .btnWrap{
                .ivu-btn{
                    height: 36px;
                    line-height: 36px;
                    margin-right: 10px;
                }
                img{
                    margin-left: 10px;
                }
                margin-right: 30px;
                display: flex;
                align-items: center;
            }
        }
        .contentWrap{
            padding: 15px;
            .finished{
                font-size: 14px;
                line-height: 80px;
                text-align: center;
                color: #0899AC;
            }
            .list{
                height: 100%;
                overflow: auto;
                // display: flex;
                // flex-wrap: wrap;
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                grid-gap: 14px;
                border-radius: 8px;
                @media screen and (max-width: 1200px){
                    grid-template-columns: repeat(3, 1fr);
                }
                @media screen and (max-width: 900px){
                    grid-template-columns: repeat(2, 1fr);
                }
                @media screen and (max-width: 576px){
                    grid-template-columns: repeat(1, 1fr);
                }
                .item{
                    // width: 285px;
                    height: 320px;
                    margin: 0 15px 15px 0;
                    background-color: #fff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.08);
                    box-sizing: border-box;
                    padding-bottom: 20px;
                    &.selected{
                        position: relative;
                        border: 1px solid #0899AC;
                        overflow: hidden;
                        &::after {
                            content: '';
                            width: 35px;
                            height: 35px;
                            border: 1px solid #0899AC;
                            background-color: #0899AC;
                            position: absolute;
                            right: 0;
                            bottom: -1px;
                            transform: rotate(45deg) translate(72%);
                            z-index: 7;
                        }

                        &::before {
                            content: '✔';
                            position: absolute;
                            right: 2px;
                            bottom: -2px;
                            color: #fff;
                            z-index: 9;
                            font-size: 13px;
                        }
                    }
                    .imgWrap{
                        box-sizing: border-box;
                        margin: 5px 5px 10px 5px;
                        position: relative;
                        height: 160px;
                        overflow: hidden;
                        border-radius: 8px;
                        .maskWrap{
                            position: absolute;
                            left: 0px;
                            right: 0px;
                            top: 0px;
                            bottom: 0px;
                            background-color: rgba(0,0,0,0.4);
                            color: #fff;
                            font-size: 14px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            border-radius: 8px;
                        }
                        .type{
                            position: absolute;
                            right: 15px;
                            top: 15px;
                            background:rgba(0,0,0,0.35);
                            border-radius:10px;
                            color: #fff;
                            font-size: 12px;
                            padding: 1px 12px 1px 20px;
                            i{
                                display: inline-block;
                                width: 3px;
                                height: 3px;
                                border-radius: 50%;
                                border: 3px solid #fff;
                                position: absolute;
                                left: 10px;
                                top: 6px;
                            }
                        }
                        img{
                            width: 100%;
                            height: auto;
                            border-radius: 8px;
                        }
                    }
                    .info{
                        padding: 0 15px;
                        font-size: 12px;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        height: 120px;
                        .name{
                            font-size: 14px;
                            font-weight: 700;
                            width: 100%;
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 2; //需要控制的文本行数
                            overflow: hidden;
                            margin-bottom: 20px;
                            span{
                                color: #3275F5;
                                i{
                                    font-style: normal;
                                    font-size: 12px;
                                }
                            }
                        }
                        .price{
                            margin-bottom: 15px;
                            span{
                                font-size: 18px;
                                color: #0899AC;
                                i{
                                    font-size: 12px;
                                    font-style: normal;
                                }
                            }
                        }
                        .date{
                            width: 100%;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                    
                }
            }
        }
        
        
    }
    .list-transition-item {
        transition: all .6s;
    }

    .list-transition-enter, .list-transition-leave-to {
        opacity: 0;
        transform: scale(.6);
    }

    .list-transition-leave-active {
        position: absolute;
        /*left: 200px;*/
    }
    .perfectInfo{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 9999;
        background-color: rgba(1,1,1,0.2);
        .perfectBody{
            position: absolute;
            top: 515px;
            left: 220px;
            cursor: pointer;
            p:nth-of-type(1){
                font-size: 18px;
                color: #fff;
                margin-bottom: 20px;
            }
            p:nth-of-type(2){
                border-radius: 4px;
                width: 150px;
                height: 48px;
                text-align: center;
                line-height: 48px;
                background-color: #fff;
            }
            img{
                position: absolute;
                left: -200px;
                top: -80px
            }
        }
    }
    .preferenceModal{
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
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
</style>