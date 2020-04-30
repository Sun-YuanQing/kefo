<template>
  <div class="physicalList">
    <Header
      title="体检列表"
      @change-router="$router.back()"
    ></Header>
    <div class="contentMain">
      <div class="detailMain">
        <div class="head">
          <div class="searchWrap">
            <Search
              v-model="postData.Key"
              placeholder="输入套餐名称"
              @on-search="handleSearch"
            ></Search>
            <Select
              v-model="postData.State"
              style="width: 120px"
              @on-change="handleSearch"
            >
              <Option value="-1">全部</Option>
              <Option value="0">待录入数据</Option>
              <Option value="1">已录入数据</Option>
            </Select>
          </div>
          <Button @click="isAdd=true;">新增报告模版</Button>
        </div>

        <div>
          <Table
            :columns="listName"
            :data="listData"
          ></Table>
          <Page
            :total="total"
            :current="postData.PageIndex"
            :page-size="postData.PageSize"
            placement="top"
            show-total
            show-sizer
            @on-change="handleChange"
            @on-page-size-change="pageSizeChanged"
          />
        </div>
      </div>
    </div>
    <Modal
      v-model="isAdd"
      width="500"
      :mask-closable="false"
      class="productListModal"
      @on-cancel="isAdd=false;$refs['editedForm'].resetFields()"
    >
      <p
        slot="header"
        style="text-align:center;font-size: 18px;"
      >新增报告模版</p>
      <Form
        ref="editedForm"
        :model="editItem"
        :rules="ruleValidate"
        :label-width="80"
      >
        <FormItem
          prop="ProductName"
          label="报告名称"
        >
          <Input
            placeholder="输入报告名称"
            v-model="editItem.ProductName"
          />
        </FormItem>
      </Form>
      <div
        slot="footer"
        class="foot"
      >
        <Button @click="isAdd=false;$refs['editedForm'].resetFields()">取消</Button>
        <Button
          type="primary"
          @click="addTemplate"
        >确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import Header from '@/components/route-header'
import Search from '@/components/search'
import { getPhysicalList, addTemplateName } from '@/api/physical.js'
export default {
  components: { Header, Search },
  data() {
    return {
      listName: [
        {
          title: '序号',
          type: 'index',
          align: 'center'
        }, {
          title: '报告名称',
          key: 'ProductName'
        }, {
          title: '会员名称',
          key: 'UserNickName'
        }, {
          title: '体检时间',
          key: 'PhyDate'
        }, {
          title: '姓名',
          key: 'UserName'
        }, {
          title: '联系方式',
          key: 'Phone'
        }, {
          title: '状态',
          render: (h, params) => {
            let doName = params.row.State == 0 ? '待录入数据' : '已录入数据';
            return h("div", doName)
          }
        }, {
          title: '操作',
          render: (h, params) => {
            let doName = params.row.State == 0 ? '录入数据' : '查看详情';
            return h("div", {
              style: {
                color: '#3275F5',
                cursor: 'pointer'
              },
              on: {
                click: () => {
                  if (params.row.State == 0) {
                    this.$router.push({ path: '/physicalEdit', query: { id: params.row.Id } })
                  } else {
                    this.$router.push({ path: '/physicalDetail', query: { id: params.row.Id } })
                  }
                }
              }
            }, doName)
          }
        }
      ],
      listData: [],
      postData: {
        Key: '',
        State: '-1',
        PageIndex: 1,
        PageSize: 10
      },
      total: 0,
      isAdd: false,
      editItem: {},
      ruleValidate: {
        ProductName: [{
          required: true,
          message: '请输入报告名称',
          trigger: 'blur'
        },
        {
          type: 'string',
          max: 20,
          message: '最多输入20个字',
          trigger: 'blur'
        }]
      },
    }
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      getPhysicalList(this.postData).then(res => {
        let { HealthyReport, Total } = res.Data;
        if (HealthyReport != null) {
          this.listData = HealthyReport;
          this.total = Total;
        } else {
          this.listData = [];
          this.total = 0;
        }
      }).catch(err => {

      })
    },
    handleSearch() {
      this.postData = { ...this.postData, PageIndex: 1, PageSize: 10 };
      this.loadData();
    },
    //页码切换
    handleChange(e) {
      this.postData.PageIndex = e;
      this.loadData();
    },

    //每页条数切换
    pageSizeChanged(pageSize) {
      this.postData = { ...this.postData, PageIndex: 1, PageSize: pageSize };
      this.loadData();
    },

    addTemplate() {
      this.$refs['editedForm'].validate((valid) => {
        if (valid) {
          addTemplateName(this.editItem).then(res => {
            this.isAdd = false;
            this.loadData();
            this.$refs['editedForm'].resetFields();
          }).catch(err => {

          })
        }
      });
    }
  }
}
</script>
<style lang="less" scoped>
.physicalList {
  height: 100%;
  .contentMain {
    min-height: calc(100% - 44px);
    max-height: calc(100% - 44px);
    padding: 10px;
    box-sizing: border-box;
    background-color: #f7f8fa;
    overflow-y: auto;
    .detailMain {
      background: #fff;
      padding: 10px;
      margin-bottom: 10px;
      .head {
        padding-left: 20px;
        padding-right: 3px;
        display: flex;
        justify-content: space-between;
        .searchWrap {
          display: flex;
          > div {
            display: flex;
            align-items: center;
            > span {
              padding-right: 10px;
            }
            &:first-of-type {
              margin-right: 20px;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
.ivu-select-selection {
  width: 100%;
}
.foot {
  text-align: center;
  .ivu-btn {
    width: 120px;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    &:first-of-type {
      margin-right: 20px;
    }
  }
}
</style>