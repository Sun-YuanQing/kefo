<template>
    <div class="editedInfo">
        <Form  ref="form" :model="formValidate" :rules="ruleValidate"
            :label-width="140" class="form" >
            <FormItem label="商家代码：">
                <Input v-model="formValidate.Code" :disabled="true"/>
            </FormItem>
            <FormItem label="商家账号：" prop="Phone">
                 <Input v-model="formValidate.Phone" :disabled="true"/>
            </FormItem>
            <FormItem label="商家名称：" prop="SiteName">
                <Input v-model="formValidate.SiteName" :maxlength="16"/>
            </FormItem>
            <FormItem label="店铺logo" prop="Logo" class="logo2">
                <div class="upload" 
                    :style="{'border': formValidate.Logo && formValidate.Logo.url ? 'none' : '1px dashed #999'}">
                    <input type="file" name="upLoadLogo" ref="upLoad" value="" 
                        accept="image/jpg, image/jpeg, image/png" @change="uploadLogo"/>
                    <img src="@/assets/upload-icon.svg" alt="" srcset="">
                    <img :src="formValidate.Logo.url" alt="" class="img" v-if="formValidate.Logo && formValidate.Logo.url">
                </div>
                <p v-if="formValidate.Logo && formValidate.Logo.url" style="color: #E94E27;">重新上传</p>
                <p v-else>店铺logo</p>
            </FormItem>
            <FormItem label="客服电话"  required style="margin-bottom: 30px;">
                <Row class="row">
                    <Col span="6" class="auto">
                        <FormItem prop="Tel_F" style="margin-bottom: 0;" class="interval">
                            <Input v-model="formValidate.Tel_F" placeholder="区号" :maxlength="4"></Input>
                        </FormItem>
                    </Col>
                    <Col span="2" style="text-align: center">-</Col>
                    <Col span="16" class="auto">
                        <FormItem prop="Tel_B" style="margin-bottom: 0;" class="interval">
                            <Input v-model="formValidate.Tel_B" placeholder="输入手机号时区号可空" :maxlength="11"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <p style="color: #999;font-size: 14px;margin-top: 5px;">此电话将于网店展示、预约、客户短信提醒等</p>
            </FormItem>
            <FormItem label="店铺地址" required style="margin-bottom: 30px;">
                <FormItem prop="Province" style="margin-bottom: 20px;" class="row">
                    <v-distpicker :province="formValidate.Province" 
                                    :city="formValidate.City" 
                                    :area="formValidate.Town"
                                    @province="onChangeProvince" 
                                    @city="onChangeCity" 
                                    @area="onChangeArea"></v-distpicker>
                </FormItem>
                <FormItem prop="Address" class="interval">
                    <div style="display: flex;flex-wrap: wrap;">
                        <Input v-model="formValidate.Address" placeholder="详细地址，例：沙河街道16号楼5层501"></Input>
                        <div    @click="getMyLocation" class="detailAddress">
                            <img src="@/assets/location-icon.svg" alt="">
                            <span style="padding-left: 5px;color: #3275F5">定位地址</span>
                        </div>
                    </div>
                </FormItem>
                <p  style="color: #999;font-size: 14px;margin-top: 4px;">店铺地址将会展示给会员，请填写详细地址，包括楼层、门牌号，方便会员查找</p>
            </FormItem>
            <FormItem label="店铺说明" prop="Description">
                <div class="textareaWrap">
                    <Input  v-model="formValidate.Description" type="textarea" class="textarea"
                            :autosize="{minRows: 4,maxRows: 8}" :maxlength="100"
                            placeholder="介绍一下你的店铺吧，100字以内" />
                    <div class="tip">{{formValidate.Description ? formValidate.Description.length : 0}}/100</div>
                </div>
            </FormItem>
            <FormItem class="logo" prop="Logo">
                <div class="upload"
                     :style="{'border': formValidate.Logo && formValidate.Logo.url ? 'none' : '1px dashed #999'}">
                    <input type="file" name="upLoadLogo" ref="upLoad" value="" 
                        accept="image/jpg, image/jpeg, image/png" @change="uploadLogo"/>
                    <img src="@/assets/upload-icon.svg" alt="" srcset="">
                    <img :src="formValidate.Logo.url" alt="" class="img" v-if="formValidate.Logo && formValidate.Logo.url">
                </div>
                <p v-if="formValidate.Logo && formValidate.Logo.url" style="color: #E94E27;">重新上传</p>
                <p v-else>商家logo</p>
            </FormItem>
        </Form>

        <tx-map ref="txMap" :isShowMap="isShowMap" type="2" @closeMap="closeMap"></tx-map>
    </div>
