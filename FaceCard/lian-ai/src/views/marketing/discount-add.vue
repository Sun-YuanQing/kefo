<template>
  <div class="fullscreen">
    <Header title="添加"></Header>
    <div class="content card-form">
      <div class="note">
        <div>
          <h4>规则说明</h4>
          <ul>
            <li>1：任意消费满足满减规则自动生效，在结算中自动结算</li>
            <li>2：客户每次消费只能领取一张优惠券</li>
            <li>3：满减抵扣金额不能大于消费金额</li>
          </ul>
        </div>
        <div>
          <h4>应用场景</h4>
          <ul>
            <li>增加客人消费次数，提升客单价</li>
          </ul>
        </div>
      </div>
      <div class="scroll">
        <Card
          v-for="(item, index) in postData"
          :key="index"
          style="margin-bottom: 20px; padding-bottom: 20px;"
        >
          <p class="align-center">消费满
            <InputNumber
              v-model="item.LIMITAMOUNT"
              :min="0"
              class="input"
            ></InputNumber>
            可获得
            <span style="font-size: 18px; color: #E94E27">【优惠券】</span>
            <Button
              @click="handleDelete(index)"
              v-if="index > 0"
              style="margin-left: auto;"
              shape="circle"
            >删除</Button>
          </p>
          <div
            class="align-center"
            style="padding: 40px 0 25px"
          >
            <img
              src="@/assets/coupon-setting.svg"
              alt=""
              style="margin-right: 6px;"
            >
            <h4>优惠券设置</h4>
          </div>
          <div class="count-setting">
            <p>
              <span>
                满 <InputNumber
                  :min="0"
                  v-model="item.Amount"
                  class="input"
                ></InputNumber>
              </span>
              <span>
                减少<InputNumber
                  :min="0"
                  v-model="item.PreferentialAmount"
                  class="input"
                  :max="item.Amount"
                ></InputNumber>
              </span>
            </p>
            <p>有效时间
              <Select
                v-model="item.Days"
                class="select"
                placement="top"
              >
                <Option :value="7">领券后7日内</Option>
                <Option :value="15">领券后15日内</Option>
                <Option :value="30">领券后30日内</Option>
              </Select>
            </p>
            <p>每人限领
              <Select
                v-model="item.LimitCount"
                class="select"
              >
                <Option :value="-1">不限</Option>
                <Option :value="1">1</Option>
                <Option :value="2">2</Option>
                <Option :value="3">3</Option>
                <Option :value="4">4</Option>
                <Option :value="5">5</Option>
              </Select></p>
          </div>
        </Card>
        <Button
          class="add-next"
          @click="handleAdd"
        >添加下一张优惠券</Button>
      </div>
      <Button
        @click="handleSave"
        :loading="loading"
        class="save"
        type="primary"
      >保存</Button>
    </div>
  </div>
</template>

<script>
import Header from 'src/components/route-header'
import { formatDate } from 'src/utils'

function discountItem() {
  return {
    "LIMITAMOUNT": 0,
    "PreferentialAmount": 0,
    "Amount": 0,
    "Days": 15,
    "LimitCount": 1
  }
}

export default {
  name: 'discount-add',
  components: { Header },
  data() {
    return {
      loading: false,
      postData: []
    }
  },
  created() {
    this.postData.push(discountItem())
  },
  methods: {
    handleDelete(index) {
      this.postData.splice(index, 1)
    },
    handleAdd() {
      this.postData.push(discountItem())
    },
    handleSave() {
      this.loading = true;
      const url = '/Coupon/AddCoupons'
      const postData = {
        Coupons: this.postData
      }
      this.$axios.post(url, postData).then(res => {
        this.loading = false;
        if (res.data.Code === '0') {
          const data = res.data.Data;
          this.$Message.success('操作成功')
          this.$router.back()
        } else {
          this.$Message.error(res.data.Message);
        }
      }).catch(e => {
        this.loading = false;
        throw new Error(e)
      })
    },
  },
}
</script>

<style lang="less">
.card-form {
  .ivu-select-single .ivu-select-selection .ivu-select-placeholder,
  .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
    height: 100%;
  }

  .ivu-select-single .ivu-select-selection {
    height: 100%;
    line-height: 50px;
    display: flex;
    align-items: center;
  }
}
</style>

<style lang="less" scoped>
.input,
.select {
  width: 150px;
  height: 50px;
  font-size: 18px;
  line-height: 50px;
  margin: 0 6px;
}

.content {
  padding: 20px 28px;
  // display: flex;
  // flex-direction: column;
  background-color: #f7f8fa;

  .scroll {
    // height: 70vh;
    // overflow-y: scroll;
    padding-bottom: 30px;
  }

  .note {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 30px 46px;
    padding-bottom: 20px;
  }

  .count-setting {
    display: grid;
    grid-template-columns: 3fr 2fr 2fr;

    p {
      display: flex;
      line-height: 50px;
      margin-bottom: 10px;
      white-space: nowrap;
    }
  }

  .add-next {
    width: 326px;
    color: #999;
    border-style: dashed;
  }
  @media screen and (max-width: 576px) {
    .add-next {
      width: 100%;
    }
  }
}

.save {
  display: block;
  width: 200px;
  height: 50px;
  margin: 30px auto 0;
  // margin-top: auto;
  // align-self: center;
}
@media screen and (max-width: 768px) {
  .content {
    .count-setting {
      grid-template-columns: 1fr;
    }
  }
}
@media screen and (max-width: 576px) {
  .content {
    .note {
      grid-template-columns: 1fr;
    }
    .count-setting {
      p {
        flex-wrap: wrap;
        white-space: normal;
        > span {
          display: inline-block;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
