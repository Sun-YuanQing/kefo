<template>
    <div class="fullscreen addProduct">
        <Header :title="types == 0 ?'添加项目/服务':'编辑项目/服务'"></Header>
        <div class="content">
            <div class="basicSetting">
                <h3>基础设置</h3>
                <div class="line_input">
                  <div class="title"><span>*</span>编号：</div>
                  <Input  v-model="listData.Number" class="inputStyle" :maxlength="15" />
                </div>
                <div class="line_input">
                  <div class="title"><span>*</span>类别：</div>
                  <Select v-model="listData.ServiceType">
                    <Option v-for="item in ServiceTypes" :value="item.Id" :key="item.Id">{{ item.Name }}</Option>
                  </Select>
                  <div v-if="ServiceTypes.length == 0" class="addunits" >还没有类别，点击这里去<router-link to="projectClass">添加类别</router-link>吧!</div>
                </div>
                <div class="line_input">
                  <div class="title"><span>*</span>名称：</div>
                  <Input  v-model="listData.Name" class="inputStyle" :maxlength="15" />
                </div>
                <div class="line_input">
                  <div class="title"><span>*</span>价格：</div>
                  <InputNumber  :min="0" :max="100000000" v-model="listData.Price" class="inputStyle" ></InputNumber>
                  <div class="units">元</div>
                </div>
            </div>

           <div class="advancedSetting">
             <div style="display: flex;justify-content: space-between;">
               <h3>高级设置<span>（该项目需要在网店展示时请开启高级设置进行配置）</span></h3>
               <i-switch v-model="isShow"></i-switch>
             </div>
             <div class="form" v-if="isShow">
                <div class="line_input">
                  <div class="title">网店售价：</div>
                  <InputNumber :min="0" :max="100000000" v-model="listData.SellPrice" class="inputStyle"></InputNumber>
                  <div class="units">元</div>
                </div>
                <p style="color: #999;margin: -22px 0 20px 70px;">不填时默认只展示基础设置的价格</p>
                
                <div class="line_input">
                  <div class="title">网店展示：</div>
                  <RadioGroup v-model="listData.WebStatus">
                    <Radio style="margin-right: 20px;" :label="1" >展示</Radio>
                    <Radio :label="0" >不展示</Radio>
                  </RadioGroup>
                </div>

                <div class="line_input">
                  <div class="title">线上预约：</div>
                  <RadioGroup v-model="listData.AppointmentMode">
                    <Radio style="margin-right: 20px;" :label="1" >到店支付<span style="color: #999;">（先预约再到店付款）</span></Radio>
                    <Radio :label="2" >需支付<span style="color: #999;">（先付款再到店预约）</span></Radio>
                  </RadioGroup>
                </div>

                <div class="line_input">
                  <div class="title">服务时长：</div>
                  <InputNumber :min="1" :max="100000000" v-model="listData.ServiceTime" class="inputStyle"></InputNumber>
                  <div class="units">分钟<span style="color: #999;">（时长为大于0的整数）</span></div>
                </div>
                <p style="color: #E94E27;margin: -22px 0 20px 70px;">服务时长与预约时间有关联</p>

                <div class="line_input" style="align-items: flex-start;flex-wrap: no-wrap;">
                  <div class="title">商品图：</div>
                  <ul class="goodsImgList">
                      <li v-for="(item,index) in listData.ProductPhoto" :key="index">
                          <img class="item" :src="item.url">
                          <img class="delete" src="../../assets/delete-icon.svg" alt="" @click="deleteDoodsImgs(index)">
                      </li>
                      <li class="upload">
                        <input type="file" name="upLoad" ref="upLoad" value="" accept="image/jpg, image/jpeg, image/png"
                            multiple="multiple" @change="uploadGoods"/>
                        <img src="../../assets/upload-icon.svg" alt="" srcset="">
                      </li>
                  </ul>
                </div>
                <div style="color: #999;margin: -22px 0 20px 70px;">
                  <p>最多支持4张图片，为了保证图片质量请尽量上传16:9的尺寸，仅支持jpeg、jpg、png格式，大小不超过1.0MB</p>
                  <p style="margin-top: 5px;">在网店展示时图片按上传顺序展示，请谨慎选择第一张图片</p>
                </div>
                

                <div class="line_input" style="align-items: flex-start;">
                  <div class="title">详情图：</div>
                  <ul class="detailImgList">
                      <li v-for="(item,index) in listData.WebdetailPhoto" :key="index">
                          <img class="item" :src="item.url">
                          <img class="delete" src="../../assets/delete-icon.svg" alt="" @click="deleteDetailImgs(index)">
                      </li>
                      <li class="upload">
                        <input type="file" name="upLoad" ref="upLoad" value="" accept="image/jpg, image/jpeg, image/png"
                            multiple="multiple" @change="uploadDetail"/>
                        <img src="../../assets/upload-icon.svg" alt="" srcset="">
                      </li>
                  </ul>
                </div>
                <p style="color: #999;margin: -22px 0 20px 70px;">仅支持jpeg、jpg、png格式，大小不超过1.0MB</p>

                <div class="line_input" style="align-items: flex-start;">
                  <div class="title">说明：</div>
                  <div style="position: relative;height: auto;">
                    <Input v-model="listData.Description" :rows="4" type="textarea" :maxlength="100" class="textarea"
                         placeholder="输入对该项目/服务的介绍与说明，100字以内"/>
                    <p style="position: absolute;bottom: 0;right: 10px">{{listData.Description ? listData.Description.length : 0}}/100</p>
                  </div>
                  
                </div>


              </div>
           </div>

        </div>
        <div class="bottom">
            <div @click="changeStatus">
              <Button v-if="listData.Status==1">上架</Button>
              <Button v-else>下架</Button>
            </div>
            <Button class="save" @click="addTrue">保存</Button>
        </div>
    </div>
