<template>
    <div class="mainWrap setting">
        <div class="headMemu">
            <div class="breadcrumb">
                <span>商家设置</span>
                <span>/{{$route.meta.name}}</span>
            </div>
            <Menu mode="horizontal" theme="light" :active-name="active">
                <MenuItem name="1" to="/setting/merchant/info" v-if="storeType != 3">商家设置</MenuItem>
                <MenuItem name="3" to="/setting/productType">产品设置</MenuItem>
                <!-- <MenuItem name="4" to="/setting/visitorType">游客类型设置</MenuItem> -->
                <MenuItem name="2" to="/setting/supplier/list">供应商设置</MenuItem>
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
export default{ 
    name: 'setting',
    data(){
        return{
            active: '1',
            storeType: '',
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
    },
    methods:{
        update() {
            switch(this.$route.name){
                case 'marchantInfo':
                    this.active = '1'
                    break;
                case 'ascription':
                    this.active = '1'
                    break;
                case 'supplierList':
                    this.active = '2'
                    break;
                case 'supplierType':
                    this.active = '2'
                    break;
                case 'productType':
                    this.active = '3'
                    break;
                case 'addProduct':
                    this.active = '3'
                    break;
                case 'visitorType':
                    this.active = '4'
                    break;
                default:
                    this.active = '1'
            }
        },
    }

}
</script>

<style lang="less" scoped>
    
</style>