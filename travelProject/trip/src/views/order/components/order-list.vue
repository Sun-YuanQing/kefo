<template>
  <div class="orderList">
    <div class="radioWrap">
      <RadioGroup
        v-model="postData.OrderState"
        type="button"
        @on-change="radioChange"
      >
        <Radio
          :label="type.value"
          v-for="type in typeList"
          :key="type.value"
        >{{type.label}}
          <Badge
            v-if="type.value==11 && unAuditNum>=0"
            :count="unAuditNum"
          >
            <a
              href="#"
              class="demo-badge"
            ></a>
          </Badge>
        </Radio>
      </RadioGroup>
    </div>
    <div class="infoWrap">
      <div class="head">
        <div>
          <span>查找</span>
          <Search
            v-model="postData.Key"
            placeholder="输入产品名称或联系人姓名、电话"
            @on-search="handleSearch"
          ></Search>
        </div>
        <div>
          <span>下单日期</span>
          <DatePicker
            type="date"
            placeholder="请选择下单日期"
            :value="postData.StartDate"
            :editable="false"
            @on-change="startDateChange"
          ></DatePicker>
        </div>
      </div>
      <div class="tableWrap">
        <div class="table">
          <div class="thead">
            <p style="width: 20%">商品名称</p>
            <p style="width: 15%">联系人</p>
            <p style="width: 20%">联系电话</p>
            <p style="width: 15%">实付款</p>
            <p style="width: 15%">订单状态</p>
            <p style="width: 15%">操作</p>
          </div>
          <div
            class="tbody"
            :style="{'max-height': $bus.clientHeight-382+'px' }"
          >
            <div
              class="spinContainer"
              v-if="loading"
            >
              <Spin fix></Spin>
            </div>
            <div
              v-if="tableData.length == 0 && isLoad"
              class="empty"
            >暂无数据！</div>
            <template v-if="tableData.length > 0">
              <div
                v-for="(row,index) in tableData"
                :key="index"
                class="tbodyWrap"
              >
                <div class="colspan">
                  <span>下单时间：{{row.CreateTime}}</span>
                  <span>订单编号：{{row.OrderNo}}</span>
                  <template v-if="row.DistId">
                    <span>分销员：{{row.DistNickName}}</span>
                    <span v-if="row.EstimateAmount>0">{{row.OrderState==30 ? '提成：' : '预估提成：'}}{{row.EstimateAmount}}</span>
                  </template>
                </div>
                <div
                  class="tableCont"
                  :class="row.OrderState=='0' ? 'activityEnd' : ''"
                >
                  <div
                    class="nameColumn"
                    style="width: 20%;"
                  >
                    <template v-if="row.IsSeck">
                      <span
                        class="character"
                        :style="{color: row.OrderState==0 ? '#999' : '#0899AC',
                                                        border: row.OrderState==0 ? '1px solid #999' : '1px solid #0899AC'}"
                      >秒</span>
                      <span>{{row.ProductName}}</span>
                    </template>
                    <template v-else-if="row.IsAssem && row.PayAmount > 0">
                      <span
                        class="character"
                        :style="{color: row.OrderState==0 ? '#999' : '#0899AC',
                                                        border: row.OrderState==0 ? '1px solid #999' : '1px solid #0899AC'}"
                      >拼</span>
                      <span>{{row.ProductName}}</span>
                    </template>
                    <span v-else>{{row.ProductName}}</span>
                  </div>
                  <div style="width: 15%">{{row.ContactName || '—'}}</div>
                  <div style="width: 20%">{{row.ContactPhone || '—'}}</div>
                  <div style="width: 15%">￥{{row.PayAmount}}</div>
                  <div style="width: 15%">
                    <span v-if="row.Type==5 && row.OrderState==11">待确认</span>
                    <span
                      v-else-if="row.Type==3 && row.OrderState==11"
                      class="red"
                    >待发货</span>
                    <span v-else-if="row.Type==3 && row.OrderState==21">已发货</span>
                    <span v-else-if="row.Type==5 && row.OrderState==21">待入住</span>
                    <span
                      v-else
                      class="red"
                    >{{row.OrderState  | orderState}}</span>
                  </div>
                  <div style="width: 15%">
                    <Button
                      v-if="row.OrderState == '10'"
                      type="text"
                      @click="isChange=true;changeId=row.OrderId;changeType=row.Type"
                    >改价</Button>
                    <Button
                      type="text"
                      style="padding: 0"
                      @click="$router.push({path: '/orderDetail',query: {id: row.OrderId}})"
                    >详情</Button>
                  </div>
                </div>
              </div>
            </template>
          </div>

        </div>
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

    <!-- 修改价格 -->
    <Modal
      v-model="isChange"
      width="450"
      :mask-closable="false"
      class="changeOrderModal"
      @on-cancel="changePrice=null;logisticsPrice=null"
    >
      <p
        slot="header"
        style="text-align:center;font-size: 18px;"
      >修改价格</p>
      <Form
        ref="editedForm"
        :label-width="90"
      >
        <template v-if="changeType==3">
          <FormItem label="商品售价">
            <InputNumber
              :max="999999999"
              :min="0"
              :precision="2"
              v-model="changePrice"
              style="width: 260px;"
            ></InputNumber>&nbsp;元
          </FormItem>
          <FormItem label="商品运费">
            <InputNumber
              :max="999999999"
              :min="0"
              :precision="2"
              v-model="logisticsPrice"
              style="width: 260px;"
            ></InputNumber>&nbsp;元
          </FormItem>
        </template>
        <FormItem
          v-else
          label="实付款"
        >
          <InputNumber
            :max="999999999"
            :min="0"
            :precision="2"
            v-model="changePrice"
            style="width: 260px;"
          >
          </InputNumber>&nbsp;元
        </FormItem>
      </Form>
      <div
        slot="footer"
        class="foot"
      >
        <!-- <Button  @click="changePrice=null;logisticsPrice=null">取消</Button> -->
        <Button
          type="primary"
          @click="editPrice"
        >保存</Button>
      </div>
      <Spin
        size="large"
        fix
        v-if="spinShow"
      ></Spin>
    </Modal>

  </div>
