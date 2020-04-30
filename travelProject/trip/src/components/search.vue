<template>
  <div class="search">
    <Input :placeholder="placeholder" class="input" v-model="search" @on-enter="handleSearch" />
    <Button @click="handleSearch" class="search-button">查询</Button>
  </div>
</template>

<script>
  export default {
    name: 'search',
    props: {
      value: {},
      placeholder: ''
    },
    computed: {
      search: {
        get() {
          return this.value;
        },
        set(val) {
          this.$emit('input', val)
        }
      }
    },
    methods: {
      handleSearch() {
        // if (!this.search.trim()) return false;
        this.$emit('on-search', this.search)
      }
    },
  }
</script>

<style lang="less">
  .search {
    .ivu-input-wrapper {
      height: 100%;
    }

    .ivu-input {
      border: 0;
    }
  }
</style>

<style scoped lang="less">
  .search {
    border: 1px solid #e4e4e4;
    display: flex;
    border-radius: 4px;
    overflow: hidden;
    height: 40px;
    width: 314px;

    &:focus, &:hover {
      border-color: #333;
    }
    .input {
      font-size: 14px;
      background-color: #fff;
      flex: 1;
      border: 0;
    }
    .search-button {
      border: 0;
      border-radius: 0;
      width: 66px;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      background-color: #f9f9f9;
    }
  }
</style>
