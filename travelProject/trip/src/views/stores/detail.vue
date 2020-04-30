<template>
  <FullPage class="check"
            title="门店详情"
            @change-router="$router.push('/stores')">
    <div class="basisInfo">
      <div class="basis">基本信息</div>
      <div class="line_info">
        <label class="info_label">门店账号：</label>
        <Input
          v-model="formVal.LoginName"
          disabled
        />
      </div>
      <div class="line_info">
        <label class="info_label">门店名称：</label>
        <Input
          v-model="formVal.Name"
          disabled
        />
      </div>
      <div class="line_info">
        <label class="info_label">门店负责人：</label>
        <Input
          v-model="formVal.Contact"
          disabled
        />
      </div>
      <div class="line_info">
        <label class="info_label">身份证件号：</label>
        <Input
          v-model="formVal.IdCard"
          disabled
        />
      </div>
      <div class="line_info">
        <label class="info_label">联系电话：</label>
        <div class="line_input">
          <Input
            v-model="formVal.TelCode"
            disabled
          />
          <div class="line_center"></div>
          <Input
            v-model="formVal.Tel"
            disabled
          />
        </div>
      </div>
      <div class="line_info">
        <label class="info_label">门店地址：</label>
        <Input
          v-model="formVal.Address"
          disabled
        />
      </div>
    </div>
    <div class="audit">
      <p class="back_title">未通过审核原因如下：</p>
      <div class="couple_box">
        <div class="couple_line" v-for="(item,index) in failReason" :key="index">
          <div class="label_line">
            <div class="label_num">{{index}}</div>{{item}}
          </div>
          <div>不合格</div>
        </div>
      </div>
    </div>
  </FullPage>
</template>
<script>
import FullPage from '@/components/fullscreen-page'
import { getDetail } from '@/api/store.js'
export default {
  components: { FullPage },
  data() {
    return {
      formVal: {},
      failReason: []
    }
  },
  created() {
    this.siteid = this.$route.query.id
    this.iniData();
  },
  methods: {
    iniData() {
      getDetail(this.siteid).then(res => {
        this.formVal = res.Data;
        if(res.Data.FailReason){
          this.failReason = JSON.parse(res.Data.FailReason);
        }
      })
    },
  }
}
</script>
<style lang="less">
  .check .content{
    height: calc(100% - 64px) !important;
  }
</style>
<style lang="less" scoped>

.check {
    box-sizing: border-box;
    .basisInfo {
      width: 100%;
      box-sizing: border-box;
      padding: 20px 0 0 20px;
      .basis {
        font-size: 18px;
        color: #333;
        padding-left: 12px;
        margin-bottom: 30px;
      }
      .line_info {
        display: flex;
        align-items: center;
        padding-bottom: 30px;
        .info_label {
          display: inline-block;
          white-space: nowrap;
          width: 120px;
          text-align: right;
          font-size: 16px;
          color: #333;
        }
        .line_input {
          display: flex;
          align-items: center;
          .ivu-input-wrapper:first-of-type {
            width: 120px;
            margin-left: 20px;
          }
          .ivu-input-wrapper:last-of-type {
            width: 374px;
            margin-left: 0;
          }
          .line_center {
            background: #cccccc;
            width: 16px;
            height: 1px;
            margin: 0 15px;
          }
        }
        .ivu-input-wrapper {
          width: 540px;
          margin-left: 20px;
        }
      }
    }
    
  .audit {
    padding: 20px 50px 35px;
    .back_title {
      font-size: 18px;
      color: #333;
      font-weight: 700;
    }
    .couple_box {
      background: #f7f8fa;
      margin-top: 25px;
      border-radius: 4px;
      width: 100%;
      box-sizing: border-box;
      padding: 30px 65px;
      .couple_line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        color: #333;
        &:last-of-type {
          margin-top: 10px;
        }
        .label_line {
          display: flex;
          align-items: center;
          .label_num {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 1px solid #333;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 10px;
          }
        }
      }
    }
  }
  
}
</style>
<style lang="less">
.ivu-radio {
  margin-right: 15px;
}
.ivu-form .ivu-form-item-label {
  font-size: 16px;
  color: #333;
  padding: 10px 20px 10px 0;
}
.ivu-form-item {
  margin-top: 30px;
  margin-bottom: 0;
}
.ivu-form .ivu-input-wrapper,
.ivu-form .ivu-input-number {
  width: 542px;
}
.ivu-form .ivu-select-single .ivu-select-selection {
  width: 542px;
}
</style>