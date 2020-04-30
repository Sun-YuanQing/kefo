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
            src="@/assets/logo2.svg"
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
          </MenuItem>

        </Menu>
        <div
          class="home"
          @click="queryInfo"
        >
          <img
            src="@/assets/home.svg"
            alt="home"
          >
          <p>{{siteName}}</p>
        </div>
        <div slot="trigger"></div>
      </Sider>

      <Layout>
        <Content :style="{'box-sizing': 'border-box', background: '#f7f8fa;', height: 'height: 100vh'}">
          <!-- <keep-alive> -->
          <router-view></router-view>
          <!-- </keep-alive> -->
        </Content>
      </Layout>

    </Layout>

    <Modal
      v-model="isShow"
      width="312"
      :footer-hide="true"
      :mask-closable="false"
    >
      <div class="home-content">
        <div
          class="header"
          @click="isShow=false;
                  $router.push({path: '/personalInfo',query:{'Sex': adminUserInfo.Sex,'UserName': adminUserInfo.UserName,'Email': adminUserInfo.Email}})"
        >
          <img
            :src="adminUserInfo.PhotoUrl || require('../assets/avatar.svg')"
            alt="home"
          >
          <div style="font-size: 14px;color: #999;">{{adminUserInfo.UserName}}&nbsp;&nbsp;{{phone}}</div>
          <div>{{adminUserInfo.SiteName}}</div>
        </div>
        <CellGroup @on-click="clickCell">
          <Cell
            title="切换店铺"
            name="1"
          >
            <img
              src="@/assets/arrow-right.svg"
              alt=""
              slot="extra"
            >
          </Cell>
          <Cell
            title="店铺信息"
            name="2"
          >
            <img
              src="@/assets/arrow-right.svg"
              alt=""
              slot="extra"
            >
          </Cell>
          <Cell
            title="退出登录"
            name="3"
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
export default {
  name: 'wrapper',
  data() {
    return {
      isShow: false,
      phone: "",
      siteName: "",
      isCollapsed: false,
      adminUserInfo: {},
      menuList: [
        {
          route: '/index',
          name: 'index',
          icon: 'menu-today-member',
          title: '今日会员'
        },
        {
          route: '/cashier',
          name: 'cashier',
          icon: 'menu-cash',
          title: '收银管理'
        },
        {
          route: '/member',
          name: 'member',
          icon: 'menu-member',
          title: '会员管理'
        },
        {
          route: '/marketing',
          name: 'marketing',
          icon: 'menu-marketing',
          title: '营销方案'
        },
        {
          route: '/setting',
          name: 'setting',
          icon: 'menu-setting',
          title: '商家配置'
        },

      ]
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
    this.siteName = localStorage.getItem('siteName');
    this.phone = localStorage.getItem("currentUserNname")
    this.update();

  },
  watch: {
    $route() {
      this.update();
    }
  },
  methods: {
    queryInfo() {
      this.isShow = true;
      this.getAdminUser();
    },
    clickCell(name) {
      this.isShow = false;
      if (name == "1") {
        this.$router.push('/selectStore')
      } else if (name == "2") {
        this.$router.push('/storeInfo')
      } else if (name == "3") {
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
      const self = this;
      this.$Modal.confirm({
        title: '请确认是否退出登录',
        onOk: () => {

          this.clearTokens()

        }
      })
    },
    clearTokens() {
      let arr = JSON.parse(localStorage.getItem('tokenList'));
      let tokenList = [];
      for (let i = 0; i < arr.length; i++) {
        for (let key in arr[i]) {
          tokenList.push(arr[i][key])
        }
      }
      let url = '/Site/ClearTokens';
      let postData = {
        Tokens: [...tokenList, localStorage.getItem('loginToken')]
      }
      this.$axios.post(url, postData).then(res => {
        let { Data, Message, Code } = res.data;
        if (Code == 0) {
          // window.localStorage.clear()
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("loginToken");
          window.localStorage.removeItem("siteId");
          window.localStorage.removeItem("tokenList");
          window.localStorage.removeItem("currentUserNname");
          this.isShow = false;
          this.$router.push('/login');
        } else {
          this.$Message.error(Message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getAdminUser() {
      let url = "/User/GetAdminUser";
      this.axios.post(url)
        .then(res => {
          let { Data, Code, Message } = res.data;
          if (Code == 0) {
            Data.LoginUser.Sex = Data.LoginUser.Sex.toString();
            this.adminUserInfo = Data.LoginUser;
          } else {
            this.$Message.error(Message)
          }
        }).catch(err => {
          console.log(err)
        })
    },

  },
}
</script>
<style lang="less">
.ivu-cell-extra img {
  padding-left: 20px;
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
.home {
  flex-direction: column;
  font-size: 12px;
  line-height: 1.8;
  color: #a7adc1;
  width: 100%;
  position: absolute;
  bottom: 0;
  img {
    opacity: 0.8;
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
  background-color: #28282c;
}
.ivu-menu-light {
  background-color: #28282c;
}
.ivu-menu-item {
  height: 82px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #a7adc1;
  font-size: 12px;
}

.menu-icon {
  fill: #a7adc1;
}
.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
  background-color: #28282c;
  color: #a7adc1;
  .menu-icon {
    fill: #a7adc1;
  }
}
.ivu-menu-light.ivu-menu-vertical .active:not(.ivu-menu-submenu) {
  background-color: #fff;
  color: #1f1f39;
  .menu-icon {
    fill: #1f1f39;
  }
}

.ivu-menu-vertical .ivu-menu-item:hover,
.ivu-menu-vertical .ivu-menu-submenu-title:hover {
  color: #a7adc1;
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
  .home {
    position: relative;
  }
}
</style>
