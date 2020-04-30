<template>
    <div class="fullscreen order">
        <Header title="开单"></Header>
        <div class="content">
            <project-info :orderList="orderList" :isTraveler="isTraveler" :userId="userId" @getOrder="getOrder"></project-info>
            <div class="right">
                <div v-if="!userId && !faceId && !isTraveler">
                    <Search v-model="searchVal" placeholder="输入手机号"  style="width: 100%;"  
                            @on-search="handleSearch"></Search>
                    <ul class="radio">
                        <li @click="editedMenber('2')"><span></span>成为会员？</li>
                        <li v-if="!isTraveler" @click="addInventUser"><span></span>散客</li>
                    </ul>
                </div>
                <div class="userInfo" v-else>
                    <div class="tag" v-if="isTraveler">散客</div>
                    <div class="top">
                        <img :src="userInfo.Photo || require('../../assets/avatar.svg')" 
                             width='90' height='90' alt="">
                        <ul>
                            <li>{{ userInfo.UserName || '姓名'}}</li>
                            <li>{{ userInfo.Phone || '手机号' }}</li>
                        </ul>
                    </div>
                    <ul class="bottom" v-if="!isTraveler">
                        <li>
                            <span>余额</span>
                            <span>¥{{userInfo.Amount.toFixed(2)}}</span>
                        </li>
                        <li>
                            <span>优惠券</span>
                            <span>{{userInfo.CouponCount}}张</span>
                        </li>
                        <li>
                            <span>卡项</span>
                            <span>{{cardNum}}张</span>
                        </li>
                    </ul>
                    <div class="toCharge">
                         <Button :to="{path: '/charge', query: { userId: userInfo.UserId}}" 
                                 v-if="userId && !isTraveler">充值</Button>
                         <Button @click="changeUser" v-if="isSearch">更换会员</Button>
                         <Button @click="editedMenber(isTraveler ? '3' : '4')" 
                                 v-if="(faceId && !userId) || isTraveler">成为会员</Button>
                    </div>
                </div>
                <ul v-for="(order,index) in orderList" :key="index" class="projectList">
                    <li class="close" v-if="!order.Status"><img src="../../assets/delete2.svg" alt=""  
                        @click="deleteProject(index,order)"></li>
                    <li>{{order.ItemType=="1" ? "项目/服务" : order.ItemType=="2" ? "产品" : "卡项"}}</li>
                    <li class="name">
                        <span v-if="order.ItemType=='3'">【{{order.ClassType}}】—{{order.ChildType}}</span>
                        <span v-else>{{order.ItemName}}</span>
                        <span>
                            <span v-if="order.UserCardProjectId && order.Price != order.ActualPrice">
                                <span class="old">￥{{order.Price.toFixed(2)}}</span>
                                ￥{{order.ActualPrice.toFixed(2)}}</span>
                            <span v-else>￥{{order.Price.toFixed(2)}}</span>
                            <span class="blue" @click="isChangePrice = true;
                                    originalData={'Index': index,'Name': order.ItemName,'Price': order.Price};">改价</span>
                        </span>
                    </li>
                    <li class="name config" v-if="order.ItemType!='3'">
                        <span>使用卡项</span>
                        <span @click="configCard(index,order)">
                            <span v-if="order.UserCardProjectItemId" style="color: #E94E27">{{order.CardProjectName}}</span>
                            <span v-else-if="!order.cardCount">无可用卡项</span>
                            <span v-else style="color: #E94E27">{{ order.cardCount + '张可用'}}</span>
                            <img src="../../assets/arrow-right.svg" alt="" width="6" srcset="">
                        </span>
                    </li>

                    <!-- 项目/服务 -->
                    <li v-if="order.ItemType=='3' && order.CardRightsItems && order.CardRightsItems.Project.length>0">
                        <ul class="projectList">
                            <li class="tag">项目/服务</li>
                            <li v-for="project in order.CardRightsItems.Project.slice(0,3)" :key="project.Id">
                                <span class="over">{{project.ItemName}}</span>
                                <span v-if="project.ItemNum >0">{{project.ItemNum + project.ItemUnit}}</span>
                            </li>
                            <li v-if="order.CardRightsItems.Project.length>3">...</li>
                        </ul>
                    </li>
                    <p v-if="order.ClassType=='次卡' && order.ChildType=='多项有限次'" style="margin-bottom: 10px;">
                        以上{{order.CardRightsItems.Project.length}}个项目/服务共<b>{{order.ToTalNum}}</b>次
                    </p>

                    <li v-if="order.ItemType=='3' && order.IsUnionDisc">
                        <ul class="projectList">
                            <li>
                                <span>全店统一折扣</span>
                                <span>{{order.Discount}}折</span>
                            </li>
                        </ul>
                    </li>

                    <!-- 产品 -->
                    <li v-if="order.ItemType=='3' && order.CardRightsItems && order.CardRightsItems.Product.length>0">
                        <ul class="projectList" >
                            <li class="tag">产品</li>
                            <li v-for="product in order.CardRightsItems.Product.slice(0,3)" :key="product.Id">
                                <span class="over">{{product.ItemName}}</span>
                                <span v-if="product.ItemNum >0">{{product.ItemNum + product.ItemUnit}}</span>
                            </li>
                            <li v-if="order.CardRightsItems.Product.length>3">...</li>
                        </ul>
                    </li>

                    <!-- 赠送 -->
                    <li v-if="order.ItemType=='3' && order.CardGivingItems 
                        && (order.CardGivingItems.Product.length>0 || order.CardGivingItems.Project.length>0)">
                        <ul class="projectList">
                            <li v-for="project in order.CardGivingItems.Project" :key="project.Id">
                               <p class="itemName">
                                    <span>{{project.ItemName}}</span>
                                    <img src="../../assets/gift-icon.svg" alt="">
                                </p>
                                <span>{{project.ItemNum + project.ItemUnit}}</span>
                            </li>
                            <li v-for="product in order.CardGivingItems.Product" :key="product.Id">
                                <p class="itemName">
                                    <span>{{product.ItemName}}</span>
                                    <img src="../../assets/gift-icon.svg" alt="">
                                </p>
                                <span>{{product.ItemNum + product.ItemUnit}}</span>
                            </li>
                        </ul>
                    </li>

                    <!-- 销售员 -->
                    <li>
                        <ul class="staffList">
                            <li v-for="(itm,indx) in order.ServiceStaff" :key="indx">
                                <span>{{itm.EmployeeName}}</span>
                                <span v-if="order.ItemType=='1'" 
                                        :style="{'background-color':itm.ServiceType==2 ? '#FFF6EA' : '#F7F8FA','color':itm.ServiceType==2 ? '#FF9F27' : '#999999'}" 
                                        class="point">{{itm.ServiceType==2 ? '点' : '轮'}}</span>
                                <span v-if="order.ItemType=='1'" >{{itm.ProfessionName}}</span>
                                <span v-if="order.ItemType=='2' || order.ItemType=='3'" >{{itm.SaleWayName}}</span>
                            </li>
                        </ul>
                    </li>
                    <p v-if="order.ItemType=='3'" style="text-align: right;font-size: 12px;">
                        <router-link :to="{path: '/cardDetail',query:{cardId: order.Id,type: '1'}}">查看详情</router-link>
                    </p>
                </ul>
                <div class="buttonWrap">
                    <Button type="text" @click="entryOrder" :loading="orderLoading">挂单</Button>
                    <Button type="text" @click="checkOut">结账</Button>
                </div>

            </div>
        </div>
        <!-- 添加会员 -->
        <add-member :isShow="isAdd" :title="title" :form="addForm" @chang-info="addMenber" @cancel-add="isAdd=false;"></add-member>
        
        <!-- 修改价格 -->
        <Modal v-model="isChangePrice" class="priceModal"
               :mask-closable="false" :footer-hide="true" width="380" @on-cancel="changedprice=0;">
            <p slot="header" class="title">{{originalData.Name}}单价修改</p>
            <ul class="priceModalConten">
                <li>
                    <span>原价</span>
                    <InputNumber v-model="originalData.Price" disabled ></InputNumber>&nbsp;&nbsp;元
                </li>
                <li>
                    <span>改价后</span>
                    <InputNumber  :min="1" 
                          :max="9999999999"
                          :parser= "value => `${value}`.replace(/([0-9]+.[0-9]{2})[0-9]*/,'$1')"
                          v-model="changedprice" ></InputNumber>&nbsp;&nbsp;元
                </li>
                <li>
                    <span></span>
                     <Button type="primary" @click="changPrice" :loading="priceLoading">确定</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                </li>
            </ul>
        </Modal>
    </div>
