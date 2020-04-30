<template>
    <div class="distributorRoyalty">
        <h3>提成计算方式</h3>
        <p class="tip">商品通过分销员分享的链接销售时，分销员所获提成按商品设置的售价计算：单笔订单提成金额 = 单件商品售价 X 提成比例</p>
        <ul class="royaltyContent">
            <li>
                普通商品：按单件商品利润的
                <span v-if="type==1">
                    <InputNumber v-model="profit"  style="width: 120px;"
                                :max="100" :min="0" :precision="2"></InputNumber>
                                &nbsp;&nbsp;%提成
                </span>
                <span v-else>{{profit}}%&nbsp;&nbsp;提成</span>
            </li>
            <li>
                营销商品：按单件商品售价的
                <span v-if="type==1">
                    <InputNumber v-model="sale"  style="width: 120px;"
                                :max="100" :min="0" :precision="2"></InputNumber>
                                &nbsp;&nbsp;%提成
                </span>
                <span v-else>{{sale}}%&nbsp;&nbsp;提成</span>
            </li>
        </ul>
        
        <Button type="primary" v-if="type==1" @click="changeRayalty">保存</Button>
        <Button type="primary" v-else @click="type=1">编辑</Button>
    </div>
</template>

<script>
import { getSiteDiscount, editSiteDiscount } from '@/api/store-setting.js'
export default {
    data(){
        return{
            type: 2, //2正常状态 1编辑状态
            profit: 0,
            sale: 0,
        }
    },
    created(){
        this.getRayalty()
    },
    methods: {
        //获取提成
        getRayalty(){
            this.$Spin.show();
            getSiteDiscount('1').then(res => {
                this.$Spin.hide();
                let { Profit,Sale,HasDicount } = res.Data;
                this.profit = Profit;
                this.sale = Sale;
            }).catch(err => {
                this.$Spin.hide();
            })
        },

        //修改提成
        changeRayalty(){
            this.$Spin.show();
            let postData = {
                Type: "1", //1.提成  2.优惠
                Profit: this.profit,
                Sale: this.sale
            }
            editSiteDiscount(postData).then(res => {
                this.$Spin.hide();
                this.type = 2;
                this.$Message.success('修改提成成功');
                
            }).catch(err => {
                this.$Spin.hide();
            })
        }
    }
}
</script>
<style lang="less" scoped>
    .distributorRoyalty{
        h3{
            margin-top: 10px;
        }
        .tip{
            color: #999;
            line-height: 2.5;
        }
        .royaltyContent{
            margin: 20px 0 40px;
            li{
                margin-bottom: 20px;
            }
        }
        .ivu-btn{
            width: 120px;
        }
        
    }
    
</style>