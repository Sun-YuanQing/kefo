<template>
    <div class="fullscreen">
        <Header title="提现"></Header>
        <div class="tip">由于提现涉及到第三方支付及银行，提现以实际时间为准</div>
        <div class="content">
            <div class="wallet" @click="showDrawer = true">
                <span>{{bankName}}</span>
                 <Icon type="ios-arrow-forward" color="#ccc" size="24"/>
            </div>
            <div class="cash-out">
                <div class="title">提现金额</div>
                <div class="money">
                    <span>￥</span>
                    <input type="text" v-model="postData.Amount" @input="postData.Amount=postData.Amount.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')">
                </div>
            </div>
            <div class="err-tip">
                <span :style="{'color': (postData.Amount && postData.Amount > totalDrawCash) ? '#E94E27' : '#666'}">{{errTip}}</span>
                <span class="all" @click="withdrawalAll">全部提现</span>
            </div>
            <div class="explain">
                <div class="title">提现说明</div>
                <div class="cont">
                    <p>1.提现到微信钱包免手续费</p>
                    <p>2.提现到银行卡需0.6%的手续费，最高25元</p>
                </div>
            </div>
            <div class="btn" 
                 @click="isOut"
                 :style="{'color': able ? '#fff' : '#ccc','background': able ? '#333' : '#eee'}">确定提现</div>
        </div>

        <!-- 提现申请处理中 -->
        <Modal v-model="isModal" width="540" :closable="closable" footer-hide class="success-modal">
            <div class="success-tip">
                <img src="@/assets/success.svg" alt="">
                <p style="font-size: 20px; color: #333;">提现申请已提交，正在处理中…</p>
                <p style="font-size: 16px; color: #999;">可在提现记录中查看进程</p>
                <div class="modal-btn" @click="isModal=false;$router.back();">确定</div>
            </div>
            
        </Modal>

        <!-- 银行卡列表 -->
        <Drawer v-model="showDrawer" :closable="false" placement="right" :width="330">
            <div class="card-list">
                <div @click="handleSwitch(1)" class="card-item">
                    <div>微信钱包</div>
                    <img v-if="postData.Type==1" src="@/assets/selected.svg" alt="">
                </div>
                <template v-if="carList.length">
                    <div @click="handleSwitch(2,item)" class="card-item" v-for="(item, index) in carList" :key="index">
                        <div>
                            <span>{{item.BankName}}</span>
                            <span style="padding-left: 10px">尾号({{item.BankCard.substr(-4,4)}})</span>
                        </div>
                        <img v-if="postData.Type==2 && postData.BankId==item.BankId" src="@/assets/selected.svg" alt="">
                    </div>
                </template>
                
            </div>
            <div class="add-card" @click="$router.push('/bankCardAdd')">+添加银行卡</div>
        </Drawer>
    </div>
</template>

<script>
import Header from 'src/components/route-header'
export default {
    components: { Header },
    data(){
        return {
            closable: false,
            isModal:false,

            totalDrawCash: 0,
            errTip: "",
            showDrawer: false,
            carList:[],

            postData:{
                Type: 1,
                BankId: '',
                Amount: 0
            },
            bankName: '微信钱包'
        }
    },
    watch: {
        postData: {
            handler: function(){
                if(this.postData.Amount > this.totalDrawCash){
                    this.errTip = "输入金额超过可提现金额";
                }else{
                    this.errTip = "可提现"+ this.totalDrawCash+"元";
                }
            },
            deep: true
        }
        
    },
    computed: {
        able: function(){
            return this.postData.Amount > 0&& this.postData.Amount <= this.totalDrawCash
        }
    },
    created() {
        this.totalDrawCash = this.$route.query.amout;
        this.getBankList()
        this.errTip = "可提现"+ this.totalDrawCash+"元";
    },
    methods: {
        withdrawalAll(){
            this.postData.Amount = this.totalDrawCash;
        },

        //银行列表
        getBankList(){
            const url = '/CashOut/GetBanksByID';
            this.$axios.post(url).then(res => {
                if (res.data.Code === '0') {
                    const data = res.data.Data;
                    this.carList = data;
                    // console.log('carList',data)
                } else {
                    this.$Message.error(res.data.Message);
                }
            }).catch(e => {
                throw new Error(e)
            })
        },


        //提现
        isOut(){
            if(this.able){
                this.$Modal.confirm({
                    title: '请确认是否提现',
                    loading: true,
                    onOk: () => {
                        this.cashOut()
                    }
                })
            }
        },
        cashOut(){

            const url = '/CashOut/AddCashOut';
            this.$axios.post(url,this.postData).then(res => {
                if (res.data.Code === '0') {
                    this.$Modal.remove();
                    this.isModal = true;
                } else {
                    this.$Message.error(res.data.Message);
                }
            }).catch(e => {
                throw new Error(e)
            })

        },

        //选择银行卡
        handleSwitch(type,item){
            if(type==1){
                this.postData.Type = 1;
                this.postData.BankId = '';
                this.bankName = "微信支付"
            }else{
                this.postData.Type = 2;
                this.postData.BankId = item.BankId;
                this.bankName = item.BankName;
            }
        }
    }

    
}
</script>

