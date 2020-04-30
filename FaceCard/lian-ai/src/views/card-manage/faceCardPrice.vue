<template>
    <div class="fullscreen faceCardPrice">
        <Header title="关于菲卡价"></Header>
        <div class="content">
            <div>
                <h3><img src="../../assets/price-icon.svg" alt="">什么是菲卡价？</h3>
                <p>“菲卡价”是指由第三方“菲卡时代”平台代收为此卡的押金。用户不必支付此卡的全部金额也可享受同等的权益，降低了消费门槛，引进了更多的客流量。</p>
            </div>
            <div>
                <h3><img src="../../assets/rights-icon.svg" alt="">菲卡价使用权益？</h3>
                <p>以“菲卡价”购买此卡后，享受此卡原始价同等权益，用户在有效时间内到店完成权益里的某个或多个项目/服务、购买产品之后，用户只需按此卡的权益进行折算之后单次结账，以及商家赠送的项目/服务、产品必须完成所有权益之后才可赠送。</p>
                <div class="tip">
                    <div class="example"><span>例如：</span>1、用用户以“菲卡价”购买次卡中的“多项有限次卡&nbsp;30次”时，用户只需支付150元，即可享受此卡的权益。</div>
                    <div class="detail">
                        <div class="card">
                            <img src="../../assets/about1.svg" alt="">
                            <img src="../../assets/about2.svg"  alt="">
                        </div>
                        <p  style="color: #666;margin: 10px 0 20px;">用户通过线上预约或者直接到店选择并完成“进口资生堂修复”这个项目/服务1次后，需向商家支付100元，<span style="color: #3275F5;">计算如下：</span></p>
                        <p  style="font-weight: 700;">3000元 ÷ 30次 = 100元/次（小数点四舍五入）</p>
                        <p style="margin: 20px 0 10px;">2、当用户以“菲卡价”购买次卡中的“单项有限次卡”时，用户只需支付150元，即可享受次卡的权益。</p>
                        <div class="card">
                            <img src="../../assets/about3.svg" alt="">
                            <img src="../../assets/about4.svg"  alt="">
                        </div>
                        <p  style="color: #666;margin: 10px 0 20px;">用户通过线上预约或者直接到店选择并完成“进口资生堂修复”这个项目/服务1次后，需向商家支付126元，<span style="color: #3275F5;">计算如下：</span></p>
                        <img class="long" src="../../assets/about5.png" alt="">
                    </div>
                    
                </div>
            </div>
            <div>
                <h3><img src="../../assets/refund-icon.svg" alt="">菲卡价可退还吗？</h3>
                <p>当用户在有效时间内消费完此卡权益，由第三方“菲卡时代”平台退还给用户；</p>
                <p>当用户在有效时间内没有消费完此卡权益，由第三方“菲卡时代”平台补偿给商家。</p>
            </div>
            <div>
                <h3><img src="../../assets/price-setting-icon.svg" alt="">建议菲卡价金额设置？</h3>
                <p>建议“菲卡价”小于最高项目/服务、产品的价格，大于最高项目/服务、产品价格折算之后的20%左右。</p>
                <div class="tip">
                    <p class="example"><span style="color: #3275F5;">例如：</span>最高项目/服务“进口资生堂修护”的价格为170元，折算之后用户需单次向商家支付126元，则菲卡价建议为151.2~170元，
                        <span style="color: #3275F5;">计算如下：</span></p>
                    <p class="detail" style="font-weight: 700;">126元 x (1+20%) = 151.2元</p>
                    
                </div>
            </div>
            <div>
                <h3><img src="../../assets/contact-icon.svg" alt="">还不了解？</h3>
                <p>若不明白“菲卡价”规则，请拨打“菲卡时代”平台客服电话咨询<span style="color: #3275F5;padding-left: 10px;">0755-86967063</span></p>
                <p style="display: flex;align-items: center;">或添加客服微信号
                    <span style="color: #3275F5;padding-left: 10px;padding-right: 20px;">Frank-5899</span>
                    <img src="../../assets/Qr-code.png" width="96" alt="">
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import Header from '@/components/route-header'
export default {
    components: { Header },
    data(){
        return{

        }
    }
}
</script>
<style lang="less" scoped>
    .faceCardPrice{
        background-color: #F7F8FA;
        .content{
            margin: 10px;
            background-color: #fff;
            padding: 30px 40px;
            &>div{
                margin-bottom: 30px;
                h3{
                    font-size: 18px;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    line-height: 48px;
                    background-color: #f9f9f9;
                    padding: 0 15px;
                    img{
                        margin-right: 10px;
                    }
                }
                & > p{
                    line-height: 1.6;
                    padding: 0 15px;
                    color: #666;
                    font-size: 16px;
                }
                .tip{
                    padding: 0 15px;
                    font-size: 14px;
                    color: #000;
                    .example{
                        margin: 20px 0;
                    }
                    .detail{
                        margin-left: 40px;
                        @media screen and (max-width:916px){
                            .long{
                                width: 100%;
                            }
                        }
                        
                        .card{
                            display: flex;
                            align-items: center;
                            flex-wrap: wrap;
                            img:nth-of-type(2){
                               margin-left: 20px; 
                            }
                            @media screen and (max-width:960px){
                                img{
                                    width: 100%;
                                }
                                img:nth-of-type(2){
                                    margin-left: 0;
                                }
                            }
                        }

                    }
                }
            }
        }
        @media screen and (max-width:576px){
            .content{
                padding: 30px 16px;
            }
        }
    }
</style>