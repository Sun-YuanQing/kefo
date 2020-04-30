<template>
    <div class="product">
        <div class="radioWrap">
            <RadioGroup v-model="radio" type="button" @on-change="radioChange">
                <Radio :label="0">产品分类</Radio>
                <Radio :label="1">出游类型</Radio>
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
    name: "product",
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
                this.$router.push('/setting/product/productType');
            }else{
                this.$router.push('/setting/product/travelType');
            }
        },
        update() {
            switch(this.$route.name){
                case 'productType':
                    this.radio = 0
                    break;
                case 'travelType':
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
    .product{
        height: 100%;
        .radioWrap{
            padding: 20px 40px;
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