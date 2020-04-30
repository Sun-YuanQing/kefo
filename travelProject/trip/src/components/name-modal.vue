<template>
    <!-- 选择产品名称 -->
        <Modal v-model="isShowModal" width="760" :mask-closable="false" :footer-hide="true"
               class="productListModal" @on-cancel="cancel">
            <p slot="header" style="font-size: 18px;">{{classes=='1' ? '商品名称' : '产品名称'}}</p>
            <div class="content">
                <div class="left">
                    <div class="leftType" v-if="classes=='1'">{{this.type}}</div>
                    <div class="leftType" v-else>
                        <Select v-if="postData.Type=='1' || postData.Type=='2'" v-model="postData.Type" 
                                @on-change="travelTypeChange"
                                style="width:180px;text-align: center;">
                            <Option value="1">直营产品</Option>
                            <Option value="2">非直营产品</Option>
                        </Select>
                        <div v-else-if="postData.Type=='3'">其他产品</div>
                        <div v-else>酒店产品</div>
                    </div>
                    <ul>
                        <li :class="{'active': !postData.TravelProductType}" 
                            @click="typeChange()">全部</li>
                        <li v-for="item in travelClassList" @click="typeChange(item.Id)"
                            :key="item.Id" :class="{'active': postData.TravelProductType==item.Id}">{{item.Name}}</li>
                    </ul>
                </div>
                <div class="right">
                    <div class="searchWrap">
                        <Input placeholder="输入产品名称" style="width: 250px;" 
                               v-model="postData.Name" @on-enter="handleSearch">
                            <Icon type="ios-search" slot="prefix" size="20" style="line-height: 40px;"/>
                        </Input>
                    </div>
                    <ul class="nameList">
                        <li v-if="isLoad && TravelProductList.length==0" style="border: none;text-align: center;">暂无数据</li>
                        <li v-for="(type,index) in TravelProductList" :key="index"
                            :class="{'selected': type.Id==selectedName}" 
                            @click="selectName(type.Id)">
                            {{type.Name}}
                        </li>
                    </ul>
                    <Page   :total="total"
                            :current="postData.PageIndex"
                            :page-size="postData.PageSize"
                            placement="top"
                            show-total
                            show-sizer
                            @on-change="handleChange"
                            @on-page-size-change="pageSizeChanged"/>
                </div>
                
            </div>
            <Spin size="large" fix v-if="showSpin"></Spin>
        </Modal>
</template>
<script>
import { getTravelProductNameByType } from '@/api/goods.js'
import { transformProductType } from '@/utils/transform.js'
export default {
    props:{
        isShow: false,
        postData: {},
        selectedName: '',
        classes: '',
    },
    data(){
        return{
            isShowModal: this.isShow,
            isLoad: false,
            showSpin: false,
            total:0,
            travelClassList: [],
            TravelProductList: [],
            type: '',
        }
    },
    watch: {
        isShow(val){
            this.isShowModal = val;
        },
        postData:{
            handler(val){
                this.type = transformProductType(this.postData.Type);
            },
            deep: true,
            immediate: true
        }
    },
    created(){
        
    },
    methods: {
        //弹窗产品类别 
        getTravelClass(postData){
            this.showSpin = true;
            this.travelClassList = [];
            this.TravelProductList = [];
            getTravelProductNameByType(postData).then(res => {
                this.showSpin = false;
                this.isLoad = true;
                this.travelClassList = res.Data.TravelProductType;
                this.TravelProductList = res.Data.TravelProduct;
                this.total = res.Data.Total;

            }).catch(err => {
                this.showSpin = false;
            })
        },
        //页码切换
        handleChange(e){
            let data = {...this.postData,PageIndex:e};
            this.$emit('dataChange',data);
            this.getTravelClass(data);
        },

        //每页条数切换
        pageSizeChanged(pageSize){
            let data = { ...this.postData,PageIndex: 1,PageSize: pageSize};
            this.$emit('dataChange',data);
            this.getTravelClass(data);
        },
        handleSearch(){
            let data = { ...this.postData,PageIndex: 1,PageSize: 10};
            this.$emit('dataChange',data);
            this.getTravelClass(data);
        },
        typeChange(id){
            let data = { ...this.postData,PageIndex: 1,PageSize: 10,TravelProductType: id};
            this.$emit('dataChange',data);
            this.getTravelClass(data);
        },
        travelTypeChange(){
            let data = { ...this.postData,PageIndex: 1,PageSize: 10};
            this.$emit('dataChange',data);
            this.getTravelClass(data);
        },

        //选择产品
        selectName(id){
            this.$emit('nameChange',id)
        },
        cancel(){
            this.$emit('cancelNameModal')
        },
    }
}
</script>
<style lang="less">
    .productListModal{
        .leftType{
            .ivu-select .ivu-select-selection{
                background-color: #F7F8FA;
                border: none;
            }
            .ivu-select-visible .ivu-select-selection{
                border: none;
                box-shadow: none;
            }
        }
    }
</style>
<style lang="less" scoped>
    .productListModal{
        .content{
            width: 100%;
            display: flex;
            .left{
                width: 200px;
                .leftType{
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #F7F8FA;
                }
                ul {
                    width: 100%;
                    max-height: 320px;
                    overflow-y: auto;
                    li{
                        text-align: center;
                        line-height: 40px;
                        cursor: pointer;
                        &.active{
                            background-color: #F7F8FA;
                        }
                    }
                }
                
            }
            .right{
                width: calc(100% - 200px);
                background-color: #F7F8FA;
                padding: 0 10px 10px;
                .searchWrap{
                    height: 60px;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                }
                .nameList{
                    max-height: 278px;
                    overflow-y: auto;
                    li{
                        margin-bottom: 10px;
                        padding: 10px 15px;
                        border: 1px solid #e4e4e4;
                        border-radius: 4px;
                        line-height: 1.5;
                        box-sizing: border-box;
                        cursor: pointer;
                    }
                }
            }
        }
    }
</style>