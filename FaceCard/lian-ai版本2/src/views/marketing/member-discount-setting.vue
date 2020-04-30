<template>
  <div class="fullscreen">
    <Header title="会员折扣方案">
      <Button v-if="showAdd" to="/memberDiscountSettingAdd" style="width: 70px" shape="circle">添加</Button>
    </Header>
    <div class="content">
      <h3>规则说明</h3>
      <ul>
        <li>1: 商家收银时，可以使用此优惠政策，为会员提供消费打折服务</li>
        <li>2: 会员消费折扣只能配置一条</li>
      </ul>
      <div class="table-wrap">
        <Table class="space-table" :data="tableData" :columns="columns"></Table>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from 'src/components/route-header'

  export default {
    name: 'member-discount-setting',
    components: { Header },
    data() {
      return {
        showAdd: false,
        tableData: [],
        columns: [
          {
            title: '会员折扣',
            minWidth: 180,
            render: (h, param) => {
              const item = param.row;
              return <h4>会员消费折扣</h4>
            }
          },
          {
            title: '折扣',
            minWidth: 100,
            render: (h, param) => {
              const item = param.row;
              return <h4>{item.Discount}</h4>
            }
          },
          {
            title: '启用/停用',
            minWidth: 100,
            // width: 200,
            render: (h, param) => {
              const item = param.row;
              return <i-switch value={item.Flag} on-on-change={e => this.handleFlagChange(item, e)}></i-switch>
            }
          },
          {
            title: '操作',
            minWidth: 120,
            render: (h, param) => {
              const item = param.row;
              return <div>
                <Button type="text" onClick={ () => this.handleEdit(item) } style="color: #3275F5;font-size: 14px;">编辑</Button>
                <Button type="text" onClick={ () => this.handledelete(param.index) } style="margin-left: 18px;color: #FF4142;font-size: 14px;">删除</Button>
              </div>
            }
          }
        ]
      }
    },
    created() {
      this.getSetting()
    },
    methods: {
      handleEdit(data) {
        this.$router.push({ path: '/memberDiscountSettingAdd', query: { data } })
      },
      handledelete(index){
        this.$Modal.confirm({
            title: '请确认是否删除',
            onOk: () => {
                
                const url = 'Discount/DeleteDiscount'
                this.$axios.post(url).then(res => {
                  if (res.data.Code === '0') {
                    this.$Message.success('删除成功')
                    this.tableData.splice(index,1)
                  } else {
                    this.$Message.error(res.data.Message);
                  }
                }).catch(e => {
                  throw new Error(e)
                })
                
            }
        })
        
      },
      getSetting() {
        const url = '/Discount/GetDiscount'
        this.$axios.post(url).then(res => {
          if (res.data.Code === '0') {
            const data = res.data.Data;
            if (!data) {
              this.showAdd = true;
            }else{
              this.tableData = [data]
            }
            
          } else {
            this.$Message.error(res.data.Message);
          }
        }).catch(e => {
          throw new Error(e)
        })
      },
      handleFlagChange(item, e) {
        item.Flag = e;
        const url = '/Discount/EditDiscount'
        const postData = {
          ...this.tableData[0],
          Flag: e
        }
        this.$axios.post(url, postData).then(res => {
          if (res.data.Code === '0') {
            const data = res.data.Data;

          } else {
            this.$Message.error(res.data.Message);
          }
        }).catch(e => {
          throw new Error(e)
        })
      }
    },
  }
</script>

<style lang="less" scoped>
  .fullscreen {
    background-color: #f7f8fa;
  }

  .content {
    padding: 20px 28px;
  }
</style>
