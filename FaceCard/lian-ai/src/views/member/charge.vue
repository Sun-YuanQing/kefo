<template>
  <div class="fullscreen">
    <Header title="充值"></Header>
    <div class="content">
      <div class="left">
        <CardInfo :user-id="userId" @staff-change="staffChange" @user-info-change="userInfoChange"  :card-id.sync="cardId"></CardInfo>
      </div>
      <div class="right">
        <div class="center">
          <h3>充值金额</h3>
          <div class="radio-group">
            <div @click="handleAmountChange(item,1)" class="radio" :class="{ selected: item.Amount === postData.Amount }"
                 v-for="(item,index) in countList" :key="index">
                 <p>{{item.Amount}}元</p>
                 <p>{{item.PreferentialAmount}}元</p>
            </div>
          </div>
          <div class="input-box">
            <span>输入金额:</span>
            <InputNumber :value="postData.Amount" class="input" placeholder="请输入" ref="inputNum"
                         :min="0" :max="9999999999" 
                         :parser= "value => `${value}`.replace(/([0-9]+.[0-9]{2})[0-9]*/,'$1')"
                         style="font-weight: 700;font-size: 26px;"
                         @on-change="handleAmountChange"></InputNumber>
          </div>
          <div class="concessions" v-if="countItem">
            优惠: {{countInfo}}
          </div>
          <ul class="pay-list">
            <li v-for="(pay,index) in payList"
            :class="{ selected: pay.value === postData.SourceType }" 
            @click="sourceTypeChange(pay)" :key="index">{{pay.label}}</li>
          </ul>
          <div class="button-wrap">
            <Button @click="handleCharge" class="button" type="primary" :disabled="!userId || !postData.Amount || !postData.SourceType">
              <span>充值</span>
              <span v-if="postData.Amount">: ￥
                <span>
                  <span class="big-num">{{Math.floor(postData.Amount)}}</span>.{{postData.Amount.toFixed(2).toString().substr(-2, 2)}}
                </span>
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
    <Modal v-model="chargeSuccess" :mask-closable="false" :closable="false">
      <p slot="header" class="title">充值成功</p>
      <div class="charge-success">
        <h3>已充值 <amount :value="chargeAmount" />
        </h3>
        <!-- <img src="@/assets/charge-success.svg" alt=""> -->
      </div>
      <div slot="footer" class="modal-buttons">
        <Button type="primary" @click="userId ? $router.push({path: '/userDetail',query:{userId: userId}}) : $router.back()">确定</Button>
        <Button to="index" style="margin-left: 20px;" type="primary">返回首页</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import Header from '@/components/route-header'
  import CardInfo from './components/card-info'

  export default {
    name: 'charge',
    components: { Header, CardInfo },
    data() {
      return {
        userId: '',
        cardId: '',
        amounts: [50, 100, 200, 500, 1000],
        chargeSuccess: false,
        countItem: null,
        chargeAmount: 0,
        countList: [],
        postData: {
          "UserId": "",
          "CardId": "",
          "Amount": 0,
          "PreferentialAmount": "",
          "SourceType":  '',   //1.储值支付  2.现金 3.微信 4.支付宝
          "EmployeeId": ''
        },
        payList:[{
          value: '2',
          label: '现金'
        },{
          value: '3',
          label: '微信'
        },{
          value: '4',
          label: '支付宝'
        }],
      }
    },
    created() {
      this.userId = this.$route.query.userId;
      // if (!this.userId) {
      //   this.$router.replace('index')
      // }
      this.getCountList()
    },
    computed: {
      countInfo() {
        return this.countItem ? `充值满${this.countItem.Amount}送${this.countItem.PreferentialAmount}` : ''
      }
    },
    methods: {
       staffChange(val){
        this.$set(this.postData,'EmployeeId',val)
      },
      sourceTypeChange(item){
        this.$set(this.postData,'SourceType',this.postData.SourceType == item.value ?  '' : item.value)
      },
      userInfoChange(val){
        this.userId = val.UserId;
        this.cardId = val.CardId;
      },
      handleAmountChange(val,type) {
        if(type==1){
          if(val.Amount == this.postData.Amount ){
             this.postData.Amount = 0;
            this.countItem = null;
          }else{
             this.postData.Amount = val.Amount;
             this.countItem = val;
          }
          
         
           
        }else{
          this.postData.Amount = val;
          this.countItem = this.countList.filter(item => item.Amount <= val).sort((a, b) => Number(b) - Number(a))[0]
        }
        
      },
      handleCharge() {
        this.$Modal.confirm({
          title: '请确认是否充值',
          onOk: () => {
            this.postCharge()
          }
        })
      },
      postCharge() {
        const url = '/Recharge/Charge'
        const postData = {
          Amount: this.postData.Amount.toFixed(2),
          CardId: this.cardId,
          UserId: this.userId,
          PreferentialAmount: this.countItem ? this.countItem.PreferentialAmount : 0,
          SourceType:  this.postData.SourceType,   //1.储值支付  2.现金 3.微信 4.支付宝
          EmployeeId: this.postData.EmployeeId
        }
        this.$axios.post(url, postData).then(res => {
          if (res.data.Code === '0') {
            this.chargeAmount = Number(postData.Amount) + Number(postData.PreferentialAmount);
            this.chargeSuccess = true
          } else {
            this.$Message.error(res.data.Message);
          }
        }).catch(e => {
          throw new Error(e)
        })
      },
      getCountList() {
        const url = '/Recharge/GetPreferentials';
        this.$axios.post(url).then(res => {
          if (res.data.Code === '0') {
            const data = res.data.Data;
            this.countList = data.Preferential.filter(item => {
              return Date.now() - new Date(item.StartTime) > 0 && (!item.DueTime || Date.now() - new Date(item.DueTime) < 0)
            }).sort((a, b) => Number(b) - Number(a));
          } else {
            this.$Message.error(res.data.Message);
          }
        }).catch(e => {
          throw new Error(e)
        })
      },
    }
  }
