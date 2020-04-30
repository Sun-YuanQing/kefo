<template>
  <div class="fullscreen">
    <Header title="充值赠送方案">
      <Button @click="addingCharge" style="width: 70px" shape="circle">添加</Button>
    </Header>
    <div class="content">
      <h3>规则说明</h3>
      <ul>
        <li>1: 充值配置满减金额，当前只支持单笔充值</li>
        <li>2: 充值优惠，只匹配单笔充值金额最近的优惠</li>
        <li>3: 充值优惠，最多配置5条</li>
      </ul>
      <div class="table-wrap">
        <Table class="space-table" :data="tableData" :columns="columns"></Table>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from 'src/components/route-header'
  import { formatDate } from 'src/utils'

  export default {
    name: 'charge-give',
    components: { Header },
    data() {
      return {
        tableData: [],
        columns: [
          {
            title: '充值赠送',
            minWidth: 160,
            render: (h, param) => {
              const item = param.row;
              return <h4>满<span class="big-num">{item.Amount}</span>送<span
                class="big-num">{item.PreferentialAmount}</span></h4>
            }
          },
          {
            title: '时间',
            key: 'date',
            minWidth: 200,
            render: (h, param) => {
              const item = param.row;
              // let dueTime = formatDate(new Date(item.DueTime), 'yyyy-MM-dd');
              return <div>{item.StartTime.split(' ')[0]}~{item.DueTime ?  item.DueTime.split(' ')[0] : '无'}</div>
            }
          },
          {
            title: '停用/启用',
            minWidth: 120,
            render: (h, param) => {
              const item = param.row;
              return <div>
                <i-switch v-model={item.Flag} disabled ={item.disabled} on-on-change={e => this.handleFlagChange(param.index,item, e)}></i-switch>
              </div>
            }
          },
          {
            title: '操作',
            minWidth: 120,
            render: (h, param) => {
              const item = param.row;
              
              return <div>
                <Button type="text" onClick={ () => this.handleEdit(item) } style="color: #3275F5;font-size: 14px;">编辑</Button>
                <Button type="text" onClick={ () => this.handledelete(item.Id,param.index) } style="margin-left: 18px;color: #FF4142;font-size: 14px;">删除</Button>
              </div>
            }
          }
        ]
      }
    },
    created() {
      this.getList()
    },
    
    methods: {
      handleEdit(params) {
        this.$router.push({ path: '/chargeSettingAdd', query: params})
      },
      handledelete(id,index){
        this.$Modal.confirm({
            title: '请确认是否删除',
            onOk: () => {
                
                const url = 'Recharge/DeleteRecharge'
                this.$axios.post(url, {Id: id}).then(res => {
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
      addingCharge(){
        if(this.tableData.length>=5){
            this.$Modal.warning({ 
              title: '错误提示',
              content: '充值优惠，最多配置5条!' 
          })
        }else{
          this.$router.push('/chargeSettingAdd')
        }
      },
      getList() {
        const url = '/Recharge/GetRecharges'
        this.$axios.post(url).then(res => {
          if (res.data.Code === '0') {
            const data = res.data.Data;
            this.tableData = data;

          } else {
            this.$Message.error(res.data.Message);
          }
        }).catch(e => {
          throw new Error(e)
        })
      },
      handleFlagChange(index,{ Id }, Flag) {
        
        this.tableData[index].Flag  = Flag
        const url = '/Recharge/EditRechargeFlag'
        this.$axios.post(url, { Id, Flag }).then(res => {
          if (res.data.Code === '0') {
            // this.$Message.success('操作成功')
          } else {
            this.$Message.error(res.data.Message);
            this.getList()
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
