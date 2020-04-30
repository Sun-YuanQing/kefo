<template>
  <div class="marketing">
    <Row :gutter="20">
        <Col :sm="24" :md="12" >
          <router-link to="/chargeSetting" class="item">
            <div class="card">
                <h3>充值赠送</h3>
                <div class="tip">适用于新店开业、店庆活动或大型节日（五一，双十一等）也可以作为常规的店铺活动，增加门店预收款</div>
                <ul>
                  <li>场景举例</li>
                  <li>新店开业充500送50，充1000送120，充2000送300</li>
                  <li>常规活动充500送20，充1000送80，充1500送100</li>
                </ul>
            </div>
          </router-link>
        </Col>
        <Col :sm="24" :md="12">
          <router-link to="memberDiscountSetting" class="item">
            <div class="card">
                <h3>会员折扣</h3>
                <div class="tip">适用于新店开业、店庆、清仓促销、会员专享折扣等优惠力度较大的场景</div>
                <ul>
                  <li>场景举例</li>
                  <li>新会员注册后到店消费可享受9折优惠</li>
                </ul>
            </div>
          </router-link>
        </Col>
        <Col :sm="24" :md="12">
            <router-link to="discountSetting" class="item">
                <div class="card">
                    <h3>优惠券</h3>
                    <div class="tip">适用于日常消费返券、满减活动的场景，可提高客单价，吸引客户下次消费</div>
                    <ul>
                      <li>场景举例</li>
                      <li>满100减5，满300减50，优惠券金额一般设置在5-50间</li>
                    </ul>
                </div>
              </router-link>
        </Col>
        <Col :sm="24" :md="12">
          <router-link to="redpacketSetting" class="item">
            <div class="card">
                <h3>红包赠送</h3>
                <div class="tip">新会员注册返现（固定金额/随机金额），日常消费返现</div>
                <ul>
                  <li>场景举例</li>
                  <li>新会员注册返5元红包，直接放入会员卡余额中，充值后可直接使用</li>
                </ul>
            </div>
          </router-link>
        </Col>
    </Row>
  </div>
</template>

<script>
  export default {
    name: 'marketing',
  }
</script>

<style lang="less" scoped>
  .marketing {
    width: 100%;
    height: 100%;
    padding: 21px 26px;
    overflow: auto;
  }
  .ivu-col{
    margin-bottom: 20px;
  }

  .card {
    height: 200px;
    padding: 20px 30px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.09);
    background-color: #fff;
    color: #333;
    font-size: 13px;
      h3 {
        font-size: 22px;
      }
      .tip{
        margin: 10px 0;
        height: 40px;
      }
      ul{
        color: #999;
        line-height: 1.6;
      }

     
  }
   @media screen and (max-width:576px){
     .card{
        flex-direction: column;
        height: auto;
        padding-bottom: 30px;
        .tip{
          height: 80px;
        }
     }
     
   }
</style>
