<template>
  <div class="register">
    <Header :title="headTitle" @change-router="changeRouter"></Header>
    <div class="plan_content">
      <div class="line_plan">
        <div class="plan_box">
          <div class="plan_img_box">
            <div class="kong"></div>
            <img src="@/assets/register.svg" alt="" class="sel_img" v-if="selid == 0" >
            <div class="plan_sel_back" v-else >
              <img  src="@/assets/portrait.svg" alt="" >
            </div>
            <div :class="selid > 0 ? 'blue' : 'wire'"></div>
          </div>

          <div :class="selid == 0 ? 'sel_text' : 'plan_text'">注册账号</div>
        </div>
        <div class="wire"></div>

        <div class="plan_box">
          <div class="plan_img_box">
            <div :class="selid > 0 ? 'blue' : 'wire'"></div>
            <img src="@/assets/password-sel.svg" alt="" class="sel_img" v-if="selid == 1" >
            <div :class="selid > 1 ? 'plan_sel_back' : 'plan_back'" v-else >
              <img src="@/assets/password-list.svg" alt="" >
            </div>
            <div :class="selid > 1 ? 'blue' : 'wire'"></div>
          </div>
          <div :class="selid == 1 ? 'sel_text' : 'plan_text'">设置密码</div>
        </div>

        <div class="plan_box">
          <div class="plan_img_box">
            <div :class="selid > 1 ? 'blue' : 'wire'"></div>
            <img src="@/assets/message-sel.svg"  alt="" class="sel_img" v-if="selid == 2">
            <div :class="selid > 2 ? 'plan_sel_back' : 'plan_back'" v-else >
              <img src="@/assets/message.svg" alt="" >
            </div>
            <div :class="selid > 2 ? 'blue' : 'wire'"></div>
          </div>
          <div :class="selid == 2 ? 'sel_text' : 'plan_text'">完善注册信息</div>
        </div>

        <div class="plan_box">
          <div class="plan_img_box">
            <div :class="selid > 2 ? 'blue' : 'wire'"></div>
            <img src="@/assets/audit-sel.svg" alt=""  class="sel_img" v-if="selid == 3" >
            <div :class="selid > 3 ? 'plan_sel_back' : 'plan_back'"  v-else >
              <img src="@/assets/audit.svg" alt="" >
            </div>
            <div :class="selid > 3 ? 'blue' : 'wire'"></div>
          </div>
          <div :class="selid == 3 ? 'sel_text' : 'plan_text'">总部审核</div>
        </div>
        <div class="wire"></div>
        <div class="plan_box">
          <div class="plan_img_box">
            <div class="wire"></div>
            <div class="plan_back">
              <img src="@/assets/success.svg" alt="" >
            </div>
            <div class="kong"></div>
          </div>
          <div class="plan_text">注册成功</div>
        </div>
      </div>
    </div>

    <div class="container" v-if="selid<3">
      <!-- 注册账号-->
      <Form ref="NameVal" :model="formVal" :rules="nameRule" :label-width="0"
             class="form" v-if="selid == 0">
        <FormItem label="" prop="ParentCode" >
          <Input
            v-model="formVal.ParentCode"
            ref="ParentCode"
            placeholder="输入或选择总部代码"
            icon="ios-arrow-down"
            @on-click="showSelect"
            @on-change="codechange"
            required>
            <img src="@/assets/head-code.svg" alt="" slot="prefix" >
          </Input>
          <div class="code_list" v-if="showCode" >
            <div v-for="(item,index) in codeList" :key="index"
                 @click="formVal.ParentCode = item;showCode = false;">{{item}}</div>
            <div v-if="codeList.length <= 0">暂无数据</div>
          </div>
        </FormItem>
        <FormItem label="" prop="LoginName" >
          <Input v-model="formVal.LoginName" ref="LoginName" :maxlength="11" placeholder="输入手机号">
            <img src="@/assets/phone-icon.svg" alt="" slot="prefix" >
          </Input>
        </FormItem>
        <FormItem label="" prop="AuthCode" class="authCode">
          <Input v-model="formVal.AuthCode" placeholder="输入验证码" >
            <img src="@/assets/verify-icon.svg" alt="" slot="prefix" >
          </Input>
          <div class="captcha-num">
            <span @click="getAuth" class="captcha" v-if="getCodeFlag" >获取验证码</span>
            <span v-if="!getCodeFlag">重新发送（{{time}}s）</span>
          </div>
        </FormItem>
        <FormItem>
          <Button type="primary" size="large"  long @click="toNext('NameVal')" >
            <span class="login-word">下一步</span>
          </Button>
        </FormItem>
      </Form>

      <!-- 设置密码 -->
      <Form ref="passwordVal" :model="formVal" :rules="passWordRules" :label-width="0" 
            class="form" v-show="selid == 1">
        <FormItem label="" prop="PassWord">
          <Input v-model="formVal.PassWord" type="password" placeholder="设置密码(最少6位)">
            <img src="@/assets/secret-icon.svg" alt="" slot="prefix">
          </Input>
        </FormItem>
        <FormItem label="" prop="PassWord2">
          <Input v-model="formVal.PassWord2" type="password" placeholder="再次输入密码">
          <img src="@/assets/secret-icon.svg" alt="" slot="prefix" >
          </Input>
        </FormItem>
        <FormItem>
          <Button type="primary" size="large" long @click="toNext('passwordVal')">
            <span class="login-word">下一步</span>
          </Button>
        </FormItem>
      </Form>

      <!-- 完善注册信息-->
      <Form ref="infoVal" :model="formVal" :rules="ruleValidate" 
            :label-width="selid == 2 ? 110 : 0"
            class="form" v-show="selid == 2" >
        <FormItem label="门店名称：" prop="Name">
          <Input v-model="formVal.Name" placeholder="输入门店名称"/>
        </FormItem>
        <FormItem label="门店负责人：" prop="Contact" >
          <Input v-model="formVal.Contact" placeholder="输入门店负责人"/>
        </FormItem>
        <FormItem label="身份证件号：" prop="IdCard">
          <Input v-model="formVal.IdCard" placeholder="输入身份证件号"/>
        </FormItem>
        <FormItem
          label="联系电话：" required class="telphone" >
          <Row class="tel_width">
            <Col span="6">
              <FormItem prop="TelCode">
                <Input v-model="formVal.TelCode" :maxlength="4" placeholder="区号"/>
              </FormItem>
            </Col>
            <Col span="2" style="text-align:center;" >-</Col>
            <Col span="16">
              <FormItem prop="Tel" style="margin-bottom: 0;" class="interval">
                <Input v-model="formVal.Tel" :maxlength="11" placeholder="输入手机号时区号可空"/>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="门店地址：" required >
          <FormItem prop="Provice" style="margin-bottom: 20px;" class="row">
            <v-distpicker
              :province="formVal.Provice"
              :city="formVal.City"
              :area="formVal.Area"
              @province="onChangeProvince"
              @city="onChangeCity"
              @area="onChangeArea"></v-distpicker>
          </FormItem>
          <FormItem prop="Address">
            <Input v-model="formVal.Address" placeholder="详细地址，例：沙河街道16号楼5层501"/>
          </FormItem>
        </FormItem>
        <FormItem>
          <Button type="primary" size="large" long @click="toNext('infoVal')">
            <span class="login-word">提交申请</span>
          </Button>
        </FormItem>
      </Form>
    </div>

    <!-- 审核中 -->
    <div class="sand_box" v-if="showaudit">
      <img src="@/assets/sand-clock.svg" />
      <span class="sand_text">总部<span class="sand_big">审核中</span>，请耐心等待...</span>
    </div>

    <!-- 审核失败 -->
    <div class="fail_box" v-else>
      <div class="headtext">以下信息不合格，请重新填写：</div>
      <div class="content_box">
        <div class="line_store" v-for="(item,index) in failList" :key="index">
          <div class="num_box">
            <span class="num">{{index+1}}</span>
            <span>{{item}}</span>
          </div>
          <div class="fail_text">不合格</div>
        </div>
      </div>
      <div class="change_text"
          @click="$router.push({path:'/process',query:{step:2,SiteState:-1}})">去修改 >></div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/route-header'
