<template>
  <FullPage class="check"
       title="门店审核"
       @change-router="$router.push('/stores')">
    
    <div class="basisInfo">
      <div class="basis">基本信息</div>
      <div class="line_info">
        <label class="info_label">门店账号：</label>
        <Input
          v-model="formVal.LoginName"
          disabled
        />
        <RadioGroup
          class="info_radio"
          v-model="radioVal.LoginName"
        >
          <Radio :label="0">合格</Radio>
          <Radio :label="1">不合格</Radio>
        </RadioGroup>
      </div>
      <div class="line_info">
        <label class="info_label">门店名称：</label>
        <Input
          v-model="formVal.Name"
          disabled
        />
        <RadioGroup
          class="info_radio"
          v-model="radioVal.Name"
        >
          <Radio :label="0">合格</Radio>
          <Radio :label="1">不合格</Radio>
        </RadioGroup>
      </div>
      <div class="line_info">
        <label class="info_label">门店负责人：</label>
        <Input
          v-model="formVal.Contact"
          disabled
        />
        <RadioGroup
          class="info_radio"
          v-model="radioVal.Contact"
        >
          <Radio :label="0">合格</Radio>
          <Radio :label="1">不合格</Radio>
        </RadioGroup>
      </div>
      <div class="line_info">
        <label class="info_label">身份证件号：</label>
        <Input
          v-model="formVal.IdCard"
          disabled
        />
        <RadioGroup
          class="info_radio"
          v-model="radioVal.IdCard"
        >
          <Radio :label="0">合格</Radio>
          <Radio :label="1">不合格</Radio>
        </RadioGroup>
      </div>
      <div class="line_info">
        <label class="info_label">联系电话：</label>
        <div class="line_input">
          <Input
            v-model="formVal.TelCode"
            disabled
          />
          <div class="line_center"></div>
          <Input
            v-model="formVal.Tel"
            disabled
          />
        </div>

        <RadioGroup
          class="info_radio"
          v-model="radioVal.Tel"
        >
          <Radio :label="0">合格</Radio>
          <Radio :label="1">不合格</Radio>
        </RadioGroup>
      </div>
      <div class="line_info">
        <label class="info_label">门店地址：</label>
        <Input
          v-model="formVal.Address"
          disabled
        />
        <RadioGroup
          class="info_radio"
          v-model="radioVal.Address"
        >
          <Radio :label="0">合格</Radio>
          <Radio :label="1">不合格</Radio>
        </RadioGroup>
      </div>
      <div class="replenish">补充信息</div>
      <Form
        :model="formData"
        :label-width="150"
        :rules="ruleValidate"
        ref="formData"
      >
        <FormItem
          label="门店编号："
          prop="SiteCode"
        >
          <Input
            v-model="formData.SiteCode"
            placeholder="输入门店编号"
          />
        </FormItem>
        <FormItem
          label="门店归属："
          prop="BelongId"
        >
          <div>
            <Select v-model="formData.BelongId">
              <Option
                v-for="(item,index) in belongList"
                :key="index"
                :value="item.Id"
              >{{item.Province + item.City + item.Area + item.Name}}</Option>
            </Select>
            <a
              style="margin-left:12px;"
              href="/setting/merchant/ascription"
            >去设置新增归属配置</a>
          </div>
        </FormItem>
        <FormItem
          label="有效经营时间："
          prop="DueTime"
          required
        >
          <DatePicker
            type="daterange"
            show-week-numbers
            placeholder="开始时间 - 结束时间"
            @on-change="dateChange"
          ></DatePicker>
        </FormItem>
        <FormItem
          label="备注："
        >
          <Input
            v-model="formData.Desc"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="输入备注（可不填）"
          />
        </FormItem>
      </Form>
    </div>
    <div class="sumbit_btn">
      <Button @click="getpass('formData',-1)">不通过</Button>
      <Button
        type="primary"
        style="margin-left: 20px"
        @click="getpass('formData',1)"
      >通过</Button>
    </div>
      
    <!-- 反馈弹窗 -->
    <Modal
      v-model="coupleBack"
      width="700"
    >
      <p
        class="back_title"
        v-if="isPass"
      >以下信息不合格不能通过，请先修改再通过！</p>
      <p
        v-else
        class="back_title"
      >将以下不合格的信息反馈到门店？</p>
      <div class="couple_box">
        <div
          class="couple_line"
          v-for="(item,index) in failReason"
          :key="index"
        >
          <div class="label_line">
            <div class="label_num">{{index + 1}}</div>{{item}}
          </div>
          <div>不合格</div>
        </div>
      </div>
      <div
        slot="footer"
        class="edit_foot"
        v-if="isPass"
        @click="tocancel"
      >
        <Button type="primary">知道了</Button>
      </div>
      <div
        slot="footer"
        class="couple_foot"
        v-else
      >
        <Button @click="tocancel">取消</Button>
        <Button
          type="primary"
          style="margin-left: 20px"
          @click="submitPass('-1')"
        >反馈</Button>
      </div>

    </Modal>
  </FullPage>
