<template>
  <div class="layout">
    <Layout>
      <Sider
        breakpoint="md"
        collapsible
        :collapsed-width="78"
        width="110"
        v-model="isCollapsed"
      >
        <div class="logo">
          <img
            v-if="!adminUserInfo.Logo"
            src="@/assets/logo2.svg"
            alt="logo"
          >
          <img
            class="main"
            v-else
            :src="adminUserInfo.Logo"
            alt="logo"
          >
        </div>
        <Menu
          active-name="active"
          width="110px"
          mode="vertical"
          theme="light"
          :class="menuitemClasses"
          @on-select="select"
        >
          <MenuItem
            :name="menu.name"
            v-for="(menu, index) in menuList"
            :key="index"
            :class="{ 'active': active === menu.name}"
            :to="menu.route"
          >
          <svg-icon
            :name="menu.icon"
            size="26px"
            class="menu-icon"
          ></svg-icon>
          <span style="margin-top: 2px">{{menu.title}}</span>
          <Badge
            v-if="unTotal>0 && menu.name=='stores'"
            :count="unTotal"
          >
            <a
              href="#"
              class="demo-badge"
            ></a>
          </Badge>
          <Badge
            v-if="unAuditNum>0 && menu.name=='order'"
            :count="unAuditNum"
          >
            <a
              href="#"
              class="demo-badge"
            ></a>
          </Badge>
          <Badge
            v-if="unAuditGoodsNum>0 && menu.name=='goods'"
            :count="unAuditGoodsNum"
          >
            <a
              href="#"
              class="demo-badge"
            ></a>
          </Badge>
          </MenuItem>
          <!-- <div class="home"  @click="queryInfo" >
            <img src="@/assets/home.svg" alt="home">
            <p>{{adminUserInfo.SiteName }}</p>
          </div> -->
        </Menu>
        <div
          class="home"
          @click="queryInfo"
        >
          <img
            src="@/assets/home.svg"
            alt="home"
          >
          <p>{{adminUserInfo.SiteName }}</p>
          <!-- || '赣州国旅总部' -->
        </div>
        <div slot="trigger"></div>
      </Sider>

      <Layout>
        <Content :style="{'box-sizing': 'border-box', background: '#f7f8fa;', height: 'height: 100vh'}">
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive"></router-view>
        </Content>
      </Layout>

    </Layout>

    <Modal
      v-model="isShowInfo"
      width="312"
      :footer-hide="true"
      :mask-closable="false"
    >
      <div class="home-content">
        <div
          class="header"
          @click="isShowInfo=false; $router.push({
              path: '/personalInfo',
              query:{'Sex': adminUserInfo.Sex,'UserName': adminUserInfo.UserName,'Email': adminUserInfo.Email}})"
        >
          <img
            :src="adminUserInfo.PhotoUrl || require('@/assets/avatar.svg')"
            alt="home"
          >
          <div style="font-size: 14px;color: #999;">{{adminUserInfo.UserName}}</div>
          <div>{{adminUserInfo.SiteName}}</div>
        </div>
        <CellGroup @on-click="clickCell">
          <Cell
            :title="storeType==1?'商家信息':'门店信息'"
            name="1"
          >
            <img
              src="@/assets/arrow-right.svg"
              alt=""
              slot="extra"
            >
          </Cell>
          <Cell
            title="退出登录"
            name="2"
          >
            <img
              src="@/assets/layout.svg"
              alt=""
              slot="extra"
            >
          </Cell>
        </CellGroup>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getToken, getStoreType, getLoginName, removeToken, removeStoreType, getPhysical } from '@/utils/auth.js'
