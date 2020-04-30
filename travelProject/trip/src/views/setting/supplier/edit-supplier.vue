<template>
    <FullPage :title="id ? '编辑供应商' : '新增供应商'" class="editSupplier"
              @change-router="$router.back()">
        <Form   :model="formData" :rules="ruleValidate"
                ref="supplierForm" :label-width="110" class="form">
            <FormItem label="供应商名称：" prop="Name">
                <Input v-model="formData.Name" />
            </FormItem>
            <FormItem label="供应商类型：">
                <div style="display: flex;flex-wrap: wrap;">
                    <Select v-model="formData.Type" placeholder="请选择供应商类型">
                        <Option v-for="type in typeList" 
                                :key="type.Id" :value="type.Id">{{type.Name}}</Option>
                    </Select>
                    <router-link to="/setting/supplier/type" style="padding-left: 10px;line-height: 40px;">去设置新增供应商类型</router-link>
                </div>
                
            </FormItem>
            <FormItem label="负责人：" prop="Leader">
                <Input v-model="formData.Leader"/>
            </FormItem>
            <FormItem label="联系电话：" prop="Telephone">
                <Input v-model="formData.Telephone" :maxlength="11"/>
            </FormItem>
            <FormItem label="所在地址：" prop="Address">
                <Input v-model="formData.Address"/>
            </FormItem>
            <FormItem label="营业执照：">
                <ul class="imgList">
                    <li v-for="(img,index) in formData.BusinessLicense" :key="index">
                        <img class="item" :src="img.url" alt="">
                        <img class="delete" src="@/assets/delete-icon.svg" alt="" @click="deleteImg(index,1)">
                    </li>
                    <li class="upload">
                        <input type="file" name="upLoad" ref="upLoad1" value="" accept="image/jpg, image/jpeg, image/png"
                            multiple="multiple" @change="uploadImg($event,1)"/>
                        <img src="@/assets/upload-icon.svg" alt="" srcset="">
                    </li>
                </ul>
                <p style="color: #999;">最多支持10张图片，仅支持jpeg、jpg、png格式，大小不超过5.0MB</p>
            </FormItem>
            <FormItem label="合同有效期：">
                <DatePicker :value="daterange"  type="daterange" @on-change="dateChange"
                            placeholder="开始时间-结束时间"></DatePicker>
                <!-- <Row class="row">
                    <Col span="11" class="auto">
                        <DatePicker type="date" @on-change="startTimeChange"
                                    :value="formData.ContractStartTime" placeholder="开始日期"></DatePicker>
                    </Col>
                    <Col span="2" style="text-align: center">至</Col>
                    <Col span="11" class="auto">
                        <DatePicker type="date" @on-change="endTimeChange"
                                    :value="formData.ContractEndTime" placeholder="结束日期"></DatePicker>
                    </Col>
                </Row> -->
            </FormItem>
            <FormItem label="合同文件：">
                <ul  class="imgList">
                    <li v-for="(file,index) in formData.ContractFile" :key="index">
                        <img class="item" :src="file.url">
                        <img class="delete" src="@/assets/delete-icon.svg" alt="" @click="deleteImg(index,2)">
                    </li>
                    <li class="upload">
                        <input type="file" name="upLoad" ref="upLoad2" value="" accept="image/jpg, image/jpeg, image/png"
                            multiple="multiple" @change="uploadImg($event,2)"/>
                        <img src="@/assets/upload-icon.svg" alt="" srcset="">
                    </li>
                </ul>
                <p style="color: #999;">最多支持10张图片，仅支持jpeg、jpg、png格式，大小不超过5.0MB</p>
            </FormItem>
            <FormItem label="备注：">
                <div class="textareaWrap">
                    <Input  v-model="formData.Remark" type="textarea" class="textarea"
                            :autosize="{minRows: 4,maxRows: 8}" :maxlength="100"
                            placeholder="介绍一下你的店铺吧，100字以内" />
                    <div class="tip">{{formData.Remark ? formData.Remark.length : 0}}/100</div>
                </div>
            </FormItem>
        </Form>
        <div class="bottom">
            <Button @click="$router.back()">取消</Button>
            <Button type="primary" @click="handleSubmit">保存</Button>
        </div>
    </FullPage>
