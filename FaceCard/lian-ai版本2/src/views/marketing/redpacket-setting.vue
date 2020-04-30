<template>
  <div class="fullscreen">
    <Header title="红包方案">
      <Button @click="addingRedpacket" style="width: 70px" shape="circle">添加</Button>
    </Header>
    <div class="content">
      <RadioGroup v-model="filterRadio" @on-change="getList" class="radioTab"  type="button">
        <Radio :label="1">使用中</Radio>
        <Radio :label="2">已停用</Radio>
      </RadioGroup>
      <ul>
        <li :class="{ disabled: filterRadio === 2 }" v-for="item in list" :key="item.Id">
          <div class="redpacket" @click="handleCheck(item.Id)">
            <div v-if="filterRadio === 1 && isEdit" class="checkmark">
              <img v-if="checked.includes(item.Id)" src="@/assets/checkmark.svg" alt="">
            </div>
            <div class="top">
              <h4>{{type[item.PresentType - 1]}}</h4>
              <h3 v-if="item.Type === 2">随机</h3>
              <h3 v-else><amount :value="item.Amount" /></h3>
              <p class="align-center">
                <span>已领: {{item.ReceivedCount}}/{{item.TotalCount}}个</span>
                <span>共: ￥{{item.ReceivedAmount}}/￥{{item.TotalAmount}}</span>
              </p>
            </div>
            <div class="bottom">
              <p><span>1</span>{{type[item.PresentType - 1]}}时赠送{{amountType[item.Type - 1]}}金额红包</p>
              <p><span>2</span>领取有效期：{{item.StartTime}}～{{item.DueTime}}</p>
            </div>
          </div>
        </li>
      </ul>
      <template v-if="filterRadio === 1">
        <Button @click="handleEdit" class="button" v-if="!isEdit && this.list.length>0">编辑</Button>
        <div v-if="isEdit && this.list.length>0" class="buttons">
          <Button @click="handleCancel">取消</Button>
          <Button @click="handleStop" style="margin-left: 30px;" type="primary">停用</Button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import Header from 'src/components/route-header'

  export default {
    name: 'redpacket-setting',
    components: { Header },
    data() {
      return {
        type: ['注册会员', '消费'],
        amountType: ['固定', '随机'],
        isEdit: false,
        checked: [],
        filterRadio: 1,
        list: [],
        presentType: ''
      }
    },
    created() {
      this.getList()
    },
    methods: {
      handleCheck(id) {
        if (!this.isEdit) return;

        if (this.checked.includes(id)) {
          const index = this.checked.findIndex(item => item === id);
          this.checked.splice(index, 1)
        } else {
          this.checked.push(id)
        }
      },
      handleCancel() {
        this.isEdit = false;
        this.checked = []
      },
      handleEdit() {
        this.isEdit = true;
      },
      getList() {
        const url = '/Redpacket/GetRedPackets'
        this.$axios.post(url, { Flag: this.filterRadio === 1 }).then(res => {
          if (res.data.Code === '0') {
            const data = res.data.Data;
            this.list = data;

            let arr = [];
            data.forEach(item => {
                arr.push(item.PresentType)
            })
            this.presentType = arr.join('&');

          } else {
            this.$Message.error(res.data.Message);
          }
        }).catch(e => {
          throw new Error(e)
        })
      },
      handleStop(){
        if (!this.checked.length) return this.$Message.error('请选择要停用的红包')
        const url = '/Redpacket/UpdateRedPacketFlag'
        this.$axios.post(url, { Ids: this.checked }).then(res => {
          if (res.data.Code === '0') {
            this.isEdit = false;
            this.getList()
          } else {
            this.$Message.error(res.data.Message);
          }
        }).catch(e => {
          throw new Error(e)
        })
      },
      addingRedpacket(){
        if(this.presentType == '1' || this.presentType == '2' || !this.presentType ){
          this.$router.push({path:'/redpacketAdd',query: {presentType:this.presentType}});
          

        }else{

          this.$Modal.warning({ 
              title: '错误提示',
              content: '注册会员红包和消费红包都已经存在了，请停用再添加！' 
          })

        }
      }
    },
  }
</script>

<style lang="less" scoped>
  .fullscreen {
    background-color: #f7f8fa;
  }

  .content {
    padding: 20px;
    // display: flex;
    // flex-direction: column;
    .radioTab{
      position: fixed;
      left: 28px;
      top: 68px;
      z-index: 9999;
    }

    ul {
      margin-top: 30px;
      padding: 32px 0;
      display: grid;
      grid-template-columns: repeat(3, 309px);
      grid-gap: 30px 20px;
      justify-items: center;
      justify-content: center;
      // max-height: 75vh;
      // overflow-y: scroll;

      li {
        > p {
          font-size: 12px;
          color: #999;
        }
        .redpacket {
          width: 309px;
          height: 307px;
          background-image: url("../../assets/redpacket-bg.svg");
          background-repeat: no-repeat;
          background-size: 100% 100%;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .checkmark {
            position: absolute;
            right: 0;
            top: -4px;
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

          .top {
            text-align: center;
            padding-top: 21px;

            h4 {
              font-size: 16px;
            }

            h3 {
              padding-top: 22px;
              font-size: 24px;
              color: #E94E27;
            }

            p {
              justify-content: space-between;
              padding: 30px 22px 0;
              font-size: 12px;
            }
          }

          .bottom {
            padding-left: 25px;
            padding-bottom: 33px;

            p {
              font-size: 12px;
              color: #fff;
              font-weight: lighter;
              span {
                display: inline-block;
                width: 13px;
                height: 13px;
                border-radius: 50%;
                color: #E94E27;
                background-color: #fff;
                line-height: 13px;
                text-align: center;
                margin-right: 4px;
              }
            }
          }
        }
      }

      .disabled {
        filter: saturate(0);
      }
    }

    .buttons {
      // align-self: center;
      // margin-top: auto;
      width: 435px;
      margin: 40px auto;
      button{
        width: 200px; 
        height: 50px
      }
    }
    .button {
      // align-self: center;
      // margin-top: auto;
      display: block;
      margin: 30px auto;
      width: 200px;
      height: 50px;
      
    }
  }
  @media screen and (max-width:992px){
    .content ul{
        grid-template-columns: repeat(2, 309px);
        padding: 32px 0;
        
    }
  }
  @media screen and (max-width:767px){
    .content ul{
        grid-template-columns: repeat(1, 309px);
        padding: 32px 0;
        
    }
  }
  @media screen and (max-width:576px){
    .content ul {
       justify-content: flex-start;
      //  overflow: auto;
      li .discount{
         padding: 30px 0;
         width: 220px;
         height: auto;
         background: none;
         border-radius: 8px;
         border-top: 1px solid #eee;
         box-shadow: 0 2px 4px rgba(0, 0, 0, 0.09);
         flex-direction: column;
         .right{
           width: 150px;
           margin-top: 20px;
           padding-left: 20px;
         }
       }
    }
    .content .buttons {
      width: 235px;
       button{
        width: 100px;
      }
    }
     
    
  }
</style>
