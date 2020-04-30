<template>
  <div class="billing">
    <Header title="美容行业开单设置"></Header>
    <div class="function">
      <div class="title">项目设置</div>
      <Row class="list">
        <Col
          :xs="24"
          :sm="12"
          :md="6"
        >
        <router-link to="/projectClass">
          <img
            src="@/assets/project-serviceCategory.svg"
            alt=""
          >
          <span>项目/服务类别</span>
        </router-link>
        </Col>
        <Col
          :xs="24"
          :sm="12"
          :md="6"
        >
        <router-link to="/projectServe">
          <img
            src="@/assets/project-service.svg"
            alt=""
          >
          <span>项目/服务</span>
        </router-link>
        </Col>
      </Row>
    </div>
    <div class="function">
      <div class="title">产品设置</div>
      <Row class="list">
        <Col
          :xs="24"
          :sm="12"
          :md="6"
        >
        <router-link to="/productClass">
          <img
            src="@/assets/product-class.svg"
            alt=""
          >
          <span>产品类别</span>
        </router-link>
        </Col>
        <Col
          :xs="24"
          :sm="12"
          :md="6"
        >
        <router-link to="/productSale">
          <img
            src="@/assets/product-sale.svg"
            alt=""
          >
          <span>产品销售类型</span>
        </router-link>
        </Col>
        <Col
          :xs="24"
          :sm="12"
          :md="6"
        >
        <router-link to="/product">
          <img
            src="@/assets/product.svg"
            alt=""
          >
          <span>产品</span>
        </router-link>
        </Col>
      </Row>
    </div>
    <div class="function">
      <div class="title">提成设置</div>
      <Row class="list">
        <Col
          :xs="24"
          :sm="12"
          :md="6"
        >
        <router-link to="/staffPosition">
          <img
            src="@/assets/position.svg"
            alt=""
          >
          <span>员工职位设置</span>
        </router-link>
        </Col>
        <Col
          :xs="24"
          :sm="12"
          :md="6"
        >
        <router-link to="/committee">
          <img
            src="@/assets/deduct.svg"
            alt=""
          >
          <span>提成设置</span>
        </router-link>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script>
import Header from 'src/components/route-header'
export default {
  components: { Header },
}
</script>

<style lang="less" scoped>
.billing {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  background: #f7f8fa;
  .function {
    width: 100%;
    background: #fff;
    border-radius: 8px;
    box-sizing: border-box;
    padding: 20px;
    margin-top: 10px;
    padding: 30px;
    .title {
      font-size: 16px;
      font-weight: 700;
    }
    .list {
      .ivu-col {
        a {
          display: flex;
          align-items: center;
          width: 100%;
          height: 80px;
          font-size: 16px;
          color: #333;
          img {
            padding: 0 10px 0 20px;
          }
        }
      }
      li a {
        display: flex;
        align-items: center;
        width: 200px;
        height: 80px;
        font-size: 16px;
        color: #333;
        img {
          padding: 0 10px 0 20px;
        }
      }
    }
  }
}
</style>
