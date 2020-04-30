<template>
  <Modal v-model="showModal" fullscreen footer-hide :closable="false" :transition-names="['modal', 'fade']">
    <div slot="header" class="fullscreen-modal-header">
      <Icon type="ios-arrow-back" size="30" style="cursor: pointer" @click.native="handleBack" />
      <span class="title">{{title}}</span>
    </div>
    <slot></slot>
  </Modal>
</template>

<script>
  export default {
    name: 'fullscreen',
    props: {
      value: {
        type: Boolean,
        default: false
      },
      title: {}
    },
    data() {
      return {

      }
    },
    computed: {
      showModal: {
        get() {
          return this.value;
        },
        set(val) {
          this.$emit('input', val)
        }
      }
    },
    methods: {
      handleBack() {
        this.showModal = false;
        this.$emit('input', false);
        this.$router.back()
      }
    },
  }
</script>

<style lang="less">
  .fullscreen-modal-header {
    display: flex;
    align-items: center;

    .title {
      font-size: 20px;
      font-weight: bold;
      margin: 0 auto;
      transform: translateX(-50%);
    }
  }
</style>