</template>
<script>
import { getObjectURL,getImgToBase64,dataURLtoFile } from '@/utils/format.js'
import VDistpicker from 'v-distpicker'
import TxMap from '@/components/map.vue'
import { updateAdminUser } from '@/api/setting.js'
export default {
    components:{ VDistpicker, TxMap },
    props: {
        formData:{
            type: Object,
            default: () => {},
            required: true
        }
    },
    data(){
        const validateLogo = (rule, value, callback) => {
            if(!this.formValidate.Logo && !this.formValidate.Logo.url){
                callback(new Error('请上传商家logo'));
            }else{
                callback();
            }
        };

        const validateTelCode = (rule, value, callback) => {
            let phone = /^\d{7,8}$/,area = /^0\d{2,3}$/
            if(value==''){
                if(phone.test(this.formValidate.Tel_B)){
                    callback(new Error('请填写区号'));
                }else{
                    callback();
                }
            }else{
                if(!area.test(value)){
                    callback(new Error('区号格式不正确'));
                }else{
                    callback();
                }
            }
            
        };
        const validateMobile  = (rule, value, callback) => {
            let mobile = /^1\d{10}$/ , phone = /^\d{7,8}$/;
            if(value==''){
                callback(new Error('请填写手机号/座机号'));
            }else if(!mobile.test(value) && !phone.test(value)){
                callback(new Error('手机号/座机号格式不正确'));
            }else{
                callback();
            }
        }
        const validateProvince = (rule, value, callback) => {
            if(this.formValidate.Province=='' && this.formValidate.City=='' && this.formValidate.Town==''){
                callback(new Error('请选择省市区'));
            }else if(this.formValidate.City=='' && this.formValidate.Town==''){
                callback(new Error('请选择市和区'));
            }else if(this.formValidate.Province==''){
                callback(new Error('请选择省'));
            }else if(this.formValidate.City==''){
                callback(new Error('请选择城市'));
            }else if(this.formValidate.Town==''){
                callback(new Error('请选择区域'));
            }
            else{
                callback();
            }
        }

        return{
            isShowMap: false,
            code: '',
            formValidate: {
                // SiteName: '',
                // Code: '',
                // Phone: '',
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
            },
            ruleValidate: { 
                SiteName:[
                    { required: true, message: '请输入商家名称', trigger: 'blur' },
                ],
                Tel_B:[
                    { required: true, validator: validateMobile, trigger: 'blur' },
                ],
                Tel_F: [
                    { validator: validateTelCode, trigger: 'blur' },
                ],
                Logo:[
                    { required: true, validator: validateLogo, trigger: 'change' },
                ],
                Province: [
                    { required: true, validator: validateProvince, trigger: 'change' },
                ],
                Address:[
                    { required: true, message: '请输入详细地址', trigger: 'blur' },
                ],
            }
        }
    },
    watch: {
      // 因为不能直接修改 props 里的属性，所以不能直接把 formData 通过v-model进行绑定
      // 在这里我们需要监听 formData，当它发生变化时，立即将值赋给 data 里的 form
      formData: {
        immediate: true,
        handler (val) {
          this.formValidate = JSON.parse(JSON.stringify(val));
        }
      }
    },
    created() {
        // this.code = 'GanZhou' + this.formValidate.Code;
        //网络地址图片转换成file文件
        if(this.formValidate.Logo){
            this.formValidate.Logo = {url: this.formValidate.Logo,file: null};
            let self = this;
            getImgToBase64(this.formValidate.Logo.url,function(data){
                self.formValidate.Logo.file = dataURLtoFile(data,"Logo");
            });
            
        }
    },
    methods: {
        //省市区修改
        onChangeProvince(data) {
            this.formValidate.Province = data.value;
        },
        onChangeCity(data) {
            this.formValidate.City = data.value;
        },
        onChangeArea(data) {
            this.formValidate.Town = data.value;
        },

        //上传logo
        uploadLogo(e){
            let file = e.target.files[0];
            let types = ['image/jpg', 'image/jpeg', 'image/png'];
            if(file){
                let size = file.size/1024/1024;
                if(!types.includes(file.type)){
                    this.$Message.warning("上传的图片格式不正确！");
                    return ;
                }else if(size>1){
                    this.$Message.warning(file.name+" 这张图大小超过1MB");
                    return ;
                }else{
                    this.formValidate.Logo = {
                        file: file,
                        url: getObjectURL(file)
                    };
                    this.$refs.upLoad.value = null;
                }
                
            }
        },

        handleSubmit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.updateUserInfo();
                } else {
                this.$Message.error('有必填信息未填写');
                }
            })
        },
        updateUserInfo() {
            this.$Spin.show();
            console.log(88,this.formValidate)
            let formInfo = new FormData();
            formInfo.append("Logo",this.formValidate.Logo.file,"Logo");
            for(let x in this.formValidate){
                if(x != "Logo"){
                    formInfo.append(x,this.formValidate[x]);
                }
            }
            updateAdminUser(formInfo).then(res => {
                this.$Spin.hide();
                this.$Message.success("修改成功");
                this.$parent.flag = 1;
                this.$parent.getInfo();
                
            }).catch(err => {
                this.$Spin.hide();
            })
        },
        
        //定位
        getMyLocation(){
            this.isShowMap=true;
            this.$refs.txMap.getLocation();
        },
        closeMap(){
            this.isShowMap=false;
        }

        
    }
}
</script>
<style lang="less">
  .mapModal .ivu-modal {
    height: 95%;
    overflow-y: auto;
    .searchInput{
      width: calc(100% - 102px);
      .ivu-input{
        padding-left: 28px;
        font-size: 14px;
      }
    }
  }
  .editedInfo{
    .ivu-form {
        .distpicker-address-wrapper{
            select{
                width: 32.2%;
            }
        }
        .ivu-select {
            width: auto;
            margin-right: 15px;
        }
        .auto .ivu-input-wrapper{
            width: 100%;
        }
        .interval .ivu-form-item-error-tip{
            top: 150%;
        }
    }
  }
