<template>
  <FullPage title="卡面配置">
    <div class="card-config">
      <div class="card-info">
        <div class="card">
          <div class="shadow" :style="{ backgroundImage: currentBg }"></div>
          <div class="card-card" :style="{ backgroundImage: currentBg }">
            <h3>{{config.CardName}}</h3>
            <p>有效期: 不限制</p>
          </div>
        </div>
        <div class="config">
          <p class="align-center item" style="padding-bottom: 35px;">
            <span class="label">名称</span>
            <Input class="input" :maxlength="8" v-model="config.CardName"/>
          </p>
          <div class="item">
            <span class="label">卡面样式</span>
            <ul>
              <li class="random" @click="config.Random = true; config.CurrrntStyleId = ''"
                  :class="{ selected: config.Random }">
                <span>随机</span>
              </li>
              <li @click="config.CurrrntStyleId = item.StyleId; config.Random = false;" v-for="item in config.Styles" :key="item.StyleId"
                  :class="{ selected: item.StyleId === config.CurrrntStyleId }"
                  :style="{ backgroundColor: item.Colour }"></li>
            </ul>
          </div>
        </div>
      </div>
      <Button @click="handleSave" :loading="loading" type="primary" class="saveBtn">保存</Button>
    </div>
  </FullPage>
</template>

<script>
  import FullPage from 'src/components/fullscreen-page'

  export default {
    name: 'card-setting-config',
    components: { FullPage },
    data() {
      return {
        loading: false,
        config: {
          "CardName": "",
          "Random": true,
          "CurrrntStyleId": "",
          "Styles": []
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
        let imgs = '';
        for (let item of this.config.Styles) {
          colors += `,${item.Colour}`;
          // imgs += `url(${item.PhotoUrl}),`
        }
        return `${imgs}linear-gradient(to right bottom${colors})`
      },
      bgUrl() {
        return this.config.Styles[0] && this.config.Styles[0].PhotoUrl
      }
    },
    methods: {
      handleSave() {
        if (!this.config.CardName) return this.$Message.error('请输入卡名称');
        this.loading = true;
        const url = '/Card/SaveCardStyle'
        const postData = {
          StyleId: this.config.CurrrntStyleId,
          cardName: this.config.CardName,
          random: this.config.Random
        }
        this.$axios.post(url, postData).then(res => {
          this.loading = false;
          if (res.data.Code === '0') {
            this.$Message.success('保存成功')
            this.$router.back()
          } else {
            this.$Message.error(res.data.Message);
          }
        }).catch(e => {
          this.loading = false;
          throw new Error(e)
        })
      },
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
  .card-config {
    display: flex;
    flex-direction: column;
    // height: 100%;
    padding-top: 20px;
    box-sizing: border-box;
    .saveBtn{
        width: 200px; 
        height: 50px; 
        align-self: center; 
        margin-top: 160px;
      }

    .card-info {
      display: flex;
      align-items: center;

      .card {
        color: #fff;
        width: 390px;
        height: 260px;
        background-size: 100% 100%;
        border-radius: 20px;
        position: relative;

        h3 {
          font-size: 18px;
        }

        p {
          font-size: 13px;
        }
      }

      .shadow {
        top: 5px;
        filter: blur(30px);
        transform: scale(.85);
      }

      .card-card {
        padding: 20px 26px;
        z-index: 2;
        border-radius: 16px;
      }

      .config {
        padding-left: 60px;
        font-size: 18px;

        .item {
          display: flex;
          align-items: center;
        }

        .label {
          margin-right: 10px;
        }

        .input {
          width: 300px;
          height: 50px;
          line-height: 50px;
          text-align: center;
        }

        ul {
          display: flex;

          li {
            height: 40px;
            width: 40px;
            border-radius: 50%;
            margin-right: 30px;
            border: 2px solid #fff;
            box-sizing: content-box;
            cursor: pointer;
          }

          .random {
            border-color: transparent;
            font-size: 12px;
            padding: 2px;

            span {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
              height: 100%;
              background-color: #fff;
              border-radius: 50%;
            }
          }

          .selected {
            border-color: #E94E27;
          }
        }
      }
      
    }
    
  }

  @media screen and (max-width:768px){
    .card-config{
      .saveBtn{
        margin-top: 60px;
      }
      .card-info{
        flex-direction: column;
        .card{
          margin-bottom: 30px;
        }
        .config {
          padding-left: 0;
          .item{
            flex-direction: column;
            .label{
              align-self: flex-start;
            }
          }
        }
      }
    }
  }
  @media screen and (max-width:576px){
    .card-config .card-info{
      .card{
        width: 100%;
        height: 200px;
      }
      
    }
  }
</style>