</template>
<script>
import Header from '@/components/route-header'
import Search from '@/components/search'
import AddMember from 'src/components/add-member'
import ProjectInfo from './components/project-info'
import { Stats } from 'fs';
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
    name: 'order',
    components: { Header,Search ,AddMember,ProjectInfo},
    data(){
        return{
            title: "",
            addForm: {},
            userId: "",
            faceId: "",
            type: "",  //1从配置卡面过来，需要获取缓存
            searchVal: "",
            userInfo: {
                Photo: "",
                UserName: "",
                Sex: '1',
                Phone: "",
                Amount: 0,
                CouponCount: 0
            },
            isAdd:  false,
            isChangePrice: false,
            priceLoading: false,
            originalData: {},
            changedprice: 0,
            orderList: [],
            orderLoading: false,
            isTraveler: false,
            isSearch: false,
            isChange: false,
            cardNum: 0,
        }
    },
    created(){
        this.faceId = this.$route.query.faceId ;
        this.userId = this.$route.query.userId ;
        this.type = this.$route.query.type ;
        
        if(this.faceId || this.userId){
            this.getInfo(); //用户信息
            this.getCardNum();
            if(this.type == '1'){
                this.orderList = JSON.parse(localStorage.getItem("orderList-Fk")) || [];
                let configItem =  JSON.parse(localStorage.getItem("configItem-FK")) ;
                // console.log('configItem',configItem)
                if(configItem){
                    this.isChange = true;
                    let actualPrice = 0;
                    let data = this.orderList[configItem.orderIndex];
                    if(configItem.ClassType=="折扣卡" && configItem.Class=='1'){
                        if(configItem.UnionDisc){
                            actualPrice = data.Price * configItem.Discount;
                        }else{
                            actualPrice = configItem.ItemPrice * (configItem.ItemNum/10);
                        }
                    }else{
                        actualPrice = 0;
                    }
                    this.orderList[configItem.orderIndex].ActualPrice = actualPrice; 
                    if(configItem.Id){
                        this.orderList[configItem.orderIndex].UserCardProjectId = configItem.UserCardProjectId;
                        this.orderList[configItem.orderIndex].CardProjectId = configItem.CardProjectId;
                        this.orderList[configItem.orderIndex].UserCardProjectItemId = configItem.Id;
                        this.orderList[configItem.orderIndex].CardProjectName = configItem.Name;
                    }
                    
                }
            }
            if((this.type == '1' && this.orderList.length==0) || this.type != '1'){
                this.getBeautyOrderStatus();//已下单列表
            }
            localStorage.removeItem("orderList-Fk")  //准备就绪后清除缓存
            localStorage.removeItem("configItem-FK")
        }
        // console.log('this.orderList',this.orderList)
        
    },
    methods: {
        getOrder(item){
            this.orderList = item;
            // console.log('this.orderList',this.orderList)
        },
        getInfo() {
            const url = '/User/GetUserByFaceId';
            const postData = {
                FaceId: this.faceId,
                UserId: this.userId
            };
            this.$axios.post(url, postData).then(res => {
                let {Code,Data,Message} = res.data;
                if(Code === '0'){
                    this.userInfo = Data.User;
                    this.userId = this.userInfo.UserId || '';
                    this.faceId = this.userInfo.FaceId || '';
                    this.isTraveler = this.userInfo.InventUser;
                    
                }else{
                    this.$Message.error(Message);
                }
            }).catch(e => {
                throw new Error(e)
            })
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
        //已下单列表
        getBeautyOrderStatus(){
            const url = '/UserFace/GetBeautyOrderStatus';
            const postData = {
                FaceId: this.faceId,
                UserId: this.userId
            };
            this.$axios.post(url, postData).then(res => {
                if(res.data.Code === '0') {
                    const data = res.data.Data;
                    if(data.Status && data.Items != null){
                        let arr = data.Items.map(item => {
                            return {
                                    ...item,
                                    Status: true,  //已经下单的项目
                                }
                        })

                        this.orderList = arr;
                        this.getCardDetail();
                    }
                    
                } else {
                    this.$Message.error(res.data.Message);
                }
            }).catch(e => {
                throw new Error(e)
            })
        },
        getCardDetail(){
            this.orderList.forEach((item,index) => {
                if(item.ItemType=='3'){
                    //卡项详情
                    let url = '/CardProject/GetCardPeojectByCardId?cardId=' + item.ItemId;
                    this.$axios.post(url).then(res => {
                        const { Code, Message, Data } = res.data;
                        if (Code === '0') {
                            let data = {
                                ...Data,
                                ...this.orderList[index]
                            } 
                            this.$set(this.orderList,index,data);
                        } else {
                            this.$Message.error(Message);
                        }
                    }).catch(e => {
                        throw new Error(e)
                    })
                }else{
                    //根据项目获取有效卡片数量
                    let url = 'UserCardProject/GetUserEffectCardCount';
                    this.$axios.post(url, {UserId: this.userId,ItemId: item.ItemId}).then(res => {
                        const { Code, Message, Data } = res.data;
                        if (Code === '0') {
                            let data = {
                                ...this.orderList[index],
                                cardCount: Data.Count,
                            }
                            this.$set(this.orderList,index,data);
                        } else {
                            this.$Message.error(Message);
                        }
                    }).catch(e => {
                        throw new Error(e)
                    })
                }
            })

        },
        //虚拟用户
        addInventUser(){
            const url = '/User/AddInventUser';
            this.$axios.post(url).then(res => {
                if (res.data.Code === '0') {
                    this.isTraveler = true;
                    let data = res.data.Data.InventUser;
                    this.userInfo.UserName = data.Name;
                    this.userInfo.UserId = data.UserId;
                    this.userId = data.UserId;
                } else {
                    this.$Message.error(res.data.Message);
                }
            }).catch(e => {
                throw new Error(e)
            })
        },
        addMenber(item){
            this.searchVal = item.Phone;
            this.handleSearch();
        },
        handleSearch(){
            var phoneReg = /(^1[2-5789]\d{9}$)/;
            if(!this.searchVal){
                this.$Message.error('请输入手机号')
            }else if(!phoneReg.test(this.searchVal)){
                this.$Message.error('输入的手机号格式不正确')
            }else{
                let url = 'User/GetUserCardsByPhone';
                this.$axios.post(url,{Phone: this.searchVal}).then(res => {
                    let {Code,Data,Message} = res.data;
                    if(Code == 0){
                        this.isSearch = true;
                        this.userInfo = Data.UserDetai;
                        this.userId = this.userInfo.UserId;
                        this.getBeautyOrderStatus();
                    }else{
                        this.$Message.error(Message)
                    }
                }).catch(err => {
                    throw new Error(err)
                })
            }
        },
        changeUser(){
            this.userInfo = {
                Photo: "",
                UserName: "",
                Sex: '1',
                Phone: "",
                Amount: 0,
                CouponCount: 0
            };
            this.userId = "";
            this.faceId = "";
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
            }else if(val == '4'){
                //有faceid的添加会员
                this.addForm = Object.assign({}, this.userInfo);
                let sex = this.userInfo.Sex.toString();
                this.$set(this.addForm,'Sex',sex)
            }
            this.isAdd = true;
        
      },

      //根据项目获取有效卡片 匹配项目
      configCard(index,item){
        // console.log(index,item) 
        if(item.cardCount && item.cardCount > 0){
            localStorage.setItem('orderList-Fk', JSON.stringify(this.orderList));
            this.$router.push({
                path: '/cards',
                query: {
                    userId: this.userId,
                    faceId: this.faceId,
                    itemId: item.ItemId,
                    itemName: item.ItemName,
                    itemType: item.ItemType,
                    index: index
                }
            })
        }
        
      },

      //挂单
      entryOrder(){
            if(!this.userId && !this.faceId && !this.isTraveler ){
                this.$Message.info("请先搜索出会员或添加散客！")
            }else if(this.orderList.length == 0){
                this.$Message.info("请添加项目/服务或产品！")
            }else{
                this.$Modal.confirm({
                    title: '请确认是否挂单',
                    onOk: () => {
                        this.addOrder(1)
                    }
                })
                
            }
            
      },

      //确定挂单
      addOrder(type){
        if(type==1) this.orderLoading = true;
        const url = '/BeautyOrder/AddBeautyOrder';
        const array = this.orderList.map(item => {
            Reflect.deleteProperty(item,'Status')
            if(item.ItemType=='3'){
                return {
                    ItemId: item.Id,
                    ItemName: item.Name,
                    ItemType: '3',
                    Price: item.CardPrice,
                    ActualPrice: item.ActualPrice,
                    ServiceStaff: item.ServiceStaff
                }
            }else{
                return item;
            }
            
        })
        const postData = {
            UserId: this.userId, 
            FaceId: this.faceId,
            Items: array
        }
        //  console.log(this.orderList)
        this.$axios.post(url, postData).then(res => {
            if(type==1) this.orderLoading = false;
            if (res.data.Code === '0') {
                if(type==1){
                    this.$Message.success('挂单成功！');
                    this.$router.push({
                        path: '/userDetail',
                        query: {
                            userId: this.userId,
                            faceId:this.faceId
                        }
                    })
                }else{
                    this.$router.push({
                        path: '/checkOut',
                        query: {
                            userId: this.userId,
                            faceId:this.faceId,
                            isTraveler: this.isTraveler ? '1' : '0',
                            photo: this.userInfo.Photo
                        }
                    })
                }
                
            } else {
                this.$Message.error(res.data.Message);
            }
        }).catch(e => {
            throw new Error(e)
        })
      },

      //结账
      checkOut(){
            if(!this.userId && !this.faceId && !this.isTraveler ){
                this.$Message.info("请先搜索出会员或添加散客！")
            }else if(this.orderList.length == 0){
                this.$Message.info("请添加项目/服务或产品！")
            }else{
                //还没挂单？
                let flag = this.orderList.some(item => !item.Status);
                // console.log('flag',flag)
                if(flag || this.isChange){
                    //挂单
                    this.addOrder(2)
                }else{
                    //结账
                    this.$router.push({
                        path: '/checkOut',
                        query: {
                            userId: this.userId,
                            faceId: this.faceId,
                            isTraveler:this.isTraveler ? '1' : '0',
                            photo: this.userInfo.Photo
                        }
                    })
                }
            }
      },

      //删除产品或项目
      deleteProject(index,item){
          this.$Modal.confirm({
                title: `请确认是否删除${item.ItemType == '1' ? '项目/服务' : '产品'}：${item.ItemName}?`,
                onOk: () => {
                    
                    this.orderList.splice(index,1)
                }
            })
          
      },
      
      //修改价格
      changPrice(){
        let index = this.originalData.Index;
        this.orderList[index].Price = this.changedprice;
        this.isChangePrice = false;
        this.isChange = true;
        this.changedprice = 0;
      },
      
    }
}
</script>
<style lang="less">
    .order .content{
        .ivu-tabs-nav-container{
            background-color: #F7F8FA;
        }
        .ivu-tabs-nav .ivu-tabs-tab{
                    padding: 18px 16px;
                }
        .ivu-tabs-nav .ivu-tabs-tab-active{
            font-weight: 900;
        }
        .ivu-tabs-ink-bar{
            height: 0;
        }
        .ivu-tabs-nav-prev,.ivu-tabs-nav-next{
                    line-height: 58px;
                }
        
    }
    .ivu-input-number-input{
                    text-align: center;
                }
    
</style>
<style lang="less" scoped>
    @import "../../styles/order.less";
</style>

