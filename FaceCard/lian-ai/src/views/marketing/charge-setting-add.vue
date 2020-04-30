<template>
  <div class="fullscreen">
    <Header :title="title"></Header>
    <div class="content">
      <Card style="margin-bottom: 20px;">
        <div
          slot="title"
          class="align-center"
        >
          <img
            src="@/assets/setting.svg"
            alt=""
            style="margin-right: 6px;"
          >
          <h4>基本配置</h4>
        </div>
        <div class="card-body">
          <div class="item">
            <span class="label">充值满</span>
            <InputNumber
              :min="1"
              :max="9999999999"
              :parser="value => `${value}`.replace(/([0-9]+.[0-9]{2})[0-9]*/,'$1')"
              v-model="postData.Amount"
              class="text-align-center input"
            ></InputNumber>
          </div>
          <div class="item">
            <span class="label">赠送</span>
            <InputNumber
              :min="1"
              :max="9999999999"
              :parser="value => `${value}`.replace(/([0-9]+.[0-9]{2})[0-9]*/,'$1')"
              v-model="postData.PreferentialAmount"
              class="text-align-center input"
            ></InputNumber>
          </div>
        </div>
      </Card>
      <Card>
        <div
          slot="title"
          class="align-center"
        >
          <img
            src="@/assets/time.svg"
            alt=""
            style="margin-right: 6px;"
          >
          <p
            class="align-center"
            style="color: #999; font-weight: normal;"
          ><span style="font-weight: bold; color: #333">时间段</span>（未选择默认为“全时间段”）</p>
        </div>
        <Button
          @click="handleClear"
          size="small"
          shape="circle"
          style="width: 70px"
          slot="extra"
        >清空</Button>
        <div class="card-body">
          <div class="item">
            <span class="label">开始</span>
            <DatePicker
              :options="options"
              :value="postData.StartTime"
              @on-change="handleStartDate"
              :clearable="false"
              class="picker"
            ></DatePicker>
          </div>
          <div class="item">
            <span class="label">结束</span>
            <DatePicker
              :options="options"
              :value="postData.DueTime"
              @on-change="handleEndDate"
              class="picker"
            ></DatePicker>
          </div>
        </div>
      </Card>
      <div class="save">
        <Button
          @click="handleSave"
          :loading="loading"
          type="primary"
        >保存</Button>
      </div>

    </div>
  </div>
</template>

<script>
import Header from 'src/components/route-header'
import { formatDate } from 'src/utils'

export default {
  name: 'charge-setting-add',
  components: { Header },
  data() {
    return {
      loading: false,
      title: '添加',
      options: {
        disabledDate(val) {
          return Date.now() - new Date(val) > 24 * 60 * 60 * 1000
        }
      },
      rechargeList: [],
      postData: {
        "Id": "", //新增传空  修改传id
        "Flag": true,
        "Amount": 1,
        "PreferentialAmount": 1,
        "StartTime": formatDate(new Date(), 'yyyy-MM-dd'),
        "DueTime": ""
      }
    }
  },
  created() {
    let params = this.$route.query;
    if (params.Id) {
      this.title = "修改"
      this.postData = {
        ...params,
        Amount: Number(params.Amount),
        PreferentialAmount: Number(params.PreferentialAmount),
        StartTime: formatDate(new Date(params.StartTime), 'yyyy-MM-dd'),
        DueTime: params.DueTime ? formatDate(new Date(params.DueTime), 'yyyy-MM-dd') + ' 23:59:59' : ''
      };
    } else {
      this.title = "添加"
    }
    this.getList()
  },
  methods: {
    //获取已经存在的优惠
    getList() {
      const url = '/Recharge/GetRecharges'
      this.$axios.post(url).then(res => {
        if (res.data.Code === '0') {
          const data = res.data.Data;
          this.rechargeList = data;

        } else {
          this.$Message.error(res.data.Message);
        }
      }).catch(e => {
        throw new Error(e)
      })
    },
    handleClear() {
      this.postData.StartTime = formatDate(new Date(), 'yyyy-MM-dd');
      this.postData.DueTime = ''
    },

    handleSave() {
      //如果存在的不可重复
      let flag = this.rechargeList.some((item, index) => {
        return item.Amount == this.postData.Amount && item.Id != this.postData.Id
      })

      if (flag) {
        this.$Message.error(`满${this.postData.Amount}的充值优惠配置已经存在！如需修改，返回列表编辑！`);
        return;
      }
      this.loading = true;
      const url = '/Recharge/EditRecharge'
      // if (!this.postData.DueTime) {
      //   return this.$Message.error('请填写结束日期')
      // }
      this.$axios.post(url, this.postData).then(res => {
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

    handleStartDate(e) {
      if (new Date(e) > new Date(this.postData.DueTime)) {
        this.postData.DueTime = e + ' 23:59:59';
      }
      this.postData.StartTime = e;
    },
    handleEndDate(e) {
      if (new Date(e) < new Date(this.postData.StartTime)) {
        this.postData.DueTime = this.postData.StartTime
        return this.$Message.error('结束时间不能小于开始时间')
      }
      this.postData.DueTime = e + ' 23:59:59'
    },
  },
}
</script>

<style lang="less" scoped>
.content {
  padding: 20px 28px;
}
.card-body {
  padding: 30px 0 25px;
  font-size: 18px;
  .item {
    display: inline-block;
  }
  .label {
    display: inline-block;
    width: 65px;
    text-align: right;
    line-height: 44px;
    padding-bottom: 5px;
  }
  .ivu-date-picker {
    margin: 0 6px 5px;
  }
  .ivu-input-wrapper {
    width: 18px;
  }

  .input {
    width: 180px;
    height: 44px;
    font-size: 18px;
    line-height: 44px;
    margin: 0 6px 5px;
  }
}

.save {
  display: flex;
  justify-content: center;
  margin: 40px 0 0;
  .ivu-btn {
    width: 150px;
    height: 44px;
    &:nth-of-type(1) {
      margin-right: 20px;
    }
  }
}
@media screen and (max-width: 768px) {
  .card-body .item {
    display: block;
  }
}
</style>
<style>
.ivu-card-head p {
  width: 255px;
}
@media screen and (max-width: 576px) {
  .ivu-card-head p {
    width: 150px;
  }
}
</style>
