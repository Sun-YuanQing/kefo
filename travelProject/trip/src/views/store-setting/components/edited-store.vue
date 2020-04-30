<template>
    <div class="editedStore">
        <Form  ref="form" :model="formValidate" :rules="ruleValidate"
            :label-width="140" class="form" >
            <FormItem label="门店编码：" prop="SiteCode">
                <Input v-model="formValidate.SiteCode" :disabled="true"/>
            </FormItem>
            <FormItem label="门店账号：" prop="LoginName">
                <Input v-model="formValidate.LoginName" :disabled="true"/>
            </FormItem>
            <FormItem label="门店归属：" prop="BelongName">
                <Input v-model="formValidate.BelongName" :disabled="true"/>
            </FormItem>
            <FormItem label="门店名称：" prop="SiteName">
                <Input v-model="formValidate.SiteName" :maxlength="30"/>
            </FormItem>
            <FormItem label="经营时间" required style="margin-bottom: 36px;">
                <FormItem prop="OperaDates" class="week" style="margin-bottom: 20px;">
                    <div style="position: relative" class="row" @click="isShowWeek = !isShowWeek">
                        <Input :value="selectedWeeks" :readonly="true"/>
                        <img :src="isShowWeek ? require('@/assets/arrow-up.svg') : require('@/assets/arrow-down.svg')" 
                            alt="" style="position: absolute;top: 20px;right: 20px;cursor: pointer;">
                    </div>
                    <CheckboxGroup v-if="isShowWeek" v-model="formValidate.OperaDates" class="weekCheck">
                        <Checkbox v-for="(week,index) in weeks" 
                                    :key="index" :label="week"></Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <Row class="row">
                        <Col span="11" class="auto">
                            <FormItem prop="OperaHourStart" style="margin-bottom: 0">
                                <TimePicker format="HH:mm" v-model="formValidate.OperaHourStart"></TimePicker>
                            </FormItem>
                        </Col>
                        <Col span="2" style="text-align: center">-</Col>
                        <Col span="11" class="auto">
                            <FormItem prop="OperaHourEnd" style="margin-bottom: 0">
                                <TimePicker format="HH:mm" v-model="formValidate.OperaHourEnd"></TimePicker>
                            </FormItem>
                        </Col>
                </Row>
            </FormItem>
            <FormItem label="门店logo" prop="Logo" class="logo2">
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
            <FormItem label="门店地址" required style="margin-bottom: 30px;">
                <FormItem prop="Province" style="margin-bottom: 20px;" class="row">
                    <v-distpicker :province="formValidate.Province" 
                                    :city="formValidate.City" 
                                    :area="formValidate.Area"
                                    @province="onChangeProvince" 
                                    @city="onChangeCity" 
                                    @area="onChangeArea"></v-distpicker>
                </FormItem>
                <FormItem prop="Address" class="interval">
                    <div style="display: flex;flex-wrap: wrap;">
                        <Input v-model="formValidate.Address" placeholder="详细地址，例：沙河街道16号楼5层501"/>
                        <div    @click="getMyLocation" class="detailAddress">
                            <img src="@/assets/location-icon.svg" alt="">
                            <span style="padding-left: 5px;color: #3275F5">定位地址</span>
                        </div>
                    </div>
                </FormItem>
                <p  style="color: #999;font-size: 14px;margin-top: 4px;">店铺地址将会展示给会员，请填写详细地址，包括楼层、门牌号，方便会员查找</p>
            </FormItem>
            <FormItem label="门店电话"  required style="margin-bottom: 30px;">
                <Row class="row">
                    <Col span="6" class="auto">
                        <FormItem prop="TelCode" style="margin-bottom: 0;" class="interval">
                            <Input v-model="formValidate.TelCode" placeholder="区号" />
                        </FormItem>
                    </Col>
                    <Col span="2" style="text-align: center">-</Col>
                    <Col span="16" class="auto">
                        <FormItem prop="Tel" style="margin-bottom: 0;" class="interval">
                            <Input v-model="formValidate.Tel" placeholder="输入手机号时区号可空" />
                        </FormItem>
                    </Col>
                </Row>
                <p style="color: #999;font-size: 14px;margin-top: 5px;">此电话将于网店展示、预约、客户短信提醒等</p>
            </FormItem>
            <FormItem label="门店照片" prop="Photo">
                <ul class="imgList">
                    <li v-for="(item,index) in formValidate.Photo" :key="index">
                        <img class="item" :src="item.url">
                        <img class="delete" src="@/assets/delete-icon.svg" alt="" @click="deleteImg(index)">
                    </li>
                    <li class="upload">
                        <input type="file" name="upLoad" ref="upLoad" value="" accept="image/jpg, image/jpeg, image/png"
                            multiple="multiple" @change="uploadImg"/>
                        <img src="@/assets/upload-icon.svg" alt="" srcset="">
                    </li>
                </ul>
          <p style="color: #999;margin-top: 0px;">最多支持4张图片，为了保证图片质量请尽量上传16:9的尺寸，仅支持jpeg、jpg、png格式，大小不超过10MB</p>
            </FormItem>

            <FormItem label="门店说明" prop="Desc">
                <div class="textareaWrap">
                    <Input  v-model="formValidate.Desc" type="textarea" class="textarea"
                            :autosize="{minRows: 4,maxRows: 8}" :maxlength="100"
                            placeholder="介绍一下你的店铺吧，100字以内" />
                    <div class="tip">{{formValidate.Desc ? formValidate.Desc.length : 0}}/100</div>
                </div>
            </FormItem>
            <FormItem label="门店宣言" prop="SiteTitle">
                <div class="textareaWrap">
                   <Input  v-model="formValidate.SiteTitle" :maxlength="20" class="textarea"
                           placeholder="设置一下你的门店宣言吧，20字以内" />
                </div>
                
            </FormItem>
            <FormItem label="门店摄像头" required prop="IsHaveVudio">
                <i-switch v-model="formValidate.IsHaveVudio"></i-switch>
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
                <p v-else>门店logo</p>
            </FormItem>
        </Form>
        <tx-map ref="txMap" :isShowMap="isShowMap" type="1" @closeMap="closeMap"></tx-map>

    </div>
