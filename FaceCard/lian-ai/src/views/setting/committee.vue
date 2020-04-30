<template>
  <div class="committee">
    <Header title="提成设置"></Header>
    <div class="wai_box">
      <div class="tab_title">
        <RadioGroup v-model="types" type="button" @on-change="changeRadio">
          <Radio :label="0">项目/服务</Radio>
          <Radio :label="1">产品</Radio>
          <Radio :label="2">卡项</Radio>
        </RadioGroup>
      </div>
      <div class="main_box">
        <Button @click="toadd">新增方案</Button>
        <div class="tableBox">
          <Table stripe :loading="loading" :columns="titleList" :data="showData"></Table>
          <footer class="centerFoot">
            <Pager :total="total" @on-change="onPageChange"></Pager>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Header from 'src/components/route-header'
import Pager from 'src/components/pager'
export default {
  components: { Header, Pager },
  data() {
    return {
      types: 0,
      titleList: [
        {
          title: '方案名称',
          align: 'center',
          key: 'Name',
          minWidth: 100
        },
        {
          title: '创建人',
          align: 'center',
          key: 'CreatdUser',
          minWidth: 100
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'CreatedTime',
          minWidth: 100
        },
        {
          title: '操作',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            return h("div", {
              style: {
                "display": "flex",
                "justify-content": "center"
              }
            }, [
                h("div", {
                  style: {
                    'margin-right': '15px',
                    'color': '#3275F5',
                    'cursor': 'pointer'
                  },
                  on: {
                    click: () => {
                      this.$router.push({ path: '/addCommit', query: { types: this.types, id: params.row.Id } })
                    }
                  }
                }, '编辑'),
                h("div", {
                  style: {
                    'color': '#3275F5',
                    'cursor': 'pointer'
                  },
                  on: {
                    click: () => {
                      var that = this;
                      this.$Modal.confirm({
                        title: '请确认是否删除',
                        onOk: () => {
                          // let url = this.types == 0 ? '/PushMoney/DelPushMoneyById' : this.types == 1  ? '/PushMoney/DelPushMoneyById' : '/PushMoney/DelPushMoneyById';
                           let url = '/PushMoney/DelPushMoneyById'
                          this.$axios.post(url, { Id: params.row.Id })
                            .then(res => {
                              if (res.data.Code === '0') {
                                this.$Message.success('删除成功');
                                this.showData = [];
                                this.iniData();
                              } else {
                                this.$Message.error(res.data.Message);
                              }
                            })
                            .catch(e => {
                              throw new Error(e)
                            })
                        }
                      })
                    }
                  }
                }, '删除')
              ])
          }
        },
      ],
      showData: [],
      total: 0,
      PageIndex: 1,
      loading: true
    }
  },
  created() {
    this.iniData();
  },
  methods: {
    iniData() {
      let url = this.types == 0 ? '/PushMoney/GetPushMoneys' : this.types == 1 ? '/PushMoney/GetProductPushMoneys' : '/PushMoney/GetCardPushMoneys';
      this.axios.post(url, { PageIndex: this.PageIndex, PageSize: 10 })
        .then(res => {
          if (res.data.Code == 0) {
            this.loading = false;
            this.showData = res.data.Data.PushMoneys;
            this.total = res.data.Data.Total;
          } else {
            this.$Message.error(res.data.Message);
          }
        })
        .catch(e => {
          throw new Error(e)
        })
    },
    toadd() {
      this.$router.push({ path: '/addCommit', query: { types: this.types } })
    },
    onPageChange(e) {
      this.PageIndex = e.PageIndex;
      this.iniData();
    },
    changeRadio(e) {
      this.showData = [];
      this.loading = true;
      this.iniData();
    }
  }
}
</script>
<style lang="less" scoped>
.committee {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  background: #f7f8fa;
  .wai_box {
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    .tab_title {
      background: #ffffff;
      padding: 20px;
      width: 100%;
      box-sizing: border-box;
    }
    .main_box {
      margin-top: 10px;
      background: #ffffff;
      width: 100%;
      box-sizing: border-box;
      padding: 20px;
      .tableBox {
        margin-top: 15px;
      }
    }
  }
}
.ivu-radio-group-button .ivu-radio-wrapper {
  padding: 0;
  width: 80px;
  text-align: center;
}
</style>
