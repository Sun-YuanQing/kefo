<template>
  <FullPage class="editStore"
            title="编辑门店"
            @change-router="$router.push({path:'/examine',query:{id: siteid}})">
        <div class="basisInfo">
          <div class="line_info">
            <label class="info_label">门店编号：</label>
            <Input
              v-model="formVal.Code"
              disabled
            />
          </div>
          <div class="line_info">
            <label class="info_label">门店账号：</label>
            <Input
              v-model="formVal.LoginName"
              disabled
            />
          </div>
          <div class="line_info">
            <label class="info_label">门店名称：</label>
            <Input
              v-model="formVal.Name"
              disabled
            />
          </div>
          <div class="line_info">
            <label class="info_label">门店负责人：</label>
            <Input
              v-model="formVal.Contact"
              disabled
            />
          </div>
          <div class="line_info">
            <label class="info_label">身份证件号：</label>
            <Input
              v-model="formVal.IdCard"
              disabled
            />
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
          </div>
          <div class="line_info">
            <label class="info_label">门店地址：</label>
            <Input
              v-model="formVal.Tel"
              disabled
            />
          </div>
          <Form
            :model="formVal"
            :label-width="150"
            :rules="ruleValidate"
            ref="formData"
          >
            <FormItem label="门店归属：" prop="BelongId">
              <Select v-model="formVal.BelongId">
                <Option
                  v-for="(item,index) in belongList"
                  :key="index"
                  :value="item.Id"
                >{{item.Province + item.City + item.Area + item.Name}}</Option>
              </Select>
            </FormItem>
            <FormItem label="有效经营时间：" prop="DueTime">
              <DatePicker
                type="daterange"
                show-week-numbers
                v-model="showTime"
                placeholder="开始时间 - 结束时间"
                @on-change="dateChange"
              ></DatePicker>
            </FormItem>
            <FormItem
              label="备注："
            >
             <div class="textareaWrap">
                  <Input  v-model="formVal.Desc" type="textarea" class="textarea"
                          :autosize="{minRows: 4,maxRows: 8}" :maxlength="100"
                          placeholder="最多输入100个字" />
                  <div class="tip">{{formVal.Desc ? formVal.Desc.length : 0}}/100</div>
              </div>
              <!-- <Input
                v-model="formVal.Desc"
                type="textarea"
                :max="100"
                :autosize="{minRows: 3,maxRows: 8}"
                placeholder="最多输入100个字"/> -->
            </FormItem>
          </Form>
        </div>
        <div class="sumbit_btn">
          <Button @click="toCancel">取消</Button>
          <Button type="primary" style="margin-left: 20px" @click="toSave">保存</Button>
        </div>
  </FullPage>
</template>
<script>
import FullPage from '@/components/fullscreen-page'
import { getDetail, UpdateSite } from '@/api/store.js'
import { storesBelonging } from '@/api/setting.js'
export default {
  components: { FullPage },
  data() {
    return {
      formVal: {},
      ruleValidate: {
        BelongId: [{ required: true, message: '请选择门店归属', trigger: 'change' }],
        DueTime: [{ required: true, message: '有效经营时间不能为空', trigger: 'change' }],
      },
      belongList: [],
      siteid: '',
      showTime: []
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
        this.showTime[0] = new Date(res.Data.StartTime);
        this.showTime[1] = new Date(res.Data.DueTime);
        this.$set(this.showTime, this.showTime)
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
        this.belongList = res.Data;
      })
    },
    toSave() {
      this.$refs['formData'].validate((valid) => {
          if (valid) {
            this.formVal.SiteId = this.siteid;
            UpdateSite(this.formVal).then(res => {
              this.$Message.success('修改成功');
              this.$router.go(-1)
            })
          }
      })
      
    },
    toCancel() {
      this.$router.go(-1)
    },
    dateChange(e) {
      this.formVal.StartTime = e[0];
      this.formVal.DueTime = e[1];
      this.$refs['formData'].validate((valid) => {})
    },
  }
}
</script>
<style lang="less" scoped>
.editStore {
    box-sizing: border-box;
    padding-bottom: 80px;
    .basisInfo {
      padding-top: 20px;
      .line_info {
        display: flex;
        align-items: center;
        padding-bottom: 30px;
        .info_label {
          display: inline-block;
          white-space: nowrap;
          width: 150px;
          padding-right: 20px;
          box-sizing: border-box;
          text-align: right;
          font-size: 16px;
          color: #333;
        }
        .ivu-input-wrapper {
          width: 530px;
        }
        
        .line_input {
          display: flex;
          align-items: center;
          width: 530px;
          .ivu-input-wrapper:first-of-type {
            width: 25%;
          }
          .ivu-input-wrapper:last-of-type {
            width: 70%; 
            margin-left: 0;
          }
          .line_center {
            background: #cccccc;
            width: 5%;
            height: 1px;
            margin: 0 15px;
          }
        }
        @media screen and (max-width: 768px) {
          .ivu-input-wrapper,.line_input{
              width: 160px;
          }
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
      
    }
    .textareaWrap{
        width: 530px;
        .textarea{
            width: 530px;
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
</style>
<style lang="less">
.ivu-radio {
  margin-right: 15px;
}
.ivu-form{
  .ivu-form-item-label {
    font-size: 16px;
    color: #333;
    padding: 10px 20px 10px 0;
  }
  .ivu-form-item {
    margin-bottom: 30px;
  }
  .ivu-input-number,.ivu-input-wrapper {
    width: 530px;
  }
  .ivu-select-single .ivu-select-selection {
    width: 530px;
  }
  @media screen and (max-width: 768px){
      .ivu-select-single .ivu-select-selection {
            width: 160px;
        }
        .ivu-input-wrapper,.ivu-input-number{
            width: 160px;
        }
  }

}

</style>