</template>
<script>
import { getObjectURL,getImgToBase64,dataURLtoFile } from '@/utils/format.js'
import VDistpicker from 'v-distpicker'
import { updateSiteSet } from '@/api/store-setting.js'
import TxMap from '@/components/map.vue'
export default {
    components:{ VDistpicker,TxMap },
    props: {
        formData:{
            type: Object,
            default: () => {},
            required: true
        }
    },
    data(){
        const validateDate = (rule, value, callback) => {
            if(this.formValidate.OperaDates.length===0){
                callback(new Error('请选择经营时间'));
            }else{
                callback();
            }
        };
        const validatePhoto = (rule, value, callback) => {
            if(this.formValidate.Photo.length===0){
                callback(new Error('请上传店铺照片'));
            }else{
                callback();
            }
        };
        const validateLogo = (rule, value, callback) => {
            if(!this.formValidate.Logo || !this.formValidate.Logo.url){
                callback(new Error('请上传商家logo'));
            }else{
                callback();
            }
        };

        const validateTelCode = (rule, value, callback) => {
            let phone = /^\d{7,8}$/,area = /^0\d{2,3}$/
            if(value==''){
                if(phone.test(this.formValidate.Tel)){
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
            if(this.formValidate.Province=='' && this.formValidate.City=='' && this.formValidate.Area==''){
                callback(new Error('请选择省市区'));
            }else if(this.formValidate.City=='' && this.formValidate.Area==''){
                callback(new Error('请选择市和区'));
            }else if(this.formValidate.Province==''){
                callback(new Error('请选择省'));
            }else if(this.formValidate.City==''){
                callback(new Error('请选择城市'));
            }else if(this.formValidate.Area==''){
                callback(new Error('请选择区域'));
            }
            else{
                callback();
            }
        }

        return{
            isShowWeek: false,
            weeks: ["星期一","星期二","星期三","星期四","星期五","星期六","星期日"],
            isShowMap: false,
            formValidate: {
                // Lon: '', //经度
                // Lat: '' //纬度
            },
            ruleValidate: { 
                SiteName:[
                    { required: true, message: '请输入门店名称', trigger: 'blur' },
                ],
                OperaDates:[
                    { required: true, validator: validateDate, trigger: 'change' },
                ],
                Tel:[
                    { required: true, validator: validateMobile, trigger: 'blur' },
                ],
                TelCode: [
                    { validator: validateTelCode, trigger: 'blur' },
                ],
                Logo:[
                    { required: true, validator: validateLogo, trigger: 'change' },
                ],
                Photo:[
                    { required: true, validator: validatePhoto, trigger: 'change' },
                ],
                Province: [
                    { required: true, validator: validateProvince, trigger: 'change' },
                ],
                Address:[
                    { required: true, message: '请输入详细地址', trigger: 'blur' },
                ],
                SiteTitle: [
                    { required: true, message: '请输入门店宣言', trigger: 'blur' },
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
    computed: {
        selectedWeeks(){
            if(this.formValidate.OperaDates){
                return this.formValidate.OperaDates.join(',');
            }else{
                return '';
            }
        
        },
    },
    created() {
        this.formValidate.OperaDates = this.formValidate.OperaDates ?  this.formValidate.OperaDates.split(',') : [];
        this.formValidate.Photo = this.formValidate.Photo ? this.formValidate.Photo : [];
        //网络地址图片转换成file文件
        if(this.formValidate.Photo.length>0){
            this.formValidate.Photo = this.formValidate.Photo.map(item => {
                return { url: item,file: null }
            })
            let self = this;
            for(let i=0; i<this.formValidate.Photo.length; i++){
                let file;
                getImgToBase64(this.formValidate.Photo[i].url,function(data){
                        file = dataURLtoFile(data,"Photo"+(i+1));
                        self.formValidate.Photo[i].file = file;
                        // console.log(99,file)
                    });
            }
        }
        if(this.formValidate.Logo){
            this.formValidate.Logo = { url: this.formValidate.Logo,file: null };
            let self = this;
            getImgToBase64(this.formValidate.Logo.url,function(data){
                self.formValidate.Logo.file = dataURLtoFile(data,"CoverPhoto");
                // console.log(77,self.formValidate.Logo)
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
            this.formValidate.Area = data.value;
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

        uploadImg(e){
            let files = e.target.files;
            // console.log('files',files)
            let types = ['image/jpg', 'image/jpeg', 'image/png'];
            if((this.formValidate.Photo.length + files.length) > 4 ){
            this.$Message.warning("最多上传4张照片");
            }else{
            for(let i in files){
                
                if(files[i].size){
                    let size = files[i].size/1024/1024;
                    if(!types.includes(files[i].type)){
                        this.$Message.warning("上传的图片格式不正确！");
                        return ;
                    } else if(size>10){
                        this.$Message.warning(files[i].name+" 这张图大小超过10MB");
                        return ;
                    }else{
                        let item = {
                                file: files[i],
                                url: getObjectURL(files[i])
                            }
                        this.formValidate.Photo.push(item);
                    }
                    
                }
                
            }
            }
            
        },

        deleteImg(index){
            this.$Modal.confirm({
                title: '请确认是否删除此照片',
                onOk: () => {
                this.formValidate.Photo.splice(index,1);
                }
            })
        },

        handleSubmit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    // console.log(this.formValidate);
                    this.updateUserInfo();
                } else {
                this.$Message.error('有必填信息未填写');
                }
            })
        },

        updateUserInfo() {
            this.$Spin.show();
            console.log(0,this.formValidate)
            let formInfo = new FormData();
            formInfo.append("Logo",this.formValidate.Logo.file,"Logo");
            for(let i=0;i<this.formValidate.Photo.length;i++){
                formInfo.append("Photo"+(i+1),this.formValidate.Photo[i].file,"Photo"+(i+1));
            }
            for(let x in this.formValidate){
                if(x != "Logo" && x != "Photo"){
                    if(x=='OperaDates'){
                        formInfo.append(x,this.formValidate[x].join(','));
                    }else{
                        formInfo.append(x,this.formValidate[x]);
                    }
                }
            }
            updateSiteSet(formInfo).then(res => {
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
  .editedStore{
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
        .weekCheck{
            .ivu-checkbox{
                display: none;
            }
        }
    }
  }
</style>
<style lang="less" scoped>
    .editedStore{
        position: relative;
        margin-top: 20px;
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
                .week{
                    .weekCheck{
                    max-width: 668px;
                    margin: 15px 20px 0;
                    display: flex;
                    flex-wrap: wrap;
                    font-size: 14px;
                    box-shadow:2px 2px 8px 0px rgba(232,232,232,1);
                    .ivu-checkbox-group-item{
                        border: 1px solid #E4E4E4;
                        padding: 0 18px;
                        margin: 10px 5px;
                        border-radius: 4px;
                    }
                    .ivu-checkbox-wrapper-checked{
                        border-color: #3275F5;
                        position: relative;
                        overflow: hidden;
                        &::after {
                            content: "";
                            width: 25px;
                            height: 25px;
                            border: 1px solid #3275f5;
                            background-color: #3275f5;
                            position: absolute;
                            right: 0;
                            bottom: -1px;
                            transform: rotate(45deg) translate(72%);
                            z-index: 3;
                        }
                        &::before {
                            content: "✔";
                            position: absolute;
                            right: 0px;
                            bottom: -10px;
                            color: #fff;
                            font-size: 12px;
                            z-index: 6;
                        }
                    }
                    
                    }
                }
                .imgList{
                    display: flex;
                    flex-wrap:wrap;
                    li{
                        margin-right: 20px;
                        margin-bottom: 10px;
                        position: relative;
                        .delete{
                        position: absolute;
                        right: -5px;
                        top: -5px;
                        }
                    }
                    li,img.item{
                    width: 240px;
                    height: 135px;
                    border-radius: 4px;
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

</style>