import { validatePhone, validatePwd, validateCode, validateCardId } from '@/utils/validate'
import { getStoreType } from '@/utils/auth.js'
import VDistpicker from 'v-distpicker'
import { parentCode, getAuto, postSubmit, userPhone, getFailInfo, getRegisterInfo, editRegisterInfo } from '@/api/user.js'
export default {
  components: { Header, VDistpicker },
  data() {
    const validatePsw2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else {
        if (value !== this.formVal.PassWord) {
          callback(new Error('两次输入密码不一致'));
        }
        callback();
      }
    };
    const validateTelCode = (rule, value, callback) => {
            let phone = /^\d{7,8}$/,area = /^0\d{2,3}$/
            if(value==''){
                if(phone.test(this.formVal.Tel)){
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
        };
        const validateProvince = (rule, value, callback) => {
            if(this.formVal.Province=='' && this.formVal.City=='' && this.formVal.Area==''){
                callback(new Error('请选择省市区'));
            }else if(this.formVal.City=='' && this.formVal.Area==''){
                callback(new Error('请选择市和区'));
            }else if(this.formVal.Province==''){
                callback(new Error('请选择省'));
            }else if(this.formVal.City==''){
                callback(new Error('请选择城市'));
            }else if(this.formVal.Area==''){
                callback(new Error('请选择区域'));
            }
            else{
                callback();
            }
        }
    return {
      headTitle: '注册',
      getCodeFlag: true,  //获取验证码，true需要获取，false已经获取
      time: 60,
      formVal: {
        ParentCode: '',
        LoginName: '',
        AuthCode: '',
        PassWord: '',
        PassWord2: '',
        Name: '',
        Contact: '',
        IdCard: '',
        TelCode: '',
        Tel: '',
        Provice: '',
        City: '',
        Area: '',
        Address: ''
      },
      nameRule: {
        ParentCode: [
          { required: true, message: '输入或选择总部代码！', trigger: 'change' },
        ],
        LoginName: [
          { validator: validatePhone, trigger: 'blur' }
        ], 
        AuthCode: [
          { validator: validateCode, trigger: 'blur' },
        ],
      },
      passWordRules:{
        PassWord: [
          { validator: validatePwd, trigger: 'blur' },
          { type: 'string', min: 6, message: '密码至少6位', trigger: 'blur' }
        ],
        PassWord2: [
          { validator: validatePsw2, trigger: 'blur' },
          { type: 'string', min: 6, message: '密码至少6位', trigger: 'blur' }
        ],
      },
      ruleValidate: {
        Name: [
          { required: true, message: '请输入门店名称', trigger: 'blur' },
          { type: 'string', max: 30, message: '最多输入30个字', trigger: 'blur' }
        ], 
        Contact: [
          { required: true, message: '请输入门店负责人', trigger: 'blur' },
          { type: 'string', max: 30, message: '最多输入30个字', trigger: 'blur' }
        ], 
        IdCard: [
          {  required: true, validator: validateCardId, trigger: 'blur' }
        ], 
        TelCode: [
          { required: true, validator: validateTelCode, trigger: 'blur'  }
        ], 
        Tel: [
          { required: true,validator: validateMobile, trigger: 'blur' }
        ], 
        Provice: [
          { required: true, validator: validateProvince, trigger: 'change' },
        ], 
        Address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          { type: 'string', max: 50, message: '最多输入50个字', trigger: 'blur' }
        ],

      },
      getCodeFlag: true,
      selid: 0,
      showCode: false,
      codeList: [],
      showNext: true,
      verification: '',
      showaudit: true,
      failList: []
    }
  },
  created() {
    this.selid = this.$route.query.step;
    if (this.selid == 0) {
      this.headTitle = '注册';
    } else if (this.selid == 1) {
      this.headTitle = '设置密码';
    } else if (this.selid == 2) {
      this.headTitle = '完善注册信息';
    } else if (this.selid == 3) {
      this.headTitle = '总部审核';
    }
    if (this.$route.query.SiteState) {
      this.showaudit = this.$route.query.SiteState == 0 ? true : false;
      this.getfail();
      this.getRegister();
    }
  },
  methods: {
    getfail() {
      getFailInfo().then(res => {
        this.failList = JSON.parse(res.Data.AuditFail);
      })
    },
    getRegister() {
      getRegisterInfo().then(res => {
        this.formVal = res.Data;
      })
    },
    changeRouter() {
      if (this.selid == 0) {
        this.$router.push('/register')
      } else if (this.selid == 1) {
        this.$router.push({ path: '/process', query: { step: 0 } });
      } else if (this.selid == 2) {
        if (this.$route.query.SiteState) {
          this.$router.push({ path: '/login' })
        } else {
          this.$router.push({ path: '/process', query: { step: 1 } });
        }
      } else if (this.selid == 3) {
        this.$router.push('/login')
      }
    },
    toLast() {
      this.$router.push('/register')
    },
    toNext(name) {
      this.$refs[name].validate((valid) => {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.selid == 2) {
              if (this.$route.query.SiteState) {
                editRegisterInfo(this.formVal).then(res => {
                  this.showaudit = true;
                  this.selid = Number(this.selid) + 1;
                  this.$router.push({ path: '/process', query: { step: this.selid } })
                })
              } else {
                this.formVal.UserType = getStoreType();
                postSubmit(this.formVal).then(res => {
                  this.showaudit = true;
                  this.selid = Number(this.selid) + 1;
                  this.$router.push({ path: '/process', query: { step: this.selid } })
                })
              }

            }else{
              this.selid = Number(this.selid) + 1;
              this.$router.push({ path: '/process', query: { step: this.selid } })
            }
            
          } else {
            // this.$Message.error('Fail!');
          }
        })
      })

    },
    onChangeProvince(data) {
      this.formVal.Provice = data.value;
    },
    onChangeCity(data) {
      this.formVal.City = data.value;
    },
    onChangeArea(data) {
      this.formVal.Area = data.value;
    },
    showSelect() {
      if (this.showCode) {
        this.showCode = !this.showCode;
      } else {
        this.codeList = [];
        this.getCode('')
      }
    },
    getCode(e) {
      parentCode(e).then(res => {
        this.codeList = res.Data;
        this.showCode = true;
      })
    },
    codechange(e) {
      this.getCode(this.formVal.ParentCode)
    },
    getAuth() {
      if (!this.formVal.LoginName) {
        this.$refs.LoginName.focus();
        this.$Message.info('请先输入正确的手机号码')
      } else {
        userPhone(this.formVal.LoginName).then(resfort => {
          getAuto(this.formVal.LoginName).then(res => {
            this.verification = res.Data;
            this.$Message.info('验证码已经发送到手机')
            this.getCodeFlag = false;
            this.time = 60;
            this.codeTimeOut(60);
          })
        })
      }
    },
    codeTimeOut(time) {
      var _this = this;
      setInterval(function () {
        _this.time = time--;
        if (_this.time <= 0) {
          _this.getCodeFlag = true;
        }
      }, 1000);
    },
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        this.selid = val.query.step;
      },
      deep: true
    }
  }
}
</script>
<style lang="less">
.register {
  width: 100%;
  height: 100%;
  .head_title {
    width: 100%;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
  }
  .plan_content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 130px;
    overflow: auto;
    box-sizing: border-box;
    margin-top: 56px;
    .line_plan {
      display: flex;
      justify-content: space-around;
      align-items: center;
      .plan_box {
        text-align: center;
        font-size: 13px;
        .plan_img_box {
          display: flex;
          align-items: center;
          .kong {
            width: 24px;
            height: 1px;
          }
          .sel_img {
            margin: 0 3px;
          }
          .wire {
            width: 24px;
            height: 1px;
            background: #e5e5e5;
            opacity: 0.36;
          }
          .blue {
            width: 24px;
            height: 1px;
            background: #0899ac;
            opacity: 0.13;
          }
          .plan_back {
            background: #e5e5e5;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            opacity: 0.36;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 3px;
          }
          .plan_sel_back {
            background: #0899ac;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            opacity: 0.13;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 3px;
          }
        }

        .plan_text {
          opacity: 0.2;
          margin-top: 9px;
        }
        .sel_text {
          opacity: 1;
          margin-top: 9px;
        }
      }
    }
  }
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: calc(100% - 230px);
    overflow: auto;
    box-sizing: border-box;
    .form {
      display: flex;
      flex-direction: column;
      margin-top: 84px;
      .ivu-input-wrapper,.row {
        width: 320px;
      }
      .distpicker-address-wrapper{
          select{
              width: 32.2%;
          }
      }
      .code_list {
        position: absolute;
        top: 43px;
        left: 0;
        width: 320px;
        text-align: center;
        background: #fff;
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.4);
        border-radius: 4px;
        z-index: 99;
        max-height: 139px;
        overflow-y: scroll;
        font-size: 14px;
        color: #333;
      }
      .telphone {
        .ivu-input-wrapper {
          width: 100%;
        }
        .tel_width {
          width: 320px;
        }
        .ivu-input {
          padding-left: 12px;
        }
      }
      .authCode {
        .ivu-input-wrapper {
          width: 180px;
        }
        .captcha-num {
          width: 130px;
          margin-left: 10px;
          cursor: pointer;
          .captcha {
            background: #3b4356;
          }
          span {
            white-space: nowrap;
            background: #efefef;
            border-radius: 4px;
            color: #ccc;
            height: 40px;
            line-height: 40px;
            width: 130px;
            text-align: center;
            display: inline-block;
          }
        }
      }
    }
  }
  .sand_box {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 130px;
    .sand_text {
      font-weight: 800;
      color: #333;
      font-size: 18px;
      .sand_big {
        font-weight: 800;
        font-size: 26px;
        letter-spacing: 2px;
        margin-left: 5px;
      }
    }
  }
  .fail_box {
    width: 100%;
    box-sizing: border-box;
    padding: 0 22px;
    margin-top: 80px;
    .headtext {
      color: #333;
      font-size: 16px;
      margin-left: 80px;
    }
    .content_box {
      background: #f7f8fa;
      border-radius: 8px;
      margin-top: 20px;
      width: 100%;
      box-sizing: border-box;
      padding: 28px 143px 28px 105px;
      .line_store {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        font-size: 16px;
        color: #333;
        &:first-of-type {
          margin-top: 0;
        }
        .num_box {
          display: flex;
          align-items: center;
          .num {
            width: 16px;
            height: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            border: 1px solid #333;
            font-size: 12px;
            margin-right: 10px;
          }
        }
        .fail_text {
          font-weight: 800;
        }
      }
    }
    .change_text {
      font-size: 18px;
      color: #3275f5;
      margin-top: 16px;
      text-align: center;
      cursor: pointer;
    }
  }
}
</style>