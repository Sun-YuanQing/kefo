<template>
    <div class="marchantWrap">
      <marchant-info v-if="flag==1" :formData="formData"></marchant-info>
      <edited-info v-if="flag==2" ref="editedInfo" :formData="formData"></edited-info>
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
import MarchantInfo from '../components/marchant-info'
import EditedInfo from '../components/edited-info'
import { getAdminUser } from '@/api/setting.js'
export default {
   components: { MarchantInfo ,EditedInfo},
    data(){
        return{
            flag: 1,
            formData: {
                // SiteName: '',
                // Code: '',
                // Account: '',
                // Description: '',
                // Logo: '',
                // Tel_F: '',
                // Tel_B: '',
                // Province: '',
                // City: '',
                // Town: '',
                // Address: '',
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
          this.$refs.editedInfo.handleSubmit()
      },

      getInfo(){
          this.$Spin.show();
          getAdminUser().then(res => {
              this.formData = res.Data.LoginUser;
              this.$Spin.hide();
              
          }).catch(err => {
              this.$Spin.hide();
          })
      },
    }
}
</script>

<style lang="less" scoped>
    .marchantWrap{
        margin-top: 30px;
        position: relative;
        padding-bottom: 80px;
        .bottom{
            background: #fff;
            // width: calc(100% - 30px);
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