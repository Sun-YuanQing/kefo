<template>
  <div class="fullscreen">
    <Header title="会员信息"></Header>
    <div class="content member-detail">
      <div class="info">
        <div class="info-buttons" v-if="userId">
          <Button :to="{path: '/cash',query: {userId}}" class="button">收银</Button>
          <Button :to="{path: '/order',query: {userId,faceId}}" v-if="showOrder=='true'" class="button">开单</Button>
          <Button :to="{path: '/charge',query: {userId}}" class="button">充值</Button>
          <!-- <Button  class="button" @click="deleteMenber">更多</Button> -->
        </div>
        <div class="info-buttons" v-if="faceId && !userId">
          <Button :to="{path: '/cash',query: {userId}}" class="button">收银</Button>
          <Button :to="{path: '/order',query: {userId,faceId }}" v-if="showOrder=='true'" class="button">开单</Button>
          <Button class="button" @click="editedMenber(faceId ? '4' : '3')">添加会员</Button>
          <Button class="button" @click="isFind=true;">合并会员</Button>
          <Button class="button" @click="deleteMenber">删除</Button>
        </div>
        <div class="user-avatar">
          <img class="avatar" :src="userInfo.Photo || require('../../assets/avatar.svg')" alt="">
        </div>
        <div class="mid">
          <div class="name">
            <div>
              <span>{{userInfo.UserName || userInfo.Phone.slice(7,13) || '姓名'}}</span>
              <Button v-if="userId"  @click="editedMenber('1')" type="text">编辑</Button>
            </div>
            <div style="font-size: 24px;">{{ formatPhone(userInfo.Phone) || '手机号'}}</div>
          </div>
          <Form :label-width="80" label-position="right" class="form">
            <FormItem label="编号">
              <div class="text">{{userInfo.MembershipCode}}</div>
            </FormItem>
            <FormItem label="注册时间">
              <div class="text">{{userInfo.Time}}</div>
            </FormItem>
            <FormItem label="邮箱">
              <div class="text">{{userInfo.Email}}</div>
            </FormItem>
            <FormItem label="性别">
              <div class="text">{{ userInfo.Sex === 1 ? '男' : '女'}}</div>
            </FormItem>
            <FormItem label="到店次数">
              <div class="text">{{report.TotalCount || 0}}次</div>
            </FormItem>
            <FormItem label="备注">
              <div class="text">{{userInfo.Remark}}</div>
            </FormItem>
          </Form>
          <div class="notice">
            <div><span>会员卡余额&nbsp;&nbsp; </span><amount :value="userInfo.Amount" style="color: #E94E27;"/></div>
            <div><span>优惠券&nbsp;&nbsp;</span><span class="big-num">{{userInfo.CouponCount}}</span></div>
            <div @click="toCard" style="cursor: pointer;">
              <span>卡项&nbsp;&nbsp;</span><span class="big-num">{{cardNum}}</span>
            </div>
          </div>
        </div>
        
      </div>
      <div class="records">
        <Tab :items="['到店记录', '交易记录']" @on-change="changeTab" style="padding-left: 32px;padding-top: 18px;"></Tab>
        <comeRecord ref="comeRecord" v-if="activeTab === 0" :face-id="faceId" :stat="report" :user-id="userId"></comeRecord>
        <dealRecord v-if="activeTab === 1 && userInfo.UserId" :user-id="userInfo.UserId"></dealRecord>
        <div style="line-height: 160px;text-align: center;" v-if="activeTab === 1 && !userInfo.UserId">暂无数据</div>
      </div>
    </div>
    <!-- 添加会员 -->
    <add-member :isShow="isAdd" :title="title" :form="addForm" @chang-info="getInfo" @cancel-add="isAdd = false"></add-member>

    <!-- 合并会员 查找 -->
    <Modal v-model="isFind" width="420" :mask-closable="false" :footer-hide="true" 
          @on-cancel="$refs['merge-form'].resetFields()" class="merge">
      <p slot="header" class="title">查找会员</p>
      <Form class="merge-form" ref="merge-form" :model="searchForm"  :rules="validatePhone" :label-width="65"  >
        <FormItem label="手机号" prop='Phone'>
            <Input v-model="searchForm.Phone" @on-keydown.enter.prevent="findMember('merge-form')"></Input>
        </FormItem>
        <FormItem label="" prop="">
            <Button type="primary" @click="findMember('merge-form')" :loading="findLoading"
              style="width: 180px; height: 40px;margin-top: 20px;">确定</Button>
        </FormItem>
      </Form>
    </Modal>

    <!-- 合并会员 -->
    <Modal v-model="isMerge" width="420" :mask-closable="false" class="merge">
      <p slot="header" class="title">会员信息</p>
      <div class="merge-content">
        <div class="merge-info">
          <img :src="mergeInfo.PhotoUrl" alt="" width="90" style="border-radius: 50%;background: #eee;">
          <div>
            <p>{{mergeInfo.UserName}}</p>
            <p style="font-size: 24px;">{{mergeInfo.Phone}}</p>
          </div>
        </div>
        <div class="merge-amount">
          <div>余额&nbsp;&nbsp;<amount :value="mergeInfo.Amount" /></div>
          <div>优惠券&nbsp;&nbsp;<span class="big-num">{{mergeInfo.CouponCount}}</span></div>
        </div>
      </div>
      <div class="footer" slot="footer">
        <Button type="primary" :loading="mergrLoading"  @click="mergeMember">确定合并</Button>
      </div>

    </Modal>
  </div>
