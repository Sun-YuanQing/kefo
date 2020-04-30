<template>
  <FullPage title="小程序扫码配置">
    <Button shape="circle" :to="{path: '/qrcodeSettingConfig',query: {url: BaseQrCoderUrl}}" slot="extra">编辑</Button>
    <div class="body">
      <div class="grid">
        <div>
          <h3>使用场景</h3>
          <p>打印张贴在店铺显眼处，方便顾客注册成为会员，顾客扫码即可成为会员</p>
        </div>
        <div>
          <h3>规则说明</h3>
          <p>营销方案中设置了会员折扣，红包赠送，优惠券赠送，满足条件时 即可赠送给会员</p>
        </div>
      </div>

      <div class="card" :style="{'background-image':'url('+QRCoderUrl+')'}" style="background-size: 100% 100%;">
        <!-- <h3>扫码成为会员</h3> -->
        <!-- <img :src="QRCoderUrl" alt=""> -->
      </div>
    </div>
  </FullPage>
</template>

<script>
  import FullPage from 'src/components/fullscreen-page'

  export default {
    name: 'qrcodeSetting',
    components: { FullPage },
    data() {
      return {
        QRCoderUrl: '',
        BaseQrCoderUrl:''
      }
    },
    created() {
      this.getQrcode()
    },
    
    methods: {
      getQrcode() {
        const url = '/QRCoder/GetQRCoderUrl'
        this.$axios.post(url,{Name: ''}).then(res => {
          if (res.data.Code === '0') {
            
            const data = res.data.Data;
            this.QRCoderUrl = data.QrCoderUrl;
            this.BaseQrCoderUrl = data.BaseQrCoderUrl;
            
          } else {
            this.$Message.error(res.data.Message);
          }
        }).catch(e => {
          throw new Error(e)
        })
      }
    },
  }
</script>

<style lang="less" scoped>
  .grid {
    // display: grid;
    // grid-template-columns: repeat(2, 1fr);
    >div:nth-of-type(1){
        margin-bottom: 10px;
      }
  }
  // @media screen and (max-width:768px){
  //   .grid{
  //     display: block;
  //     >div:nth-of-type(1){
  //       margin-bottom: 10px;
  //     }
  //   }
  // }

  .card {
    margin-top: 30px;
    width: 291px;
    height: 433px;
    // background-image: url('~assets/scan.png');
    // background-size: 100% 100%;
    text-align: center;

    h3 {
      font-size: 16px;
      padding-top: 173px;
    }
    img{
      width: 117px;
      // height: 117px;
      padding-top: 5px;
    }
  }
</style>
