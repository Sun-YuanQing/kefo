<template>
  <div class="physicalEdit">
    <Header
      title="录入数据"
      @change-router="$router.back()"
    ></Header>
    <div class="contentMain">
      <div class="whiteBox">
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
      <div class="whiteBox">
        <div class="info-line">
          <div class="basis-line">
            <div>基础信息：</div>
            <div
              class="add-project"
              @click="isAdd=true;"
            >添加项目</div>
          </div>
          <Button
            @click="copyTemplate('his')"
            v-if="templateData.UserId"
          >复制报告</Button>
        </div>
        <Table
          :columns="paperTitle"
          :data="paperData"
        ></Table>
      </div>
      <div class="whiteBox">
        <Form
          :model="templateData"
          :label-width="100"
          :rules="ruleValidate"
          ref="formData"
        >
          <FormItem
            label="综合建议："
            prop="Content"
          >
            <div class="textareaWrap">
              <Input
                v-model="templateData.Content"
                type="textarea"
                class="textarea"
                :autosize="{minRows: 4,maxRows: 8}"
                :maxlength="200"
                placeholder="请输入综合建议"
              />
              <div class="tip">{{templateData.Content ? templateData.Content.length : 0}}/200</div>
            </div>
          </FormItem>
          <FormItem
            label="体检医院："
            prop="Hospital"
          >
            <div class="textareaWrap">
              <Input
                v-model="templateData.Hospital"
                class="textarea"
              />
            </div>
          </FormItem>
          <FormItem
            label="主治医生："
            prop="Doctor"
          >
            <div class="textareaWrap">
              <Input
                v-model="templateData.Doctor"
                class="textarea"
              />
            </div>
          </FormItem>
        </Form>
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
        <Button @click="$router.back()">取消</Button>
        <Button
          type="primary"
          style="margin-left: 20px"
          @click="toSave"
        >提交数据</Button>
      </div>
    </div>
    <Modal
      v-model="isAdd"
      width="500"
      :mask-closable="false"
      class="productListModal"
      @on-cancel="isAdd=false;$refs['editedForm'].resetFields();delete editItem.Id"
    >
      <p
        slot="header"
        style="text-align:center;font-size: 18px;"
      >{{editItem.Id ? '编辑项目' : '添加项目'}}</p>
      <Form
        ref="editedForm"
        :model="editItem"
        :rules="ruleProduct"
        :label-width="80"
      >
        <FormItem
          prop="ItemName"
          label="项目名称"
        >
          <Input v-model="editItem.ItemName" />
        </FormItem>
        <FormItem
          prop="ItemAct"
          label="输入值"
        >
          <Input v-model="editItem.ItemAct" />
          <div class="productTips">*输入值为此次体检的结果值</div>
        </FormItem>
        <FormItem
          prop="ItemStand"
          label="标准值"
        >
          <Input v-model="editItem.ItemStand" />
        </FormItem>
        <FormItem
          prop="ItemResult"
          label="判定"
        >
          <Select v-model="editItem.ItemResult">
            <Option value="A">A</Option>
            <Option value="B">B</Option>
            <Option value="C">C</Option>
            <Option value="C1">C1</Option>
            <Option value="C2">C2</Option>
            <Option value="D">D</Option>
            <Option value="D1">D1</Option>
            <Option value="E">E</Option>
          </Select>
        </FormItem>
        <FormItem label="备注">
          <Input v-model="editItem.Reamrk" />
        </FormItem>
      </Form>
      <div
        slot="footer"
        class="foot"
      >
        <Button @click="isAdd=false;$refs['editedForm'].resetFields();delete editItem.Id">取消</Button>
        <Button
          type="primary"
          @click="addProduct"
        >确定</Button>
      </div>
    </Modal>
    <Modal
      v-model="isCopy"
      width="820"
      :mask-closable="false"
      @on-cancel="isCopy=false;templateType='his';"
    >
      <p
        slot="header"
        style="font-size: 18px;"
      >选择报告</p>
      <div class="modalContent-Box">
        <div class="modal-tabs">
          <div
            @click="copyTemplate('his')"
            :class="templateType == 'his' ? 'sel-tabs' : ''"
          >历史报告数据</div>
          <div
            @click="copyTemplate('temp')"
            :class="templateType == 'temp' ? 'sel-tabs' : ''"
          >报告模版</div>
        </div>
        <div class="modal-list">
          <div
            v-for="(item,index) in tempData"
            :key="index"
            @click="setTemplate(item.Temp0rHisId)"
          >{{item.ProductName}}</div>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
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
        key: 'ItemResult',
        width: 80
      }, {
        title: '备注',
        render: (h, params) => {
          return h('div', params.row.Reamrk || '无')
        }
      }, {
        title: '操作',
        render: (h, params) => {
          let doName = params.row.State == 0 ? '录入数据' : '查看详情';
          return h('div', {
            style: {
              display: 'flex'
            }
          }, [
            h('div', {
              style: {
                color: '#3275F5',
                'margin-right': '18px',
                cursor: 'pointer'
              },
              on: {
                click: () => {
                  this.editItem = JSON.parse(JSON.stringify(params.row));
                  this.isAdd = true;
                }
              }
            }, '编辑'),
            h('div', {
              style: {
                color: '#3275F5',
                cursor: 'pointer'
              },
              on: {
                click: () => {
                  this.delProduct(params.row.Id);
                }
              }
            }, '删除')
          ])
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
    addProduct() {
      this.$refs['editedForm'].validate((valid) => {
        if (valid) {
          editProductDetail({
            HealthyId: this.templateId,
            ...this.editItem
          }).then(res => {
            this.$Message.success('保存成功')
            this.isAdd = false;
            this.$refs['editedForm'].resetFields();
            this.loadData();
          })
        }
      })
    },
    delProduct(id) {
      this.$Modal.confirm({
        title: '请确认是否删除该项目？',
        onOk: () => {
          delProductDetail(id).then(res => {
            this.$Message.success('成功删除')
            this.loadData();
          })
        }
      })
    },
    copyTemplate(type) {
      getHistoryTemplate({
        Temp0rHis: type,
        UserId: this.templateData.UserId,
        HeathyId: this.templateId
      }).then(res => {
        this.templateType = type;
        this.tempData = res.Data;
        this.isCopy = true;
      })
    },
    setTemplate(tempId) {
      setHistoryTemplate({
        HeathyId: this.templateId,
        Temp0rHisId: tempId
      }).then(res => {
        this.$Message.success('复制成功')
        this.templateType = 'his';
        this.isCopy = false;
        this.loadData();
      }).catch(err => {

      })
    },
    toSave() {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          saveTemplate({
            Id: this.templateId,
            Content: this.templateData.Content,
            Hospital: this.templateData.Hospital,
            Doctor: this.templateData.Doctor
          }).then(res => {
            this.$Message.success('保存成功')
            this.$router.back()
          }).catch(err => {

          })
        }
      });
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
      padding: 40px 50px;
      margin-bottom: 10px;
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
      .info-line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .basis-line {
          display: flex;
          align-items: center;
          color: #333;
          font-size: 16px;
          .add-project {
            color: #3275f5;
            margin-left: 20px;
            cursor: pointer;
          }
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