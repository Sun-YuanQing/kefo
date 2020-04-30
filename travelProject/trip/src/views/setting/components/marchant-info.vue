<template>
    <div class="marchantInfo">
        <Form :label-width="140" class="form">
          <FormItem  label="商家代码：">
            <div>{{ formData.Code }}</div>
          </FormItem>
          <FormItem label="商家账号：">
            <div>{{formData.Phone}}</div>
          </FormItem>
          <FormItem label="商家名称：">
            <div>{{formData.SiteName}}</div>
          </FormItem>
          <FormItem label="店铺logo：" class="logo2">
            <img :src="formData.Logo" v-if="formData.Logo" alt="">
            <div v-else class="upload">
              <img src="@/assets/upload-icon.svg" alt="">
            </div>
          </FormItem>
          <FormItem label="商家电话：">
            <div><span v-if="formData.Tel_F">{{formData.Tel_F + '—'}}</span>{{formData.Tel_B}}</div>
          </FormItem>
          <FormItem label="商家地址：">
            <div>{{formData.Province + formData.City + formData.Town}}&nbsp;&nbsp;{{formData.Address}}</div>
          </FormItem>
          <FormItem label="商家说明：">
            <div>{{formData.Description}}</div>
          </FormItem>
        </Form>
        <div class="logo">
          <img v-if="formData.Logo" :src="formData.Logo"  alt="">
          <div v-else class="upload">
            <img src="@/assets/upload-icon.svg" alt="">
          </div>
          <p>商家logo</p>
        </div>
    </div>
</template>
<script>
export default {
    props: {
          formData:{
              type: Object,
              default: () => {},
              required: true
          },
    },
    data(){
        return{
            
        }
    }
}
</script>

<style lang="less" scoped>
    .marchantInfo{
        margin-top: 30px;
        position: relative;
        .logo{
            position: absolute;
            right: 80px;
            top: 10px;
            p{
                margin-top: 10px;
                margin-left: 25px;
            }
        }
        .logo2{
            display: none;
            p{
                display: none;
            }
        }
        .logo,.logo2{
            font-size: 16px;
            .upload{
              width: 120px;
              height: 120px;
              border: 1px dashed #999;
              line-height: 120px;
              text-align: center;
              border-radius: 4px;
              position: relative;
              .img{
                  border-radius: 4px;
                  position: absolute;
                  width: 126px;
                  height: 126px;
                  left: -3px;
                  top: -3px;
                  z-index: 3;
              }
            }
            > img{
                width: 120px;
                height: 120px;
                border-radius: 4px;
            }
        }
        @media screen and (max-width:576px){
            .logo{
                display: none;
            }
            .logo2{
                display: block;
            }
        
        }
        
    }
</style>