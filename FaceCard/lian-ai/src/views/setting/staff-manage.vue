<template>
  <div class="bill">
    <Header title="员工管理"></Header>
    <div
      ref="tableWrap"
      class="table-wrap"
    >
      <div class="title">
        <p>会员列表</p>
        <div>
          <Button @click="edit(2)">添加员工</Button>
          <!-- <Button class="set">设置</Button> -->
        </div>
      </div>

      <div style="flex: 1; overflow: scroll;">
        <Table
          :columns="columns"
          :data="tableData"
          :max-height="maxHeight"
          :loading="loading"
          stripe
          disabled-hover
        >
          <template
            slot-scope="{ row, index }"
            slot="action"
          >
            <Button
              type="text"
              style="margin-right: 15px;color: #3275F5;"
              @click="edit(1,index)"
            >编辑</Button>
            <Button
              type="text"
              style="color: #3275F5;"
              @click="remove(row.Id)"
            >删除</Button>
          </template>
        </Table>
      </div>
    </div>
    <Modal
      v-model="isEdit"
      width="420"
      @on-cancel="resetAll"
      :mask-closable="false"
      :footer-hide="true"
      class="merge"
    >
      <p
        slot="header"
        class="title"
      >{{title==1 ? '修改员工':'添加员工'}}</p>
      <Form
        ref="addForm"
        :model="addForm"
        :rules="ruleValidate"
        :label-width="60"
        class="merge-form"
      >
        <FormItem
          label="姓名"
          prop="Name"
        >
          <Input
            v-model="addForm.Name"
            :maxlength="12"
          ></Input>
        </FormItem>
        <FormItem
          label="手机"
          prop="Phone"
        >
          <Input
            v-model="addForm.Phone"
            :maxlength="11"
          ></Input>
        </FormItem>
        <FormItem
          label="工号"
          prop="Number"
        >
          <Input
            v-model="addForm.Number"
            :maxlength="16"
          ></Input>
        </FormItem>
        <FormItem
          label="职称"
          prop="Position"
        >
          <Input
            v-if="showShop =='false'"
            v-model="addForm.Position"
            :maxlength="16"
          ></Input>
          <Select
            v-model="addForm.PositionId"
            v-else
            @on-change="changeSel"
            label-in-value
          >
            <Option
              v-for="item in Position"
              :value="item.Id"
              :key="item.Id"
            >{{ item.Name }}</Option>
          </Select>
        </FormItem>
        <div
          v-if="showShop =='true' && Position.length == 0"
          class="addunits"
        >还没有职称，点击这里去<router-link to="staffPosition">添加职称</router-link>吧!</div>
        <FormItem
          label="状态"
          prop="Status"
        >
          <RadioGroup v-model="addForm.Status">
            <Radio :label="0">在职</Radio>
            <Radio :label="1">离职</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem
          label=""
          prop=""
        >
          <Button
            type="primary"
            @click="handleSubmit('addForm')"
            style="width: 200px; height: 40px;margin-top: 20px;"
          >确定</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import Header from 'src/components/route-header'
