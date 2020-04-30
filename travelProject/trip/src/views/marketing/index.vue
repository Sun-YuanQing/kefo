<template>
  <div class="marketing">
    <Row :gutter="20">
        <Col :sm="24" :md="12" >
          <router-link to="" class="item">
            <div class="card">
                <h3>充值赠送</h3>
                <p>多充多送 | 回笼资金 | 留住客户</p>
            </div>
          </router-link>
        </Col>
        <Col :sm="24" :md="12" >
          <router-link to="" class="item">
            <div class="card">
                <h3>会员折扣方案</h3>
                <p>专享折扣 | 立买立减 | 促进销售</p>
            </div>
          </router-link>
        </Col>
        <Col :sm="24" :md="12" >
          <router-link to="" class="item">
            <div class="card">
                <h3>优惠券方案</h3>
                <p>消费送券 | 下次使用 | 留住客户</p>
            </div>
          </router-link>
        </Col>
        <Col :sm="24" :md="12" >
          <router-link to="" class="item">
            <div class="card">
                <h3>红包赠送方案</h3>
                <p>红包返现 | 促进消费 | 留住客户</p>
            </div>
          </router-link>
        </Col>
        <Col :sm="24" :md="12" >
          <router-link to="/groupBuying" class="item">
            <div class="card">
                <h3>拼团</h3>
                <p>多人拼团 | 会员裂变</p>
            </div>
          </router-link>
        </Col>
        <Col :sm="24" :md="12" >
          <router-link to="" class="item">
            <div class="card">
                <h3>砍价</h3>
                <p>砍出最低价格 | 获取新会员</p>
            </div>
          </router-link>
        </Col>
        <Col :sm="24" :md="12" >
          <router-link to="/seckill" class="item">
            <div class="card">
                <h3>秒杀</h3>
                <p>价格优势</p>
            </div>
          </router-link>
        </Col>
        <Col :sm="24" :md="12" >
          <router-link to="/distributor" class="item">
            <div class="card">
                <h3>分销员</h3>
                <p>全民推广 | 赚佣金</p>
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
    height: 140px;
    padding: 20px 30px;
    border-radius: 8px;
    box-sizing: border-box;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.09);
    background-color: #fff;
    color: #333;
    font-size: 13px;
    display: flex;
    flex-direction: column;
    justify-content: center;
      h3 {
        font-size: 22px;
      }
      p{
          margin-top: 12px;
          font-size: 16px;
          color: #999;
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
