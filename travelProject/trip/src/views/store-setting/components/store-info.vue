<template>
    <div class="storeInfo">
        <Form :label-width="140" class="form">
          <FormItem  label="门店编号：">
            <div>{{ formData.SiteCode }}</div>
          </FormItem>
          <FormItem label="门店账号：">
            <div>{{formData.LoginName}}</div>
          </FormItem>
          <FormItem label="门店名称：">
            <div>{{formData.SiteName}}</div>
          </FormItem>
           <FormItem label="门店归属：">
            <div>{{formData.BelongName}}</div>
          </FormItem>
           <FormItem label="经营时间：">
            <div>{{formData.OperaDates}}&nbsp;&nbsp;
              {{formData.OperaHourStart}}—{{formData.OperaHourEnd}}
            </div>
          </FormItem>
          <FormItem label="门店logo：" class="logo2">
            <img :src="formData.Logo" v-if="formData.Logo" alt="">
            <div v-else class="upload">
              <img src="@/assets/upload-icon.svg" alt="">
            </div>
          </FormItem>
          <FormItem label="门店地址：">
            <div>{{formData.Province + formData.City + formData.Area}}&nbsp;&nbsp;{{formData.Address}}</div>
          </FormItem>
          <FormItem label="门店电话：">
            <div>{{formData.TelCode}}—{{formData.Tel}}</div>
          </FormItem>
           <FormItem label="门店照片：">
            <ul class="imgList">
              <li v-for="(item,index) in formData.Photo" :key="index">
                <img :src="item" alt="" class="item">
              </li>
            </ul>
          </FormItem>
          <FormItem label="门店说明：">
            <div>{{formData.Desc}}</div>
          </FormItem>
          <FormItem label="门店宣言：">
            <div>{{formData.SiteTitle}}</div>
          </FormItem>
          <FormItem label="门店摄像头：">
            <div>{{formData.IsHaveVudio ? '已开启' : '未开启'}}</div>
          </FormItem>
        </Form>
        <div class="logo">
          <img v-if="formData.Logo" :src="formData.Logo"  alt="">
          <div v-else class="upload">
            <img src="@/assets/upload-icon.svg" alt="">
          </div>
          <p>门店logo</p>
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
    .storeInfo{
        position: relative;
        margin-top: 20px;
        .form{
          .imgList{
            display: flex;
            flex-wrap:wrap;
            li{
                margin-right: 20px;
                margin-bottom: 10px;
            }
            li,img.item{
              width: 240px;
              height: 135px;
              border-radius: 4px;
            }
          }
        }
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