<template>
    <div class="distributorSetting">
        <div class="radioWrap">
            <RadioGroup v-model="radio" type="button" @on-change="radioChange">
                <Radio :label="0">提成设置</Radio>
                <Radio :label="1">优惠设置</Radio>
            </RadioGroup>
        </div>
        <div class="infoWrap">
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
        </div>
    </div>
</template>
<script>

export default {
    name: "distributorSetting",
    data(){
        return{
            radio: 0,
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
        radioChange(e){
            if(e==0){
                this.$router.push('/storeSetting/distributor/royalty');
            }else{
                this.$router.push('/storeSetting/distributor/discount');
            }
        },
        update() {
            switch(this.$route.name){
                case 'distributorRroyalty':
                    this.radio = 0
                    break;
                case 'distributorDiscount':
                    this.radio = 1
                    break;
                default:
                    this.active = 0
            }
        },
    }
}
</script>
<style lang="less" scoped>
    .distributorSetting{
        height: 100%;
        .radioWrap{
            padding: 0px 40px 20px;
            border-bottom: 10px solid #F7F8FA;
        }
        .infoWrap{
            box-sizing: border-box;
            padding: 20px 40px;
            height: calc(100% - 82px);
            overflow: auto;
        }
        
    }
</style>