</style>
<style lang="less" scoped>
    .editedInfo{
        margin-top: 30px;
        position: relative;
        .ivu-form{
            p{
                line-height: 1.3;
            }
            .ivu-form-item {
                .row{
                    width: 320px;
                }
                @media screen and (max-width: 768px){
                    .row{
                        width: 230px;
                    }
                }
                .ivu-form-item-label {
                    font-size: 20px !important;
                }
                .ivu-form-item-content {
                    font-size: 20px;
                }
            }
            .detailAddress{
                display: flex;
                align-items: center;
                height: 40px;
                padding-left: 10px;
                cursor: pointer
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
                    input{
                        position: absolute;
                        width: 120px;
                        height: 120px;
                        right: 0;
                        top: 0;
                        cursor: pointer;
                        opacity: 0;
                        z-index: 5;
                    }
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
    }

    .mapModal{
        .content{
            margin-top: -15px;
            .head{
                display: flex;
                align-items: center;
            }
            .container{
                margin-top: 10px;
                display: flex;
                flex-wrap: wrap;
                #container {
                    min-width: 420px;
                    min-height:380px;
                    margin-right: 10px;
                }
                ul{
                    width: calc(100% - 430px);
                    margin-top: 10px;
                    height: 380px;
                    overflow-y: auto;
                    li{
                        margin-bottom: 10px;
                        line-height: 1.6;
                        cursor: pointer;
                        p:nth-of-type(1) {
                            display: flex;
                            font-size: 14px;
                            align-items: center;
                            span{
                                display: inline-block;
                                width: 6px;
                                height: 6px;
                                border-radius: 50%;
                                background: #c5c5c5;
                                margin-right: 5px;
                            }
                        }
                        p:nth-of-type(2){
                            font-size: 12px;
                            color: #999;
                        }
                    }
                    .selected{
                        p:nth-of-type(1){
                            color: #E94E27;
                            span{
                            background: #E94E27;
                            }
                        }
                    }
                }
            }
            
        }
    }
</style>