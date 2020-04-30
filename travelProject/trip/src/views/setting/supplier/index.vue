<template>
    <div class="supplier">
        <div class="radioWrap">
            <RadioGroup v-model="radio" type="button" @on-change="radioChange">
                <Radio :label="0">供应商列表</Radio>
                <Radio :label="1">供应商类型</Radio>
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
    name: "supplier",
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
                this.$router.push('/setting/supplier/list');
            }else{
                this.$router.push('/setting/supplier/type');
            }
        },
        update() {
            switch(this.$route.name){
                case 'supplierType':
                    this.radio = 1
                    break;
                case 'supplierList':
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
    .supplier{
        height: 100%;
        .radioWrap{
            padding: 20px 40px;
            border-bottom: 10px solid #F7F8FA;
        }
        .infoWrap{
            box-sizing: border-box;
            padding: 20px 40px 10px;
            height: calc(100% - 82px);
            overflow: auto;
        }
        
    }
</style>