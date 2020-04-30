<template>
  <div class="my-radio" :class="{ active: value === label }" @click="handleClick">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'myRadio',
    props: {
      value: {},
      label: {},
    },
    methods: {
      handleClick() {
        this.$emit('input', this.label)
      }
    },
  }
</script>

<style scoped lang="less">
  .my-radio {
    width: 40px;
    height: 40px;
    background-color: #fff;
    color: #333;
    border: 1px solid #333;
    border-radius: 4px;
    font-size: 18px;
    line-height: 40px;
    text-align: center;
    display: inline-block;
    cursor: pointer;
  }

  .active {
    color: #fff;
    background-color: #333;
  }
</style>