</script>

<style lang="less">
  .content {
    .ivu-input-number-input {
      text-align: right;
    }
  }

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
</style>

<style lang="less" scoped>
  .charge-success {
  text-align: center;
  // padding: 30px 0 70px;

  h3 {
    font-size: 20px;

    span {
      color: #E94E27;
    }
  }
}
.content:after{display:block;clear:both;content:"";visibility:hidden;height:0}
.content {
  // display: flex;
  padding-top: 18px;
  font-size: 18px;
  zoom:1;

  h3 {
    font-size: 18px;
    color: #000;
    padding-bottom: 14px;
  }

  .left {
    float: left;
    width: 480px;
    height: 100%;
    padding: 0 30px;
    box-sizing: border-box;
  }

  .right {
    float: left;
    display: flex;
    min-height: 100%;
    justify-content: center;
    border-left: 1px solid #e4e4e4;
    width: calc(100% - 480px);
    box-sizing: border-box;
    padding: 0 30px;

    .center {
      min-width: 320px;
      // display: flex;
      // flex-direction: column;
    }

    .radio-group {
      display: grid;
      grid-template-columns: repeat(5, 100px);
      grid-column-gap: 13px;

      .radio {
        width: 100px;
        height: 80px;
        border-radius: 4px;
        border: 1px solid #e4e4e4;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-size: 18px;
        color: #333;
        font-weight: 700;
        cursor: pointer;

        p:nth-of-type(2) {
          color: #666;
          font-size: 14px;
          font-weight: normal;
        }
      }

      // .selected {
      //   color: #000;
      //   border-color: #000;
      //   box-shadow: 0 0 1px #000;
      //   font-weight: bold;
      // }
    }

    .input-box {
      width: 100%;
      height: 50px;
      margin: 16px 0 10px;
      position: relative;

      >span {
        position: absolute;
        z-index: 2;
        left: 12px;
        line-height: 50px;
        color: #666;
        font-size: 15px;
      }

      .input {
        padding-right: 12px;
        height: 50px;
        line-height: 50px;
        width: 100%;
        border: 1px solid #e4e4e4;
        border-radius: 4px;
        position: absolute;
        box-shadow: none;
      }
    }

    .concessions {
      text-align: right;
      font-size: 16px;
      color: #999;
    }
    .button-wrap{
      width: 100%;
      display: flex;
      justify-content: center;
      margin:  50px 0 20px;
    }
    .button {
      width: 326px;
      height: 50px;
      min-height: 44px;
     
    }
  }
}
@media screen and (min-width: 992px){
  .content .right .button{
    margin-top: 180px;
  }
}
@media screen and (max-width: 992px) {
  .content .left {
    width: 380px;
  }

  .content .right {
    width: calc(100% - 380px);
  }
}

@media screen and (max-width: 768px) {
  .content {
    // flex-wrap: wrap;

    .left {
      height: auto;
      margin-bottom: 30px;
    }

    .left,
    .right {
      width: 100%;
    }
    .right{
      border-left: none;
      min-height: 60%;
    }
  }

}

.pay-list {
  display: flex;
  margin: 30px 0 50px;

  li {
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

    &:last-of-type {
      margin-right: 0;
    }
  }

}

.selected {
  border: 1px solid #3275F5;
  position: relative;
  overflow: hidden;

  &::after {
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

  &::before {
    content: '✔';
    position: absolute;
    right: 1px;
    bottom: -1px;
    color: #fff;
    z-index: 9;
    font-size: 13px;
  }
}
</style>