</template>
<script>
import FullPage from '@/components/fullscreen-page'
import { validatePhone } from '@/utils/validate.js'
import { getSupplierById, getSupplierTypes, editSupplier } from '@/api/setting.js'
import { getObjectURL,getImgToBase64,dataURLtoFile } from '@/utils/format.js'
export default {
    name: "editSupplier",
    components: { FullPage },
    data(){
        return{
            id: "",
            formData: {
                Name: "",
                Type: "",
                Leader: "",
                Telephone: "",
                Address: "",
                BusinessLicense: [],
                ContractStartTime: "",
                ContractEndTime: "",
                ContractFile: [],
                Remark: "",
            },
            daterange: [],
            ruleValidate: {
                Name: [
                        { required: true, message: '请输入供应商名称', trigger: 'blur' },
                        { type: 'string', max: 50, message: '最多输入50个字', trigger: 'blur' }
                    ],
                Leader: [
                            { required: true, message: '请输入负责人', trigger: 'blur' },
                            { type: 'string', max: 30, message: '最多输入30个字', trigger: 'blur' }
                        ],
                Address: [{ type: 'string', max: 50, message: '最多输入50个字', trigger: 'blur' }],
                Telephone: [{ required: true, validator: validatePhone, trigger: 'blur' },],
            },
            typeList: [],
        }
    },
    created(){
        this.id = this.$route.query.id;
        this.getTypes();
        if(this.id){
            this.getDetail();
        }
        
    },
    methods: {
        dateChange(e){
            this.daterange = e;
            this.formData.ContractStartTime = e[0];
            this.formData.ContractEndTime = e[1];
        },
        // startTimeChange(e){
        //     this.formData.ContractStartTime = e;
        // },

        // endTimeChange(e){
        //     this.formData.ContractEndTime = e;
        // },

        getDetail(){
            this.$Spin.show();
            getSupplierById(this.id).then(res => {
                this.$Spin.hide();
                this.formData = res.Data.Supplier;
                this.daterange = [this.formData.ContractStartTimeStr,this.formData.ContractEndTimeStr]
                // this.formData.ContractStartTime = this.formData.ContractStartTimeStr;
                // this.formData.ContractEndTime = this.formData.ContractEndTimeStr;

                //网络地址图片转换成file文件
                if(this.formData.BusinessLicense.length>0){
                    this.formData.BusinessLicense = this.formData.BusinessLicense.map(item =>{
                       return { url: item,file: null }
                    })
                    let self = this;
                    for(let i=0; i<this.formData.BusinessLicense.length; i++){
                        let file;
                        getImgToBase64(this.formData.BusinessLicense[i].url,function(data){
                                file = dataURLtoFile(data,"BusinessLicense"+(i+1));
                                self.formData.BusinessLicense[i].file = file;
                            });
                    }
                }

                if(this.formData.ContractFile.length>0){
                    this.formData.ContractFile = this.formData.ContractFile.map(item =>{
                       return { url: item,file: null }
                    })
                    let self = this;
                    for(let i=0; i<this.formData.ContractFile.length; i++){
                        let file;
                        getImgToBase64(this.formData.ContractFile[i].url,function(data){
                                file = dataURLtoFile(data,"ContractFile"+(i+1));
                                self.formData.ContractFile[i].file = file;
                            });
                    }
                }

            }).catch(err => {
                this.$Spin.hide();
            })
        },

        //供应商类型列表
        getTypes(){
            getSupplierTypes().then(res => {
                this.typeList = res.Data.SupplierTypes;
            }).catch(err => {

            })
        },

        //上传合同
        uploadImg(e,type){
            let files = e.target.files;
            // console.log('files',files)
            let types = ['image/jpg', 'image/jpeg', 'image/png'];
            let imgLength = 0;
            if(type == 1){
                imgLength = this.formData.BusinessLicense.length + files.length;
            }else{
                imgLength = this.formData.ContractFile.length + files.length;
            }
            if(imgLength > 10 ){
                this.$Message.warning("最多上传10张照片");
            }else{
                for(let i in files){
                    if(files[i].size){
                        let size = files[i].size/1024/1024;
                        if(!types.includes(files[i].type)){
                            this.$Message.warning("上传的图片格式不正确！");
                            return ;
                        } else if(size>5){
                            this.$Message.warning(files[i].name+" 这张图大小超过5MB");
                            return ;
                        }else{
                            let item = {
                                    file: files[i],
                                    url: getObjectURL(files[i])
                                }
                            if(type == 1){
                                this.formData.BusinessLicense.push(item);
                                this.$refs.upLoad1.value = null;
                            }else{
                                this.formData.ContractFile.push(item);
                                this.$refs.upLoad2.value = null;
                            }
                        }
                        
                    }
                    
                }
            }
        },

        deleteImg(index,type){
            this.$Modal.confirm({
                title: '请确认是否删除此照片',
                onOk: () => {
                    if(type==1){
                        this.formData.BusinessLicense.splice(index,1);
                    }else{
                        this.formData.ContractFile.splice(index,1);
                    }
                    this.$Message.success('成功删除图片')
                }
            })
        },

        handleSubmit(){
            this.$refs['supplierForm'].validate((valid) => {
                if (valid) {
                    this.$Spin.show();
                    let formInfo = new FormData();
                    for(let i=0;i<this.formData.BusinessLicense.length;i++){
                            formInfo.append("BusinessLicense"+(i+1),this.formData.BusinessLicense[i].file,"BusinessLicense"+(i+1));
                    }
                    for(let i=0;i<this.formData.ContractFile.length;i++){
                        formInfo.append("ContractFile"+(i+1),this.formData.ContractFile[i].file,"ContractFile"+(i+1));
                    }
                    for(let x in this.formData){
                        if(x != "BusinessLicense" && x != "ContractFile" && x != "ContractStartTimeStr" && x != "ContractEndTimeStr" && x != "ExpiryDate"){
                            formInfo.append(x,this.formData[x]);
                        }
                    }
                    editSupplier(formInfo).then(res => {
                        this.$Spin.hide();
                        this.$Message.success(this.id ? '成功修改供应商信息' : '成功添加供应商信息');
                        this.$router.back();
                    }).catch(err => {
                        this.$Spin.hide();
                    })
                } else {
                    // this.$Message.error('有必填信息未填写');
                }
            })
        }
    }
}
</script>
<style lang="less">
    .editSupplier{
        .ivu-form{
            .auto .ivu-input-wrapper{
                width: 100%;
            }
        }
    }
