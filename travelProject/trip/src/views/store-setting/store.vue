<template>
    <div class="storeWrap">
      <store-info v-if="flag==1" :formData="formData"></store-info>
      <edited-store v-if="flag==2" ref="editedStore" :formData="formData"></edited-store>
      <div class="bottom">
          <Button type="primary" @click="flag=2" v-if="flag==1">编辑</Button>
          <div v-if="flag==2" class="btnWrap">
              <Button @click="flag=1">取消</Button>
              <Button type="primary" @click="updataInfo">保存</Button>
          </div>
      </div>  
    </div>
</template>
<script>
import StoreInfo from './components/store-info.vue'
import EditedStore from './components/edited-store'
import { getSiteSetInfo } from '@/api/store-setting.js'
export default {
   components: { StoreInfo ,EditedStore },
    data(){
        return{
            flag: 1,
            formData: {
                // Lon: '', //经度
                // Lat: '' //纬度
            }
        }
    },
    created(){
      this.getInfo();
    },
    methods: {
      updataInfo(){
          this.$refs.editedStore.handleSubmit()
      },

      getInfo(){
          this.$Spin.show();
          getSiteSetInfo().then(res => {
              this.formData = res.Data;
              this.$Spin.hide();
              
          }).catch(err => {
              this.$Spin.hide();
          })
      },
    }
}
</script>

<style lang="less" scoped>
    .storeWrap{
        padding-bottom: 80px;
        .bottom{
            background: #fff;
            border-top: 1px solid #E4E4E4;
            display: flex;
            justify-content: center;
            padding: 15px 0;
            position: fixed;
            bottom: 15px;
            left: 125px;
            right: 15px;
            z-index: 99;
            > .ivu-btn{
                height: 40px;
                width: 200px;
            }
            .btnWrap{
                .ivu-btn{
                    height: 40px;
                    width: 120px;
                    &:first-of-type{
                        margin-right: 30px;
                    }
                }
            }
        }
        .logo{
            position: absolute;
            right: 80px;
            top: 30px;
            p{
                margin-top: 10px;
                margin-left: 25px;
            }
        }
        
        
    }
</style>