<style lang="less" scoped>
   .tip{
       font-size: 13px;
       color: #F5C274;
       width: 100%;
       line-height: 40px;
       background: #FEFAF2;
       padding-left: 20px;
   }
   .content{
       width: 100%;
       display: flex;
       flex-direction: column;
       align-items: center;
       margin-top: 30px;
       .wallet{
           padding: 0 10px;
           width: 380px;
           height: 60px;
           box-sizing: border-box;
           display: flex;
           align-items: center;
           justify-content: space-between;
           color: #333;
           font-size: 17px;
           border: 1px solid #E4E4E4;
           border-radius: 4px;
           cursor: pointer;
       }
       .cash-out{
           margin-top: 10px;
           padding: 15px 10px;
           width: 380px;
           height: 140px;
           border: 1px solid #E4E4E4;
           border-radius: 4px;
           .title{
               font-size: 14px;
               color: #666;
           }
           .money{
               color: #333;
               font-size: 40px;
               position: relative;
               left: -6px;
               display: flex;
               input{
                   width: 300px;
                   border: none;
                   outline: none;
               }
           }
       }
       .err-tip{
           margin: 10px 0 30px;
           width: 380px;
           display: flex;
           justify-content: space-between;
           color: #666;
           font-size: 14px;
           .all{
               color: #3275F5;
               cursor: pointer;
           }
       }
       .explain{
          width: 380px;
          padding: 5px 10px 12px;
          border-radius: 4px;
          background: #F7F8FA;
          color: #999;
          font-size: 12px;
          .title{
              font-size: 13px;
              line-height: 2;
          }
       }
       .btn{
           margin-top: 60px;
           width: 380px;
           height: 50px;
           line-height: 50px;
           font-size: 18px;
           text-align: center;
           border-radius: 4px;
           cursor: pointer;
       }
   }
   .card-list{
       color: #333;
       font-size: 18px;
       max-height: calc(100% - 80px);
       overflow: auto;
        .card-item{
            height: 80px;
            display: flex;
            justify-content: space-between;
            align-items: center; 
            border-bottom: 1px solid #F4F4F4;
            cursor: pointer;
        }
    }
    .add-card{
        color: #999;
        font-size: 18px;
        line-height: 80px;
        cursor: pointer;
    }
    .ivu-modal-footer{
        padding: 0;
        .footer {
            display: flex;
            height: 80px;
            align-items: center;
            border-top: 1px solid #E4E4E4;
            .ivu-btn{
                width: 50%;
                height: 100%;
                padding: 0;
                margin: 0;
                font-size: 22px;
                color: #3275F5;
                &:first-of-type{
                    border-right: 1px solid #E4E4E4;
                    box-sizing: border-box;
                }
            }
        }
        
    }
    .success-modal{
        .success-tip{
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            padding:  60px 0 20px;
            line-height: 1.6;
        }
        .modal-btn{
            margin-top: 80px;
            width: 200px;
            border-radius: 4px;
            color: #fff;
            background: #333;
            font-size: 16px;
            text-align: center;
            height: 40px;
            line-height: 40px;
            cursor: pointer;
        }
    }

    @media screen and(max-width: 576px){
        .content{
            .wallet{
                width: 320px;
            }
            .cash-out{
                width: 320px;
                .money{
                    input{
                        width: 260px;
                    }
                }
            }
            .err-tip{
                width: 320px;
            }
            .explain{
                width: 320px;
            }
            .btn{
                width: 320px;
            }
        }
    }
    
</style>