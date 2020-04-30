<template>
  <div class="fullscreen">
    <Header title="优惠券方案">
      <Button to="discountAdd" style="width: 70px;" shape="circle">添加</Button>
    </Header>
    <div class="content">
      <RadioGroup v-model="filterRadio" @on-change="getList" class="radioTab" type="button">
        <Radio :label="1">使用中</Radio>
        <Radio :label="2">已停用</Radio>
      </RadioGroup>
      <ul>
        <li :class="{ disabled: filterRadio === 2 }" v-for="item in discountList" :key="item.Id">
          <p>{{item.CreatedTime}} 建</p>
          <div class="discount" @click="handleCheck(item.Id)">
            <div v-if="filterRadio === 1 && isEdit" class="checkmark">
              <img v-if="checked.includes(item.Id)" src="@/assets/checkmark.svg" alt="">
            </div>
            <div class="left">
              <h3>￥<span class="big-num">{{item.PreferentialAmount}}</span></h3>
              <p>满{{item.Amount}}元可使用</p>
            </div>
            <div class="right">
              <h4>优惠券</h4>
              <p>自领取日后的{{item.Days}}天内生效，领取次数{{item.LimitCount === -1 ? '不限':
                item.LimitCount}}，消费满{{item.LimitAmount}}元获得</p>
              <div class="count">
                <span>已领 {{item.ReceivedCount}}</span>
                <span>已用 {{item.UsedCount}}</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <template v-if="filterRadio === 1">
        <Button @click="handleEdit" class="button" v-if="!isEdit">编辑</Button>
        <div v-else class="buttons">
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
    name: 'discount-setting',
    components: { Header },
    data() {
      return {
        isEdit: false,
        checked: [],
        filterRadio: 1,
        discountList: []
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
        const url = '/Coupon/GetCoupons'
        this.$axios.post(url, { Flag: this.filterRadio === 1 }).then(res => {
          if (res.data.Code === '0') {
            const data = res.data.Data;
            this.discountList = data
          } else {
            this.$Message.error(res.data.Message);
          }
        }).catch(e => {
          throw new Error(e)
        })
      },
      handleStop() {
        if (!this.checked.length) return this.$Message.error('请选择要停用的优惠券')
        const url = '/Coupon/UpdateCouponFlag'
        this.$axios.post(url, { Ids: this.checked }).then(res => {
          if (res.data.Code === '0') {
            this.getList()
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

<style lang="less" scoped>
  .fullscreen {
    background-color: #f7f8fa;
  }

  .content {
    padding: 20px 28px;
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
      padding: 32px 36px;
      display: grid;
      grid-template-columns: 428px 428px;
      grid-gap: 30px 46px;
      justify-items: center;
      justify-content: center;
      // max-height: 75vh;
      // overflow-x: hidden;
      // overflow-y: scroll;

      li {
        > p {
          font-size: 12px;
          color: #999;
        }

        .discount {
          width: 428px;
          height: 180px;
          background-image: url("../../assets/count-bg.png");
          background-repeat: no-repeat;
          background-size: 100% 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;

          .checkmark {
            position: absolute;
            right: -5px;
            top: -5px;
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

          .left {
            text-align: center;

            h3 {
              font-size: 24px;
              color: #F5C274;
            }

            p {
              font-size: 13px;
              color: #666;
            }
          }

          .right {
            width: 229px;
            padding-left: 40px;

            h4 {
              font-size: 16px;
            }

            p {
              font-size: 12px;
              color: #999;
            }

            .count {
              padding-top: 26px;
              font-size: 12px;
              color: #999;
              display: grid;
              grid-template-columns: 1fr 1fr;
            }
          }
        }
      }

      .disabled {
        filter: saturate(0);
      }
    }

    .buttons {
      width: 435px;
      margin: 40px auto;
      // align-self: center;
      // margin-top: auto;
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
  @media screen and (max-width:767px){
    .content ul{
        grid-template-columns: 1fr;
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
