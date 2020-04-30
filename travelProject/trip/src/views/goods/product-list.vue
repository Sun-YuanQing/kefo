<template>
  <div class="productList">
    <div class="radioWrap">
      <RadioGroup
        v-model="postData.Type"
        type="button"
        @on-change="radioChange"
      >
        <Radio
          :label="type.Type"
          v-for="type in typeList"
          :key="type.Type"
        >{{type.Name}}</Radio>
      </RadioGroup>
    </div>
    <div class="infoWrap">
      <div class="head">
        <div class="searchWrap">
          <div>
            <span>产品名称</span>
            <Search
              v-model="postData.Name"
              placeholder="输入产品名称"
              @on-search="handleSearch"
            ></Search>
          </div>
          <div>
            <span>产品状态</span>
            <Select
              v-model="postData.Status"
              style="width: 120px"
              @on-change="handleSearch"
            >
              <Option value="-1">全部</Option>
              <Option value="0">{{storeType=='1' ? '已下架' : '已下线'}}</Option>
              <Option value="1">{{storeType=='1' ? '已上架' : '已上线'}}</Option>
              <Option value="2">{{storeType=='1' ? '待上架' : '待上线'}}</Option>
            </Select>
          </div>
        </div>
        <div>
          <Button
            v-if="storeType!='2'"
            @click="isAdd=true;"
          >+新增优选商品</Button>
        </div>

      </div>
      <div class="tableWrap">
        <Table
          :columns="columns"
          :data="tableData"
          :loading="loading"
          :row-class-name="rowClassName"
          :max-height="$bus.clientHeight-335"
          stripe
          disabled-hover
        >
          <template
            slot-scope="{ row }"
            slot="Type"
          >
            <div>{{row.Type | productTypes}}</div>
          </template>
          <!-- 0 已经下线 1 已经上线 2待上线 -->
          <!-- <template slot-scope="{ row }" slot="AuditStatus">
                        <div v-if="storeType=='1'">{{row.AuditStatus == 0 ? '已下架' : row.AuditStatus == 1 ? '已上架' : '待上架'}}</div>
                        <div v-else>{{row.AuditStatus == 0 ? '已下线' : row.AuditStatus == 1 ? '已上线' : '待上线'}}</div>
                    </template> -->
          <template
            slot-scope="{ row }"
            slot="Action"
          >
            <Button
              type="text"
              @click="$router.push({path: '/productDetail',query: {type: row.Type,id: row.Id}})"
            >详情</Button>
            <Button
              type="text"
              @click="changeStatus(row.Id,row.Status,row.Name)"
            >
              <span v-if="storeType=='1'">{{row.Status == 1 ? '下架' : '上架' }}</span>
              <span v-else>{{row.Status == 1 ? '下线' : '上线'}}</span>
            </Button>
            <Button
              v-if="storeType!='1'"
              type="text"
              :style="{color: row.Status==1 ? '#3275F5' : '#999'}"
              @click="recommend(row.Id,row.Recommend,row.Name,row.Status)"
            >{{row.Recommend ? '取消推荐' : '首页推荐'}}</Button>
            <Button
              type="text"
              @click="deleteProduct(row.Id,row.Name)"
            >删除</Button>
          </template>
        </Table>
        <Page
          :total="total"
          :current="postData.PageIndex"
          :page-size="postData.PageSize"
          placement="top"
          show-total
          show-sizer
          @on-change="handleChange"
          @on-page-size-change="pageSizeChanged"
        />
      </div>
    </div>

    <Modal
      v-model="isAdd"
      width="590"
      :mask-closable="false"
      class="productListModal"
      @on-cancel="isAdd=false;addType='';"
    >
      <p
        slot="header"
        style="text-align:center;font-size: 18px;"
      >选择添加产品类型</p>
      <ul class="typeList">
        <li
          v-for="(type,index) in typeList.slice(1)"
          :key="index"
          :class="{'active': type.Type==addType}"
          @click="changeAddType(type.Type)"
        >
          {{type.Name}}
        </li>
      </ul>
      <div
        slot="footer"
        class="foot"
      >
        <Button @click="isAdd=false;addType='';">取消</Button>
        <Button
          type="primary"
          @click="sureType"
        >确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import Search from '@/components/search'
