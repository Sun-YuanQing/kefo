<template>
  <div class="register">
    <Header
      title="注册"
      @change-router="$router.push('/login')"
    ></Header>
    <div class="content">
      <div class="content_center">
        <div class="scale_line">
          <div>请选择开店规模</div>
          <div class="shop_box">
            <div
              class="shop_line"
              @click="selShop(2)"
            >
              <div :class="selid == 2 ? 'sel_box' :'lot_box'">
                <div class="lot"></div>
              </div>
              <span>单店</span>
            </div>
            <div
              class="shop_line"
              @click="selShop(1)"
            >
              <div :class="selid == 1 ? 'sel_box' :'lot_box'">
                <div class="lot"></div>
              </div>
              <span>多店</span>
            </div>
          </div>
        </div>
        <div class="warm_box">
          <p class="warm">温馨提示</p>
          <div class="grad_box">
            <p>单店：加盟的连锁店</p>
            <p>多店：旗下有多家加盟的连锁店</p>
          </div>
        </div>
        <div class="btn_box">
          <Button
            class="next_box"
            type="primary"
            @click="toNext"
          >下一步</Button>
        </div>

      </div>

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
      shoptype: 2, // 1为总部   2为门店
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