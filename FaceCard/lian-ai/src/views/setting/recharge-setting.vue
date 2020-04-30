<template>
  <FullPage title="充值预设金额" class="recharge-setting">
    <div class="body">
      <h3>说明</h3>
      <p>提前预设充值金额选项，方便快捷充值，可预设5个。点击可编辑、删除金额</p>
      <ul>
          <li v-for="(item,index) in dataList" :key="index" @click="handleEdit(item)"><span>{{item}}</span>元</li>
          <li class="last" v-if="dataList.length<6" @click="handleEdit(0)">+</li>
      </ul>
    </div>
    <Modal v-model="isEdit"  width="420" 
          :mask-closable="false" :footer-hide="true" class="model">
      <p slot="header" class="title">编辑</p>
      <div>
          <div class="form">
              金额
              <InputNumber v-model="amount" 
                        :parser= "value => `${value}`.replace(/([0-9]+.[0-9]{2})[0-9]*/,'$1')"
                        :min="0" :max="9999999999"></InputNumber> 元
          </div>
          <Button type="primary">保存</Button>
      </div>
    </Modal>
  </FullPage>
</template>

<script>
  import FullPage from 'src/components/fullscreen-page'

  export default {
    name: 'rechargeSetting',
    components: { FullPage },
    data() {
      return {
          dataList: [50,100,500],
          isEdit: false,
          amount: 0,
      }
        
    },
    created() {
      //this.getConfig()
    },
    
    methods: {
      getConfig() {
        const url = '/Card/GetCardStyle?type=1'
        this.$axios.post(url).then(res => {
          if (res.data.Code === '0') {
            const data = res.data.Data;
            this.config = { ...data, CurrrntStyleId: data.Random ? '' : data.CurrrntStyleId };
          } else {
            this.$Message.error(res.data.Message);
          }
        }).catch(e => {
          throw new Error(e)
        })
      },
      handleEdit(val){
       this.isEdit = true; 
       this.amount = val;
    }
    },
    
  }
</script>
<style>
     .ivu-input-number-input{
        height: 40px;
        line-height: 40px;
        text-align: center;
    }
</style>

<style lang="less" scoped>
  ul {
    margin-top: 30px;
    display: flex;
    flex-wrap: wrap;
    li{
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 160px;
        height: 60px;
        margin-bottom: 10px;
        margin-right: 30px;
        border-radius: 4px;
        border: 1px solid #E4E4E4;
        background: #fff;
        font-size: 18px;
        font-weight: 700;
        cursor: pointer;
        span{
            font-size: 22px;
        }
    }
    .last{
        font-weight: 100;
        font-size: 25px;
    }

  }

  .model{
        .title{
            text-align: center;
            font-size: 18px;
            margin: 10px 0 -8px;
            color: #333;
            } 
        .ivu-modal-body > div {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 18px;
            font-weight: 700;
            .form{
                width: 280px;
                margin: 60px 0;
                .ivu-input-number{
                    height: 40px;
                    width: 200px;
                    text-align: center;
                }
            }
            .ivu-btn{
                width: 200px;
                height: 40px;
                font-size: 16px;
                margin-bottom: 20px;
            }
        }
        
            
    }
</style>
