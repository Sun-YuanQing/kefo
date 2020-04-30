<template>
  <div class="mainWrap goods">
    <div class="headMemu">
      <div class="breadcrumb">
        <span>订单管理</span>
        <span>/{{activeName}}</span>
      </div>
      <Menu
        mode="horizontal"
        theme="light"
        ref="menus"
        :active-name="active"
        @on-select="selectChange"
      >
        <!-- <MenuItem name="1">订单交易</MenuItem> -->
        <!-- <MenuItem name="2">订单列表</MenuItem> -->
        <MenuItem
          v-for="type in typeList"
          :name="type.Type"
          :key="type.Type"
        >{{type.Name}}</MenuItem>
      </Menu>
    </div>

    <div class="contentWrap">
      <div class="content">
        <order-list
          v-if="isLoad"
          :type="active"
        ></order-list>
      </div>
    </div>
  </div>
</template>
<script>
import OrderList from './components/order-list'
import { getProjectType } from '@/api/goods.js'
import { getStoreType } from '@/utils/auth.js'
export default {
  name: 'goods',
  components: { OrderList },
  data() {
    return {
      active: 1,
      activeName: '',
      typeList: [],
      isLoad: false,
      // typeList: [{Type: -1,Name: '全部产品'}],
    }
  },
  watch: {

  },
  created() {
    this.storeType = getStoreType();
    this.getProjectTypeList();
  },
  methods: {
    selectChange(e) {
      this.active = e;
      let index = this.typeList.findIndex(item => item.Type == e)
      this.activeName = this.typeList[index].Name;
    },
    //获取当前的一级分类
    getProjectTypeList() {
      // this.$Spin.show();
      getProjectType(true).then(res => {
        // this.$Spin.hide();
        // this.typeList = [{Type: -1,Name: '全部产品'},...res.Data.ProjectTypes]
        this.typeList = res.Data.ProjectTypes;
        this.selectChange(this.typeList[0].Type);
        this.$nextTick(() => {
          this.$refs.menus.updateActiveName();
        })
        this.isLoad = true;
      }).catch(err => {

      })
    },
  }
}
</script>
