<template>
  <div class="card-info">
    <div class="info-wrap" v-if="cardInfo.CardId">
      <div class="detail">
        <img :src="cardInfo.PhotoUrl || require('../../../assets/avatar.svg')" width='90' height='90' alt="">
        <ul>
          <li>{{cardInfo.UserName || cardInfo.Phone.slice(8,12) || '---'}}</li>
          <li>{{cardInfo.Phone || '---'}}</li>
          <li>
            <span>余额</span>
            <p>¥{{cardInfo.Amount.toFixed(2)}}</p>
          </li>
          <li>
            <span>优惠券</span>
            <p>{{cardInfo.CouponCount}}张</p>
          </li>
        </ul>
      </div>
      <div class="btn">
        <Button :to="{path: '/charge', query: { userId: cardInfo.UserId}}" v-if="$route.name=='cash'">充值</Button>
        <Button :to="{path: '/cash', query: { userId: cardInfo.UserId}}" v-else>收银</Button>
      </div>
      
    </div>
    
    <div class="input-wrap">
      <Search  v-if="!userId" v-model="searchVal" placeholder="输入手机号" 
              style="width: 100%;"
              @on-search="handleSearch"></Search>
      <div class="input-box">
        <span>选择员工</span>
          <div @click="showStaff = true" class="input">
            <p>{{Staff.Name || ''}}{{Staff.Number || ''}}</p>
            <Icon type="ios-arrow-forward" color="#999"></Icon>
          </div>
      </div>
    </div>
    <!-- 员工列表 -->
    <Modal :mask-closable="false" v-model="showStaff" @on-cancel="showStaff=false;selectedStaff = Staff">
      <p slot="header" class="title">选择员工</p>
      <ul class="staff-list">
        <li v-for="(item, index) in staffList" :class="{ selected: item.Id === selectedStaff.Id }"
            @click=" (selectedStaff == item ? selectedStaff = '' : selectedStaff = item)" :key="index">
            <p>{{item.Name}}</p>
            <p>员工编号：{{item.Number}}</p>
        </li>
      </ul>
      <div slot="footer" class="modal-buttons">
        <Button @click="handleSelect" type="primary" style="width: 200px;height: 40px;">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import Search from '@/components/search'
  export default {
    name: 'card-info',
    components:{ Search },
    props: { userId: { required: true } },
    data() {
      return {
        cardInfo: {
          "CardId": "",
          "UserId": "",
          "CardNo": "",
          "PhotoUrl": "",
          "UserName": "",
          "Amount": 0,
          "CardName": '',
          "PreferentialAmount": 0  // 50 对应的优惠金额
        },
        searchVal: '',
        showStaff: false,
        staffList:[{
                "Id": "e04a3c6b38a246d395cc397ec0c315fa",
                "Name": "芳芳",
                "Number": "01"
            } ],
        selectedStaff: {},
        Staff: {},
      }
    },
    created() {
      this.getStaff();
      if(this.userId){
        this.getCardInfo()
      }
      
    },
    methods: {
      handleSearch(){
        var phoneReg = /(^1[2-5789]\d{9}$)/;
        if(!this.searchVal){
          this.$Message.error('请输入手机号')
        }else if(!phoneReg.test(this.searchVal)){
          this.$Message.error('输入的手机号格式不正确')
        }else{
          let url = 'User/GetUserCardsByPhone';
          this.$axios.post(url,{Phone: this.searchVal}).then(res => {
            let {Code,Data,Message} = res.data;
            if(Code == 0){

              this.cardInfo = Data.UserDetai;
              this.$emit('user-info-change',this.cardInfo)
            }else{
              this.$Message.error(Message)
            }
          }).catch(err => {
              throw new Error(err)
          })
        }
      },
      handleSelect(){
        this.showStaff=false;
        this.Staff = this.selectedStaff;
        this.$emit('staff-change',this.selectedStaff.Id)
      },
      getStaff(){
        const url = '/Employee/GetEmployees'
        this.$axios.post(url).then(res => {
          if (res.data.Code === '0') {
            this.staffList = res.data.Data.Employees;
          } else {
            this.$Message.error(res.data.Message);
          }
        }).catch(e => {
          throw new Error(e)
        })
      },
      getCardInfo() {
        const url = '/Recharge/GetUserCharge'
        this.$axios.post(url, { UserId: this.userId }).then(res => {
          if (res.data.Code === '0') {
            const data = res.data.Data;
            this.cardInfo = data;
            this.$emit('update:cardId', data.CardId)
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
  .card-info {
    .info-wrap{
      background: #F7F8FA;
      margin-bottom: 20px;
      .detail{
        >img{
          border-radius: 50%;
          background-color: #f5f5f5;
        }
        padding: 20px;
        display: flex;
        position: relative;
          ul {
          list-style: none;
          margin-left: 10px;
          padding-top: 20px;
          li {
            display: flex;
            padding-bottom: 5px;
            color: #333;
            font-size: 18px;
            &:nth-of-type(3){
              margin-top: 12px;
            }
            &:nth-of-type(3),&:nth-of-type(4){
              color: #666;
              span{
                width: 55px;
                display: inline;
                text-align: left;
              }
            }
            p {
              padding-left: 15px;
            }
          }
        }
        
      }
      .btn{
          margin: 0 30px;
          padding: 20px 0;
          display: flex;
          justify-content: center;
          border-top: 1px solid #e4e4e4;
      }
      
    }
    
    
    .input-wrap{
      margin-bottom: 20px;
      .input-box {
        width: 100%;
        margin-top: 20px;
        position: relative;
        height: 44px;
        > span {
          position: absolute;
          z-index: 2;
          left: 12px;
          line-height: 44px;
          color: #999;
          font-size: 14px;
        }
        p{
          font-size: 16px;
        }

        .input {
          padding-right: 12px;
          height: 44px;
          font-size: 14px;
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
    }
  }
  .staff-list {
    display: grid;
    grid-template-columns: repeat(3, 147px);
    grid-column-gap: 20px;
    grid-row-gap: 20px;
    height: 60vh;
    align-content: flex-start;
    overflow-y: scroll;
    overflow-x: hidden;
    li {
      width: 147px;
      padding: 10px 15px;
      box-sizing: border-box;
      border: 1px solid #e4e4e4;
      background-color: #f7f8fa;
      border-radius: 8px;
      color: #333;
      font-size: 16px;
      cursor: pointer;
      position: relative;
      p:nth-of-type(2){
          font-size: 13px;
          color: #999;
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
