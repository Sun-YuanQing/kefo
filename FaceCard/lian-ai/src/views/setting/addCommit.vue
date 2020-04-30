<template>
  <div class="addCommit">
    <Header :title="types ==0?'新增项目/服务提成方案': types == 1 ? '新增产品提成方案' : '新增卡项提成方案'"></Header>
    <div class="wai_box">
      <div class="scheme">
        <label>方案名称</label>
        <Input v-model="filter.Name" :maxlength="15"  />
      </div>
      <div class="main_box">
        <div class="choseLine">
          <label>*</label>
          <Button type="dashed" @click="choseLeft" >{{types == 0 ? '选择适配项目/服务': types == 1 ? '选择适配产品' : '选择适配卡项'}}</Button>
          <Button type="dashed"  @click="choseRight">{{types == 0 ? '选择适配工种':'选择适配销售类型'}}</Button>
        </div>
        <div class="haveProduct" v-if="productTable.length>0" >
          <div class="havaTitle">{{types == 0 ? '适配项目/服务' : types == 1 ? '适配产品' : '适配卡项'}}</div>
          <div class="line-have">
            <div class="list-item" v-for="item in productTable" :key="item.Name" > 
              <div class="namelen">{{item.Name}}</div>
              <div class="price"><span class="unit">￥</span>{{types == 2 ? item.CardPrice.toFixed(2) : item.Price.toFixed(2)}}</div>
            </div>
          </div>
        </div>
        <div class="haveProduct" v-if="types == 0" >
          <div class="havaTitle">项目/服务基础提成</div>
        </div>
        <div class="product-table">
          <div class="yidong">
            <table style="width:100%">
              <colgroup>
                <col width="130">
                <col width="130">
                <col  v-if="SaleWayTable.length == 0" width="130" >
                <col v-else v-for="(item,index) in SaleWayTable" :key="index" width="130">
              </colgroup>
              <thead>
                <tr>
                  <th  class="product-center" colspan="1" rowspan="2">提成方式</th>
                  <th class="product-center" colspan="1" rowspan="2" >
                    {{types == 0 ? '项目/服务提成' : types == 1 ? '产品提成' : '卡项提成'}}
                  </th>
                  <th  class="product-center" :colspan="SaleWayTable.length" rowspan="1">
                    {{types == 0 ? '工种提成' : '销售类型提成占比'}}
                  </th>
                </tr>
                <tr>
                  <th class="product-center" v-for="item in SaleWayTable" 
                      :key="item.Id"  colspan="1" rowspan="1">{{item.Name}}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="product-center">
                    <Select v-model="filter.PushType">
                      <Option :value="1">固定提成</Option>
                      <Option :value="2">比例提成</Option>
                    </Select>
                  </td>
                  <td>
                    <div class="line_input">
                      <InputNumber :min="0" :max="999999999" v-model="filter.PushAmount"></InputNumber>
                      <div class="unit">{{filter.PushType == 1 ? '元' : '%'}}</div>
                    </div>
                  </td>
                  <td v-for="(item,index) in SaleWayTable.length" :key="index">
                    <div class="line_input">
                      <InputNumber :min="0" :max="999999999" v-model="getVal[index]"></InputNumber>
                      <div class="unit">{{filter.PushType == 1 ? '元' : '%'}}</div>
                    </div>
                  </td>
                  <td class="product-center" v-if="SaleWayTable.length==0">{{types == 0 ? '请优先选择工种' : '请优先选择销售类型'}}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
        <div class="explain" v-if="types == 0">说明：从项目拿出一定金额作为项目/服务提成，再把这个金额（项目/服务提成）自由分配给不同的工种（技师、造型师、助理等组成的工种提成）</div>
        <div class="explain" v-if="types == 1">说明：设置保存后，开单多选员工时按销售类型提成占比计算提成，只选1名员工，将默认按100%计算。个人产品提成=产品提成×销售类型提成占比</div>
        <div class="explain" v-else>说明：设置保存后，开单多选员工时按销售类提成占比计算提成，只选1名员工，将默认按100%计算。个人卡项提成=卡项售价x卡项提成×销售类型提成占比</div>
        <div  class="haveProduct" v-if="types == 0">
          <div class="havaTitle">项目/服务点客额外提成<span class="orNo">（可选填或不填）</span></div>
        </div>
        <div class="product-table" v-if="types == 0">
          <div class="yidong">
            <table style="width:100%">
              <colgroup>
                <col width="130">
                <col v-if="SaleWayTable.length == 0" width="130">
                <col v-else v-for="(item,index) in SaleWayTable" :key="index" width="130">
              </colgroup>
              <thead>
                <tr>
                  <th class="product-center" colspan="1" rowspan="2" >额外提成</th>
                  <th  class="product-center" :colspan="SaleWayTable.length" rowspan="1">点客额外工种提成</th>
                </tr>
                <tr>
                  <th class="product-center" v-for="item in SaleWayTable"
                    :key="item.Id" colspan="1" rowspan="1">{{item.Name}}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="product-center">
                    <Select v-model="filter.ExtendPushType">
                      <Option :value="1">固定提成</Option>
                      <Option :value="2">比例提成</Option>
                    </Select>
                  </td>
                  <td v-for="(item,index) in SaleWayTable.length" :key="index">
                    <div class="line_input">
                      <InputNumber :min="0" :max="999999999" v-model="getExtVal[index]" ></InputNumber>
                      <div class="unit">{{filter.ExtendPushType ==1 ? '元' : '%'}}</div>
                    </div>
                  </td>
                  <td class="product-center"  v-if="SaleWayTable.length==0" >请优先选择工种</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="explain" v-if="types == 0">说明：个人总提成=项目/服务基础提成+项目/服务点客额外提成（比如：“技师”被点客的提成=“技师”的基础提成+“技师”的点客额外提成）</div>
        <div class="saveLine">
          <Button @click="toBack">取消</Button>
          <Button type="primary" @click="saveBack">保存</Button>
        </div>
      </div>
    </div>

    <!-- 适配项目/服务,适配产品 -->
    <Modal :mask-closable="false" width="auto" v-if="types == 0 || types == 1"  v-model="adaptive" @on-cancel="iscancel">
      <div class="adaptive-title" slot="header" >
        <span>{{types == 0 ? '适配项目/服务' :'适配产品'}}</span>
      </div>
      <ul class="product-list publicA">
        <li v-for="(item,index) in Products" :key="index"
          @click="istrue(index)"  :class="{selected:item.choose}">
          <div class="namelen">{{item.Name}}</div><span class="rmb">￥</span>{{item.Price.toFixed(2)}}
        </li>
      </ul>
      <Spin size="large" fix v-if="spinShow1"></Spin>
      <div class="no_box" v-if="Products.length==0">
        <div v-if="types == 0">还没有项目，点击这里去<router-link class="no_add" to="/addProject">添加项目</router-link>吧！</div>
        <div v-else>还没有产品，点击这里去<router-link class="no_add" to="/addProduct" >添加产品</router-link>吧！</div>
      </div>
      <div slot="footer" class="adapt-foot" >
        <Button type="primary" @click="issave" >确认</Button>
      </div>
    </Modal>

    <!-- 适配卡项 -->
    <Modal :mask-closable="false" width="auto" v-if="types == 2" v-model="adaptive" @on-cancel="iscancel">
      <div class="adaptive-title" slot="header" >适配卡项</div>
      <div style="display: flex;">
        <ul class="cardType">
          <li v-for="(card,index) in cardTypes" :key="index" @click="selectCardType(card)"
              :class="{selected: card==cardType}">{{card}}</li>
        </ul>
        <div class="card-list-wrap">
          <div class="checkedAll">
              <p :class="{selected: checkedAll}" @click="selectedAll"></p>
              <span>全选</span>
          </div>
          <ul class="product-list publicA">
            <li v-for="(item,index) in Products" :key="index"
              @click="istrue(index)"  :class="{selected:item.choose}" 
              :style="{display: item.ClassType == cardType ? 'flex' : 'none'}">
              <div class="namelen">{{item.Name}}</div><span class="rmb">￥</span>{{item.CardPrice.toFixed(2)}}
            </li>
          </ul>
        </div>
        <div class="no_box" v-if="Products.length==0">
          <div>还没有卡项，点击这里去<router-link class="no_add" to="/cardManage">添加卡项</router-link>吧！</div>
        </div>
      </div>
      <Spin size="large" fix v-if="spinShow1"></Spin>
      <div slot="footer" class="adapt-foot" >
        <Button type="primary" @click="issave" >确认</Button>
      </div>
    </Modal>

    <!-- 适配工种 适配产品销售类型 -->
    <Modal :mask-closable="false"  width="auto" v-model="adaptType" @on-cancel="iscancel">
      <div class="adaptive-title" slot="header">
        <span>{{types == 0 ? '适配工种' :'适配产品销售类型'}}</span>
      </div>
      <ul class="product-list publicB">
        <li v-for="(item,index) in SaleWays" :key="index" 
            @click="totrue(index)" :class="{selected:item.choose}">
          <span>{{item.Name}}</span>
        </li>
      </ul>
      <Spin size="large" fix v-if="spinShow2"></Spin>
      <div class="no_box" v-if="SaleWays.length==0" >
        <div v-if="types == 0">还没有工种，点击这里去<router-link class="no_add" to="/staffPosition">添加工种</router-link>吧！</div>
        <div v-else>还没有销售类型，点击这里去<router-link class="no_add" to="/productSale">添加销售类型</router-link>吧！</div>
      </div>
      <div slot="footer" class="adapt-foot" >
        <Button type="primary" @click="tosave">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import Header from 'src/components/route-header'