</style>
<style lang="less" scoped>
    .editSupplier{
        box-sizing: border-box;
        padding-bottom: 80px;
        .ivu-form-item {
            p{
                line-height: 1.4;
            }
            .row{
                width: 320px;
            }
            @media screen and (max-width: 768px){
                .row{
                    width: 230px;
                }
            }
        }
        .imgList{
            display: flex;
            flex-wrap:wrap;
            li{
                width: 200px;
                margin-right: 20px;
                margin-bottom: 10px;
                position: relative;
                border-radius: 4px;
                img.item{
                    width: 200px;
                    border-radius: 4px;
                }
                .delete{
                    cursor: pointer;
                    position: absolute;
                    right: -5px;
                    top: -5px;
                }
            }
            .upload{
                width: 200px;
                height: 112px;
                border: 1px dashed #999;
                line-height: 112px;
                text-align: center;
                input{
                    position: absolute;
                    width: 200px;
                    height: 112px;
                    right: 0;
                    top: 0;
                    cursor: pointer;
                    opacity: 0;
                    z-index: 5;
                }
            }
        }
        
        .bottom{
            background: #fff;
            // width: calc(100% - 30px);
            border-top: 1px solid #E4E4E4;
            display: flex;
            justify-content: center;
            padding: 15px 0;
            position: fixed;
            bottom: 10px;
            left: 10px;
            right: 10px;
            z-index: 99;
            > .ivu-btn{
                height: 40px;
                width: 120px;
                &:first-of-type{
                    margin-right: 30px;
                }
            }
        }
    }
</style>