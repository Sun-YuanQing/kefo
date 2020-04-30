<template>
    <div class="mainWrap goods">
        <div class="headMemu">
            <div class="breadcrumb">
                <span>{{storeType == 1 ? '商品管理' : '门店商品'}}</span>
                <span>/{{activeName}}</span>
            </div>
            <Menu mode="horizontal" theme="light" 
                  :active-name="active" @on-select="select">
                <Submenu name="1">
                    <template slot="title">
                        商品库
                        <Badge v-if="storeType=='2' && unAuditNum>=0" :count="unAuditNum">
                            <a href="#" class="demo-badge"></a>
                        </Badge>
                    </template>
                    <MenuItem name="productList" to="/goods/productList">产品</MenuItem>
                    <!-- <MenuItem name="2">卡项</MenuItem> -->
                </Submenu>
                <MenuItem name="checkPending" v-if="storeType=='1'" to="/goods/checkPending">
                    待审核商品
                    <Badge v-if="unAuditNum>=0" :count="unAuditNum">
                        <a href="#" class="demo-badge"></a>
                    </Badge>
                </MenuItem>
                <MenuItem name="uploadProduct" v-if="storeType=='2'" to="/goods/uploadProduct">商品上传管理</MenuItem>
            </Menu>
        </div>

        <div class="contentWrap">
            <div class="content">
                <keep-alive>
                    <router-view v-if="$route.meta.keepAlive"></router-view>
                </keep-alive>
                <router-view v-if="!$route.meta.keepAlive"></router-view>
            </div>
        </div>
    </div>
</template>
<script>
import { getStoreType } from '@/utils/auth.js'
import { getAuditCount } from '@/api/goods.js'
export default {
    name: 'goods',
    data(){
        return{
            active: 'productList', //1产品 2卡项 3上传商品
            activeName: '商品库',
            storeType: '',
            unAuditNum: 0, //待审核/审核通过待上线数量
        }
    },
     watch: {
        $route() {
            this.update();
        }
    },
    created(){
        this.storeType = getStoreType();
        this.update();
        this.getUnAuditNum();
    },
    methods:{
        update() {
            this.active = this.$route.name;
            this.activeName = this.$route.meta.name;
        },

        select(e) {
            this.active = e;
        },

        getUnAuditNum(){
            getAuditCount(this.storeType==2 ? 2 : 1).then(res => {
                this.unAuditNum = res.Data.Count;
            })
        }
    }
}
</script>
<style lang="less">
.goods{
    .ivu-badge {
        top: -9px;
        right: 5px;
        margin-left: 15px;
        .ivu-badge-count{
            height: 16px;
            line-height: 14px;
            min-width: 16px;
            font-size: 12px;
            padding: 0 2px;
        }
    }
}
</style>