import { constants } from 'crypto';
export default {
  components: { Header },
  data() {
    return {
      SaleWays: [],
      adaptive: false,
      Products: [],
      adaptType: false,
      productTable: [],
      SaleWayTable: [],
      getVal: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      getExtVal: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      types: 0,
      filter: {
        Name: '',
        PushType: 1,
        ExtendPushType: 1,
        PushAmount: 0,
        Percentage: [],
        ExtendPercentage: []
      },
      spinShow1: false,
      spinShow2: false,
      cardTypes: ["次卡","折扣卡","体验卡"],
      cardType: "次卡",
      checkedAll: false,
    }
  },
  watch: {
    cardType(val){
      this.cardChange();
    },
    Products:{
      handler(val){
        this.cardChange();
      },
      deep: true
    }
  },
  created() {
    this.types = this.$route.query.types;
    if (this.$route.query.id) {
      this.editId = this.$route.query.id;
      this.iniData();
    }
  },
  methods: {
    cardChange(){
      if(this.types==2){
        let arr = this.Products.filter(item => item.ClassType == this.cardType);
        if(arr.every(item => item.choose)){
          this.checkedAll = true;
        }else{
          this.checkedAll = false;
        }
      }
    },
    iniData() {
      let url = this.types == 0 ? '/PushMoney/GetPushMoneyById' : this.types == 1 ? '/PushMoney/GetProductPushMoneyById' : '/PushMoney/GetCardPushMoneyById';
      this.axios.post(url, { Id: this.editId })
        .then(res => {
          this.filter.Id = res.data.Data.Id;
          this.filter.Name = res.data.Data.Name;
          this.filter.Profession = this.types == 0 ? res.data.Data.Profession : res.data.Data.SaleWay;
          this.filter.Service = this.types == 0 ? res.data.Data.Service : this.types == 1 ? res.data.Data.Product : res.data.Data.CardProjct;
          this.filter.PushType = res.data.Data.PushType;
          this.filter.PushAmount = res.data.Data.PushAmount;
          this.filter.Percentage = res.data.Data.Percentage;
          this.getEditLeft();
          this.getEditRight();
          for (let x in this.filter.Percentage) {
            this.getVal[x] = this.filter.Percentage[x].Amount;
          }
          if (this.types == 0) {
            this.filter.ExtendPushType = res.data.Data.ExtendPushType;
            this.filter.ExtendPercentage = res.data.Data.ExtendPercentage;
            for (let y in this.filter.ExtendPercentage) {
              this.getExtVal[y] = this.filter.ExtendPercentage[y].Amount;
            }
          }
        })
    },
    getEditLeft() {
      let url = this.types == 0 ? '/Lable/GetServicesBySiteId' : this.types == 1 ? '/Lable/GetProductsBySiteId' : '/CardProject/GetKDCardList';
      this.axios.post(url, { PageIndex: 1, PageSize: 999999999 })
        .then(res => {
          if (res.data.Code == 0) {
            let dataArr = this.types == 0 ? res.data.Data.Services : this.types == 1 ? res.data.Data.Products : res.data.Data.Cards;
            let Service = this.filter.Service.split(',');
            if (Service.length > 0) {
              for (let xx in Service) {
                for (let yy in dataArr) {
                  if (dataArr[yy].Id == Service[xx]) {
                    this.productTable.push(dataArr[yy]);
                  }
                }
              }
            }
          } else {
            this.$Message.error(res.data.Message);
          }
        })
        .catch(e => {
          throw new Error(e)
        })
    },
    getEditRight() {
      let url = this.types == 0 ? '/Lable/GetProfessionsBySiteId' : '/Lable/GetSaleWaysBySiteId';
      this.axios.post(url)
        .then(res => {
          if (res.data.Code == 0) {
            let dataArr = this.types == 0 ? res.data.Data.Position : res.data.Data.SaleWays;
            let Profession = this.filter.Profession.split(',');
            if (Profession.length > 0) {
              for (let xx in Profession) {
                for (let yy in dataArr) {
                  if (dataArr[yy].Id == Profession[xx]) {
                    this.SaleWayTable.push(dataArr[yy]);
                  }
                }
              }
            }
          } else {
            this.$Message.error(res.data.Message);
          }
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    choseRight() {
      this.adaptType = true;
      this.spinShow2 = true;
      let url = this.types == 0 ? '/Lable/GetProfessionsBySiteId' : '/Lable/GetSaleWaysBySiteId';
      this.axios.post(url)
        .then(res => {
          if (res.data.Code == 0) {
            this.spinShow2 = false;
            this.SaleWays = [];
            let dataArr = this.types == 0 ? res.data.Data.Position : res.data.Data.SaleWays;
            dataArr.map((item, index) => {
              this.SaleWays.push(
                Object.assign({}, item, { choose: false })
              )
            })
            if (this.SaleWayTable.length > 0) {
              for (let xx in this.SaleWayTable) {
                for (let yy in this.SaleWays) {
                  if (this.SaleWays[yy].Id == this.SaleWayTable[xx].Id) {
                    this.SaleWays[yy].choose = true;
                  }
                }
              }
            }
            
          } else {
            this.$Message.error(res.data.Message);
          }
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    choseLeft() {
      this.adaptive = true;
      this.spinShow1 = true;
      let url = this.types == 0 ? '/Lable/GetServicesBySiteId' : this.types == 1 ? '/Lable/GetProductsBySiteId' : '/CardProject/GetKDCardList';
      this.axios.post(url, { PageIndex: 1, PageSize: 999999999 })
        .then(res => {
          this.spinShow1 = false;
          if (res.data.Code == 0) {
            this.Products = [];
            let dataArr = this.types == 0 ? res.data.Data.Services : this.types == 1 ? res.data.Data.Products : res.data.Data.Cards;
            dataArr.map((item, index) => {
              this.Products.push(
                Object.assign({}, item, { choose: false })
              )
            })
            if (this.productTable.length > 0) {
              for (let xx in this.productTable) {
                for (let yy in this.Products) {
                  if (this.Products[yy].Id == this.productTable[xx].Id) {
                    this.Products[yy].choose = true;
                  }
                }
              }
            }
            
          } else {
            this.$Message.error(res.data.Message);
          }
        })
        .catch(e => {
          throw new Error(e)
        })
    },
    selectedAll(){
      this.checkedAll = !this.checkedAll;
      // if(this.checkedAll){
        this.Products = this.Products.map(item => {
          if(item.ClassType == this.cardType){
            return { ...item,choose: this.checkedAll }
          }else{
            return { ...item }
          }
        })
        
      // }
    },
    selectCardType(val){
      this.cardType = val;
    },
    istrue(index) {
      this.Products[index].choose = !this.Products[index].choose;
    },
    totrue(index) {
      this.SaleWays[index].choose = !this.SaleWays[index].choose;
    },
    iscancel() {
      this.Products = [];
      this.SaleWays = [];
    },
    issave() {
      this.productTable = [];
      let productId = [];
      for (let x in this.Products) {
        if (this.Products[x].choose == true) {
          this.productTable.push(this.Products[x]);
          productId.push(this.Products[x].Id)
        }
      }
      this.filter.Service = productId.join();
      this.adaptive = false;
    },
    tosave() {
      this.SaleWayTable = [];
      let SaleWayId = []
      for (let x in this.SaleWays) {
        if (this.SaleWays[x].choose == true) {
          this.SaleWayTable.push(this.SaleWays[x]);
          SaleWayId.push(this.SaleWays[x].Id)
        }
      }
      this.filter.Profession = SaleWayId.join();
      this.adaptType = false;
    },
    toBack() {
      this.$router.back();
    },
    saveBack() {
      this.filter.Percentage = [];
      if (this.types == 0) { this.filter.ExtendPercentage = []; }
      for (let qq in this.SaleWayTable) {
        if (this.types == 0) {
          this.filter.Percentage.push({ Profession: this.SaleWayTable[qq].Id, Amount: this.getVal[qq] });
          this.filter.ExtendPercentage.push({ Profession: this.SaleWayTable[qq].Id, Amount: this.getExtVal[qq] })
        } else {
          this.filter.Percentage.push({ SaleWay: this.SaleWayTable[qq].Id, Amount: this.getVal[qq] });
        }
      }
      if (!this.filter.Name) {
        this.$Message.error("方案名称不为空！");
        return false;
      }
      if (!this.filter.PushAmount) {
        this.$Message.error(this.types == 0 ? '项目提成不为0！' : this.types == 1 ? '产品提成不为0！': '卡项提成不为0！');
        return false;
      }
      if (!this.filter.Service) {
        this.$Message.error(this.types == 0 ? '请选择适配项目/服务！' : this.types == 1 ? '请选择适配产品！' : '请选择适配卡项');
        return false;
      }
      if (!this.filter.Profession) {
        this.$Message.error(this.types == 0 ? '请选择适配工种！' : '请选择适配销售类型！');
        return false;
      }
      let all = 0;
      for (let x in this.filter.Percentage) {
        all += this.filter.Percentage[x].Amount;
      }
      if (this.filter.PushType == 1 && all != this.filter.PushAmount) {
        this.$Message.error(all > this.filter.PushAmount ? '分配的固定金额过多！' : '分配的固定金额较少！');
        return false;
      }
      if (this.filter.PushType == 2 && all != 100) {
        this.$Message.error(all > 100 ? '分配的比例超过100%！' : '分配的比例未达到100%！');
        return false;
      }
      let addUrl = "";
      let dataAll = {};
      if (this.types == 0) {
        addUrl = "/PushMoney/EditPushMoney"
        dataAll = { ...this.filter };
      } else if(this.types == 1){
          addUrl =  "/PushMoney/EditProductPushMoney";
          let editId = {};
          if (this.$route.query.id) {
            editId = { Id: this.editId }
          }
          dataAll = {
            ...editId,
            Name: this.filter.Name,
            Product: this.filter.Service,
            SaleWay: this.filter.Profession,
            PushType: this.filter.PushType,
            PushAmount: this.filter.PushAmount,
            Percentage: this.filter.Percentage
          };
      }else{
        addUrl = "/PushMoney/EditCardPushMoney";
        let editId = {};
          if (this.$route.query.id) {
            editId = { Id: this.editId }
          }
          dataAll = {
            ...editId,
            Name: this.filter.Name,
            CardProjct: this.filter.Service,
            SaleWay: this.filter.Profession,
            PushType: this.filter.PushType,
            PushAmount: this.filter.PushAmount,
            Percentage: this.filter.Percentage
          };
      }
      this.axios.post(addUrl, dataAll).then(res => {
        if (res.data.Code == 0) {
          this.$Message.success(this.$route.query.id ? "修改成功" : "添加成功");
          this.$router.back();
        } else {
          this.$Message.error(res.data.Message);
        }
      })
        .catch(e => {
          throw new Error(e)
        })
    }
  }
}
</script>
<style lang="less" scoped>
.addCommit {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  background: #f7f8fa;
  .wai_box {
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    .scheme {
      background: #ffffff;
      padding: 20px;
      label {
        font-weight: 700;
        font-size: 16px;
        margin-right: 10px;
      }
    }
    .main_box {
      background: #ffffff;
      padding: 0 20px;
      margin-top: 10px;
      .choseLine {
        padding-top: 30px;
        label {
          color: #ff9f27;
          font-size: 14px;
          font-weight: 700;
          line-height: 1;
          font-family: SimSun;
          margin-right: 8px;
        }
        button {
          color: #ff9f27;
          margin-right: 12px;
          border-color: #ff9f27;
        }
      }
      .haveProduct {
        margin-top: 30px;
        display: flex;
        .havaTitle {
          font-size: 16px;
          font-weight: 700;
          margin-right: 10px;
          height: 36px;
          line-height: 36px;
          white-space: nowrap;
          .orNo {
            color: #d8d8d8;
            margin-left: 4px;
          }
        }
        .line-have {
          display: flex;
          flex-wrap: wrap;
          .list-item {
            font-size: 13px;
            height: 36px;
            width: 160px;
            line-height: 36px;
            border: 1px solid #e4e4e4;
            margin-right: 10px;
            border-radius: 4px;
            margin-bottom: 10px;
            display: flex;
            justify-content: center;
            .namelen {
              max-width: 80px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .price {
              margin-left: 10px;
              .unit {
                font-size: 10px;
              }
            }
          }
        }
      }
      .product-table {
        color: #333;
        width: inherit;
        height: 100%;
        overflow: hidden;
        max-width: 100%;
        font-size: 14px;
        background-color: #fff;
        box-sizing: border-box;
        border: 1px solid #e4e4e4;
        margin-top: 30px;
        .yidong {
          overflow-x: scroll;
        }
        table {
          table-layout: fixed;
          thead {
            th {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              height: 40px;
              background-color: #f9f9f9;
              border-right: 1px solid #e4e4e4;
              border-bottom: 1px solid #e4e4e4;
              &:last-of-type {
                border-right: none;
              }
            }
          }
          tbody {
            td {
              height: 48px;
              border-right: 1px solid #e4e4e4;
              min-width: 110px;
              &:last-of-type {
                border-right: none;
              }
            }
          }
        }
      }
      .explain {
        margin-top: 18px;
        color: #999999;
        font-size: 12px;
      }
      .saveLine {
        margin-top: 170px;
        padding-bottom: 70px;
        display: flex;
        justify-content: center;
        button {
          width: 120px;
          height: 40px;
          &:first-of-type {
            margin-right: 20px;
            color: #999999;
          }
        }
      }
    }
  }
}
.adaptive-title {
  text-align: center;
  font-weight: 700;
  font-size: 18px;
}
.product-list {
  display: flex;
  flex-wrap: wrap;
  margin: 10px 0 50px;
  max-height: 300px;
  overflow-x: auto;
  li {
    width: 175px;
    height: 44px;
    background-color: #f7f8fa;
    border-radius: 4px;
    line-height: 44px;
    display: flex;
    justify-content: center;
    color: #333;
    cursor: pointer;
    margin-right: 15px;
    margin-bottom: 10px;
    border: 1px solid #e4e4e4;
    font-size: 14px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    &:last-of-type {
      margin-right: 0;
    }
    .rmb {
      font-size: 12px;
      margin-left: 15px;
    }
    .namelen {
      white-space: nowrap;
      width: 85px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .selected {
    border: 1px solid #3275f5;
    position: relative;
    overflow: hidden;
    &::after {
      content: "";
      width: 35px;
      height: 35px;
      border: 1px solid #3275f5;
      background-color: #3275f5;
      position: absolute;
      right: 0;
      bottom: -1px;
      transform: rotate(45deg) translate(72%);
      z-index: 7;
    }
    &::before {
      content: "✔";
      position: absolute;
      right: 1px;
      bottom: -15px;
      color: #fff;
      z-index: 9;
      font-size: 13px;
    }
  }
}
.cardType{
  width: 123px;
  font-size: 14px;
  li{
    width: 100%;
    line-height: 46px;
    text-align: center;
    cursor: pointer;
  }
  .selected{
    background-color: #F7F8FA;
  }
}
.card-list-wrap{
  background-color: #F7F8FA;
  padding-left: 20px;
  width: calc(100% - 123px);
  min-height: 300px;
  .checkedAll{
      display: flex;
      align-items: center;
      margin: 15px 10px 10px 0;
      p{
          width: 18px;
          height: 16px;
          border: 1px solid #c7c7c7;
          margin-right: 10px;
          border-radius: 2px;
      }
      .selected{
          position: relative;
          &::before{
              width: 18px;
              height: 16px;
              position: absolute;
              left: 0;
              top: 0;
              content: "";
              background-image: url(../../assets/selected-icon.svg);
              background-size: 100% 100%;
              
          }
      }
      span{
          color: #999;
          font-size: 16px;
      }
  }
  ul{
    li{
      width: 200px;
      .namelen{
        width: 100px;
      }
    }
  }
}
@media screen and (max-width: 576px) {
  .product-list {
    margin-bottom: 20px;
  }
  .publicA li {
    width: 100%;
    .namelen {
      width: 120px;
    }
    &:last-of-type {
      margin-right: 15px;
    }
  }
  .publicB li {
    width: 145px;
    &:nth-child(2n) {
      margin-right: 0;
    }
  }
  .addCommit .wai_box .main_box .saveLine {
    margin-top: 100px;
  }
}
.no_box {
  width: 100%;
  text-align: center;
  height: 300px;
  line-height: 300px;
  font-size: 14px;
  .no_add {
    color: #e94e27;
    border-bottom: 1px solid #e94e27;
  }
}
.adapt-foot {
  text-align: center;
  button {
    width: 200px;
    height: 40px;
    line-height: 40px;
  }
}
.product-center {
  text-align: center;
}
.line_input {
  display: flex;
  justify-content: center;
  align-items: center;
  .unit {
    background: #f9f9f9;
    border: 1px solid #e4e4e4;
    color: #999999;
    height: 33px;
    width: 33px;
    text-align: center;
    line-height: 33px;
    font-size: 14px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  .ivu-input-number {
    border: 1px solid #e4e4e4;
    border-radius: 0;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    border-right: none;
    height: 33px;
    line-height: 33px;
    font-size: 14px;
  }
}
.ivu-select {
  width: 110px;
}
</style>
<style>
.ivu-select-single .ivu-select-selection {
  width: 110px;
}
.ivu-modal {
  width: 610px;
}
.ivu-btn {
  padding: 0 7px;
}
</style>