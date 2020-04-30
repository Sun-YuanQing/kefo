<template>
  <div class="bill">
    <Header title="明细记录"></Header>
    <div  ref="tableWrap"  class="table-wrap" >
      <div class="title">
        <p>明细记录</p>
        <div class="filter">
          <Cascader :data="typeList"  @on-change="typeChange" trigger="hover" ></Cascader>
          <DatePicker type="month" v-model="propsData.Date" :editable="false" @on-change="dateChange" style="width: 200px" ></DatePicker>
        </div>
      </div>

      <div style="flex: 1; overflow: scroll">
        <Table :columns="columns" :data="tableData" :max-height="maxHeight" :loading="loading" stripe  disabled-hover></Table>
      </div>
      <div class="tatal-amount">合计：{{totalAmount}}</div>
      <footer>
        <Pager :total="total"  @on-change="onPageChange"></Pager>
      </footer>
    </div>
  </div>
</template>

<script>
import Header from "src/components/route-header";
import Pager from "src/components/pager";
export default {
  components: { Header, Pager },
  data() {
    const child = [
      {
        value: "1",
        label: "扣款"
      },
      {
        value: "2",
        label: "现金"
      },
      {
        value: "3",
        label: "微信"
      },
      {
        value: "4",
        label: "支付宝"
      },
      {
        value: "5",
        label: "APP"
      },
      {
        value: "6",
        label: "小程序"
      }
    ];
    const list = [
      {
        value: "1",
        label: "收银",
        children: child.slice(1, 4)
      },
      {
        value: "2",
        label: "充值",
        children: child.slice(1, 6)
      }
    ];
    return {
      loading: false,
      maxHeight: 300,
      total: 10,
      totalAmount: 0,
      propsData: {
        PageIndex: "1",
        PageSize: "10",
        Date: "",
        LevelOne: "-1", // 1 收款 2. 消耗
        LevelTwo: "-1", // 1.收银 2.充值
        LevelThree: "-1" // 1.扣卡 2. 现金 3.微信 4.支付宝   5.APP 6.小程序
      },
      columns: [
        {
          title: "交易编号",
          key: "RecordNo",
          minWidth: 170,
          fixed: "left"
        },
        {
          title: "用户编号",
          key: "Code",
          minWidth: 170
        },
        {
          title: "手机号",
          key: "Phone",
          minWidth: 160
        },
        {
          title: "姓名",
          key: "Name",
          minWidth: 100
        },
        {
          title: "类型",
          key: "Type",
          minWidth: 120
        },
        {
          title: "方式",
          key: "SourceType",
          minWidth: 120
        },
        {
          title: "金额(元)",
          key: "Amount",
          minWidth: 120
        },
        {
          title: "时间",
          key: "CreatedTime",
          minWidth: 190
        }
      ],
      tableData: [],
      typeList: [
        {
          value: "1",
          label: "收款",
          children: list
        },
        {
          value: "2",
          label: "消耗",
          children: child.slice(0, 1)
        }
      ]
    };
  },
  created() {
    var height =
      document.documentElement.clientHeight || document.body.clientHeight;
    this.maxHeight = height - 250;
    this.propsData.Type = -1;
    this.onPageChange({ PageIndex: 1, PageSize: 10 });
  },
  methods: {
    onPageChange({ PageIndex, PageSize }) {
      this.loading = true;
      this.propsData = { ...this.propsData, PageIndex, PageSize };
      const url = "/Report/GetConsumeRecordsBySourceType";
      this.$axios
        .post(url, this.propsData)
        .then(res => {
          this.loading = false;
          if (res.data.Code === "0") {
            const data = res.data.Data;
            this.tableData = data.Statistics;
            this.total = data.Total;
            this.totalAmount = data.TotalAmount;
          } else {
            this.$Message.error(res.data.Message);
          }
        })
        .catch(e => {
          throw new Error(e);
        });
    },
    dateChange(e) {
      this.propsData.Date = e;
      this.onPageChange({ PageIndex: 1, PageSize: 10 });
    },
    typeChange(e) {
      // "LevelOne": "0" ,// 1 收款 2. 消耗
      // "LevelTwo": "0",  // 1.收银 2.充值
      // "LevelThree": "0" // 1.扣卡 2. 现金 3.微信 4.支付宝   5.APP 6.小程序
      if (e.length == 2) {
        this.propsData.LevelOne = e[0];
        this.propsData.LevelTwo = "0";
        this.propsData.LevelThree = e[1];
      } else {
        this.propsData.LevelOne = e[0];
        this.propsData.LevelTwo = e[1];
        this.propsData.LevelThree = e[2];
      }

      this.propsData = { ...this.propsData, PageIndex: 1, PageSize: 10 };
      this.onPageChange({ PageIndex: 1, PageSize: 10 });
    }
  }
};
</script>
<style lang="less">
.bill .ivu-table th {
  background-color: #eee;
}
@media screen and(max-width: 576px){
  .bill .ivu-input-wrapper,.bill .ivu-date-picker{
      width: 160px !important;
    }
     
}
</style>

<style lang="less" scoped>
.bill {
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #f7f8fa;
}
.tatal-amount {
  background-color: #f8f8f9;
  line-height: 40px;
  font-weight: 700;
  display: flex;
  padding-right: 22%;
  justify-content: flex-end;
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
    p {
      font-size: 16px;
      font-weight: 700;
    }
    .filter {
      display: flex;
      margin-right: 10px;
      .ivu-date-picker {
        margin-left: 10px;
      }
    }
  }
}
@media screen and(max-width: 576px){
  .table-wrap .title p{
    display: none;
  }
}
</style>

