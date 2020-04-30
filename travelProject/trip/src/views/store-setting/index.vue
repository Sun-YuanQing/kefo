<template>
    <div class="mainWrap storeSetting">
        <div class="headMemu">
            <div class="breadcrumb">
                <span>门店配置</span>
                <span>/{{$route.meta.name}}</span>
            </div>
            <Menu mode="horizontal" theme="light" :active-name="active">
                <MenuItem name="1" to="/storeSetting/store">店铺设置</MenuItem>
                <MenuItem name="2" to="/storeSetting/member">会员设置</MenuItem>
                <MenuItem name="3" to="/storeSetting/qrCode">二维码设置</MenuItem>
                <MenuItem name="4" to="/storeSetting/distributor">分销员设置</MenuItem>
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
export default{ 
    name: 'storeSetting',
    data(){
        return{
            active: '1'
        }
    },
    watch: {
        $route() {
            this.update();
        }
    },
    created(){
        this.update();
    },
    methods:{
        update() {
            switch(this.$route.name){
                case 'shopSetting':
                    this.active = '1'
                    break;
                case 'memberSetting':
                    this.active = '2'
                    break;
                case 'qrCodeSetting':
                    this.active = '3'
                    break;
                case 'distributorRroyalty':
                    this.active = '4'
                    break;
                case 'distributorDiscount':
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
    .content{
        padding: 20px 15px 0;
        overflow: auto;
    }
</style>