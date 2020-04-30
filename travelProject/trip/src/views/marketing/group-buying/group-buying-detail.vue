<template>
    <div class="groupBuyingDetail">
        <Header title="拼团详情" @change-router="$router.back()"></Header>
        <div class="contentWrap">
            <div class="basicInfo">
                <h3><img src="@/assets/basic-icon.svg" alt="">基本信息</h3>
                <Form :label-width="110" inline>
                    <FormItem label="活动商品：">
                        <div>{{formData.ProductName}}</div>
                    </FormItem>
                    <FormItem label="游客类型：" v-if="formData.ProductType == 1 || formData.ProductType == 2">
                        <div>{{formData.VisitorTypeName}}</div>
                    </FormItem>
                    <FormItem label="类型：" v-if="formData.ProductType == 3 || formData.ProductType == 5">
                        <div>{{formData.VisitorTypeName}}</div>
                    </FormItem>
                    <FormItem :label="formData.ProductType==5 ? '房型：' : '出游类型：'" v-if="formData.ProductType != 3">
                        <div>{{formData.TravelTypeName}}</div>
                    </FormItem>
                    <FormItem label="开始时间：">
                        <div>{{formData.StartTime}}</div>
                    </FormItem>
                    <FormItem label="结束时间：">
                        <div>{{formData.EndTime}}</div>
                    </FormItem>
                    <FormItem label="活动状态：">
                        <div>{{formData.AssemState == 1 ? '进行中' : formData.AssemState == 0 ? '未开始' : '已结束'}}</div>
                    </FormItem>
                    <FormItem label="活动限购：">
                        <div v-if="formData.IsLimtBuy==1">限购{{formData.LimtNum}}次/人</div>
                        <div v-else>不限购</div>
                    </FormItem>
                </Form>
            </div>

            <div class="priceInfo">
                <h3><img src="@/assets/price-icon.svg" alt="">价格和库存信息</h3>
                <Form :label-width="110" inline>
                    <FormItem label="成团人数：">
                        <div>{{formData.AsseNum}}人</div>
                    </FormItem>
                    <FormItem label="售价：">
                        <div>￥{{formData.Price}}</div>
                    </FormItem>
                    <FormItem label="成本价：">
                        <div>￥{{formData.CostPrice}}</div>
                    </FormItem>
                    <FormItem label="拼团价：">
                        <div>￥{{formData.KillPrice}}</div>
                    </FormItem>
                    <FormItem label="活动库存：">
                        <div>{{formData.StockNum}}</div>
                    </FormItem>
                </Form>
            </div>

            <div class="promoteInfo">
                <h3><img src="@/assets/promote-icon.svg" alt="">推广信息</h3>
                <Form :label-width="110">
                    <FormItem label="分享文案：">
                        <div>{{formData.Extens}}</div>
                    </FormItem>
                </Form>
            </div>
            
            <div class="activityRules">
                <p>活动规则：</p>
                <ul>
                    <li>1、不定期更新，限量发送，活动有效期内售完即止</li>
                    <li>2、在拼团商品活动页面中选择商品，点击购买进入支付页</li>
                    <li>3、限时拼团仅支持在线预定，电话下单无效</li>
                    <li>4、限时拼团产品资源特殊，付款成功后不可取消行程和退款</li>
                    <li>5、限时拼团商品不与其他优惠福利同享</li>
                    <li>6、拼团商品不可使用优惠券</li>
                    <li>7、同一登录账户、同一手机号、同一设备终端号、同一支付账户等合理显示为同一用户的情形，均视为同一用户</li>
                    <li>8、通过不正当手段参与拼团活动，本平台有撤销相关订单的权利</li>
                </ul>
            </div>
            <div class="bottom">
                <Button type="primary" @click="$router.push({path: '/editGroupBuying',query: {id: id}})">编辑</Button>
            </div>
        </div>
    </div>
</template>
<script>
import Header from '@/components/route-header'
import { getGroupBuyingDetail } from '@/api/marketing.js'
export default {
    components: {Header},
    data(){
        return{
            id: "",
            formData: {}
        }
    },
    created(){
        this.id = this.$route.query.id;
        this.getData();
    },
    methods: {
        getData(){
            this.$Spin.show();
            getGroupBuyingDetail(this.id).then(res => {
                this.formData = res.Data;
                this.$Spin.hide();
            }).catch(err => {
                this.$Spin.hide();
            })
        }
    }

}
</script>
<style lang="less">
    .groupBuyingDetail{
        .ivu-form-inline .ivu-form-item{
            width: 48%;
        }
        @media screen and (max-width: 768px){
            .ivu-form-inline .ivu-form-item{
                width: 100%;
            }
        }
    }
</style>
<style lang="less" scoped>
    .groupBuyingDetail{
        height: 100%;
        .contentWrap{
            min-height: calc(100% - 44px);
            max-height: calc(100% - 44px);
            padding: 0 20px 80px;
            box-sizing: border-box;
            background-color: #F7F8FA;
            overflow-y: auto;
            .basicInfo,.priceInfo,.promoteInfo{
                margin-top: 20px;
                padding: 30px 16px 16px;
                background-color: #fff;
                border-radius: 8px;
                >h3{
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    padding-bottom: 16px;
                    border-bottom: 1px solid #F7F8FA;
                    img{
                        margin-right: 5px;
                    }
                }
                .ivu-form{
                    margin-top: 24px;
                }
            }
            .activityRules{
                margin: 30px 20px 80px 45px;
                color: #999;
                p{
                    line-height: 3;
                }
                ul li{
                    line-height: 1.8;
                }
               
            }
            .bottom{
                background: #fff;
                border-top: 1px solid #E4E4E4;
                display: flex;
                justify-content: center;
                padding: 15px 0;
                position: fixed;
                bottom: 0px;
                left: 0;
                right: 0;
                z-index: 99;
                > .ivu-btn{
                    height: 40px;
                    width: 200px;
                }
            }
        }
    }
</style>