</template>

<script>
  import Tab from '@/components/tabs'
  // import MyRadio from 'src/components/my-radio'
  import { formatPhone, formatDate } from 'src/utils/index'
  import comeRecord from './components/come-records'
  import dealRecord from './components/deal-records'
  import Header from '@/components/route-header'
  import { validateName} from '@/utils/validate'
  import AddMember from '@/components/add-member'


  const USER_INFO = {
    "Photo": "",
    "UserName": "",
    "Phone": "",
    "Birthday": "",
    "Email": "",
    "Remark": "",
    "FaceId": "",
    "Sex": '1',
    "MembershipCode": ""
  }

  export default {
    name: 'memberDetail',
    components: { Tab, comeRecord, dealRecord, Header ,AddMember},
    data() {
      return {
        showOrder: 'false',
        formatPhone,
        formatDate,
        faceId: '',
        userId: '',
        showCharge: false,
        activeTab: 0,
        userInfo: {
          "Photo": "",
          "UserName": "",
          "Phone": "",
          "Birthday": "",
          "Email": "",
          "Remark": "",
          "FaceId": "",
          "UserId": '',
          "Sex": 1,
          "MembershipCode": ""
        },
        report: {
          "Frequency": "0",  //到店频率
          "SevenCount": 0,
          "ThirtyCount": 0,
          "YearCount": 0,
          "ConvertDays": 0,
          "BeMemberCount": 0
        },
        isEdit: false,
        isAdd: false,
        isFind: false,
        isMerge: false,
        searchForm:{
          Phone: "",
        },
        title: "",
        addForm:{},
        findLoading: false,
        mergrLoading: false,
        mergeInfo: {},
        cardNum: 0,
        validatePhone: {
          Phone: [ { validator: validateName, trigger: 'blur' } ],
        },
        
      }
    },
    created() {
      this.showOrder = localStorage.getItem('goShop');
      this.faceId = this.$route.query.faceId;
      this.userId = this.$route.query.userId;
      this.getInfo();
      this.getCardNum();
    },
    methods: {
      toCard(){
        if(this.cardNum > 0){
          this.$router.push({path: '/cards',query: {userId: this.userId}})
        }
      },
      getCardNum(){
        const url = '/UserCardProject/GetUserCardCount';
        this.$axios.post(url, { UserId: this.userId }).then(res => {
          let {Code,Data,Message} = res.data;
          if (Code === '0') {
            this.cardNum = Data.Count;
          } else {
            this.$Message.error(Message);
          }
        }).catch(e => {
          throw new Error(e)
        })
      },
      changeTab(index) {
        this.activeTab = index;
      },
      checkForm() {
        if (this.userInfo.Phone && !this.userInfo.Phone.match(/^\d{11}$/)) {
          this.$Message.error('手机号格式错误');
          return false
        }
        if (this.userInfo.Email && !this.userInfo.Email.match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)) {
          this.$Message.error('邮箱格式错误');
          return false
        }
        return true
      },
      
      getInfo() {
        const url = '/User/GetUserByFaceId';
        this.$axios.post(url, { FaceId: this.faceId,UserId: this.userId }).then(res => {
          let {Code,Data,Message} = res.data;
          if (Code === '0') {
            const data = Data || { User: USER_INFO, Report: {} };
            this.userInfo = data.User;
            this.report = data.Report;
            this.userId = this.userInfo.UserId;
            this.faceId = this.userInfo.FaceId;
            this.$nextTick(() => {
              this.$refs.comeRecord.toShopRadioChange('SevenCount')
            })
          } else {
            this.$Message.error(Message);
          }
        }).catch(e => {
          throw new Error(e)
        })
      },
      handleReset (name) {
          this.$refs[name].resetFields();
      },
      editedMenber(val){
        this.title = val;
        if(val == '2'){
            //没有userid和faceid的添加会员 
            this.addForm = {}
        }else if(val == '3'){
            //有userid，没faceid的添加会员，即虚拟会员转会员
            this.addForm = {
                ...USER_INFO,
                UserId: this.userId,
            }
        }else if(val == '4' || val == '1'){
            //有faceid的添加会员
            //修改会员
            this.addForm = Object.assign({}, this.userInfo);
            let sex = this.userInfo.Sex.toString();
            this.$set(this.addForm,'Sex',sex)
        }

        this.isAdd = true;
        
        
      },
      //删除
      deleteMenber(){
        this.$Modal.confirm({
            title: '请确认是否删除',
            onOk: () => {
                let url = "/Userface/DeleteFaceById"
                this.$axios.post(url,{FaceId: this.faceId}).then(res => {
                  let {Code,Message} = res.data;
                  if(Code == '0'){
                      this.$Message.success('删除成功')
                      this.$router.back();

                  }else{
                    this.$Message.error(Message)
                  }
                }).catch(err => {

                })
            }
        })
      },
      //合并,搜索手机号返详情
      findMember(name){
        this.$refs[name].validate((valid) => {
              if(valid){
                    this.findLoading = true;
                    let url = 'User/GetUserCardsByPhone';
                    this.$axios.post(url, this.searchForm).then(res => {
                        this.findLoading = false;
                        let {Code,Message,Data} = res.data;
                        if (Code === '0') {

                            this.mergeInfo = Data.UserDetai;
                            this.isFind = false;
                            this.isMerge = true;
                            this.searchForm.Phone = ""
                        } else {
                            this.$Message.error(Message);
                        }
                    }).catch(err => {
                        this.findLoading = false;
                        console.log(err,99)
                    })
                } else {
                    // this.$Message.error('Fail!');
                }
            })
      },
      mergeMember(){
          this.mergrLoading = true;
          let url = '/Userface/UnionFaceIdAndUser';
          let postData = {
            FaceId:  this.faceId,
            UserId: this.mergeInfo.UserId
          }
          this.$axios.post(url, postData).then(res => {
              this.mergrLoading = false;
              let {Code,Message} = res.data;
              if (Code === '0') {
                  this.$Message.success("合并成功");
                  this.isMerge = false;
                  this.getInfo()
              } else {
                  this.$Message.error(Message);
              }
          }).catch(e => {
              this.mergrLoading = false;
          })
      }
      
    },
  }
