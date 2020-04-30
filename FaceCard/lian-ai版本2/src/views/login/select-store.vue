<template>
  <div class="select-store">
    <div class="title">选择店铺</div>
    <div class="container">
      <div class="info">
        <div class="left">
          <img
            src="@/assets/avatar.svg"
            alt=""
            width="64"
          >
          <p>{{name}}<span>(创建者)</span></p>
        </div>
        <Button to="/createStore">创建店铺</Button>
      </div>
      <div class="store-list">
        <div class="title">所有店铺</div>
        <Row
          :gutter="20"
          v-if="sites"
        >
          <Col
            :sm="24"
            :md="12"
            :lg="8"
            :xl="6"
            v-for="(site,index) in sites"
            :key="index"
          >
          <div @click="distributeToken(site.UserId,site.SiteId,site.SiteName,site.ItemName)">
            <p class="name">{{site.SiteName}}</p>
            <p class="type">主营类目：{{site.ItemName}}</p>
          </div>
          </Col>
        </Row>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      name: "",
      sites: []
    }
  },
  created() {
    this.name = localStorage.getItem("currentUserNname")
  },
  mounted() {
    this.queryStore();
  },
  methods: {
    queryStore() {
      let url = "Site/GetSites";
      this.axios.post(url).then(res => {
        let { Data, Code, Message } = res.data;
        if (Code == 0) {
          this.sites = Data.Sites;
          // console.log(this.sites)
        } else {
          this.$Message.error(Message)
        }
      }).catch(err => {
        console.log(err)
      })
    },

    distributeToken(userId, siteId, siteName, shopName) {
      let tokenList = JSON.parse(localStorage.getItem('tokenList'));
      let flag = false;
      let verify = shopName == "美容美发" ? 'true' : 'false';
      if (tokenList) {
        for (let i = 0; i < tokenList.length; i++) {
          for (let key in tokenList[i]) {
            if (key == siteId) {
              localStorage.setItem('token', tokenList[i][key]);
              localStorage.setItem('siteId', siteId);
              localStorage.setItem('siteName', siteName);
              localStorage.setItem('goShop', verify);
              flag = true;
              this.$router.push('/index');
            }
          }
        }
      }

      if (!flag || !tokenList) {
        let url = "/Site/DistributeToken";
        this.axios.post(url, { UserId: userId })
          .then(res => {
            let { Data, Code, Message } = res.data;
            if (Code == 0) {
              localStorage.setItem('token', Data.Token);
              localStorage.setItem('siteId', siteId);
              localStorage.setItem('siteName', siteName);
              localStorage.setItem('goShop', verify);
              if (tokenList) {
                tokenList.push({ [siteId]: Data.Token })
              } else {
                tokenList = [{ [siteId]: Data.Token }]
              }
              localStorage.setItem('tokenList', JSON.stringify(tokenList));
              this.$router.push('/index');
            } else {
              this.$Message.error(Message)
            }
          }).catch(err => {
            console.log(err)
          })
      }

    }
  }
}
</script>
<style lang="less" scoped>
.select-store {
  width: 100%;
  height: 100%;
  overflow: auto;
  position: relative;
  > .title {
    width: 100%;
    line-height: 44px;
    font-size: 20px;
    font-weight: 900;
    text-align: center;
    z-index: 999;
    position: fixed;
    background: #fff;
  }
  .container {
    width: 100%;
    padding: 54px 30px 10px;
    box-sizing: border-box;

    .info {
      width: 100%;
      padding: 20px 30px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #f7f8fa;
      border-radius: 8px;
      font-size: 16px;
      .left {
        display: flex;
        align-items: center;
        color: #333;
        p {
          padding-left: 10px;
          span {
            color: #ccc;
          }
        }
      }
      .ivu-btn {
        width: 110px;
        height: 40px;
        background-color: #3275f5;
        color: #fff;
      }
    }
    .store-list {
      margin-top: 30px;
      .title {
        font-size: 18px;
        color: #333;
        font-weight: 700;
        line-height: 3;
      }
      .ivu-row {
        .ivu-col {
          padding: 0 20px;
          margin-bottom: 20px;
          cursor: pointer;
          div {
            width: 100%;
            background-color: #f7f8fa;
            border-radius: 8px;
            padding: 20px;
            border: 1px solid #e4e4e4;
            line-height: 1.8;
            .name {
              color: #333;
              font-size: 16px;
            }
            .type {
              color: #999;
              font-size: 13px;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 576px) {
  .select-store .container .info {
    flex-direction: column;
    .ivu-btn {
      margin-top: 20px;
    }
  }
}
</style>
