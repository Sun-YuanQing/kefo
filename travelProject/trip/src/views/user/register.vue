<template>
  <div class="register">
    <Header
      title="注册"
      @change-router="$router.push('/login')"
    ></Header>
    <div class="content">
      <Row :gutter="40">
        <Col :sm="24" :md="12" >
          <div class="item">
            <h2>基础版</h2>
            <p class="title">适合单店经营模式</p>
            <ul class="tip">
              <li>单店：旗下没有加盟的分店，也没有加盟到某个总店</li>
            </ul>
            <div class="buttonWrap">
              <Button type="primary" @click="selShop(3)">开通单店</Button>
            </div>
          </div>
        </Col>
        <Col :sm="24" :md="12" >
          <div class="item">
            <h2>专业版</h2>
            <p class="title">适合分店/总店经营模式</p>
            <ul class="tip">
              <li>分店：加盟到某个总店的连锁店</li>
              <li>总店：旗下有多家加盟的连锁分店</li>
            </ul>
            <div class="buttonWrap">
              <Button type="primary" @click="selShop(2)">开通分店</Button>
              <Button type="primary" @click="selShop(1)" style="margin-left: 20px;">开通总店</Button>
            </div>
          </div>
        </Col>
      </Row>

    </div>
  </div>
</template>
<script>
import Header from '@/components/route-header'
import { setStoreType, getStoreType } from '@/utils/auth'
export default {
  components: { Header },
  data() {
    return {
      shoptype: 2, // 1为总部   2为门店 3为单店
      selid: 2
    }
  },
  created() {
    if (getStoreType()) {
      this.selid = getStoreType();
    }
  },
  methods: {
    toNext() {
      setStoreType(this.selid)//单/多店标识
      if (this.selid == 2) {
        this.$router.push({ path: '/process', query: { step: 0 } })
      } else {
        this.$router.push('/process')
      }

    },
    selShop(e) {
      this.selid = e;
      this.toNext();
    }
  }
}
</script>
<style lang="less">
.register {
  width: 100%;
  height: 100%;
  .content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100% - 44px);
    .ivu-row{
      .item{
        width: 350px;
        height: 350px;
        padding: 40px 30px 20px;
        box-sizing: border-box;
        background:rgba(255,255,255,1);
        box-shadow:0px 4px 10px 0px rgba(0,0,0,0.15);
        border-radius:8px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
        h2{
          font-size: 26px;
          line-height: 2;
        }
        .title{
          font-size: 22px;
          line-height: 2;
        }
        .tip{
          margin: 20px 0 40px;
          font-size: 16px;
          color: #999;
        }
        .buttonWrap{
          .ivu-btn{
            height: 40px;
            line-height: 40px;
            width: 200px;
          }
        }
        &:last-of-type{
          .ivu-btn{
            width: 120px;
          }
        }
      }
    }


    .content_center {
      width: 100%;
      box-sizing: border-box;
      padding: 0 54px 0 90px;
      .scale_line {
        display: flex;
        font-size: 24px;
        color: #333;
        .shop_box {
          margin-left: 234px;
          .shop_line {
            display: flex;
            align-items: center;
            cursor: pointer;
            &:last-of-type {
              margin-top: 35px;
            }
            .lot_box {
              border: 2px solid #cccccc;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: #fff;
            }
            .sel_box {
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: #0899ac;
              display: flex;
              justify-content: center;
              align-items: center;
              .lot {
                background: #fff;
                width: 8px;
                height: 8px;
                border-radius: 50%;
              }
            }
            span {
              margin-left: 14px;
            }
          }
        }
      }
      .warm_box {
        margin-top: 15px;
        .warm {
          font-size: 18px;
          color: #999;
        }
        .grad_box {
          width: 100%;
          background: #f7f8fa;
          color: #999999;
          font-size: 16px;
          padding: 36px 48px;
          box-sizing: border-box;
          margin-top: 15px;
          p:last-of-type {
            margin-top: 18px;
          }
        }
      }
      .btn_box {
        margin-top: 61px;
        text-align: center;
        .next_box {
          width: 350px;
          height: 50px;
          margin: 0 auto;
          font-size: 18px;
        }
      }
    }
  }
}
</style>