import { getProductList, getProjectType, recommendProduct, onlineProductById, deleteTravelProductById } from '@/api/goods.js'
import { getStoreType } from '@/utils/auth.js'
import { allColumns, directColumns, notDirectColumns, otherColumns, hotelColumns, combinedColumns } from './product-columns.js'
export default {
  name: "productList",
  components: { Search },
  data() {
    return {
      storeType: '',
      isAdd: false,
      addType: '',
      postData: {
        Type: '-1',  //1.直营  2.非直营  3.其他 4. 组合 -1全部
        Name: '',
        Status: '-1', //0.下架  1.上架  2.待上架  -1全部
        PageIndex: 1,
        PageSize: 10
      },
      loading: false,
      total: 0,
      tableData: [],
      columns: [],
      typeList: [
        {
          Type: '-1',
          Name: '全部产品'
        },
        // {
        //     Type: '1',
        //     Name: '旅游直营产品'
        // },
        // {
        //     Type: '2',
        //     Name: '旅游非直营产品'
        // },
        // {
        //     Type: '3',
        //     Name: '其他产品'
        // },
        // {
        //     Type: '4',
        //     Name: '组合产品'
        // },
        // {
        //     Type: '5',
        //     Name: '酒店产品'
        // },
      ]
    }
  },
  created() {
    this.storeType = getStoreType();
    this.getProjectTypeList()
    this.update('-1')
    this.getData();
  },
  methods: {
    //获取当前的一级分类
    getProjectTypeList() {
      getProjectType(this.storeType == 2 ? true : false).then(res => {
        this.typeList = [{ Type: '-1', Name: '全部产品' }, ...res.Data.ProjectTypes]

      }).catch(err => {

      })
    },
    sureType() {
      if (!this.addType) {
        this.$Message.warning('请选择产品类型')
      } else {
        this.isAdd = false;
        this.$router.push({ path: '/editProduct', query: { type: this.addType } })
      }

    },
    radioChange(e) {
      this.postData.PageIndex = 1;
      this.update(e);
      this.getData();
    },
    changeAddType(type) {
      this.addType = type;
    },
    update(e) {
      switch (e.toString()) {
        case '-1':
          this.columns = this.storeType == 2 ? allColumns.slice(0, 4).concat(allColumns.slice(5)) : allColumns;
          break;
        case '1':
          this.columns = this.storeType == 2 ? directColumns.slice(0, 3).concat(directColumns.slice(4)) : directColumns;
          break;
        case '2':
          this.columns = this.storeType == 2 ? notDirectColumns.slice(0, 4).concat(notDirectColumns.slice(5)) : notDirectColumns;
          break;
        case '3':
          this.columns = this.storeType == 2 ? otherColumns.slice(0, 4).concat(otherColumns.slice(5)) : otherColumns;
          break;
        case '4':
          this.columns = this.storeType == 2 ? combinedColumns.slice(0, 4).concat(combinedColumns.slice(5)) : combinedColumns;
          break;
        case '5':
          this.columns = hotelColumns;
          break;
        default:
          this.columns = this.storeType == 2 ? allColumns.slice(0, 4).concat(allColumns.slice(5)) : allColumns;
      }
    },

    getData() {
      this.loading = true;
      getProductList(this.postData).then(res => {
        let { TravelProduct, Total } = res.Data;
        if (TravelProduct != null) {
          this.tableData = TravelProduct;
          this.total = Total;
        } else {
          this.tableData = [];
          this.total = 0;
        }
        this.loading = false;
      }).catch(err => {
        this.loading = false;
      })
    },
    //页码切换
    handleChange(e) {
      this.postData.PageIndex = e;
      this.getData();
    },

    //每页条数切换
    pageSizeChanged(pageSize) {
      this.postData = { ...this.postData, PageIndex: 1, PageSize: pageSize };
      this.getData();
    },
    handleSearch() {
      this.postData = { ...this.postData, PageIndex: 1, PageSize: 10 };
      this.getData();
    },

    //推荐
    recommend(id, flag, name, status) {
      if (status != 1) return;
      this.$Modal.confirm({
        title: flag ? '请确认是否取消推荐' : '请确认是否推荐' + '产品：' + name,
        width: 560,
        onOk: () => {
          this.$Spin.show();
          let postData = {
            Type: "1",//1商品  2.秒杀 3.拼团
            Id: id,// 1商品Id  2.秒杀Id 3. 拼团id
            Recommend: flag ? false : true // 推荐 true/取消推荐
          }
          recommendProduct(postData).then(res => {
            this.$Spin.hide();
            this.$Message.success(flag ? '取消推荐成功' : '推荐成功');
            this.getData();
          }).catch(err => {
            this.$Spin.hide();
          })
        }
      })
    },

    //删除
    deleteProduct(id, name) {
      this.$Modal.confirm({
        title: '产品删除后不可恢复，确定要删除产品：' + name + ' 吗？',
        width: 560,
        onOk: () => {
          deleteTravelProductById(id).then(res => {
            this.$Spin.hide();
            this.$Message.success('成功删除产品：' + name);
            this.getData();
          }).catch(err => {
            this.$Spin.hide();
          })
        }
      })
    },

    //上架、下架
    changeStatus(id, status, name) {
      let title = '';
      if (this.storeType == '1') {
        title = status == 1 ? '下架' : '上架';
      } else {
        title = status == 1 ? '下线' : '上线';
      }
      this.$Modal.confirm({
        title: '确定' + title + '产品：' + name + ' 吗？',
        width: 500,
        onOk: () => {
          this.$Spin.show();
          let postData = {
            ID: id,
            Status: status == 1 ? 0 : 1
          }
          onlineProductById(postData).then(res => {
            this.$Spin.hide();
            this.$Message.success(title + '成功');
            this.getData();
          }).catch(err => {
            this.$Spin.hide();
          })
        }
      })
    },

    rowClassName(row, index) {
      if (row.Status == '0') {
        return 'activityEnd';
      } else {
        return '';
      }
    },

  }
}
</script>
<style lang="less">
.productList {
  .ivu-table-wrapper {
    .ivu-table td.nameColumn > div {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .ivu-table .activityEnd td {
      color: #999;
    }
  }
}
</style>
<style lang="less" scoped>
.productList {
  height: 100%;
  .radioWrap {
    padding: 20px 40px;
    border-bottom: 10px solid #f7f8fa;
  }
  .infoWrap {
    box-sizing: border-box;
    padding: 20px 15px 0;
    height: calc(100% - 82px);
    overflow: auto;
    .head {
      padding-left: 20px;
      padding-right: 3px;
      display: flex;
      justify-content: space-between;
      .searchWrap {
        display: flex;
        > div {
          display: flex;
          align-items: center;
          > span {
            padding-right: 10px;
          }
          &:first-of-type {
            margin-right: 20px;
          }
        }
      }
      .ivu-btn {
        width: 130px;
        height: 36px;
        line-height: 36px;
      }
    }
    .ivu-table-wrapper {
      .ivu-btn {
        color: #3275f5;
      }
    }
  }
}
.productListModal {
  .typeList {
    display: flex;
    flex-wrap: wrap;
    li {
      width: 128px;
      height: 40px;
      line-height: 40px;
      background-color: #f7f8fa;
      border-radius: 4px;
      margin-bottom: 10px;
      margin-right: 15px;
      text-align: center;
      padding: 0 10px;
      box-sizing: border-box;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      &:last-of-type {
        margin-right: 0;
      }
      &.active {
        background-color: #333;
        color: #fff;
      }
    }
  }
  .foot {
    text-align: center;
    .ivu-btn {
      width: 120px;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      &:first-of-type {
        margin-right: 20px;
      }
    }
  }
}
</style>