</template>
<script>
import FullPage from '@/components/fullscreen-page'
import { getDetail, SetSiteAudit } from '@/api/store.js'
import { storesBelonging } from '@/api/setting.js'
export default {
  components: { FullPage },
  data() {
    return {
      formVal: {},
      formData: {},
      radioVal: {
        LoginName: 0,
        Name: 0,
        Contact: 0,
        IdCard: 0,
        Tel: 0,
        Address: 0
      },
      ruleValidate: {
        SiteCode: [
          { required: true, message: '门店编号不能为空', trigger: 'blur' },
          { type: 'string',max: 30, message: '最多输入30个字符', trigger: 'blur' },
          ],
        BelongId: [{ required: true, message: '门店归属不能为空', trigger: 'change' }],
        DueTime: [{ required: true, message: '有效经营时间不能为空', trigger: 'change' }],
      },
      coupleBack: false,
      belongList: [],
      failReason: [],
      isPass: true,
    }
  },
  created() {
    this.siteid = this.$route.query.id
    this.iniData();
    this.loadData();
  },
  methods: {
    iniData() {
      getDetail(this.siteid).then(res => {
        this.formVal = res.Data;
      })
    },
    loadData() {
      let belongData = {
        Key: '',
        Province: '',
        City: '',
        Area: ''
      }
      storesBelonging(belongData).then(res => {
        // console.log(res.Data, 1111)
        this.belongList = res.Data;
      })
    },
    dateChange(e) {
      this.$set(this.formData,'StartTime',e[0])
      this.$set(this.formData,'DueTime',e[1])
      this.$refs['formData'].validate((valid) => {})
    },
    getpass(name, state) {
      this.formData.State = state;
      let leftName = "";
      this.failReason = [];
      for (let x in this.radioVal) {
        if (this.radioVal[x] == 1) {
          if (x == 'LoginName') {
            leftName = "门店账号：" + this.formVal.LoginName
          } else if (x == 'Name') {
            leftName = "门店名称：" + this.formVal.Name
          } else if (x == 'Contact') {
            leftName = "门店负责人：" + this.formVal.Contact
          } else if (x == 'IdCard') {
            leftName = "身份证件号：" + this.formVal.IdCard
          } else if (x == 'Tel') {
            leftName = "联系电话：" + this.formVal.TelCode + "-" + this.formVal.Tel
          } else if (x == 'Address') {
            leftName = "门店地址：" + this.formVal.Address
          }
          this.failReason.push(leftName)
        }
      }
      this.formData.FailReason = JSON.stringify(this.failReason);
      if (state == 1) {
        //点击通过
        if (this.failReason.length > 0) {
          this.isPass = true ;
          this.coupleBack = true;
        }else{
          this.coupleBack = false;
          this.$refs[name].validate((valid) => {
            if (valid) {
              this.submitPass(state);
            }
          })
        }
        
      } else if (state == -1) {
        //点击不通过
        if (this.failReason.length == 0){
          this.$Message.warning('基本信息都合格，不可点击不通过');
        }else{
          this.isPass = false ;
          this.coupleBack = true;
          // this.submitPass(state);
        }
      }
    },
    
    submitPass(state) {
      this.$Spin.show();
      this.formData.SiteId = this.siteid;
      SetSiteAudit(this.formData).then(res => {
        this.$Spin.hide();
        this.$Message.success(state==1 ? '审核通过' : '反馈成功');
        this.coupleBack = false;
        this.$router.go(-1)
      }).catch(err => {
        this.$Spin.hide();
      })
    },

    tocancel() {
      this.coupleBack = false;
    }
  }
}
</script>
<style lang="less" scoped>
.check {
  box-sizing: border-box;
  padding-bottom: 80px;
  .basisInfo {
    padding-top: 20px;
    .basis {
      font-size: 18px;
      color: #333;
      border-left: 8px solid #0899ac;
      padding-left: 12px;
      margin-bottom: 30px;
    }
    .line_info {
      display: flex;
      align-items: center;
      padding-bottom: 30px;
      .info_label {
        display: inline-block;
        white-space: nowrap;
        width: 130px;
        text-align: right;
        font-size: 16px;
        color: #333;
      }
      .line_input {
        display: flex;
        align-items: center;
        .ivu-input-wrapper:first-of-type {
          width: 120px;
          margin-left: 20px;
        }
        .ivu-input-wrapper:last-of-type {
          width: 374px;
          margin-left: 0;
        }
        .line_center {
          background: #cccccc;
          width: 16px;
          height: 1px;
          margin: 0 15px;
        }
      }
      .ivu-input-wrapper {
        width: 540px;
        margin-left: 20px;
      }
      .info_radio {
        margin-left: 40px;
        font-size: 16px;
        color: #333;
        .ivu-radio-wrapper {
          margin-right: 35px;
        }
      }
    }
    .replenish {
      font-size: 18px;
      color: #333;
      border-left: 8px solid #0899ac;
      padding-left: 12px;
    }
    
  }
  .sumbit_btn {
    background: #fff;
    border-top: 1px solid #E4E4E4;
    display: flex;
    justify-content: center;
    padding: 15px 0;
    position: fixed;
    bottom: 10px;
    left: 10px;
    right: 10px;
    z-index: 99;
    .ivu-btn{
        height: 40px;
        width: 120px;
        &:first-of-type{
            margin-right: 30px;
        }
    }
  }
}
.back_title {
  text-align: center;
  font-size: 22px;
  color: #333;
  font-weight: 700;
  padding-top: 60px;
}
.couple_box {
  background: #f7f8fa;
  margin-top: 25px;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
  padding: 30px 40px;
  .couple_line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    color: #333;
    margin-top: 17px;
    &:first-of-type {
      margin-top: 0;
    }
    .label_line {
      display: flex;
      align-items: center;
      .label_num {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 1px solid #333;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
      }
    }
  }
}
.couple_foot {
  display: flex;
  justify-content: center;
  align-items: center;
  .ivu-btn {
    font-size: 18px;
    width: 120px;
    height: 40px;
  }
}
.edit_foot {
  display: flex;
  justify-content: center;
  align-items: center;
  .ivu-btn {
    font-size: 18px;
    width: 200px;
    height: 40px;
  }
}
</style>
<style lang="less">
.ivu-radio {
  margin-right: 15px;
}
.ivu-form .ivu-form-item-label {
  font-size: 16px;
  color: #333;
  padding: 10px 20px 10px 0;
}
.ivu-form-item {
  margin-top: 30px;
  margin-bottom: 0;
}
.ivu-form .ivu-input-wrapper,
.ivu-form .ivu-input-number {
  width: 542px;
}
.ivu-form .ivu-select-single .ivu-select-selection {
  width: 542px;
}
</style>