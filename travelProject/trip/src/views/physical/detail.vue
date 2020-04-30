<template>
  <div class="physicalEdit">
    <Header
      title="数据详情"
      @change-router="$router.back()"
    ></Header>
    <div class="contentMain">
      <div class="whiteBox">
        <div class="perpon-box">
          <div class="paper-line">
            <div><label>报告名称：</label>{{templateData.ProductName}}</div>
          </div>
          <div
            class="paper-line"
            style="margin:18px 0;"
          >
            <div><label>姓名：</label>{{templateData.UserName || '-'}}</div>
            <div><label>体检时间：</label>{{templateData.PhyDate || '-'}}</div>
            <div><label>体检状态：</label>{{templateData.State== 1 ? '已录入数据' : '待录入数据'}}</div>
          </div>
          <div class="paper-line">
            <div><label>性别：</label>{{templateData.Sex ? '男' : '女'}}</div>
            <div><label>出生日期：</label>{{templateData.Birthday || '-'}}</div>
            <div><label>联系方式：</label>{{templateData.Phone || '-'}}</div>
          </div>
        </div>

        <div class="table-box">
          <Table
            :columns="paperTitle"
            :data="paperData"
          ></Table>
        </div>
        <div class="doctor-line">
          <label>综合建议：</label>
          <div>{{templateData.Content}}</div>
        </div>
        <div class="doctor-line">
          <label>体检医院：</label>
          <div>{{templateData.Hospital}}</div>
        </div>
        <div class="doctor-line">
          <label>主治医生：</label>
          <div>{{templateData.Doctor}}</div>
        </div>
      </div>
      <div class="role-box">
        <div class="role-title">判定基准：</div>
        <div class="role-content">
          <p>A：未发现异常</p>
          <p>B：发现有所变化或轻微异常。现在上不必担心（建议每年检查1次）</p>
          <p>C：需要继续观察</p>
          <p>C1：6个月后请做复查</p>
          <p>C2：3个月后请做复查</p>
          <p>D：要医治</p>
          <p>D1：需要接受治疗</p>
          <p>D2：需要进一步精密检查</p>
          <p>E：请继续您现在的就医治疗</p>
        </div>
      </div>
      <div class="sumbit_btn">
        <Button
          type="primary"
          style="margin-left: 20px"
          @click="toEdit"
        >编辑</Button>
      </div>
    </div>
  </div>
</template>
<script>
import Header from '@/components/route-header'
import { getTemplateDetail, saveTemplate, editProductDetail, delProductDetail, getHistoryTemplate, setHistoryTemplate } from '@/api/physical.js'
export default {
  components: { Header },
  data() {
    return {
      ruleValidate: {
        Content: [{ required: true, message: '请填写综合建议', trigger: 'blur' }],
        Hospital: [{ required: true, message: '体检医院不能为空！', trigger: 'blur' }],
        Doctor: [{ required: true, message: '主治医生不能为空！', trigger: 'blur' }]
      },
      paperTitle: [{
        title: '序号',
        type: 'index',
        align: 'center',
        width: 80
      }, {
        title: '项目（单位）',
        key: 'ItemName'
      }, {
        title: '输入值',
        key: 'ItemAct'
      }, {
        title: '标准值',
        render: (h, params) => {
          return h('div', params.row.ItemStand || '-')
        }
      }, {
        title: '判定',
        key: 'ItemResult'
      }, {
        title: '备注',
        render: (h, params) => {
          return h('div', params.row.Reamrk || '无')
        }
      }],
      paperData: [],
      templateData: {},
      isAdd: false,
      editItem: {
        ItemStand: '',
        ItemResult: 'A',
        Reamrk: ''
      },
      ruleProduct: {
        ItemName: [{ required: true, message: '请填写项目名称', trigger: 'blur' }],
        ItemAct: [{ required: true, message: '请填写输入值', trigger: 'blur' }]
      },
      isCopy: false,
      templateType: 'his',
      tempData: []
    }
  },
  created() {
    this.templateId = this.$route.query.id;
    this.loadData();
  },
  methods: {
    loadData() {
      getTemplateDetail(this.templateId).then(res => {
        this.templateData = res.Data;
        this.paperData = res.Data.HealthyReportItemResult;
      }).catch(err => {

      })
    },
    toEdit() {
      this.$router.push({ path: '/physicalEdit', query: { id: this.templateId } })
    }
  }
}
</script>
<style lang="less" scoped>
.physicalEdit {
  height: 100%;
  .contentMain {
    min-height: calc(100% - 44px);
    max-height: calc(100% - 44px);
    padding: 10px;
    box-sizing: border-box;
    background-color: #f7f8fa;
    overflow-y: auto;
    .whiteBox {
      background: #fff;
      padding: 40px 20px;
      margin-bottom: 10px;
      .perpon-box {
        padding: 0 40px;
        .paper-line {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #333;
          font-size: 14px;
          div {
            width: 200px;
            label {
              width: 70px;
              display: inline-block;
              color: #999999;
            }
          }
        }
      }
      .doctor-line {
        display: flex;
        margin-top: 35px;
        padding: 0 20px;
        font-size: 14px;
        label {
          color: #999999;
          margin-right: 12px;
        }
        div {
          color: #333333;
        }
      }
    }
    .role-box {
      padding: 20px 50px 100px;
      .role-title {
        color: #999999;
        font-size: 16px;
        font-weight: 700;
      }
      .role-content {
        margin-top: 10px;
        > p {
          font-size: 16px;
          color: #999999;
        }
      }
    }
    .sumbit_btn {
      background: #fff;
      border-top: 1px solid #e4e4e4;
      display: flex;
      justify-content: center;
      padding: 15px 0;
      position: fixed;
      bottom: 10px;
      left: 10px;
      right: 10px;
      z-index: 99;
      .ivu-btn {
        height: 40px;
        width: 200px;
        &:first-of-type {
          margin-right: 30px;
        }
      }
    }
  }
}
.productTips {
  color: #ff4b35;
  font-size: 14px;
}
.modalContent-Box {
  display: flex;
  .modal-tabs {
    > div {
      width: 200px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      color: #333;
      cursor: pointer;
    }
    .sel-tabs {
      background: #f7f8fa;
    }
  }
  .modal-list {
    width: 100%;
    background: #f7f8fa;
    padding: 0 20px 10px;
    height: 300px;
    overflow-y: scroll;
    > div {
      height: 48px;
      line-height: 48px;
      border: 1px solid #e4e4e4;
      padding: 0 20px;
      margin-top: 10px;
      border-radius: 4px;
      cursor: pointer;
    }
  }
}
</style>
<style lang="less">
.table-box {
  background: #f9f9f9;
  padding: 30px 20px;
  margin-top: 35px;
  .ivu-table-header thead tr th {
    background: #fff;
  }
}
</style>