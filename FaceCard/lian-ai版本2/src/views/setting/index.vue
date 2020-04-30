  <template>
  <div class="setting">
    <div class="function">
      <div class="title">门店管理</div>
      <Row class="list">
        <Col
          :xs="24"
          :sm="12"
          :md="6"
        >
        <router-link to="/storeInfo">
          <img
            src="@/assets/info-icon.svg"
            alt=""
          >
          <span>基本信息</span>
        </router-link>
        </Col>
        <Col
          :xs="24"
          :sm="12"
          :md="6"
        >
        <router-link to="/cardSetting">
          <img
            src="@/assets/card-icon.svg"
            alt=""
          >
          <span>会员卡配置</span>
        </router-link>
        </Col>
        <Col
          :xs="24"
          :sm="12"
          :md="6"
        >
        <router-link to="/qrcodeSetting">
          <img
            src="@/assets/scan-icon.svg"
            alt=""
          >
          <span>小程序扫码配置</span>
        </router-link>
        </Col>
        <!-- <Col
          :xs="24"
          :sm="12"
          :md="6"
        >
        <router-link to="/rechargeSetting">
          <img
            src="@/assets/recharge-icon.svg"
            alt=""
          >
          <span>充值金额预设</span>
        </router-link>
        </Col> -->
        <!-- <Col
          :xs="24"
          :sm="12"
          :md="6"
        >
        <router-link to="/findMember">
          <img
            src="@/assets/renew-icon.svg"
            alt=""
          >
          <span>续费</span>
        </router-link>
        </Col> -->
      </Row>
    </div>

    <div class="function">
      <div class="title">员工管理</div>
      <Row class="list">
        <Col
          :xs="24"
          :sm="12"
          :md="6"
        >
        <router-link to="/staffManage">
          <img
            src="@/assets/staff-icon.svg"
            alt=""
          >
          <span>员工管理</span>
        </router-link>
        </Col>
        <!-- <Col
          :xs="24"
          :sm="12"
          :md="6"
        >
        <router-link to="/index">
          <img
            src="@/assets/royalty-icon.svg"
            alt=""
          >
          <span>提成设置</span>
        </router-link>
        </Col> -->
      </Row>
    </div>

    <div class="function">
      <div class="title">财务管理</div>
      <Row class="list">
        <Col
          :xs="24"
          :sm="12"
          :md="6"
        >
        <router-link to="/cashOutRecord">
          <img
            src="@/assets/cash-out-icon.svg"
            alt=""
          >
          <span>提现</span>
        </router-link>
        </Col>
      </Row>
    </div>

    <div
      class="function"
      v-if="showBill =='true'"
    >
      <div class="title">行业管理</div>
      <Row class="list">
        <Col
          :xs="24"
          :sm="12"
          :md="6"
        >
        <router-link to="/billing">
          <img
            src="@/assets/hairdressing.svg"
            alt=""
          >
          <span>美容行业开单设置</span>
        </router-link>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      num: 50,
      showBill: 'false'
    }
  },
  created() {
    this.showBill = localStorage.getItem('goShop');
  },
  methods: {

  }
}
</script>
<style lang="less" scoped>
.setting {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 10px;
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

