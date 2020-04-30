<template>
  <FullPage class="examine"
            title="门店详情"
            @change-router="$router.push('/stores')">
        <div class="basisInfo">
            <div class="line_info">
              <label class="info_label">门店编号：</label>
              <span>{{formVal.Code}}</span>
            </div>
            <div class="line_info">
              <label class="info_label">门店账号：</label>
              <span>{{formVal.LoginName}}</span>
            </div>
            <div class="line_info">
              <label class="info_label">门店名称：</label>
              <span>{{formVal.Name}}</span>
            </div>
            <div class="line_info">
              <label class="info_label">门店负责人：</label>
              <span>{{formVal.Contact}}</span>
            </div>
            <div class="line_info">
              <label class="info_label">身份证件号：</label>
              <span>{{formVal.IdCard}}</span>
            </div>
            <div class="line_info">
              <label class="info_label">联系电话：</label>
              <span>{{formVal.TelCode}}-{{formVal.Tel}}</span>
            </div>
            <div class="line_info">
              <label class="info_label">门店地址：</label>
              <span>{{formVal.Address}}</span>
            </div>
            <div class="line_info">
              <label class="info_label">门店归属：</label>
              <span>{{formVal.BelongName}}</span>
            </div>
            <div class="line_info">
              <label class="info_label">有效经营时间：</label>
              <span>{{formVal.StartTime}} 至 {{formVal.DueTime}}</span>
            </div>
            <div class="logout">
              <Button>注销门店</Button>
            </div>
        </div>
        <div class="edit_foot">
            <Button
              type="primary"
              @click="toEdit"
            >编辑</Button>
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
      formVal: {}
    }
  },
  created() {
    this.siteid = this.$route.query.id
    this.iniData();
  },
  methods: {
    iniData() {
      getDetail(this.siteid).then(res => {
        // console.log(res.Data)
        this.formVal = res.Data;
      })
    },
    toEdit() {
      this.$router.push({ path: '/storeEdit', query: { id: this.siteid } })
    }
  }
}
</script>
<style lang="less" scoped>
.examine {
    box-sizing: border-box;
    padding-bottom: 80px;
      .basisInfo {
        .line_info {
          display: flex;
          align-items: center;
          padding-bottom: 30px;
          .info_label {
            display: inline-block;
            white-space: nowrap;
            width: 140px;
            text-align: right;
            font-size: 16px;
            color: #666;
          }
          span {
            font-size: 16px;
            color: #000;
            font-weight: 700;
            padding-left: 20px;
          }
        }
        .logout {
          padding: 0 0 18px 120px;
          .ivu-btn {
            font-size: 18px;
            width: 200px;
            height: 40px;
            color: #999;
          }
        }
      }
    .edit_foot {
      background: #fff;
      border-top: 1px solid #E4E4E4;
      display: flex;
      justify-content: center;
      padding: 15px 0;
      position: fixed;
      bottom: 10px;
      left: 10px;
      right: 10px;
      z-index: 99;
      .ivu-btn {
        width: 200px;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
      }
    }
}
</style>