</template>
<script>
import Header from '@/components/route-header'
import { getObjectURL,getImgToBase64,dataURLtoFile } from '@/utils/format.js'
export default {
    components: { Header },
    data(){
        return{
            types: 0,
            ServiceTypes: [],
            listData: {
              Name: "",
              ServiceType: "",
              Number: "",
              Status: 1,  //0正常，1下架
              Price: 0,
              WebStatus: 0, // 1. 网站展示  0 不展示 （为1时默认展开页面  为0时折叠）
              SellPrice: 0,
              AppointmentMode:  1, //1.到店支付 2.需支付
              ServiceTime: 1,
              WebdetailPhoto: [],  //详情图
              ProductPhoto: [],     //商品图
              Description: "",
            },
            isShow: false
        }
    },
    created() {
      if (this.$route.query.id) {
        this.getId = this.$route.query.id;
        this.types = 1;
        this.getData();
      } else {
        this.types = 0;
      }
      this.iniData();
    },
    methods: {
      iniData() {
        this.axios.post('/Lable/GetServiceTypesBySiteId')
          .then(res => {
            if (res.data.Code === '0') {
              this.ServiceTypes = res.data.Data.ServiceTypes;
            } else {
              this.$Message.error(res.data.Message);
            }
          })
          .catch(e => {
            throw new Error(e)
          })
      },
      getData() {
        this.axios.post('/Lable/GetServiceById', { Id: this.getId })
          .then(res => {
            if (res.data.Code == 0) {
              let data = res.data.Data.Service;
              this.listData = data;
              this.isShow = this.listData.WebStatus== 1 ? true: false
              
              //网络地址图片转换成file文件
              if(this.listData.ProductPhoto && this.listData.ProductPhoto.length>0){
                  this.listData.ProductPhoto = this.listData.ProductPhoto.map(item => {
                      return { url: item,file: null }
                  })
                  let self = this;
                  for(let i=0; i<this.listData.ProductPhoto.length; i++){
                      let file;
                      getImgToBase64(this.listData.ProductPhoto[i].url,function(data){
                          file = dataURLtoFile(data,"ProductPhoto"+(i+1));
                          self.listData.ProductPhoto[i].file = file;
                      });
                  }
              }

              if(this.listData.WebdetailPhoto && this.listData.WebdetailPhoto.length>0){
                  this.listData.WebdetailPhoto = this.listData.WebdetailPhoto.map(item => {
                      return { url: item,file: null }
                  })
                  let self = this;
                  for(let i=0; i<this.listData.WebdetailPhoto.length; i++){
                      let file;
                      getImgToBase64(this.listData.WebdetailPhoto[i].url,function(data){
                              file = dataURLtoFile(data,"WebdetailPhoto"+(i+1));
                              self.listData.WebdetailPhoto[i].file = file;
                          });
                  }
              }
              
            } else {
              this.$Message.error(res.data.Message);
            }
          })
          .catch(e => {
            throw new Error(e)
          })
      },
      changeStatus(){
          this.$Modal.confirm({
            title: this.listData.Status == '0' ? '请确认是否将“'+this.listData.Name+'”下架' : '请确认是否将“'+this.listData.Name+'”上架',
            onOk: () => {
              let status = this.listData.Status == '0' ? '1' : '0';
              if(this.listData.Id){
                this.axios.post('/Lable/EditServiceStatus', { Id: this.listData.Id, Status: status })
                .then(res => {
                  let {Code,Message} = res.data;
                  if (Code === '0') {
                    this.$Message.success(status=='0' ? '上架成功' : '下架成功');
                    this.listData.Status = status;
                  } else {
                    this.$Message.error(Message);
                  }
                })
                .catch(e => {
                  throw new Error(e)
                })
              }else{
                this.listData.Status = status;
              }
              
            }
          })
        
        
      },
      addTrue() {
        let that = this;
        if (!that.listData.Number) {
          that.$Message.error('编号不为空');
          return false;
        }
        if (!that.listData.ServiceType) {
          that.$Message.error('类别不为空');
          return false;
        }
        if (!that.listData.Name) {
          that.$Message.error('名称不为空');
          return false;
        }
        if (!that.listData.Price) {
          that.$Message.error('价格不为空');
          return false;
        }

        that.$Spin.show();
        let formInfo = new FormData();
        if(this.listData.WebStatus == 1 && !this.listData.SellPrice){
          this.listData.SellPrice = this.listData.Price
        }
        // if(this.isShow){
          for(let j=0;j<this.listData.ProductPhoto.length;j++){
              formInfo.append("ProductPhoto"+(j+1),this.listData.ProductPhoto[j].file,"ProductPhoto"+(j+1));
          }
          for(let i=0;i<this.listData.WebdetailPhoto.length;i++){
              formInfo.append("WebdetailPhoto"+(i+1),this.listData.WebdetailPhoto[i].file,"WebdetailPhoto"+(i+1));
          }
        // }
        for(let x in this.listData){
            if(x != "ProductPhoto" && x != "WebdetailPhoto")
            formInfo.append(x,this.listData[x]);
        }
        
        that.axios.post('/Lable/EditService', formInfo,{
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
          .then(res => {
            that.$Spin.hide();
            if (res.data.Code == 0) {
              that.$Message.success(this.getId ? '修改成功' : "添加成功");
              that.$router.back();
            } else {
              this.$Message.error(res.data.Message);
            }
          })
          .catch(e => {
            throw new Error(e)
          })
      },

      uploadGoods(e){
        let files = e.target.files;
        let types = ['image/jpg', 'image/jpeg', 'image/png'];
        if((this.listData.ProductPhoto.length + files.length) > 4 ){
          this.$Message.warning("最多上传4张照片");
        }else{
          for(let i in files){
            
            if(files[i].size){
                let size = files[i].size/1024/1024;
                if(!types.includes(files[i].type)){
                    this.$Message.warning("上传的图片格式不正确！");
                    return ;
                }else if(size>1){
                    this.$Message.warning(files[i].name+" 这张图大小超过1MB");
                    return ;
                }else{
                    let item = {
                            file: files[i],
                            url: getObjectURL(files[i])
                        }
                    this.listData.ProductPhoto.push(item);
                }
                
            }
            
          }
          // console.log(this.listData.ProductPhoto)
        }
        
      },

      uploadDetail(e){
        let files = e.target.files;
        let types = ['image/jpg', 'image/jpeg', 'image/png'];
        for(let i in files){
            
            if(files[i].size){
                let size = files[i].size/1024/1024;
                if(!types.includes(files[i].type)){
                    this.$Message.warning("上传的图片格式不正确！");
                    return ;
                }else if(size>1){
                    this.$Message.warning(files[i].name+" 这张图大小超过1MB");
                    return ;
                }else{
                  let item = {
                            file: files[i],
                            url: getObjectURL(files[i])
                        }
                    this.listData.WebdetailPhoto.push(item);
                }
                
            }
            
          }
          
          // console.log(this.listData.WebdetailPhoto)
        
      },

      deleteDoodsImgs(index){
        this.$Modal.confirm({
            title: '请确认是否删除此照片',
            onOk: () => {
              this.listData.ProductPhoto.splice(index,1);
            }
        })
        
      },

      deleteDetailImgs(index){
        this.$Modal.confirm({
            title: '请确认是否删除此照片',
            onOk: () => {
              this.listData.WebdetailPhoto.splice(index,1);
            }
        })
      },



      
    }


    
}
</script>
<style lang="less">
.addProduct{
    .ivu-select {
      width: auto;
      margin-right: 15px;
    }
    .ivu-select-single .ivu-select-selection {
      width: 320px;
    }
    @media screen and (max-width: 768px) {
      .ivu-select-single .ivu-select-selection {
        width: 190px;
      }
    }
    .ivu-radio-inner:after{
      background-color: #F1A56F;
    }
    .ivu-radio-checked .ivu-radio-inner{
      border-color: #F1A56F;
    }
    .ivu-switch-checked {
        background-color: #3275F5;
        border-color: #3275F5;
    }
}
  
</style>
<style lang="less" scoped>
  .addProduct{
      background-color: #F7F8FA;
      .bottom{
          background: #fff;
          width: 100%;
          border-top: 1px solid #E4E4E4;
          display: flex;
          justify-content: center;
          padding: 15px 0;
          position: fixed;
          bottom: 0;
          .ivu-btn{
            height: 40px;
            width: 140px;
            margin-right: 30px;
            &.save{
              color:#fff;
              background-color: #333;
              color: #fff;
            }
          }

      }
      .content{
            padding-bottom: 81px;
            h3{
              margin-bottom: 30px;
              span{
                color: #999;
                font-weight: normal;
                font-size: 14px;
              }
            }
            .basicSetting,.advancedSetting{
              margin: 10px;
              background-color: #fff;
              padding: 40px 30px;
              .line_input {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                margin-bottom: 20px;
                .title {
                  font-size: 14px;
                  color: #333333;
                  width: 70px;
                  white-space: nowrap;
                  span {
                    display: inline-block;
                    margin-right: 4px;
                    line-height: 1;
                    font-family: SimSun;
                    font-size: 14px;
                    color: #ed4014;
                  }
                }
                .inputStyle {
                  width: 320px;
                  height: 44px;
                  line-height: 44px;
                  margin-right: 15px;
                  font-size: 14px;
                }
                .textarea{
                   width: 700px;
                   font-size: 14px;
                   line-height: 1.6;
                   height: auto;
                }
                @media screen and (max-width: 767px) {
                  .inputStyle {
                    width: 190px;
                  }
                  .textarea{
                    width: 460px;
                  }
                }
                .units {
                  font-size: 14px;
                  color: #333333;
                }
                .addunits {
                  white-space: nowrap;
                  font-size: 14px;
                  color: #333333;
                  a {
                    color: #e94e27;
                    border-bottom: 1px solid #e94e27;
                  }
                }
              }
              @media screen and (max-width: 576px) {
                .line_input {
                  width: 310px;
                  .textarea{
                    width: 100%;
                  }
                  .addunits {
                    margin-top: 10px;
                    margin-left: 60px;
                    a {
                      color: #e94e27;
                      border-bottom: 1px solid #e94e27;
                    }
                  }
                }
              }
              
            }
            .advancedSetting{
                .line_input{
                  margin-bottom: 30px;
                }
                .goodsImgList{
                  li,img.item{
                    width: 240px;
                    height: 135px;
                  }
                }
                .detailImgList{
                  li,img.item{
                   width: 240px;
                  }
                }
                
                .goodsImgList,.detailImgList{
                  display: flex;
                  flex-wrap:wrap;
                  width: calc(100% - 70px);
                  li{
                    margin-right: 20px;
                    margin-bottom: 10px;
                    border-radius: 4px;
                    position: relative;
                    .delete{
                      position: absolute;
                      right: -5px;
                      top: -5px;
                    }
                  }
                }
                .upload{
                  width: 240px;
                  height: 135px;
                  border: 1px dashed #999;
                  line-height: 135px;
                  text-align: center;
                  input{
                    position: absolute;
                    width: 240px;
                    height: 135px;
                    right: 0;
                    top: 0;
                    cursor: pointer;
                    opacity: 0;
                    z-index: 5;
                  }
                }
                
                
              
            }
            
      }
  }
  
    
</style>