import Pager from 'src/components/pager'
import { validateName } from '@/utils/validate'
const FORM = {
  "Id": "", //新增为空  修改传id
  "Name": "",
  "Phone": "",
  "Number": "",
  "Position": "",
  "Status": 0
}
export default {
  components: { Header, Pager },
  data() {
    return {
      loading: false,
      maxHeight: 300,
      columns: [
        {
          title: '姓名',
          key: 'Name',
          minWidth: 100,
          fixed: 'left'
        }, {
          title: '手机号',
          key: 'Phone',
          minWidth: 160
        }, {
          title: '员工编号',
          key: 'Number',
          minWidth: 120
        }, {
          title: '职称',
          key: 'Position',
          minWidth: 120
        }, {
          title: '添加时间',
          key: 'CreatedTime',
          minWidth: 120
        }, {
          title: '状态',
          key: 'Status',
          render: (h, params) => {
            return h('div', params.row.Status == 0 ? '在职' : '离职')
          },
          minWidth: 120
        }, {
          title: '操作',
          slot: 'action',
          minWidth: 160,
          align: 'left'
        }
      ],
      tableData: [],
      isEdit: false,
      addForm: FORM,
      title: '',
      ruleValidate: {
        Name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        Phone: [
          { required: true, validator: validateName, trigger: 'blur' }
        ],
        Number: [
          { required: true, message: '请输入员工编号', trigger: 'blur' }
        ],
        Position: [
          { required: true, message: '请输入职位', trigger: 'blur' }
        ]
      },
      Position: [],
      showShop: 'false'
    }
  },
  created() {
    this.getStaff();
    this.getPosition();
    var height = document.documentElement.clientHeight || document.body.clientHeight;
    this.maxHeight = height - 168;
    this.showShop = localStorage.getItem('goShop')
  },
  methods: {
    getPosition() {
      let that = this;
      that.axios.post('/Lable/GetPositionsBySiteId')
        .then(res => {
          if (res.data.Code == 0) {
            that.Position = res.data.Data.Position;
          } else {
            this.$Message.error(res.data.Message);
          }
        })
        .catch(err => {
          throw new Error(e)
        })
    },
    resetAll() {
      this.$refs['addForm'].resetFields();
    },
    getStaff() {
      this.loading = true;
      const url = '/Employee/GetEmployees'
      this.$axios.post(url).then(res => {
        this.loading = false;
        if (res.data.Code === '0') {
          this.tableData = res.data.Data.Employees;
          this.$refs['addForm'].resetFields();
        } else {
          this.$Message.error(res.data.Message);
        }
      }).catch(e => {
        throw new Error(e)
      })
    },
    changeSel(e) {
      if (e) {
        this.addForm.Position = e.label;
        this.addForm.PositionId = e.value;
      }
    },
    remove(id) {
      this.$Modal.confirm({
        title: '请确认是否删除',
        onOk: () => {
          const url = '/Employee/DeleteEmployee'
          this.$axios.post(url, { Id: id }).then(res => {
            if (res.data.Code === '0') {
              this.$Message.success('删除成功');
              this.getStaff();
            } else {
              this.$Message.error(res.data.Message);
            }
          }).catch(e => {
            throw new Error(e)
          })
        }
      })
    },
    edit(type, index) {
      if (this.addForm.PositionId) {
        this.addForm.PositionId = "";
      }
      this.isEdit = true;
      if (type == 1) {
        this.title = 1;
        this.addForm = Object.assign({}, this.tableData[index])
      } else {
        this.title = 2;
        this.addForm = FORM;
      }
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const url = '/Employee/EditEmployee'
          this.$axios.post(url, this.addForm).then(res => {
            if (res.data.Code === '0') {
              this.isEdit = false;
              this.$Message.success(this.title == 1 ? '修改成功' : '添加成功');
              this.tableData = [];
              this.getStaff();
            } else {
              this.$Message.error(res.data.Message);
            }
          }).catch(e => {
            throw new Error(e)
          })
        } else {
          // this.$Message.error('Fail!');
        }
      })
    },
  }
}
</script>
<style>
.ivu-table th {
  background-color: #eee;
}
</style>

<style lang="less" scoped>
.bill {
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #f7f8fa;
}
.table-wrap {
  padding: 10px 10px 0;
  margin: 10px;
  box-sizing: border-box;
  background-color: #fff;
  .title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    margin-right: 10px;
    p {
      font-size: 16px;
      font-weight: 700;
    }
    .set {
      margin-left: 20px;
    }
  }
}
.merge {
  .title {
    text-align: center;
    font-size: 18px;
    margin: 10px 0 -8px;
    color: #333;
  }
  .merge-form {
    width: 282px;
    margin: 0 auto;
  }
  .addunits {
    white-space: nowrap;
    font-size: 14px;
    color: #333333;
    margin-bottom: 24px;
    text-align: center;
    a {
      color: #e94e27;
      border-bottom: 1px solid #e94e27;
    }
  }
}
</style>

