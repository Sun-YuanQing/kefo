<template>
  <div class="fullscreen">
    <Header title="收银"></Header>
    <div class="content">
      <div class="left">
        <CardInfo :user-id="userId" @staff-change="staffChange" @user-info-change="userInfoChange"></CardInfo>
      </div>
      <div class="right">
        <div class="center">
          <h3>收银详情</h3>
          <div class="input-box input-box1">
            <span style="top: 16px;">应收金额:</span>
            <InputNumber :value="postData.Amount" class="input" placeholder="请输入"
                         :min="0" :max="9999999999" 
                         :parser= "value => `${value}`.replace(/([0-9]+.[0-9]{2})[0-9]*/,'$1')"
                         @on-change="handleAmountChange" style="font-size: 22px;height: 80px;"></InputNumber>
          </div>
          <div class="input-box input-box2" >
            <span>优惠券:</span>
            <div @click="handleSelectDiscount" class="input">
              <p>{{selectDiscount.name || '无'}}</p>
              <Icon type="ios-arrow-forward" color="#999"></Icon>
            </div>
          </div>
          <div class="input-box input-box2">
            <span>选择商品:</span>
            <div @click="showLabel = true" class="input">
              <p>{{postData.Label}}</p>
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
          <div class="total">
            <span>实收：</span>
            <span v-if="postData.Amount"><amount :value="postData.ActualAmount"/></span>
            <span v-else>&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </div>
          <ul class="pay-list">
            <li v-for="(pay,index) in payList"
            :class="{ selected: pay.value === postData.SourceType }" 
            @click="sourceTypeChange(pay)" :key="index">{{pay.label}}</li>
          </ul>
          <div class="button-wrap">
            <Button @click="handleCash" :loading="cashLoading" class="button" type="primary" 
                    :disabled="!postData.Amount || !postData.SourceType">
              <span>收银</span>
              <!-- <span v-if="postData.Amount">:<amount :value="postData.ActualAmount"/></span> -->
            </Button>
          </div>
        </div>
      </div>
    </div>

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
    <!-- 标签列表 -->
    <Modal :mask-closable="false"  v-model="showLabel" @on-cancel="showLabel=false;isEditLabel=false;addLabelList=[];selectLabel=[];">
      <p slot="header" class="title">标签</p>
      <ul class="label-list">
        <!-- 原来的 -->
        <li v-for="(item, index) in labelList" :class="{ selected: item.Name === selectLabel.Name, edit: isEditLabel }"
            @click="!isEditLabel && (selectLabel == item ? selectLabel = '' : selectLabel = item)" :key="item.Name">
          {{item.Name}}
          <div @click.stop="handleDeleteLabel(index)" v-if="isEditLabel" class="close" title="删除">
            <Icon size="22" color="#999" type="ios-close"></Icon>
          </div>
        </li>
        <!-- 添加后还没上传的 -->
        <li v-for="(item, index) in addLabelList" :class="{ edit: isEditLabel }" :key="item">
          {{item}}
          <div @click.stop="addLabelList.splice(index, 1)" v-if="isEditLabel" class="close" title="删除">
            <Icon size="22" color="#999" type="ios-close"></Icon>
          </div>
        </li>
        <Input :maxlength="7" v-model="labelInput" ref="labelInput" @on-blur="onLabelInputBlur"
               v-if="isEditLabel && addingLabel" class="label-input"/>
        <li @click="handleAddLabel" v-if="isEditLabel" style="font-size: 30px" title="新增">+</li>
      </ul>
      <div slot="footer" class="modal-buttons">
        <template v-if="!isEditLabel">
          <Button @click="handleConfirmLabel" style="width: 120px" type="primary">确定</Button>
          <Button style="width: 120px; margin-left: 20px;" @click="isEditLabel = true">编辑</Button>
        </template>
        <Button @click="confirmAddLabel" style="width: 120px" v-else>保存</Button>
      </div>
    </Modal>

    <Modal v-model="showSuccess" :mask-closable="false" :closable="false">
      <p slot="header" class="title">收银成功</p>
      <div class="charge-success">
        <h3>已收银
          <amount :value="postData.ActualAmount"/>
        </h3>
        <!-- <img src="@/assets/charge-success.svg" alt=""> -->
      </div>
      <div slot="footer" class="modal-buttons">
        <Button type="primary" @click="userId ? $router.push({path: '/userDetail',query:{userId: userId}}) : $router.back()">确定</Button>
        <Button to="/index" style="margin-left: 20px;" type="primary">返回首页</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import CardInfo from './components/card-info'
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
    name: 'cash',
    components: { CardInfo, Header },
    data() {
      return {
        userId: '',
        sendDiscount: '',
        showSuccess: false,
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
        labelInput: '',
        addingLabel: false,
        showDiscount: false,
        showLabel: false,
        isEditLabel: false,
        selectDiscount: {},
        selectLabel: '',
        labelList: [],
        addLabelList: [], //添加的lable
        discountList: [],
        sendDiscountList: [],
        cashLoading: false,
        
      }
    },
    created() {
      this.userId = this.$route.query.userId;
      if(this.userId){
        this.getInfo();
      }
      this.getLabels()
    },
    computed: {
      labelListNames() {
        return this.labelList.map(item => item.Name)
      },
      payList(){
        if(!this.userId){
          return PayList.slice(1);
        }else{
          return PayList;
        }
      }
    },
    methods: {
      staffChange(val){
        this.$set(this.postData,'EmployeeId',val)
      },
      userInfoChange(val){
        this.userId = val.UserId;
        this.getInfo();
      },
      sourceTypeChange(item){
        this.$set(this.postData,'SourceType',this.postData.SourceType == item.value ?  '' : item.value)
      },
      handleConfirmLabel() {
        this.showLabel = false;
        this.postData.Label = this.selectLabel.Name
      },
      handleConfirmDiscount() {
        this.showDiscount = false;
        this.handleAmountChange(this.postData.Amount, true)
      },
      withoutDiscount() {
        this.selectDiscount = {};
        this.showDiscount = false;
        this.handleAmountChange(this.postData.Amount, false)
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
          } else {
            this.$Message.error(res.data.Message);
          }
        }).catch(e => {
          throw new Error(e)
        })
      },
      getLabels() {
        const url = '/Lable/GetLables'
        this.$axios.post(url).then(res => {
          if (res.data.Code === '0') {
            const data = res.data.Data;
            this.labelList = data;
          } else {
            this.$Message.error(res.data.Message);
          }
        }).catch(e => {
          throw new Error(e)
        })
      },
      onLabelInputBlur(e) {
        const value = e.target.value;
        if (!value.trim()) {
          this.addingLabel = false;
          return;
        }
        if (this.labelListNames.includes(value) || this.addLabelList.includes(value)) {
          this.$Message.error('标签已存在');
          this.$nextTick(() => {
            this.$refs.labelInput.focus();
          })
          return;
        }
        this.addLabelList.push(value)
        this.addingLabel = false;
        this.labelInput = '';
      },
      confirmAddLabel(){
          const url = '/Lable/AddLable'
          this.$axios.post(url, { Lables: this.addLabelList }).then(res => {
            if (res.data.Code === '0') {
              this.addLabelList.forEach(val => {
                this.labelList.push({ Name: val })
              })
              this.addLabelList = [];
              this.isEditLabel = false;

            } else {
              this.$Message.error(res.data.Message);
            }
          }).catch(e => {
            throw new Error(e)
          })
          
      },
      
      handleAddLabel() {
        if (this.addingLabel) return;
        this.addingLabel = true;
        this.$nextTick(() => {
          this.$refs.labelInput.focus();
        })
      },
      handleDeleteLabel(index) {
        const item = this.labelList[index]

        const url = '/Lable/DeleteLable'
        this.$axios.post(url, { Id: item.Name }).then(res => {
          if (res.data.Code === '0') {
            if (item.Name === this.selectLabel.Name) this.selectLabel = {};
            this.labelList.splice(index, 1)
          } else {
            this.$Message.error(res.data.Message);
          }
        }).catch(e => {
          throw new Error(e)
        })
      },
      handleSelectDiscount() {
        !this.selectDiscount.MyCouponId && (this.selectDiscount = this.discountList.find(item => !item.disabled) || {});
        this.showDiscount = true
      },
      onDiscountSelect(item) {
        // console.log("item",item)
        if (!item.disabled) {
          this.selectDiscount = item
        }
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

      //收银
      handleCash() {
        if (this.postData.SourceType=='1' && this.postData.ActualAmount > this.postData.totalAmount) {
          return this.$Message.error('支付金额不能大于余额')
        }else{
            this.$Modal.confirm({
                title: '请确认是否收银',
                loading: true,
                onOk: () => {
                  if(!this.userId){
                    this.offlineCollect()
                  }else{
                    this.confirmCash()
                  }
                    
                }
            })
        }
        
      },
      // 会员收银
      confirmCash(){
          this.cashLoading = true;

          const url = '/CollectMoney/AddCollect'
          this.$axios.post(url, this.postData).then(res => {
            this.cashLoading = false;
            this.$Modal.remove();
            if (res.data.Code === '0') {
              this.showSuccess = true;
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
            EmployeeId: this.postData.EmployeeId
          }
          this.$axios.post(url, postData).then(res => {
            this.cashLoading = false;
            this.$Modal.remove();
            if (res.data.Code === '0') {
              this.showSuccess = true;
            } else {
              this.$Message.error(res.data.Message);
            }
          }).catch(e => {
            this.$Modal.remove();
            this.cashLoading = false;
            throw new Error(e)
          })
      }

    },
  }
</script>

<style lang="less">
  .content {
    .ivu-input-number {
      font-size: 18px;
      color: #000;
    }

    .ivu-input-number-input {
      text-align: right;
      height: 100%;
    }

    .ivu-input-number-handler-wrap {
      display: none;
    }
  }

</style>

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
  .content {
    // display: flex;
    // flex: 1;
    // flex-wrap: wrap;
    zoom:1;
    padding-top: 18px;
    font-size: 18px;

    h3 {
      font-size: 18px;
      color: #000;
      padding-bottom: 14px;
    }

    .left {
      float: left;
      width: 480px;
      padding: 0 30px;
      box-sizing: border-box;
    }

    .right {
      float: left;
      display: flex;
      min-height: 100%;
      border-left: 1px solid #e4e4e4;
      justify-content: center;
      width: calc(100% - 480px);
      box-sizing: border-box;
      padding: 0 30px;
      // flex: 1;
      .center {
        min-width: 320px;
        // display: flex;
        // flex-direction: column;
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
      .input-box1{
        height: 80px;
        line-height: 80px;
        font-size: 18px;
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
      .button-wrap{
        width: 100%;
        display: flex;
        justify-content: center;
        margin: 50px 0 20px;
      }
      .button {
        width: 326px;
        height: 50px;
        min-height: 44px;
      }
    }
    
  }
  
  @media screen and (max-width: 992px){
    .content .left{
      width: 380px;
    }
    .content .right{
      width: calc(100% - 380px);
    }
  }
  @media screen and (max-width: 768px){
    .content {
      // flex-wrap: wrap;
      .left{
        height: auto;
        margin-bottom: 30px;
      }
      .left,.right{
        width: 100%;
      }
      .right{
        border-left: none;
        min-height: 80%;
      }
    }
    
  }

  .label-list {
    display: grid;
    grid-template-columns: repeat(3, 148px);
    grid-column-gap: 20px;
    grid-row-gap: 20px;
    min-height: 300px;
    align-content: flex-start;

    li {
      width: 148px;
      height: 40px;
      background-color: #f7f8fa;
      border-radius: 4px;
      line-height: 40px;
      text-align: center;
      color: #333;
      cursor: pointer;
      position: relative;

      .close {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        box-shadow: 0 0 0 1px #e4e4e4;
        position: absolute;
        right: -5px;
        top: -5px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        cursor: pointer;
      }
    }

    .label-input {
      width: 148px;
    }

    .selected {
      background-color: #333;
      color: #fff;
    }

    .edit {
      cursor: pointer;
    }
  }
  .total{
    height: 60px;
    line-height: 60px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 18px;
    span:nth-of-type(2){
      font-size: 22px;
    }
  }
  .pay-list{
    display: flex;
    margin: 10px 0 50px;
    li{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 122px;
      height: 50px;
      border: 1px solid #e4e4e4;
      font-size: 16px;
      margin-right: 20px;
      border-radius: 8px;
      cursor: pointer;
      &:last-of-type{
        margin-right: 0;
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
            bottom: -1px;
            color: #fff;
            z-index: 9;
            font-size: 13px;
        }
    }
  }

  
</style>

