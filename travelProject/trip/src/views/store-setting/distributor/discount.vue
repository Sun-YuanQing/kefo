<template>
    <div class="distributorDiscount">
        <h3>优惠方式</h3>
        <p class="tip">设置属于分销员的专属优惠，激励人人都成为分销员</p>
        <div class="radioWrap">
            <RadioGroup v-model="radio" @on-change="radioChange" vertical>
                <Radio :label="0">无优惠</Radio>
                <Radio :label="1">
                            普通商品：按单件商品利润的
                            <span v-if="type==1">
                                <InputNumber v-model="profit" 
                                            style="width: 120px;" :disabled="radio==0"
                                            :max="100" :min="0" :precision="2"></InputNumber>
                                            &nbsp;&nbsp;%优惠
                            </span>
                            <span v-else>{{profit}}%&nbsp;&nbsp;优惠</span>
                        <div style="margin: 20px 0 20px 25px">
                            营销商品：按单件商品售价的
                            <span v-if="type==1">
                                <InputNumber v-model="sale" 
                                            style="width: 120px;" :disabled="radio==0"
                                            :max="100" :min="0" :precision="2"></InputNumber>
                                            &nbsp;&nbsp;%优惠
                            </span>
                            <span v-else>{{sale}}%&nbsp;&nbsp;优惠</span>
                        </div>
                </Radio>
            </RadioGroup>
        </div>
        <Button type="primary" v-if="type==1" @click="changeDiscount">保存</Button>
        <Button type="primary" v-else @click="type=1">编辑</Button>
    </div>
</template>

<script>
import { getSiteDiscount, editSiteDiscount } from '@/api/store-setting.js'
export default {
    data(){
        return{
            radio: 0, //1有优惠 2无优惠
            type: 2, //2正常状态 1编辑状态
            profit: 0,
            sale: 0,
        }
    },
    created(){
        this.getDiscount()
    },
    methods: {
        //获取优惠
        getDiscount(){
            this.$Spin.show();
            getSiteDiscount('2').then(res => {
                this.$Spin.hide();
                let {Profit,Sale,HasDicount } = res.Data;
                HasDicount ? this.radio = 1 : this.radio = 0
                this.profit = Profit;
                this.sale = Sale;
            }).catch(err => {
                this.$Spin.hide();
            })
        },

        radioChange(e){
            if(this.radio==0){
                this.type = 2;
                this.profit = 0;
                this.sale = 0;
                this.changeDiscount();
            }else{
                this.type = 1;
            }
            
        },

        //修改优惠
        changeDiscount(){
            this.$Spin.show();
            let postData = {
                Type: "2", //1.提成  2.优惠
                Profit: this.profit,
                Sale: this.sale,
                HasDicount: this.radio==1 ? true : false //是否有优惠
            }
            editSiteDiscount(postData).then(res => {
                this.$Spin.hide();
                this.type = 2;
                this.$Message.success('修改优惠成功');
                
            }).catch(err => {
                this.$Spin.hide();
            })
        }
    }
}
</script>
<style lang="less" scoped>
    .distributorDiscount{
        h3{
            margin-top: 10px;
        }
        .tip{
            color: #999;
            line-height: 2;
        }
        .radioWrap{
            margin: 20px 0 90px;
        }
        .ivu-btn{
            width: 120px;
        }
        
    }
    
</style>