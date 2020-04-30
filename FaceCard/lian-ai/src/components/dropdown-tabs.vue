<template>
  <ul class="tabs">
    <li v-for="(item, index) in items" :key="index" class="tab-item" 
        :class="{ 'tab-actived': activeTab === item.id }">
          <Dropdown v-if="Array.isArray(item.label)" @on-click="changeItem($event,item.label)">
              <div>{{dropdownItem || item.label[0].label}}
                <Icon type="ios-arrow-down"></Icon> 
              </div>
              <DropdownMenu slot="list">
                 <DropdownItem v-for="(list, indx) in item.label" 
                             :key="indx" :name="list.label">{{list.label}}</DropdownItem>
              </DropdownMenu>
          </Dropdown>
          <span v-else @click="changeTab(item.id)">{{item.label}}</span>
    </li>
  </ul>
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
        dropdownItem : '',
      }
    },
    methods: {
      changeTab(index) {
        this.activeTab = index;
        this.$emit('on-change', index)
      },
      changeItem(e,item){
        this.dropdownItem = e;
        let index = item.findIndex(n => n.label == e);
        this.activeTab = 0;
        this.$emit('on-change', item[index].id)
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
