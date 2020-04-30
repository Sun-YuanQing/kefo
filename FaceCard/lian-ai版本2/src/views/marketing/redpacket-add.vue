<template>
  <div class="fullscreen">
    <Header title="添加"></Header>
    <div class="content card-form">
      <div class="note">
        <div>
          <h4>规则说明</h4>
          <ul>
            <li>1:商家在有顾客成为会员、会员消费时，可以使用此优惠政策，为会员赠送红包，促进会员消费</li>
            <li>2:红包赠送条件现只有：成为会员、会员消费时</li>
          </ul>
        </div>
      </div>
      <div class="scroll">
        <Card v-for="(item, index) in postData" :key="index" style="margin-bottom: 20px; padding-bottom: 10px;">
          <p class="align-center">因
            <Select class="select" v-model="item.PresentType" :disabled="disabled">
              <Option :value="1">注册会员</Option>
              <Option :value="2">消费</Option>
            </Select>
            赠送
            <span style="font-size: 18px; color: #E94E27">【红包】</span>
            <Button @click="handleDelete(index)" v-if="index > 0" style="margin-left: auto;" shape="circle">删除</Button>
          </p>
          <div class="align-center" style="padding: 40px 0 25px">
            <img src="@/assets/coupon-setting.svg" alt="" style="margin-right: 6px;">
            <h4>红包设置</h4>
          </div>
          <div class="count-setting">
            <p>红包类型
              <Select class="select" v-model="item.Type">
                <Option :value="2">随机金额</Option>
                <Option :value="1">固定金额</Option>
              </Select>
            </p>
            <template v-if="item.Type === 1">
              <p>单个金额
                <InputNumber v-model="item.Amount" 
                            :parser= "value => `${value}`.replace(/([0-9]+.[0-9]{2})[0-9]*/,'$1')"
                            :min="0" :max="9999999999"  
                            class="input"></InputNumber>
              </p>
              <p>红包个数
                <InputNumber  :precision="0" 
                              :min="0" 
                              :max="9999999999" 
                              v-model="item.Count" class="input"></InputNumber>
              </p>
            </template>
            <template v-else>
              <p >总金额
                <InputNumber v-model="item.Amount" 
                            :parser= "value => `${value}`.replace(/([0-9]+.[0-9]{2})[0-9]*/,'$1')"
                            :min="0" :max="9999999999"
                            class="input"></InputNumber>
              </p>
              <p>红包个数
                <InputNumber  :precision="0" 
                              :min="0" 
                              :max="item.Amount*100" 
                              v-model="item.Count" class="input"></InputNumber>
              </p>
            </template>
          </div>
          <div class="align-center date" style="padding-top: 10px;justify-content: space-between;">
            <div>
              <p style="display: inline-block">
                开始<DatePicker :clearable="false" :editable="false" :options="options" 
                                :value="item.Starttime" @on-change="handleBeginDate($event, index)"></DatePicker>
              </p>
              <p style="display: inline-block">结束<DatePicker :clearable="false" :editable="false" 
                                    :options="options" :value="item.DUETIME" @on-change="handleEndDate($event, index)">
                        </DatePicker></p>
            </div>
            <p style="align-items: flex-end;">总金额: <strong>￥<span class="big-num">{{Math.floor(computedTotal(item))}}</span>.{{computedTotal(item).toFixed(2).toString().substr(-2, 2)}}</strong></p>
          </div>
        </Card>
        <!-- <Button class="add-next" @click="handleAdd">添加下一个红包</Button> -->
      </div>
      <Button @click="handleSave" :loading="loading" class="save" type="primary">保存</Button>
    </div>
  </div>
</template>

