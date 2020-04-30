<template>
  <div class="check-pending">
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
        </div>
      </div>
      <div class="tableWrap">
        <Table
          :columns="columns"
          :data="tableData"
          :loading="loading"
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
          <template
            slot-scope="{ }"
            slot="AuditStatus"
          >
            <div>待审核</div>
          </template>
          <template
            slot-scope="{ row }"
            slot="Action"
          >
            <Button
              type="text"
              @click="$router.push({path: '/editProduct',
                                query: {type: row.Type,id: row.Id,classes: 2}})"
            >去审核</Button>
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

  </div>
</template>
<script>
import Search from '@/components/search'
import { getAuditProducts, recommendProduct, getProjectType } from '@/api/goods.js'
import { allColumns, notDirectColumns, otherColumns } from './product-check-columns.js'
export default {
  name: "check-pending",
  components: { Search },
  data() {
    return {
      postData: {
        Type: '-1',  //1.直营  2.非直营  3.其他 4. 组合 -1全部
        Name: '',
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
        }
      ]
    }
  },
  created() {
    this.getProjectTypeList();
    this.update('-1')
    this.getData();
  },
  methods: {
    //获取当前的一级分类
    getProjectTypeList() {
      getProjectType(false, true).then(res => {
        this.typeList = [{ Type: '-1', Name: '全部产品' }, ...res.Data.ProjectTypes]
      }).catch(err => {

      })
    },
    radioChange(e) {
      this.postData.PageIndex = 1;
      this.update(e);
      this.getData();
    },
    update(e) {
      switch (e.toString()) {
        case '-1':
          this.columns = allColumns;
          break;
        case '2':
          this.columns = notDirectColumns;
          break;
        case '3':
          this.columns = otherColumns;
          break;
        default:
          this.columns = allColumns;
      }
    },

    getData() {
      this.loading = true;
      getAuditProducts(this.postData).then(res => {
        this.loading = false;
        this.tableData = res.Data.TravelProduct;
        this.total = res.Data.Total;
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
    }

  }
}
</script>
<style lang="less">
.check-pending {
  .ivu-table-wrapper {
    .ivu-table td.nameColumn > div {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
<style lang="less" scoped>
.check-pending {
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
        width: 90px;
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
</style>