<template>
    <div class="fullscreen checkOut">
        <Header title="结账"></Header>
        <div class="content">
            <div class="left">
                <div class="time">开单时间：{{time}}</div>
                <div class="leftContent">
                    <ul class="orderList">
                        <li v-for="(order,index) in orderList" :key="index">
                            <span>{{order.ItemName}}</span>
                            <span>x{{order.Number}}</span>
                            <span>￥{{order.Price.toFixed(2)}}</span>
                        </li>
                    </ul>
                    <div class="input-box input-box2">
                        <span>优惠券:</span>
                        <div @click="handleSelectDiscount" class="input">
                        <p>{{selectDiscount.name || '无'}}</p>
                        <Icon type="ios-arrow-forward" color="#999"></Icon>
                        </div>
                    </div>
                    <div class="concessions">
                        <span>优惠:</span>
                        <ul>
                            <li v-if="postData.Discount">
                                <span class="icon-font purple">折</span>
                                <p>会员{{postData.Discount}}折</p>
                                <p class="price">-￥{{postData.DiscountAmount}}</p>
                            </li>
                            <li v-if="selectDiscount.MyCouponId">
                                <span class="icon-font yellow">券</span>
                                <p>{{selectDiscount.name}}</p>
                                <p class="price">-￥{{selectDiscount.PreferentialAmount}}</p>
                            </li>
                        </ul>
                    </div>
                    <div class="concessions">
                        <span>赠送:</span>
                        <ul>
                            <li v-if="postData.RedAmount">
                                <!-- <span class="icon-font red">包</span> -->
                                <p>{{postData.RedAmount}}元红包</p>
                            </li>
                            <li v-if="sendDiscount.CouponId">
                                <!-- <span class="icon-font yellow">券</span> -->
                                <p>满{{sendDiscount.Amount}}减{{sendDiscount.PreferentialAmount}}优惠券</p>
                            </li>
                        </ul>
                    </div>
                    
                </div>
                <div class="total">应付金额：<amount :value="postData.ActualAmount"/></div>
                
            </div>
            <div class="right">
                <div class="payWay">支付方式</div>
                <ul class="payList">
                    <li v-for="(pay,index) in payList" :key="index" 
                        :class="{ selected: pay.value === postData.SourceType }" 
                        @click="sourceTypeChange(pay)">
                        <p>{{pay.label}}</p>
                        <p v-if="index==0 && postData.totalAmount>=0">余额：￥{{postData.totalAmount.toFixed(2)}}</p>
                    </li>
                </ul>
                <Button class="buttonWrap"  type="text" @click="checkOut" :loading="cashLoading">结账</Button>
            </div>
        </div>
        <!-- 优惠券 -->
        <Modal :mask-closable="false" v-model="showDiscount">
            <p slot="header" class="title">优惠券</p>
            <ul class="discount">
                <li @click="onDiscountSelect(item)" class="discount-item" :class="{ 'discount-disabled': item.disabled }"
                    v-for="(item) in discountList" :key="item.MyCouponId">
                <div v-if="!item.disabled" class="checkmark">
                    <img v-if="selectDiscount.MyCouponId === item.MyCouponId" src="@/assets/checkmark.svg" alt="">
                </div>
                <div class="count">￥<span class="big-num">{{item.PreferentialAmount}}</span></div>
                <ul>
                    <li class="discount-name">{{item.name}}</li>
                    <li class="discount-date">有效期: {{item.StartTime}}~{{item.DueTime || '无'}}</li>
                    <li v-if="!item.disabled" class="discount-warn">还有{{item.left}}天到期</li>
                </ul>
                </li>
            </ul>
            <div slot="footer" class="modal-buttons">
                <Button @click="withoutDiscount">不使用优惠券</Button>
                <Button @click="handleConfirmDiscount" type="primary" style="margin-left: 30px;">确定使用</Button>
            </div>
        </Modal>

        <Modal v-model="showSuccess" :mask-closable="false" :closable="false">
            <p slot="header" class="title">结账成功</p>
            <div class="charge-success">
                <h3>实付金额：
                <amount :value="postData.ActualAmount"/>
                </h3>
            </div>
            <div slot="footer" class="modal-buttons">
                <Button type="primary" @click="showBill=true">查看单据</Button>
                <Button to="/index" style="margin-left: 20px;" type="primary">返回首页</Button>
            </div>
        </Modal>

        <!-- 账单详情 -->
        <Modal v-model="showBill" :mask-closable="false" :footer-hide="true"  @on-cancel="showBill = false">
            <div class="billCont">
                <div class="info">
                    <img :src="photo || require('../../assets/avatar.svg')" alt="" >
                    <span>{{ postData.Phone }}</span>
                </div>
                <div class="projectWrap">
                    <ul v-for="(order,index) in postArr" :key="index" class="projectList">
                        <li>{{order.ItemType=="1" ? "项目/服务" : "产品"}}</li>
                        <li class="name">
                            <span >{{order.ItemName}}</span>
                            <span> ￥{{order.Price.toFixed(2)}}</span>
                        </li>
                        <!-- <template v-if="order.ServiceStaff.length > 0"> -->
                        <li v-for="(itm,indx) in order.ServiceStaff" :key="indx" class="staffList">
                            <span>{{itm.EmployeeName}}</span>
                            <span v-if="order.ItemType=='1'" 
                                    :style="{'background-color':itm.ServiceType==2 ? '#FFF6EA' : '#F7F8FA','color':itm.ServiceType==2 ? '#FF9F27' : '#999999'}" 
                                    class="point">{{itm.ServiceType==2 ? '点' : '轮'}}</span>
                            <span v-if="order.ItemType=='1'" >{{itm.ProfessionName}}</span>
                            <span v-if="order.ItemType=='2'" >{{itm.SaleWayName}}</span>
                        </li>
                        <!-- </template> -->
                    </ul>
                </div>
                <div class="sum">消费金额：<span>￥{{postData.ActualAmount.toFixed(2)}}</span></div>
                <ul class="other">
                    <li>
                        <p>支付方式</p>
                        <p>{{payDetail.PayType}}</p>
                    </li>
                    <li>
                        <p>消费时间</p>
                        <p>{{payDetail.PayTime}}</p>
                    </li>
                    <li>
                        <p>流水单号</p>
                        <p>{{payDetail.SerialNumber}}</p>
                    </li>
                </ul>
            </div>
        </Modal>
    </div>