</script>

<style lang="less">
  .member-detail {
    overflow-y: scroll;
    .echarts {
      width: 100%;
      height: 100%;
    }

    .ivu-card-head {
      border-bottom: 0;
    }

    .ivu-progress-bg {
      background: linear-gradient(to right, #7E80F6, #7BA4F7);
      max-width: 100%;
    }
  }
</style>

<style scoped lang="less">
  .member-detail {
    background: #F7F8FA;
  }
  .records,.info{
    margin: 10px;
    background-color: #fff;
    border-radius: 4px;
  }

  .info {
    display: flex;
    // flex-wrap: wrap;
    padding: 32px 32px 42px;
    position: relative;
    margin-bottom: 0;
    .user-avatar {
      width: 140px;
      margin-right: 32px;
      text-align: center;
    }

    .avatar {
      display: block;
      width: 140px;
      height: 160px;
      // background-color: #ccc;
      border-radius: 4px;
    }

    .info-buttons {
      position: absolute;
      right: 12px;
      top: 30px;
      // width: calc(100% - 220px);
      display: flex;
      justify-content: flex-end;
      flex-wrap: wrap;
      .ivu-btn{
        margin-left: 10px;
        margin-bottom: 10px;
        font-size: 14px;
        color: #333;
      }
    }
  }

  .mid {
    // width: 100%;
    padding-right: 100px;
    .name{
      padding-left: 40px;
      color: #333;
      margin-bottom: 10px;
      font-weight: 900;
      font-size: 17px;
      line-height: 34px;
      .ivu-input-wrapper{
        margin-bottom: 5px;
      }
      .ivu-btn{
        color: #3275F5;
        font-size: 14px;
      }

    }

    .notice {
      width: 100%;
      // display: flex;
      // align-items: center;
      font-size: 15px;
      color: #333;
      padding-top: 10px;
      padding-left: 40px;
      // height: 44px;
      >div{
        display: inline-block;
        width: 33.33%;
      }
      .big-num{
        color: #E94E27;
      }
      span {
        color: #333;

        strong {
          font-size: 20px;
        }
      }
    }
  }

  .form {
    display: flex;
    flex-wrap: wrap;
    flex: 1;

    .ivu-form-item {
      flex-basis: 33%;
      margin-bottom: 5px;
      .my-radio{
        width: 30px;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
      }
    }

    .text {
      color: #333;
    }
  }
  .merge{
      .title{
        text-align: center;
        font-size: 18px;
        margin: 10px 0 -8px;
        color: #333;
      }
      .merge-content{
          background-color: #F7F8FA;
          border-radius: 4px;
          margin: 0 10px;
          .merge-info{
              border-bottom: 1px solid #E4E4E4;
              display: flex;
              align-items: center;
              margin: 0 20px;
              padding: 20px 0;
              img{
                  margin-right: 20px;
              }
              p{
                font-size: 17px;
                color: #333;
                font-weight: 700;
              }
             
          }
        .merge-amount{
            display: flex;
            justify-content: center;
            padding: 30px 0;
            font-size: 14px;
            
            >div{
                padding: 0 30px;
            }
            span{
                color: #E94E27;
                font-weight: 700;
                
            }
        }
        
        
      }
      .merge-form{
        width: 310px;
        margin:  0 auto;
        .ivu-form-item{
          margin-bottom: 15px;
        }
      }
      .footer{
          text-align: center;
          margin-top: 40px;
          margin-bottom: 10px;
        .ivu-btn{
            width: 180px;
            height: 40px;
        }
        
    }
  }
  @media screen and (max-width: 992px){
    .form{
        .ivu-form-item {
          flex-basis: 50%;
        }
      }
    .notice > div{
      width: 50%;
    }
    
  }
  @media screen and (max-width: 768px) {
      .mid{
        padding-right: 0;
      }
      .info{
        flex-wrap: wrap;
        
        .avatar{
          width: 100px;
          height: 115px;
          margin-left: 40px;
        }
      }
      
    }
  @media screen and (max-width: 567px){
    .tabs{
      padding-left: 20px !important;
    }
    .info{
      .info-buttons{
          display: flex;
          flex-direction: column;
          .ivu-btn{
            margin-bottom: 10px;
          }
        }
    }
    .form{
      .ivu-form-item {
        flex-basis: 100%;
      }
    }
    .mid .notice > div{
        width: 100%;
    }
    
  }
</style>
