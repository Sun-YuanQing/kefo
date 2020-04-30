<template>
  <div class="mainWrap stores">
    <div class="headMemu">
      <div class="breadcrumb">
        <span>门店管理</span>
        <span>/{{activeName}}</span>
      </div>
      <Menu
        mode="horizontal"
        theme="light"
        :active-name="postData.State"
        @on-select="selectChange"
      >
        <MenuItem :name="1">已审核</MenuItem>
        <MenuItem :name="0">
          待审核
          <Badge v-if="unTotal>0" :count="unTotal">
              <a href="#" class="demo-badge"></a>
          </Badge>
        </MenuItem>
        <MenuItem :name="-1">未通过</MenuItem>
        <MenuItem :name="-2">已注销</MenuItem>
      </Menu>
    </div>

    <div class="contentWrap">
      <div class="content">
        <div class="search_box">
          <div class="left_search">
            <div class="label_title">查找门店</div>
            <Input
              search
              enter-button="查询"
              placeholder="输入门店名称或负责人名称"
              v-model="postData.Key"
              @on-search="toSearch"
            />
          </div>
          <div class="right_text">
            <span>共：<span class="right_big">{{totalNum}}</span>家门店</span>
          </div>
        </div>
        <Table
          stripe  
          disabled-hover 
          :max-height="$bus.clientHeight-300"
          :loading="loading"
          :columns="columns"
          :data="detailList"
        ></Table>
        <Page
            :total="totalNum"
            :current="postData.PageIndex"
            :page-size="postData.PageSize"
            placement="top"
            show-total
            show-sizer
            @on-change="handleChange"
            @on-page-size-change="pageSizeChanged"/>
      </div>
    </div>
  </div>
</template>
<script>
import { storeList } from '@/api/store.js'
export default {
  name: 'stores',
  data() {
    return {
      activeName: '已审核',
      columns:[],
      columnList: [
        {
          title: '编号',
          align: 'center',
          key: 'Code',
          minWidth: 100,
        },
        {
          title: '门店名称',
          align: 'center',
          key: 'SiteName',
          minWidth: 120,
          render: (h, params) => {
              return h('div', params.row.Province + params.row.City + params.row.Area + '-' +params.row.SiteName );
          },
          className: 'nameColumn',
        },
        {
          title: '负责人',
          align: 'center',
          key: 'Contact',
          minWidth: 100,
        },
        {
          title: '订单数（份）',
          align: 'center',
          key: 'OrderNum',
          minWidth: 120,
        },
        {
          title: '营业额（元）',
          align: 'center',
          key: 'Amount',
          minWidth: 120,
        },
        {
          title: '联系电话',
          align: 'center',
          key: 'Tel',
          minWidth: 165,
        },
        {
          title: '身份证号码',
          align: 'center',
          key: 'IdCard',
          minWidth: 150,
          render: (h, params) => {
            return h("div",  params.row.IdCard.substring(0,4)+'*'.repeat(11)+params.row.IdCard.substring(15))
          }
        },
        {
          title: '状态',
          align: 'center',
          minWidth: 100,
          render: (h, params) => {
            return h("div",  this.activeName)
          }
        },
        {
          title: '操作',
          align: 'center',
          minWidth: 80,
          render: (h, params) => {
            let doName = this.postData.State == 0 ? '去审核' : '详情';
            return h("div", {
              style: {
                color: '#3275F5',
                cursor: 'pointer'
              },
              on: {
                click: () => {
                  if (this.postData.State == 0) {
                    // console.log(params)
                    this.$router.push({ path: '/check', query: { id: params.row.SiteId } })
                  } else if (this.postData.State == 1) {
                    this.$router.push({ path: '/examine', query: { id: params.row.SiteId } })
                  } else {
                    this.$router.push({ path: '/storeDetail', query: { id: params.row.SiteId } })
                  }
                }
              }
            }, doName)
          }
        },
      ],
      loading: false,
      detailList: [],
      postData: {
        Key: '',
        State: 1,
        PageIndex: 1,
        PageSize: 10
      },
      totalNum: 0,
      unTotal: 0,
    }
  },
  created() {
    this.selectChange(1);
  },
  methods: {
    loadData() {
      this.loading = true;
      storeList(this.postData).then(res => {
        // console.log(res)
        this.loading = false;
        this.detailList = res.Data.Sites;
        this.totalNum = res.Data.Total;
        this.unTotal = res.Data.UnTotal;
      }).catch(err => {
        this.loading = false;
      })
    },
    //页码切换
    handleChange(e){
        this.postData.PageIndex = e;
        this.loadData();
    },

    //每页条数切换
    pageSizeChanged(pageSize){
        this.postData = { ...this.postData,PageIndex: 1,PageSize: pageSize};
        this.loadData();
    },

    //搜索
    toSearch() {
      this.postData = { ...this.postData,PageIndex: 1,PageSize: 10};
      this.loadData();
    },
    
    update(e) {
      switch (e) {
        case 1:
          this.activeName = '已审核'
          break;
        case 0:
          this.activeName = '待审核'
          break;
        case -1:
          this.activeName = '未通过'
          break;
        case -2:
          this.activeName = '已注销'
          break;
        default:
          this.activeName = '已审核'
      }
    },
    selectChange(e) {
      if(e==1 || e==-2){
        this.columns = this.columnList.slice(0,6).concat(this.columnList.slice(8));
      }else{
        this.columns = this.columnList.slice(1,3).concat(this.columnList.slice(5));
      }
      this.postData.State = e;
      this.update(e);
      this.loadData();
    },
    
  }
}
</script>
<style lang="less">
  .stores {
    .ivu-table-wrapper{
        .ivu-table td.nameColumn  div{
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .ivu-badge {
        top: -10px;
        right: -6px;
        .ivu-badge-count{
          height: 16px;
          line-height: 14px;
          min-width: 16px;
          font-size: 12px;
          padding: 0 2px;
        }
    }
  }
  
</style>
<style lang="less" scoped>
.stores .content {
  padding: 20px 15px;
  .search_box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    padding: 25px 30px;
    .left_search {
      display: flex;
      align-items: center;
      .label_title {
        white-space: nowrap;
        margin-right: 10px;
        font-size: 16px;
        color: #333;
      }
      .ivu-input-group {
        width: 314px;
      }
    }
    .right_text {
      color: #333;
      font-size: 16px;
      font-weight: 600;
      .right_big {
        font-size: 24px;
      }
    }
  }
}
</style>