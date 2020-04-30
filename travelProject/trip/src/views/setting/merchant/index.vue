<template>
    <div class="merchant">
        <div class="radioWrap">
            <RadioGroup v-model="radio" type="button" @on-change="radioChange">
                <Radio :label="0">商家信息</Radio>
                <Radio :label="1" >归属配置</Radio>
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
// import { getStoreType } from '@/utils/auth.js'
export default {
    name: "merchant",
    data(){
        return{
            radio: 0,
            // storeType: ''
        }
    },
    watch: {
        $route() {
            this.update();
        }
    },
    created(){
        // this.storeType = getStoreType();
        this.update();
    },
    methods:{
        radioChange(e){
            if(e==0){
                this.$router.push('/setting/merchant/info');
            }else{
                this.$router.push('/setting/merchant/ascription');
            }
        },
        update() {
            switch(this.$route.name){
                case 'ascription':
                    this.radio = 1
                    break;
                case 'marchantInfo':
                    this.radio = 0
                    break;
                default:
                    this.active = 0
            }
        },
    }
}
</script>
<style lang="less" scoped>
    .merchant{
        height: 100%;
        .radioWrap{
            padding: 20px 40px;
            border-bottom: 10px solid #F7F8FA;
        }
        .infoWrap{
            box-sizing: border-box;
            padding: 20px 40p 0x;
            height: calc(100% - 82px);
            overflow: auto;
        }
        
    }
</style>