</template>
<script>
import Header from '@/components/route-header'
let PayList = [{
                    value: '1',
                    label: '储值支付'
                },{
                    value: '2',
                    label: '现金'
                },{
                    value: '3',
                    label: '微信'
                },{
                    value: '4',
                    label: '支付宝'
            }]
export default {
    name: "checkOut",
    components: { Header},
    data(){
        return {
            userId: "",
            faceId: "",
            isTraveler: "",
            time: "2019.09.09 09:22",
            orderList: [],
            showDiscount: false,
            selectDiscount: {},
            discountList: [],
            sendDiscountList: [],
            sendDiscount: '',
            showSuccess: false,
            cashLoading: false,
            postArr: [],
            postData: {
                Amount: 0,    ////原本金额
                CardId: '',
                UserId: '',
                MyCouponId: '',  //使用的优惠券id
                CouponId: '',    //赠送的优惠券id
                Discount: '',    //折扣
                DiscountAmount: 0,  //折扣优惠的金额
                RedPacketId: '',    //红包id  传详情返回的数据
                RedAmount: '',      //红包金额 传详情返回的数据
                ActualAmount: 0 ,    //实际支付金额  前端控制不能低于当前的余额
                SourceType:  '',   //1.储值支付  2.现金 3.微信 4.支付宝
                EmployeeId: ''
            },
            
            billList: {},
            showBill: false,
            payDetail: {},
            photo: ""
        }
    },
    computed: {
        // !userId || isTraveler=='1'
        payList(){
            if(!this.userId || this.isTraveler=='1'){
                return PayList.slice(1);
            }else{
                return PayList;
            }
        }
        
    },
    created(){
        this.userId = this.$route.query.userId;
        this.faceId = this.$route.query.faceId;
        this.isTraveler = this.$route.query.isTraveler;
        this.photo = this.$route.query.photo
        if(this.userId && this.isTraveler=='0'){
            this.getInfo();
        }else{
            this.getBeautyOrder();
        }
    },
    methods: {
        //订单列表
        getBeautyOrder(){
            const url = '/UserFace/GetBeautyOrderStatus';
            const postData = {
                FaceId: this.faceId,
                UserId: this.userId
            };
            this.$axios.post(url, postData).then(res => {
                if (res.data.Code === '0') {
                    const data = res.data.Data;
                    if(data.Status){
                        this.postArr = data.Items;
                        this.getNewArr(JSON.parse(JSON.stringify(data.Items)));
                        this.time = data.OrderTime;
                        this.postData.Amount = data.TotalAmount;
                        this.handleAmountChange(this.postData.Amount);
                    }
                    
                } else {
                    this.$Message.error(res.data.Message);
                }
            }).catch(e => {
                throw new Error(e)
            })
        },

        //去重
        getNewArr(arr){
            let newArr = arr.map(ele => {
                 Reflect.deleteProperty(ele,'ServiceStaff');
                 ele.Number = 0;
                 return ele;
            });
            // let newArr2 = [...new Set(newArr)];

            let newArr2 = [];
            for(var i = 0; i < newArr.length; i++) {
                let flag = newArr2.find(item => item.ItemId==newArr[i].ItemId && item.Price==newArr[i].Price && item.ItemType==newArr[i].ItemType)
                if(!flag){
                    newArr2.push(newArr[i]);
                };
            }
            
            for(let i=0;i<newArr.length;i++){
                for(let j=0;j<newArr2.length;j++){
                    if(newArr[i].ItemId == newArr2[j].ItemId && newArr[i].Price == newArr2[j].Price && newArr[i].ItemType == newArr2[j].ItemType){
                        newArr2[j].Number++;
                    }
                }
            }
            this.orderList = newArr2;
            
            // console.log('mmm',newArr2,totalPrice)
        },
        //会员信息
        getInfo() {
            const url = '/CollectMoney/GetCollectDetail'
            this.$axios.post(url, { UserId: this.userId }).then(res => {
                if (res.data.Code === '0') {
                    const data = res.data.Data;
                    this.postData = {
                        ...data,
                        Amount: 0,
                        totalAmount: data.Amount,
                        CouponId: '',
                        DiscountAmount: '',
                        ActualAmount: 0
                    };
                    this.sendDiscountList = data.Coupons.sort((a, b) => b.LimitAmount - a.LimitAmount);
                    this.discountList = data.MyCoupons.map(item => {
                        return {
                            ...item,
                            name: `满${item.Amount}元减${item.PreferentialAmount}元`,
                            disabled: item.Days <= 0,
                            left: Math.floor((new Date(item.DueTime) - Date.now()) / (24 * 3600 * 1000))
                        }
                    })
                    this.getBeautyOrder(); //获取订单信息
                } else {
                    this.$Message.error(res.data.Message);
                }
            }).catch(e => {
                throw new Error(e)
            })
        },
        
        sourceTypeChange(item){
            this.$set(this.postData,'SourceType',this.postData.SourceType == item.value ?  '' : item.value)
        },
        handleSelectDiscount() {
            !this.selectDiscount.MyCouponId && (this.selectDiscount = this.discountList.find(item => !item.disabled) || {});
            this.showDiscount = true
        },
        onDiscountSelect(item) {
            if (!item.disabled) {
            this.selectDiscount = item
            }
        },
        withoutDiscount() {
            this.selectDiscount = {};
            this.showDiscount = false;
            this.handleAmountChange(this.postData.Amount, false)
        },
        handleConfirmDiscount() {
            this.showDiscount = false;
            this.handleAmountChange(this.postData.Amount, true)
        },
        handleAmountChange(e, discount = true) {
            let actual = e;
            this.postData.Amount = e;
            //折扣，如8折
            if (this.postData.Discount) {
            this.postData.DiscountAmount = (e * (10 - this.postData.Discount) / 10).toFixed(2)
            actual -= this.postData.DiscountAmount
            }
            //可以赠送的优惠券：sendDiscountList按升序排列的可以赠送的优惠券，匹配一个符合的可以赠送的优惠券
            if (this.sendDiscountList.length) {
            this.sendDiscount = this.sendDiscountList.find(item => item.LimitAmount <= e) || {}
            this.postData.CouponId = this.sendDiscount.CouponId
            }
            //我的优惠券：自动匹配 我的优惠券中符合要求的优惠券
            if (this.discountList.length && discount) {
            this.discountList = this.discountList.map(item => ({
                ...item,
                disabled: item.Amount > actual
            })).sort((a, b) => a.disabled - b.disabled || b.Amount - a.Amount)
            this.selectDiscount = this.discountList.filter(item => !item.disabled).find(item => item.Amount <= actual) || {}
            this.postData.MyCouponId = this.selectDiscount.MyCouponId;
            actual -= this.selectDiscount.PreferentialAmount || 0;
            }else if (this.selectDiscount.MyCouponId) {
            //自己选的优惠券
            this.postData.MyCouponId = this.selectDiscount.MyCouponId;
            actual -= this.selectDiscount.PreferentialAmount;
            }else{
            //没有选优惠券
            this.postData.MyCouponId = this.selectDiscount.MyCouponId;
            }
            this.postData.ActualAmount = actual;
            // console.log('this.postData',this.postData)
        },
        checkOut(){
            if(!this.postData.SourceType){
                 return this.$Message.error('请选择支付方式')
            }else if (this.postData.SourceType=='1' && this.postData.ActualAmount > this.postData.totalAmount) {
                return this.$Message.error('支付金额不能大于余额')
            }else{
                this.$Modal.confirm({
                    title: '请确认是否结账',
                    loading: true,
                    onOk: () => {
                    if(this.userId && this.isTraveler=='0'){
                        this.confirmCash(); //会员
                        
                    }else{
                        this.offlineCollect(); //非会员
                    }
                        
                    }
                })
            }
        },
        
        // 会员收银
        confirmCash(){
            this.cashLoading = true;
            const url = '/CollectMoney/AddCollect';
            const postData = {
                ...this.postData,
                BeautyOrder: {
                    UserId: this.userId, 
                    FaceId: this.faceId, 
                    Items:  this.postArr
                }
                
            }
            this.$axios.post(url, postData).then(res => {
                this.cashLoading = false;
                this.$Modal.remove();
                if (res.data.Code === '0') {
                    this.showSuccess = true;
                    this.payDetail = res.data.Data.PayDetail;
                } else {
                    this.$Message.error(res.data.Message);
                }
            }).catch(e => {
                this.$Modal.remove();
                this.cashLoading = false;
                throw new Error(e)
            })
        },
        //非会员收银
        offlineCollect (){
            this.cashLoading = true;
            const url = '/CollectMoney/AddOfflineCollect';
            let postData = {
                ActualAmount: this.postData.Amount, // 实际支付金额  前端控制不能低于当前的余额
                SourceType : this.postData.SourceType , //1.储值支付  2.现金 3.微信 4.支付宝  》》》值不能为1
                EmployeeId: this.postData.EmployeeId,
                BeautyOrder: {
                    UserId: this.userId, 
                    FaceId: this.faceId, 
                    Items:  this.postArr
                }
            }
            this.$axios.post(url, postData).then(res => {
                this.cashLoading = false;
                this.$Modal.remove();
                if (res.data.Code === '0') {
                    this.showSuccess = true;
                    this.payDetail = res.data.Data.PayDetail;
                } else {
                    this.$Message.error(res.data.Message);
                }
            }).catch(e => {
                this.$Modal.remove();
                this.cashLoading = false;
                throw new Error(e)
            })
        }
    }

}
</script>
<style lang="less" scoped>
.charge-success {
    text-align: center;
    padding: 0 0 10px;

    h3 {
      font-size: 20px;
        
      span {
        color: #E94E27;
      }
    }
}