<script>
  import Header from 'src/components/route-header'
  import { formatDate } from 'src/utils'

  export default {
    name: 'redpacket-add',
    components: { Header },
    data() {
      return {
        loading: false,
        presentType: '',
        disabled: false,
        postData: [],
        options: {
          disabledDate(val) {
            return Date.now() - new Date(val) > 24 * 60 * 60 * 1000
          }
        }
      }
    },
    created() {
      this.presentType = this.$route.query.presentType;  //已经存在的红包
      if(this.presentType){
        this.disabled = true;
      }
      this.postData.push(this.discountItem());
    },
    methods: {
      discountItem() {
        if(this.presentType == 1){
          return {
            "PresentType": 2,
            "Type": 1,
            "Amount": 0,
            "Count": 0,
            "Starttime": formatDate(new Date(), 'yyyy-MM-dd'),
            "DUETIME": formatDate(new Date(), 'yyyy-MM-dd')
          }
        }else{
          return {
            "PresentType": 1,
            "Type": 1,
            "Amount": 0,
            "Count": 0,
            "Starttime": formatDate(new Date(), 'yyyy-MM-dd'),
            "DUETIME": formatDate(new Date(), 'yyyy-MM-dd')
          }
        }
        
      },
      computedTotal(item) {
        if (item.Type === 1) {
          return item.Amount * item.Count
        }
        return item.Amount
      },
      handleDelete(index) {
        this.postData.splice(index, 1)
      },
      // handleAdd() {
      //   this.postData.push(discountItem())
      // },
      handleBeginDate(e, index) {
        if (new Date(e) > new Date(this.postData[index].DUETIME)) {
          this.postData[index].DUETIME = e;
        }
        this.postData[index].Starttime = e;
      },
      handleEndDate(e, index) {
        if (new Date(e) < new Date(this.postData[index].Starttime)) {
          this.postData[index].DUETIME = this.postData[index].Starttime;
          return this.$Message.error('结束时间不能小于开始时间')
        }
        this.postData[index].DUETIME = e;
      },
      handleSave() {
        if(!this.postData[0].Amount ){
          this.$Modal.warning({ 
              title: '错误提示',
              content: '单个金额不能为0' 
          })
          return;
        }else if(!this.postData[0].Count){
          this.$Modal.warning({ 
              title: '错误提示',
              content: '红包个数不能为0' 
          })
          return;
        }else{
          this.loading = true;
          const url = '/Redpacket/AddRedpackets'
          const postData = {
            RedPackets: this.postData
          }
          this.$axios.post(url, postData).then(res => {
            this.loading = false;
            if (res.data.Code === '0') {
              this.$Message.success('操作成功')
              this.$router.back()
            } else {
              this.$Message.error(res.data.Message);
            }
          }).catch(e => {
            this.loading = false;
            throw new Error(e)
          })
        }
        
        
      },
    },
  }
</script>

<style lang="less">
  .card-form {
    .ivu-select-single .ivu-select-selection .ivu-select-placeholder, .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
      height: 100%;
    }

    .ivu-select-single .ivu-select-selection {
      width: 150px;
      height: 100%;
      line-height: 50px;
      display: flex;
      align-items: center;
    }
  }
</style>

<style lang="less" scoped>
  .input, .select {
    width: 150px;
    height: 50px;
    font-size: 18px;
    line-height: 50px;
    margin: 0 6px;
  }

  .content {
    padding: 20px 28px;
    // display: flex;
    // flex-direction: column;
    background-color: #f7f8fa;

    .scroll {
      // height: 70vh;
      // overflow-y: scroll;
    }

    .note {
      // display: grid;
      // grid-template-columns: 1fr 1fr;
      padding-bottom: 20px;
    }

    .count-setting {
      display: grid;
      grid-template-columns: 3fr 2fr 2fr;

      p {
        display: flex;
        line-height: 50px;
        margin-bottom: 10px;
      }
    }

    .add-next {
      width: 326px;
      color: #999;
      border-style: dashed;
    }
  }

  .save {
    display: block;
    margin: 40px auto 0;
    width: 200px;
    height: 50px;
    // margin-top: auto;
    // align-self: center;
  }
  @media screen and (max-width:768px){
      .content {
        .count-setting{
          grid-template-columns: 1fr;
        }
      }
  }
  @media screen and (max-width:576px){
   .content {
     .count-setting{
       p{
         flex-wrap: wrap;
         margin-bottom: 5px;
         >span{
           display: block;
           margin-bottom: 10px;
         }
       }
     }
   }
   .date{
     flex-direction: column;
     align-items: flex-start;
     justify-content: flex-start;
    p{
      margin-bottom: 10px;
    }
  }
   
  }
</style>