</template>
<script>
import Search from '@/components/search'
import {
  getOrderList,
  changePrice
} from '@/api/order.js'
export default {
  name: "orderList",
  components: {
    Search
  },
  props: ['type'],
  data() {
    return {
      postData: {
        TYPE: '',
        Key: '',
        StartDate: '',
        OrderState: '', //0.下架  1.上架  2.待上架  -1全部
        PageIndex: 1,
        PageSize: 10
      },
      loading: false,
      isLoad: false,
      total: 0,
      unAuditNum: 0,
      tableData: [],
      columns: [],
      typeList: [],
      commonTypeList: [{
        value: '',
        label: '全部订单'
      },
      {
        value: '10',
        label: '待付款'
      },
      {
        value: '11',
        label: '待审核'
      },
      {
        value: '21',
        label: '待出行'
      },
      {
        value: '30',
        label: '已完成'
      },
      {
        value: '0',
        label: '已关闭'
      },
        // {
        //     value: '22',
        //     label: '退款'
        // },
      ],
      hotelTypeList: [{
        value: '',
        label: '全部订单'
      },
      {
        value: '10',
        label: '待付款'
      },
      {
        value: '11',
        label: '待确认'
      },
      {
        value: '13',
        label: '审核不通过'
      },
      {
        value: '21',
        label: '待入住'
      },
      {
        value: '30',
        label: '已完成'
      },
      {
        value: '0',
        label: '已关闭'
      },
        // {
        //     value: '22',
        //     label: '退款'
        // },
      ],
      otherTypeList: [{
        value: '',
        label: '全部订单'
      },
      {
        value: '10',
        label: '待付款'
      },
      {
        value: '11',
        label: '待发货'
      },
      {
        value: '21',
        label: '已发货'
      },
      {
        value: '23',
        label: '待提货'
      },
      {
        value: '30',
        label: '已完成'
      },
      {
        value: '0',
        label: '已关闭'
      },
        // {
        //     value: '22',
        //     label: '退款'
        // },
      ],
      isChange: false,
      spinShow: false,
      changePrice: null,
      logisticsPrice: null,
      changeId: '',
      changeType: ""
    }
  },
  watch: {
    type(val) {
      this.postData.TYPE = val;
      this.postData.PageIndex = 1;
      this.statusChange(val)
      this.getData();
    }
  },
  created() {
    this.postData.TYPE = this.type;
    this.statusChange(this.type);
    this.getData();
  },
  methods: {
    sureType() {
      this.isAdd = false;
      this.$router.push({
        path: '/editProduct',
        query: {
          type: this.addType
        }
      })
    },
    statusChange(val) {
      this.postData.OrderState = ""
      if (val == 5) {
        this.typeList = this.hotelTypeList
      } else if (val == 3) {
        this.typeList = this.otherTypeList
      } else {
        this.typeList = this.commonTypeList
      }
    },
    radioChange(e) {
      this.postData.PageIndex = 1;
      this.getData();
    },
    getData() {
      this.loading = true;
      this.isLoad = false;
      getOrderList(this.postData).then(res => {
        this.loading = false;
        this.isLoad = true;
        this.tableData = res.Data.TraveOrders;
        this.total = res.Data.Total;
        this.unAuditNum = res.Data.UnAuditNum;
      }).catch(err => {
        this.loading = false;
      })
    },
    //页码切换
    handleChange(e) {
      this.postData.PageIndex = e;
      this.getData();
    },

    //每页条数切换
    pageSizeChanged(pageSize) {
      this.postData = {
        ...this.postData,
        PageIndex: 1,
        PageSize: pageSize
      };
      this.getData();
    },
    handleSearch() {
      this.postData = {
        ...this.postData,
        PageIndex: 1,
        PageSize: 10
      };
      this.getData();
    },
    startDateChange(e) {
      this.postData.StartDate = e;
    },
    editPrice() {
      // console.log(this.changeType)
      if (this.changePrice == null) {
        this.$Message.warning(this.changeType == 3 ? '请填写商品售价！' : '请填写价格！')
      } else if (this.changeType == 3 && this.logisticsPrice == null) {
        this.$Message.warning('请填写商品运费！')
      } else {
        this.spinShow = true;
        changePrice(this.changeId, this.changePrice, this.logisticsPrice).then(res => {
          this.spinShow = false;
          this.isChange = false;
          this.changePrice = null;
          this.logisticsPrice = null
          this.$Message.success('修改价格成功！')
        }).catch(err => {
          this.spinShow = false;
        })
      }
    },
    rowClassName(row, index) {
      if (row.OrderState == '0') {
        return 'activityEnd';
      } else {
        return '';
      }
    },

  }
}
</script>
<style lang="less">
.orderList {
  .ivu-table-wrapper {
    .ivu-table td.nameColumn div {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .ivu-table .activityEnd td {
      color: #999;
    }
  }

  .ivu-badge {
    top: -10px;
    right: -6px;

    .ivu-badge-count {
      height: 16px;
      line-height: 14px;
      min-width: 16px;
      font-size: 12px;
      padding: 0 2px;
    }
  }
}
</style>
<style lang="less" scoped>
.orderList {
  height: 100%;

  .radioWrap {
    padding: 20px 40px;
    border-bottom: 10px solid #f7f8fa;
  }

  .infoWrap {
    box-sizing: border-box;
    padding: 20px 15px 0;
    height: calc(100% - 82px);
    overflow: auto;

    .head {
      padding-left: 20px;
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

    @media screen and (max-width: 768px) {
      .head {
        flex-wrap: wrap;

        > div:first-of-type {
          margin-bottom: 10px;
        }
      }
    }

    .ivu-table-wrapper {
      .ivu-btn {
        color: #3275f5;
      }
    }
  }
}

.table {
  width: 100%;
  margin-top: 10px;
  min-width: 900px;
  overflow-x: auto;
  border-bottom: 1px solid #e4e4e4;

  .ivu-btn {
    color: #3275f5;
  }

  .activityEnd {
    color: #999;
  }

  .spinContainer {
    display: inline-block;
    width: 100%;
    height: 200px;
    position: relative;
    border: 1px solid #eee;
    border-bottom: none;
  }

  .thead {
    width: 100%;
    display: flex;

    > p {
      padding: 0 18px;
      height: 48px;
      line-height: 48px;
      background-color: #eee;
      text-align: left;
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .tbody {
    width: 100%;
    overflow: auto;

    .empty {
      text-align: center;
      line-height: 48px;
      height: 48px;
    }

    .tbodyWrap {
      margin-top: 15px;
      border: 1px solid #e4e4e4;
      border-radius: 4px;
    }

    .tableCont {
      width: 100%;
      border-top: 1px solid #e4e4e4;
      display: flex;

      > div {
        padding: 0 18px;
        text-align: left;
        line-height: 60px;
        height: 60px;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .activityEnd > div {
      color: #999;
    }

    .colspan {
      width: 100%;
      padding: 0 18px;
      text-align: left;
      line-height: 40px;
      height: 40px;
      color: #999;
      background-color: #f9f9f9;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      span {
        margin-right: 20px;

        &:nth-of-type(2) {
          margin-right: 40px;
        }
      }
    }

    .character {
      width: 10px;
      height: 14px;
      box-sizing: border-box;
      font-size: 12px;
      border-radius: 5px;
      padding: 0 2px;
      margin-right: 3px;
      margin-bottom: 5px;
      // display: inline-block;
    }
  }
}

.changeOrderModal {
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
}
</style>