<template>
  <div class="tab-table">
    <header>
      <RadioGroup class='tabs' @on-change="handleRadioChange" v-model="radio" type="button">
        <Radio :label="1">统计</Radio>
        <Radio :label="2">明细</Radio>
      </RadioGroup>
      <Select class="select" v-if="radio === 2" @on-change="handleList(postData.Type)" v-model="postData.Type">
        <Option :value="-1">全部</Option>
        <Option :value="1">充值</Option>
        <Option :value="2">赠送</Option>
        <Option :value="3">消费</Option>
      </Select>
    </header>
    
    <div>
      <div v-if="radio === 1" class="stat-cards">
        <Card class="card" @click.native="handleList(-1)">
          <div slot="title" class="card-title">余额</div>
          <div class="body">
            <h3>
              <amount :value="totalInfo.Amount" />
              <!-- <img src="@/assets/icons/png/arrow-right-golden.png" alt=""> -->
            </h3>
          </div>
        </Card>
        <Card class="card" @click.native="handleList(1)">
          <div slot="title" class="card-title">累计充值</div>
          <div class="body">
            <h3>
              <amount :value="totalInfo.ChargeAmount" /> 
              <!-- <img src="@/assets/icons/png/arrow-right-golden.png" alt=""> -->
            </h3>
          </div>
        </Card>
        <Card class="card" @click.native="handleList(2)">
          <div slot="title" class="card-title">累计赠送</div>
          <div class="body">
            <h3>
              <amount :value="totalInfo.ChargePreferentialAmount" /> 
              <!-- <img src="@/assets/icons/png/arrow-right-golden.png" alt=""> -->
            </h3>
          </div>
        </Card>
        <Card class="card" @click.native="handleList(3)">
          <div slot="title" class="card-title">累计消费</div>
          <div class="body">
            <h3>
              <amount :value="totalInfo.ConsumeAmount" /> 
              <!-- <img src="@/assets/icons/png/arrow-right-golden.png" alt=""> -->
            </h3>
          </div>
        </Card>
      </div>
      <div v-else class="table-wrap">
        <Table :columns="columns" :data="tableData" stripe></Table>
        <footer>
          <Pager :total="total" @on-change="historyPageChange"></Pager>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
  import Pager from '@/components/pager'

  export default {
    name: 'come-records',
    props: {
      userId: {
        required: true
      }
    },
    components: { Pager },
    data() {
      return {
        radio: 1,
        tradeRecordFilter: '',
        totalInfo: {
          "Amount": 80,
          "ChargeAmount": 80,  //累计充值
          "ChargePreferentialAmount": 20, //累计赠送
          "ConsumeAmount": 27 //累计消费
        },
        columns: [
          {
            title: '时间',
            key: 'CreatedTime',
            minWidth: 160
          },
          {
            title: '充值/消费',
            render: (h, param) => {
              const item = param.row;
              const style = {
                color: item.Type === 3 ? '' : '#E94E27'
              }
              return <span style={style}>{item.Detail}</span>
            },
            minWidth: 160
          },
          {
            title: '方式',
            key: 'TypeStr',
            minWidth: 80
          },
          {
            title: '剩余金额(元)',
            key: 'Amount',
            minWidth: 120
          },
        ],
        total: 0,
        tableData: [],
        postData: {
          Type: -1,
          PageIndex: 1,
          PageSize: 10
        },
      }
    },
    created() {
      this.getTotal()
    },
    methods: {
      handleList(index) {
        this.postData.Type = index;
        this.postData.PageIndex = 1;
        this.getTableList()
        this.radio = 2;
      },
      handleRadioChange(e) {
        if (e === 2) {
          this.getTableList()
        }
      },
      historyPageChange({ PageIndex, PageSize }) {
        this.postData = { ...this.postData, PageIndex, PageSize }
        this.getTableList()
      },
      getTableList() {
        const url = '/ConsumeRecord/GetConsumeRecordsByType'
        const postData = {
          ...this.postData,
          UserId: this.userId
        }
        this.$axios.post(url, postData).then(res => {
          if (res.data.Code === '0') {
            const data = res.data.Data;
            this.total = data.Total;
            this.tableData = data.Records;
          } else {
            this.$Message.error(res.data.Message);
          }
        }).catch(e => {
          throw new Error(e)
        })
      },
      getTotal() {
        const url = '/ConsumeRecord/GetSumRecordById'
        const postData = {
          UserId: this.userId
        }
        this.$axios.post(url, postData).then(res => {
          if (res.data.Code === '0') {
            this.totalInfo = res.data.Data;
          } else {
            this.$Message.error(res.data.Message);
          }
        }).catch(e => {
          throw new Error(e)
        })
      },
    },
  }
</script>

<style lang="less">
  .tab-table {
    .ivu-table th {
      background-color: #eee;
    }
    .ivu-select-single .ivu-select-selection{
          width: 100px;
        }
  }
</style>

<style lang="less" scoped>
  .tab-table {
    flex: 1;
    padding: 18px 18px 20px;
    position: relative;
    // background-color: #f7f8fa;;

    header {
      // padding-bottom: 22px;
      // display: flex;
      // align-items: center;
      // justify-content: space-between;
        display: flex;
        justify-content: flex-end;
      .tabs{
        position: absolute;
        top: -35px;
        right: 18px;
      }
      .select{
        width: 100px;
        position: relative;
        top: -10px;
        
        // display: flex;
        // justify-content: flex-end;
      }
      p {
        color: #666;
        font-size: 16px;

        span {
          font-size: 18px;
          color: #000;
          font-weight: bold;
        }
      }
    }
    

    .stat-cards {
      grid-template-columns: repeat(4, 1fr);

      .card {
        cursor: pointer;
        margin-bottom: 10px;
      }
    }
  }

  @media screen and (max-width: 768px){
    .tab-table .stat-cards{
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media screen and (max-width: 576px){
    .tab-table header{
      justify-content: flex-start;
      .tabs{
        position: relative;
        top: -10px;
        right: 0;
      }
    }
    
  }
</style>
