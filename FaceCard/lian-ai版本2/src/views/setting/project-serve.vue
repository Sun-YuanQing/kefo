<template>
  <div class="projectServe">
    <Header title="项目/服务"></Header>
    <div class="waiBox">
      <div class="whiteBox">
        <div class="line_title">
          <div class="title">项目/服务列表</div>
          <Button @click="toAdd">添加项目/服务</Button>
        </div>
        <Table
          stripe
          :loading="loading"
          :columns="listData"
          :data="Services"
        ></Table>
        <footer class="centerFoot">
          <Pager
            :total="total"
            @on-change="onPageChange"
          ></Pager>
        </footer>
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
      loading: true,
      listData: [
        {
          title: '项目编号', minWidth: 100,
          render: (h, params) => {
            let statusColor = params.row.Status == 0 ? '1' : '.5';
            return h("div", {
              style: {
                opacity: statusColor
              }
            }, params.row.Number)
          }
        },
        {
          title: '名称', minWidth: 100,
          render: (h, params) => {
            let statusColor = params.row.Status == 0 ? '1' : '.5';
            return h("div", {
              style: {
                opacity: statusColor
              }
            }, params.row.Name)
          }
        },
        {
          title: '类别', minWidth: 100,
          render: (h, params) => {
            let statusColor = params.row.Status == 0 ? '1' : '.5';
            return h("div", {
              style: {
                opacity: statusColor
              }
            }, params.row.ServiceTypeName)
          }
        },
        {
          title: '价格（元）', minWidth: 120,
          render: (h, params) => {
            let statusColor = params.row.Status == 0 ? '1' : '.5';
            return h("div", {
              style: {
                opacity: statusColor
              }
            }, params.row.Price.toFixed(2))
          }
        },
        {
          title: '状态',
          minWidth: 100,
          render: (h, params) => {
            let statusColor = params.row.Status == 0 ? '1' : '.5';
            return h("div", {
              style: {
                opacity: statusColor
              }
            }, params.row.Status == 0 ? '上架' : '下架')
          }
        },
        {
          title: '操作',
          minWidth: 120,
          render: (h, params) => {
            return h('div', {
              style: {
                "display": "flex"
              }
            }, [
                h('div', {
                  style: {
                    'margin-right': '15px',
                    'color': '#3275F5',
                    'cursor': 'pointer'
                  },
                  on: {
                    click: () => {
                      this.$router.push({ path: '/addProject', query: { id: params.row.Id } })
                    }
                  }
                }, '编辑'),
                h('div', {
                  style: {
                    'color': '#3275F5',
                    'cursor': 'pointer'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '请确认是否删除',
                        onOk: () => {
                          this.$axios.post('/Lable/DelServiceById', { Id: params.row.Id }).then(res => {
                            if (res.data.Code === '0') {
                              this.$Message.success('删除成功');
                              this.Services = [];
                              this.loading = true;
                              this.iniData();
                            } else {
                              this.$Message.error(res.data.Message);
                            }
                          }).catch(e => {
                            throw new Error(e)
                          })
                        }
                      })
                    }
                  }
                }, '删除')
              ])
          }
        }],
      total: 0,
      Services: [],
      PageIndex: 1
    }
  },
  created() {
    this.iniData();
  },
  methods: {
    iniData() {
      this.axios.post('/Lable/GetServicesBySiteId', { PageIndex: this.PageIndex, PageSize: 10 })
        .then(res => {
          if (res.data.Code === '0') {
            this.loading = false;
            this.total = res.data.Data.Total;
            this.Services = res.data.Data.Services;
          } else {
            this.$Message.error(res.data.Message);
          }
        })
        .catch(e => {
          throw new Error(e)
        })
    },
    toAdd() {
      this.$router.push({ path: '/addProject' })
    },
    onPageChange(e) {
      this.PageIndex = e.PageIndex;
      this.loading = true;
      this.iniData();
    },
  }
}
</script>
<style lang="less" scoped>
.projectServe {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  background: #f7f8fa;
  .waiBox {
    width: calc(100% - 20px);
    margin: 15px 10px 0;
    .whiteBox {
      width: 100%;
      background: #ffffff;
      box-sizing: border-box;
      padding: 20px 12px;
      .line_title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 15px;
        .title {
          font-size: 16px;
          color: #333333;
          font-weight: 700;
        }
      }
      .centerFoot {
        text-align: center;
        padding: 15px 0;
      }
    }
  }
}
</style>
