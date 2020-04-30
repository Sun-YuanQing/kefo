<template>
  <div class="index">
    <header>
      <h2>今日会员</h2>
      <div style="font-size: 16px;">（来访<strong style="font-size: 20px; color: #000">{{total}}</strong>人）</div>
      <!-- <Search v-model="search" @on-search="handleSearch"></Search> -->
    </header>
    <div class="mid">
      <dropdown-tabs v-if="showOrder=='true'" @on-change="changeTab" :items="tabItems"></dropdown-tabs>
      <Tab v-else @on-change="changeTab" :items="['全部', '会员', '非会员']"></Tab>
      <div class="buttons">
        <Button v-if="showOrder=='true'" to="/order">快捷开单</Button>
        <Button to="/cash">快捷收银</Button>
        <Button @click="isAdd = true">添加会员</Button>
        <Button type="text" to="/findMember" style="margin-left:0;"><img src="@/assets/search-icon.svg" alt=""></Button>
      </div>
    </div>
    <div v-infinite-scroll="onReachBottom" :infinite-scroll-disabled="loading" :infinite-scroll-distance="10"
         id="scrollContainer" class="scroll">
      <transition-group name="list-transition" tag="div" class="list">
        <div class="item list-transition-item"
             @click="handleUserClick(user.FaceId,user.UserId,user.Status,user.InventUser)"
             :style="{ left: 25 * (index % 4) + '%', top: 280 * (Math.floor(index / 4)) + 100 + 'px' }"
             v-for="(user, index) in userList" :key="user.LastDatetime">
          <div class="info">
            <div class="info-top">
              <div class="tag" v-if="user.Status != 0" :class="user.Status==1 ? 'active' : ''">
                <span class="circle"></span>
                <span v-if="user.Status == 1">挂单中</span>
                <span v-if="user.Status == 2">已结账</span>
              </div>
              <div class="user-avatar">
                <img :src="user.Photo || require('../../assets/avatar.svg')" alt="" class="avatar">
                <img v-if="user.Member" class="vip" src="@/assets/vip.svg" alt="">
              </div>
              <div class="user-info">
                <h3 class="phone">{{user.Phone}}</h3>
                <h3>{{user.UserName}}</h3>
              </div>
            </div>
            <div class="info-bottom">
              <div style="justify-content: space-between">
                <span style="color: #666" v-if="user.Status == 0">顾客信息</span>
                <span style="color: #666" v-if="user.Status == 1">挂单信息</span>
                <span style="color: #666" v-if="user.Status == 2">结账信息</span>
              </div>
              <template v-if="user.Member && user.Status == 0">
                <div class="member-info">
                  <span>性别：{{user.Sex === 1 ? '男' : '女'}}</span>
                  <span>会员编号：{{user.MembershipCode}}</span>
                  <span>生日：{{ user.Birthday }}</span>
                  <span>备注：{{ user.Remark }}</span>
                </div>
              </template>
              <template v-if="user.Status != 0">
                <div class="order-info">
                  <div class="project" v-if="user.BeautyItems.find(n => n.ItemType==1)">
                    <div class="project-title">项目：</div>
                    <ul>
                      <li v-for="(item,index) in user.BeautyItems" :key="index">
                        <template v-if="item.ItemType==1">
                          <span>{{item.ItemName}}</span>
                          <span>￥{{item.Price.toFixed(2)}}</span>
                        </template>
                      </li>
                    </ul>
                  </div>
                  <div class="project" v-if="user.BeautyItems.find(n => n.ItemType==2)">
                    <div class="project-title">产品：</div>
                    <ul>
                      <li v-for="(item,index) in user.BeautyItems" :key="index">
                        <template v-if="item.ItemType==2">
                          <span>{{item.ItemName}}</span>
                          <span>￥{{item.Price.toFixed(2)}}</span>
                        </template>
                      </li>
                    </ul>
                  </div>
                </div>
              </template>
              <div v-if="!user.Member && user.Status == 0">
                <!--                <Icon type="ios-camera" size="15" color="#d9d9da"></Icon>-->
                <span class="customer-info">{{user.Characteristic || '暂无顾客信息'}}</span>
              </div>
            </div>
          </div>
          <div class="bottom">
            <div>
              <div class="waiters" v-if="user.waiter && user.waiter.length && user.status !== 1">
                <img v-for="(index ,waiter) in user.waiter" :key="index" :src="waiter" class="waiter" alt="">
              </div>
              <svg-icon name="clock" size="1em"></svg-icon>
              <span>{{user.minutes >= 60 ? parseInt(user.minutes/60) + '小时' + parseInt(user.minutes%60) + '分钟' : user.minutes + '分钟'}}</span>
            </div>
            <span v-if="user.Status == 0"> 来访: {{user.VisitNumbers}}次</span>
            <span v-else> 合计: ￥{{(user.TotalAmount).toFixed(2)}}</span>
          </div>
        </div>
      </transition-group>
    </div>
    <!-- 添加会员 -->
    <add-member :isShow="isAdd" title="2" :form="{}"  @cancel-add="isAdd = false"></add-member>
  </div>