.discount {
    padding: 10px 0 0;
    width: 100%;
    height: 60vh;
    overflow-y: scroll;

    .discount-item {
      width: 401px;
      height: 141px;
      margin: 0 auto 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      background: url("../../assets/count-bg.png") no-repeat;
      background-size: 100% 100%;
      position: relative;
      padding-left: 50px;

      .checkmark {
        position: absolute;
        right: 0;
        top: 0;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        box-shadow: 0 0 0 1px #333;
        background-color: #fff;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .count {
        color: #F5C274;
        font-size: 24px;
        padding-right: 35px;
      }

      .discount-name {
        font-size: 16px;
      }

      .discount-date {
        font-size: 12px;
        color: #999;
        padding: 5px 0;
      }

      .discount-warn {
        font-size: 12px;
        color: #E94E27;
      }
    }

    .discount-disabled {
      filter: saturate(0);
    }
  }


.content:after{
    display:block;
    clear:both;
    content:"";
    visibility:hidden;
    height:0
 }
.content{
    zoom:1;
    font-size: 16px;
    .right{
        float: left;
        width: 480px;
        height: 100%;
        overflow: auto;
        padding: 0 30px 70px;
        box-sizing: border-box;
        border-left: 1px solid #e4e4e4;
        position: relative;
        .payWay{
            line-height: 40px;
        }
        .payList{
            padding-top: 20px;
            width: 100%;
            box-sizing: border-box;
            display: flex;
            flex-wrap: wrap;
            li{
                width: 44%;
                margin-bottom: 6%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background-color: #F7F8FA;
                text-align: center;
                border-radius: 8px;
                height: 80px;
                border: 1px solid #e4e4e4;
                cursor: pointer;
                &:nth-of-type(n+1){
                    margin-right: 6%;
                }
                p:nth-of-type(2){
                    font-size: 12px;
                    color: #999;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    width: 100%;
                }
            }
            .selected {
                border: 1px solid #3275F5;
                position: relative;
                overflow: hidden;
                &::after{
                    content: '';
                    width: 35px;
                    height: 35px;
                    border: 1px solid #3275F5;
                    background-color: #3275F5;
                    position: absolute;
                    right: 0;
                    bottom: -1px;
                    transform: rotate(45deg) translate(72%);
                    z-index: 7;
                    
                }
                &::before{
                    content: '✔';
                    position: absolute;
                    right: 1px;
                    bottom: 0px;
                    color: #fff;
                    z-index: 9;
                    font-size: 13px;
                    color: #fff;
                }
            }
        }
        .buttonWrap{
            width: 480px;
            position: fixed;
            bottom: 0px;
            // left: 0px;
            right: 0px;
            background-color: #3275F5;
            height: 60px;
            line-height: 60px;
            text-align: center;
            font-size: 18px;
            color: #fff;
            border-radius: 0;
        }
    }
    .left{
        float: left;
        justify-content: center;
        width: calc(100% - 480px);
        box-sizing: border-box;
        height: 100%;
        padding-bottom: 20px;
        // overflow: auto;
        position: relative;
        .total{
            position: absolute;
            width: 100%;
            bottom: 0;
            text-align: right;
            padding-right: 30px;
            line-height: 60px;
            z-index: 999999999;
        }
        .time{
            line-height: 40px;
            border-bottom: 1px solid #e4e4e4;
            padding: 0 30px;
        }
        .leftContent{
            padding: 0 30px;
            box-sizing: border-box;
            height: calc(100% - 110px);
            overflow: auto;
            .orderList{
                margin-top: 20px;
                li{
                    display: flex;
                    justify-content: space-between;
                    line-height: 60px;
                    background-color: #F7F8FA;
                    margin-bottom: 10px;
                    font-weight: 700;
                    padding: 0 30px;
                    span{
                        &:nth-of-type(1){
                            width: 40%;
                            text-align: left;
                        }
                        &:nth-of-type(2){
                            width: 20%;
                            text-align: center;
                        }
                        &:nth-of-type(3){
                            width: 40%;
                            text-align: right;
                        }
                    }
                }
            }
            .input-box {
                width: 100%;
                height: 50px;
                margin-bottom: 16px;
                color: #999;
                position: relative;

                > span {
                position: absolute;
                z-index: 2;
                left: 12px;
                line-height: 50px;
                color: #333;
                }

                .input {
                padding-right: 12px;
                height: 50px;
                width: 100%;
                border: 1px solid #e4e4e4;
                border-radius: 4px;
                position: absolute;
                box-shadow: none;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                color: #333;
                }
            }
            .input-box2 {
                span{
                font-size: 15px;
                color: #666;
                }
                .input{
                color: #333;
                font-size: 15px;
                }
            }
            .concessions {
        font-size: 16px;
        color: #999;
        display: flex;
        padding-bottom: 10px;
        
        ul {
          color: #666;
          list-style: none;
          padding-left: 8px;
          flex: 1;

          li {
            display: flex;
            align-items: center;

            .icon-font {
              font-size: 10px;
              line-height: 18px;
              text-align: center;
              width: 18px;
              height: 18px;
              border-radius: 4px;
              margin-right: 4px;

              &.purple {
                color: rgb(104, 105, 246);
                background-color: rgba(104, 105, 246, .3);
              }

              &.yellow {
                color: rgb(255, 159, 39);
                background-color: rgba(255, 159, 39, .3);
              }

              &.red {
                color: rgb(232, 120, 86);
                background-color: rgba(232, 120, 86, .3);
              }
            }

            .price {
              margin-left: auto;
            }
          }
        }
      }
        }
    }
}
.billCont{
    position: relative;
    margin-bottom: 10px;
    &::before {
          content: '';
          height: 10px;
          background-image: url("../../assets/wave.png");
          background-size: 100% 10px;
          background-repeat: repeat-x;
          position: absolute;
          bottom: -30px;
          left: -16px;
          right: -16px;
        }
        .info{
            font-size: 18px;
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            img{
                border-radius: 50%;
                background: #e4e4e4;
                width: 44px;
                margin-right: 15px;
            }
        }
    .sum{
        text-align: right;
        border-bottom: 1px solid #E4E4E4;
        line-height: 3;
        span{
            font-weight: 700;
            font-size: 18px;
        }
    }
    .other{
        margin-top: 15px;
        li{
            color: #999;
            line-height: 1.5;
            display: flex;
            justify-content: space-between;
        }
    }
    .projectWrap{
        max-height: 280px;
        overflow-y: auto;
        .projectList{
            padding: 10px 20px;
            background-color: #F7F8FA;
            font-size: 12px;
            color: #666;
            border-radius: 4px;
            margin-bottom: 10px;
            li{
                display: flex;
                justify-content: space-between;
                line-height: 1.2;
                &:first-of-type{
                    line-height: 1.6;
                }
                &:nth-of-type(3){
                    padding-top: 6px;
                }
                &:last-of-type{
                    padding-bottom: 6px;
                }
            }
            .staffList{
                padding: 3px 15px;
                background-color: #fff;
                span:not(.point){
                    width: 40%;
                }
                span:last-of-type{
                    text-align: right;
                }
                .point{
                    border-radius: 4px;
                    padding: 2px;
                    font-size: 12px;
                }
            }
            .name{
                font-size: 14px;
                color: #333;
                font-weight: 700;
                margin-bottom: 5px;
            }  
        }
    }
}

@media screen and (max-width: 992px){
    .content {
        .left{
            width: calc(100% - 380px);
        }
        .right{
            width: 380px;
            .buttonWrap{
                width: 380px;
            }
        }
    }
}
@media screen and (max-width: 768px){
    .content {
        padding-bottom: 60px;
        .left{
            width: 100%;
            padding-bottom: 60px;
            height: auto;
            .leftContent{
                 height: auto;
            }
        }
        .right{
            width: 100%;
            height: auto;
        }
        .right{
            margin-top: 40px;
            border-left: none;
            min-height: 100px;
            .buttonWrap{
                width: 100%;
                // position: fixed;
            }
        }
    }
    
}
@media screen and (max-width: 576px){
    .content{
        .left{
            .total{
                padding-right: 15px;
            }
            .leftContent{
                padding: 0 15px;
                .orderList{
                    li{
                        padding: 0 10px;
                    }
                }
            }
        }
        .right{
            padding-left: 15px;
            padding-right: 15px;
            .payList{
                margin-right: 0;
            }
        }
    }
}
</style>