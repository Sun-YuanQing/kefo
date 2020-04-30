<template>
  <div class="setting">
    <router-link class="card" to="cardSetting">
      <img src="@/assets/card-setting.svg" alt="">
      <h3>会员卡配置</h3>
    </router-link>
    <router-link class="card" to="qrcodeSetting">
      <img src="@/assets/scan-setting.svg" alt="">
      <h3>小程序扫码配置</h3>
    </router-link>
  </div>
</template>

<script>
  export default {
    name: 'setting'
  }
</script>

<style lang="less" scoped>
  .setting {
    padding: 21px 26px;
    display: grid;
    grid-template-columns: repeat(auto-fill, 267px);
    grid-gap: 20px;
    justify-content: center;

    h3 {
      font-size: 18px;
      color: #333;
      padding-left: 10px;
    }

    .card {
      background-color: #fff;
      box-shadow:0 2px 4px rgba(0,0,0,0.09);
      display: flex;
      align-items: center;
      padding-left: 18px;
      height: 90px;
      border-radius: 8px;
    }
  }
</style>