</template>

<script>
  import infiniteScroll from 'vue-infinite-scroll'
  import { formatDate, formatPhone } from 'src/utils/index'
  import Tabs from 'src/components/tabs'
  import DropdownTabs from 'src/components/dropdown-tabs'
  import Search from 'src/components/search'
  import EventBus from 'src/components/EventBus'
  import AddMember from 'src/components/add-member'

  let scroll = 0;

  const scrollFn = function (e) {
    scroll = e.target.scrollTop;
  }

  export default {
    name: 'index',
    components: {
      Tab: Tabs,
      Search,
      AddMember,
      DropdownTabs
    },
    data() {
      return {
        loading: false,
        search: '',
        activeTab: 0,
        userList: [],
        websocket: null,
        postData: {},
        allUserList: [], // 所有用户列表, 在页面加载的时候请求, 只显示前面 20 条, 滚动做本地加载更多
        page: 0,
        newNum: 0,
        showMemberDetail: false,
        FaceId: '',
        total: 0,
        timer: null,
        reconnectDelay: 3,
        scrollCon: null,
        pageSize: 20,
        isAdd:  false,
        tabItems: [
          {id: 0,label:[{id: 0,label: '全部'},{id: 1,label: '会员'},{id: 2,label: '非会员'}]},
          {id: 3,label: '挂单中'},
          {id: 4,label: '已结账'}
        ],
        showOrder: 'false',
      }
    },
    directives: { infiniteScroll },
    activated() {
      // if (!this.allUserList.length) {
      //   this.getList()
      // }
      if (this.scrollCon) {
        this.scrollCon.scrollTop = scroll;
        this.scrollCon.addEventListener('scroll', scrollFn)
      }
    },
    deactivated() {
      if (this.scrollCon) {
        this.scrollCon.removeEventListener('scroll', scrollFn)
      }
    },
    watch:{
      '$route.path': function(newVal,oldVal){
        if((oldVal == "/userDetail" && newVal == "/index") || (oldVal == "/selectStore" && newVal == "/index")){
          this.getList()
        }
      }
    },
    created() {
      this.showOrder = localStorage.getItem('goShop');
      if (!this.allUserList.length) {
        this.getList()
      }
      this.initWebsocket();
      EventBus.$on('on-user-edit', () => {
        this.page = 1;
        this.newNum = 0;
        scroll = 0;
        this.getList()
      })
    },
    mounted() {
      this.scrollCon = document.querySelector('#scrollContainer');
      // document.documentElement.requestFullscreen()
    },
    beforeDestroy() {
      this.timer && clearInterval(this.timer)
    },
    computed: {
      // todayUserList(){
      //   return this.allUserList.filter(item => item.Status==0)  
      // },
      memberUserList() {
        return this.allUserList.filter(item => item.Member)
      },
      notMemberUserList() {
        return this.allUserList.filter(item => !item.Member)
      },
      orderUserList(){
        return this.allUserList.filter(item => item.Status == 1)
      },
      checkoutUserList(){
        return this.allUserList.filter(item => item.Status == 2)
      } ,
      currentPage() {
        const pageSize = this.pageSize;
        return [(this.page - 1) * pageSize + this.newNum, this.page * pageSize + this.newNum]
      }
    },
    methods: {
      initWebsocket() {
        let siteId = window.localStorage.getItem('siteId');
        if(!siteId){
          this.$router.push('/login')
        }else{
          this.websocket = new WebSocket('wss://www.linkedsign.cn:8888')
          this.websocket.onopen = () => {
            this.websocket.send('KF'+siteId)
            // console.log('socket connected')
          };
          this.websocket.onmessage = res => {
            try {
              const data = JSON.parse(res.data)
              // console.log('socket connected',data)
              this.onMessage(data)
            } catch (e) {
              // console.log(e)
            }
          }
          this.websocket.onclose = () => {
            this.reconnect()
          }
        }
        
      },
      reconnect() {
        setTimeout(() => {
          this.reconnectDelay *= 2;
          this.initWebsocket()
        }, this.reconnectDelay * 1000)
      },
      handleSearch(search) {
        this.$router.push({ name: 'user', params: { search } })
      },
      handleUserClick(faceId,userId,status,inventUser) {
        if(status == '1'){
          //挂单中
          this.$router.push({ name: 'order', query: { faceId,userId } })
        }else if(!inventUser && status != '1'){
          this.$router.push({ name: 'userDetail', query: { faceId,userId } })
        }
        
      },
      changeTab(index) {
        this.activeTab = index;
        this.page = 1;
        this.newNum = 0;
        this.getUserList();
        this.scrollCon.scrollTop = 0;
      },
      onReachBottom() {
        if (this.loading) return false;
        this.loading = true;
        this.page++;
        this.getUserList();
      },
      onMessage(data) {
        if (Array.isArray(data)) {
          this.userList = data;
          return false;
        }
        const index = this.userList.findIndex(item => item.FaceId === data.FaceId && item.UserId === data.UserId);
        const allIndex = this.allUserList.findIndex(item => item.FaceId === data.FaceId && item.UserId === data.UserId);
        let item = {};
        if (allIndex >= 0) {
          const { minutes, Phone, Member, Birthday, VisitNumbers } = this.allUserList[allIndex]
          item = {
            ...data,
            minutes,
            Phone,
            Member,
            Birthday,
            VisitNumbers: VisitNumbers + 1
          }
          this.allUserList.splice(allIndex, 1);
        } else {
          this.total++;
          item = {
            ...data,
            minutes: Math.ceil((Date.now() - new Date(data.LastDatetimeTimeStamp)) / 60 / 1000),
            Phone: data.Phone && formatPhone(data.Phone),
            // Member: !!data.Phone,
            Birthday: data.Birthday && formatDate(new Date(data.Birthday), 'M月dd日'),
          }
        }
        if (index >= 0) {
          this.userList.splice(index, 1);
        } else {
          this.newNum++
        }
        // console.log('item22',item) 
        if(item.Source){ //小程序进入的
          this.allUserList.push(item)
          this.userList.push(item)
        }else{  //摄像头进入的
          this.allUserList.unshift(item)
          this.userList.unshift(item)
        }
        
      },
      getUserList() {
        if (this.page === 1) this.userList = [];
        if (this.activeTab === 1) {
          if (this.currentPage[0] > this.memberUserList.length) return false
          this.userList.push(...this.memberUserList.slice(...this.currentPage))
        } else if (this.activeTab === 2) {
          if (this.currentPage[0] > this.notMemberUserList.length) return false
          this.userList.push(...this.notMemberUserList.slice(...this.currentPage))
        }else if (this.activeTab === 3) {
          if (this.currentPage[0] > this.orderUserList.length) return false
          this.userList.push(...this.orderUserList.slice(...this.currentPage))
        } else if (this.activeTab === 4) {
          if (this.currentPage[0] > this.checkoutUserList.length) return false
          this.userList.push(...this.checkoutUserList.slice(...this.currentPage))
        }else{
          if (this.currentPage[0] > this.allUserList.length) return false
          this.userList.push(...this.allUserList.slice(...this.currentPage))
        }
        this.loading = false;
      },
      getList() {
        const url = '/UserFace/GetDailyFaceList'
        this.$axios.post(url, { PageIndex: '0', Member: '-1' }).then(res => {
          if (res.data.Code === '0') {
            const data = res.data.Data;
            this.total = data.Total;
            this.allUserList = {};
            this.allUserList = data.DailyFaces.map(item => {
              return {
                ...item,
                minutes: Math.ceil((Date.now() - new Date(item.LastDatetimeTimeStamp)) / 60 / 1000),
                Phone: item.Phone && formatPhone(item.Phone),
                // Member: !!item.Phone,
                Birthday: item.Birthday && formatDate(new Date(item.Birthday), 'M月dd日'),
                BeautyItems: item.BeautyItems ? item.BeautyItems.splice(0,2) : item.BeautyItems
              }
            });
            this.getUserList()
            this.timeInterval()
          } else {
            this.$Message.error(res.data.Message);
          }
        }).catch(e => {
          throw new Error(e)
        })
      },
      timeInterval() {
        clearInterval(this.timer);
        this.timer = setInterval(() => {
          this.allUserList.forEach(item => item.minutes++)
        }, 60 * 1000)
      },
      handleReset (name) {
          this.$refs[name].resetFields();
      },

    },
  }
</script>

<style lang="less">
  .index {
    .ivu-input {
      border: 0;
    }

    .scroll {
      flex: 1;
      overflow-y: scroll;
      background-color: #f4f4f7;
    }

    .ivu-scroll-container {
      height: 100% !important;
    }

    .ivu-scroll-loader {
      height: 0;
      display: none;
    }

    .ivu-scroll-wrapper {
      width: 100%;
    }

    .ivu-scroll-content {
      opacity: 1 !important;
      height: 100%;
    }
  }
</style>

<style scoped lang="less">
  @import '../../styles/today-list.less';
</style>
