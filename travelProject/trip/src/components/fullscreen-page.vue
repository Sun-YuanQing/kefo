<template>
  <div class="fullscreen">
    <Header :title="title" @change-router="changeRouter">
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
    },
    methods: {
      changeRouter(){
        this.$emit('change-router', this.search);
      }
    }
  }
</script>

<style lang="less" scoped>
  .fullscreen{
    height: 100%;
    background-color: #F7F8FA;
    .content {
      margin: 10px;
      background-color: #fff;
      box-sizing: border-box;
      border-radius: 4px;
      padding: 20px 28px;
      width: calc(100% - 20px);
      height: calc(100% - 54px);
      overflow-y: auto;
    }
  }
  
</style>
