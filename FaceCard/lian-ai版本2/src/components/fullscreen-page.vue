<template>
  <div class="fullscreen">
    <Header :title="title">
      <slot name="extra"></slot>
    </Header>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import Header from './route-header'
  export default {
    name: 'fullscreen-page',
    components: {Header},
    props: {
      title: {
        type: String,
        required: true
      }
    }
  }
</script>

<style lang="less" scoped>
  .content {
    background-color: #f7f8fa;
    padding: 20px 28px;
    width: 100%;
    height: calc(100% - 44px);
  }
</style>