import { getAdminUserInfo, clearToken } from '@/api/user.js'
import { storeList } from '@/api/store.js'
import { getOrderList } from '@/api/order.js'
import { getAuditCount } from '@/api/goods.js'
export default {
  name: 'wrapper',
  data() {
    return {
      unTotal: 0,
      unAuditNum: 0,
      unAuditGoodsNum: 0,
      isShowInfo: false,
      phone: "",
      storeType: 1,
      isCollapsed: false,
      adminUserInfo: {},
      //多店的总店
      headMenuList: [
        // {
        //   route: '/preference',
        //   name: 'preference',
        //   icon: 'menu-preference',
        //   title: '优选中心'
        // },
        {
          route: '/goods',
          name: 'goods',
          icon: 'menu-goods',
          title: '商品管理'
        },
        {
          route: '/stores',
          name: 'stores',
          icon: 'menu-stores',
          title: '门店管理'
        },
        // {
        //   route: '/statistics',
        //   name: 'statistics',
        //   icon: 'menu-statistics',
        //   title: '数据管理'
        // },
        {
          route: '/setting',
          name: 'setting',
          icon: 'menu-setting',
          title: '商家设置'
        },

      ],
      //多店的分店
      storeMenuList: [
        {
          route: '/preference',
          name: 'preference',
          icon: 'menu-preference',
          title: '优选中心'
        },
        {
          route: '/goods',
          name: 'goods',
          icon: 'menu-goods',
          title: '门店商品'
        },
        {
          route: '/order',
          name: 'order',
          icon: 'menu-order',
          title: '订单管理'
        },
        {
          route: '/marketing',
          name: 'marketing',
          icon: 'menu-marketing',
          title: '营销管理'
        },
        // {
        //   route: '/statistics',
        //   name: 'statistics',
        //   icon: 'menu-statistics',
        //   title: '数据管理'
        // },
        {
          route: '/storeSetting',
          name: 'storeSetting',
          icon: 'menu-setting',
          title: '门店配置'
        },

      ],
      //单店
      singleMenuList: [
        {
          route: '/goods',
          name: 'goods',
          icon: 'menu-goods',
          title: '商品管理'
        },
        {
          route: '/order',
          name: 'order',
          icon: 'menu-order',
          title: '订单管理'
        },
        {
          route: '/marketing',
          name: 'marketing',
          icon: 'menu-marketing',
          title: '营销管理'
        },
        // {
        //   route: '/statistics',
        //   name: 'statistics',
        //   icon: 'menu-statistics',
        //   title: '数据管理'
        // },
        {
          route: '/storeSetting',
          name: 'storeSetting',
          icon: 'menu-setting',
          title: '门店配置'
        },
        {
          route: '/setting',
          name: 'setting',
          icon: 'menu-setting',
          title: '商家设置'
        },

      ],
      // 体检
      menuList: [],
      physicalList: {
        route: '/physicalIndex',
        name: 'physicalIndex',
        icon: 'menu-other',
        title: '其他应用'
      },
    };
  },
  computed: {
    menuitemClasses: function () {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    }
  },

  created() {
    this.storeType = getStoreType();
    if (this.storeType == 1) {
      if (getPhysical()) {
        this.headMenuList.splice(2, 0, this.physicalList);
      }
      this.menuList = this.headMenuList;
    } else if (this.storeType == 2) {
      if (getPhysical()) {
        this.storeMenuList.splice(4, 0, this.physicalList);
      }
      this.menuList = this.storeMenuList;
    } else {
      if (getPhysical()) {
        this.singleMenuList.splice(3, 0, this.physicalList);
      }
      this.menuList = this.singleMenuList
    }
    this.phone = getLoginName();
    this.update();
    this.getAdminUser();
    this.getUnTotal();
    this.getUnAuditNum();
    this.getUnAuditGoodsNum();
  },
  watch: {
    $route() {
      this.update();
    }
  },
  methods: {
    queryInfo() {
      this.isShowInfo = true;
      // this.getAdminUser();
    },

    clickCell(name) {
      this.isShowInfo = false;
      if (name == "1") {
        if (this.storeType == 1 && this.$route.fullPath != '/setting/merchant/info') {
          this.$router.push('/setting/merchant/info');
        } else if (this.storeType == 2 && this.$route.fullPath != '/storeSetting/store') {
          this.$router.push('/storeSetting/store');
        }
      } else if (name == "2") {
        this.layout()
      }
    },

    update() {
      this.active = this.$route.meta.parentName || this.$route.name;
    },

    select(e) {
      this.active = e;
    },

    layout() {
      this.$Modal.confirm({
        title: '请确认是否退出登录',
        onOk: () => {
          this.clearLoginToken();
        }
      })
    },

    clearLoginToken() {
      let postData = {
        Tokens: [getToken()]
      }
      clearToken(postData).then(res => {
        removeToken();
        removeStoreType();
        this.isShowInfo = false;
        this.$router.push('/login');
      }).catch(err => {

      })
    },

    getAdminUser() {
      getAdminUserInfo().then(res => {
        res.Data.LoginUser.Sex = res.Data.LoginUser.Sex.toString();
        this.adminUserInfo = res.Data.LoginUser;
      }).catch(err => {

      })
    },

    getNum() {
      const postData = {
        Key: '',
        State: 1,
        PageIndex: 1,
        PageSize: 10
      }
      storeList(postData).then(res => {
        // console.log(res)
        this.unTotal = res.Data.UnTotal;
      })

      const postData2 = {
        Key: '',
        StartDate: '',
        OrderState: '', //0.下架  1.上架  2.待上架  -1全部
        PageIndex: 1,
        PageSize: 10
      };
      getOrderList(postData2).then(res => {
        this.unAuditNum = res.Data.UnAuditNum;
      })


    },

    getUnTotal() {
      const postData = {
        Key: '',
        State: 1,
        PageIndex: 1,
        PageSize: 10
      }
      storeList(postData).then(res => {
        // console.log(res)
        this.unTotal = res.Data.UnTotal;
      })
    },

    getUnAuditNum() {
      const postData = {
        Key: '',
        StartDate: '',
        OrderState: '', //0.下架  1.上架  2.待上架  -1全部
        PageIndex: 1,
        PageSize: 10
      };
      getOrderList(postData).then(res => {
        this.unAuditNum = res.Data.UnAuditNum;
      })
    },

    getUnAuditGoodsNum() {
      getAuditCount(this.storeType == 2 ? 2 : 1).then(res => {
        // console.log(res)
        this.unAuditGoodsNum = res.Data.Count;
      })
    }

  },
}
</script>
<style lang="less">
.ivu-cell-extra img {
  padding-left: 20px;
}
.layout {
  .ivu-badge {
    top: -42px;
    right: -22px;
    .ivu-badge-count {
      height: 16px;
      line-height: 14px;
      min-width: 16px;
      font-size: 12px;
      padding: 0 2px;
    }
  }
}
</style>
<style scoped lang="less">
.logo,
.home {
  height: 101px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
}
.logo img.main {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.home {
  flex-direction: column;
  font-size: 12px;
  line-height: 1.8;
  color: #e5e5e5;
  width: 110px;
  position: absolute;
  bottom: 0;
  z-index: 999;
  img {
    opacity: 0.8;
  }
  p {
    padding: 0 10px;
  }
}
.home-content {
  .header {
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: #333;
    img {
      width: 60px;
      margin: 10px 0 20px;
    }
  }
}
.ivu-cell {
  border-top: 1px solid #e4e4e4;
  padding: 12px 16px;
}
.ivu-layout-sider {
  height: 100vh;
  background-color: #0899ac;
}
.ivu-menu-light {
  background-color: #0899ac;
  margin-bottom: 101px;
  // max-height: calc(100% - 101px);
  // overflow-y: auto;
  // overflow-x: hidden;
}
.ivu-menu-item {
  height: 82px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #e5e5e5;
  font-size: 12px;
}

.menu-icon {
  fill: #e5e5e5;
}
.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
  background-color: #0899ac;
  color: #e5e5e5;
  .menu-icon {
    fill: #e5e5e5;
  }
}
.ivu-menu-light.ivu-menu-vertical .active:not(.ivu-menu-submenu) {
  background-color: #fff;
  color: #0899ac;
  .menu-icon {
    fill: #0899ac;
  }
}

.ivu-menu-vertical .ivu-menu-item:hover,
.ivu-menu-vertical .ivu-menu-submenu-title:hover {
  color: #e5e5e5;
}
.ivu-menu-light.ivu-menu-vertical
  .ivu-menu-item-active:not(.ivu-menu-submenu):after {
  display: none;
}
.ivu-menu-vertical.ivu-menu-light:after {
  display: none;
}

.layout {
  // border: 1px solid #d7dde4;
  // background: #f5f7f9;
  position: relative;
  // border-radius: 4px;
  overflow: hidden;
  min-height: 100vh;
}
.menu-item span {
  // display: inline-block;
  // overflow: hidden;
  // width: 110px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  // font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
}
@media screen and (max-width: 992px) {
  // .home {
  //   position: relative;
  // }
}
</style>
