<template>
  <div class="marketing">
    <Row :gutter="20">
        <Col :sm="24" :md="12" >
          <router-link to="/physicalList" class="item">
            <div class="card">
                <h3>体检产品</h3>
                <p>体检报告</p>
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
