<template>
  <div class="tabs">
    <div v-for="(item, index) in items" :key="index" class="tab-item" :class="{ 'tab-actived': activeTab === index }"
         @click="changeTab(index)">
         {{item}}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'tabs',
    props: {
      items: {
        type: Array,
        default: () => ([])
      }
    },
    data() {
      return {
        activeTab: 0,
      }
    },
    methods: {
      changeTab(index) {
        this.activeTab = index;
        this.$emit('on-change', index)
      }
    }
  }
</script>

<style scoped lang="less">
  .tabs {
    display: flex;
    font-size: 18px;
    color: #999;
    padding-bottom: 4px;

    .tab-item {
      margin-right: 66px;
      cursor: pointer;
      user-select: none;
    }

    .tab-actived {
      color: #000;
      font-weight: 600;
      &::after {
        content: '';
        width: 100%;
        height: 4px;
        border-radius: 2px;
        background-color: #000;
        display: block;
        margin-top: 3px;
      }
    }
  }
  @media screen and (max-width:768px){
    .tabs .tab-item{
        margin-right: 30px;
      }
  }
</style>
