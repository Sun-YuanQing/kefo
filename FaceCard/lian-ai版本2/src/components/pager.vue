<template>
  <Page
    :total="+total"
    :current.sync="page"
    :page-size="pageSize"
    placement="top"
    show-total
    show-sizer
    v-if="total>pageSize"
    @on-change="handleChange"
    @on-page-size-change="pageSizeChanged"
  />
</template>

<script>
import { mapGetters } from 'vuex';
import * as Types from 'src/store/mutationTypes';
export default {
  name: 'pager',
  props: {
    total: {
      type: [String, Number],
      required: true,
      default: 0
    },
    history: {
      type: Boolean,
      default: false
    },
    name: {
      type: String
    },
    postData: {
      type: Object,
      default: () => {
        return {
          PageIndex: 1,
          PageSize: 10
        };
      }
    }
  },
  data() {
    return {
      pageSize: 10,
      id: '',
      stack: null
    };
  },
  created() {
    if (this.history) {
      this.id = this.name ? this.$route.name + this.name : this.$route.name;
      const history = this.pagerStack && this.pagerStack.find(item => item.id == this.id);
      if (history) {
        const { postData } = history;
        this.pageSize = postData.PageSize;
        this._postData = postData;
      } else {
        this.handleChange(1);
      }
    }
  },
  beforeDestroy() {
    if (this.history) {
      this.$store.commit(Types.SET_PAGER_STACK, {
        id: this.id,
        postData: this._postData
      });
    }
  },
  computed: {
    ...mapGetters(['pagerStack']),
    page: {
      get() {
        return this._postData.PageIndex;
      },
      set() { }
    },
    _postData: {
      get() {
        return this.postData;
      },
      set(val) {
        this.$emit('on-change', val);
      }
    }
  },
  methods: {
    handleChange(e) {
      this._postData = { ...this._postData, ...{ PageIndex: e, PageSize: this.pageSize } };
    },
    pageSizeChanged(pageSize) {
      this.pageSize = pageSize;
      this.handleChange(1);
    }
  }
};
</script>

<style >
.ivu-page-options .ivu-select-single .ivu-select-selection {
  width: 100px;
}
@media screen and (max-width: 576px) {
  .ivu-page-total {
    font-size: 12px;
    margin-right: 5px;
  }
  .ivu-page-prev,
  .ivu-page-next,
  .ivu-page-item-jump-prev,
  .ivu-page-item-jump-next,
  .ivu-page-item {
    min-width: 25px;
    height: 25px;
    line-height: 25px;
  }
  .ivu-page-options {
    margin-left: 5px;
  }
  .ivu-page-options .ivu-select-single .ivu-select-selection {
    width: 88px;
    height: 25px;
    line-height: 25px;
  }
  .ivu-select-single .ivu-select-selection .ivu-select-placeholder,
  .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
    height: 25px;
    line-height: 25px;
  }
}
</style>
