<template>
  <div class="fullscreen-route-header">
    <Icon type="ios-arrow-back" size="30" style="cursor: pointer" @click.native="$router.back()" />
    <span class="title">{{title}}</span>
    <div class="right">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'route-header',
    props: {
      title: {}
    },
  }
</script>

<style lang="less">
  .fullscreen-route-header {
    width: 100%;
    display: flex;
    align-items: center;
    height: 44px;
    padding: 0 10px;
    position: relative;
    justify-content: space-between;
    background-color: #fff;
    z-index: 999999;

    .title {
      position: absolute;
      left: 50%;
      top: 50%;
      white-space: nowrap;
      font-size: 19px;
      font-weight: bold;
      transform: translateX(-50%) translateY(-50%);
    }
  }
</style>
