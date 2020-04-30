<template>
  <FullPage title="会员卡配置">
    <Button shape="circle" to="cardSettingConfig" slot="extra">编辑</Button>
    <div class="body">
      <h3>卡片说明</h3>
      <p>可编辑卡面名称、配色、有效时间，会员卡卡样与配置卡面样式一致</p>

      <div class="card">
        <div class="shadow" :style="{ backgroundImage: currentBg }"></div>
        <div class="card-card" :style="{ backgroundImage: currentBg }">
          <h3>{{config.CardName}}</h3>
          <p>有效期: 不限制</p>
        </div>
      </div>
    </div>
  </FullPage>
</template>

<script>
  import FullPage from 'src/components/fullscreen-page'

  export default {
    name: 'cardSetting',
    components: { FullPage },
    data() {
      return {
        config: {
          Styles: [],
          CurrrntStyleId: ''
        }
      }
    },
    created() {
      this.getConfig()
    },
    computed: {
      currentBg() {
        const item = this.config.Styles.find(item => item.StyleId === this.config.CurrrntStyleId)
        return item && `url(${item.PhotoUrl})` || this.randomBg
      },
      randomBg() {
        let colors = '';
        for (let item of this.config.Styles) {
          colors += `,${item.Colour}`
        }
        return `linear-gradient(to right bottom${colors})`
      }
    },
    methods: {
      getConfig() {
        const url = '/Card/GetCardStyle'
        this.$axios.post(url).then(res => {
          if (res.data.Code === '0') {
            const data = res.data.Data;
            this.config = { ...data, CurrrntStyleId: data.Random ? '' : data.CurrrntStyleId };
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
  .card {
    margin-top: 30px;
    color: #fff;
    width: 390px;
    height: 260px;
    border-radius: 20px;
    position: relative;

    .shadow {
      top: 5px;
      filter: blur(30px);
      transform: scale(.85);
    }

    .card-card {
      z-index: 2;
      padding: 20px 26px;
      border-radius: 16px;
    }

    h3 {
      font-size: 18px;
    }

    p {
      font-size: 13px;
    }
  }

  @media screen and (max-width:576px) {
    .card{
      width: 100%;
      height: 200px;
    }
  }
</style>
