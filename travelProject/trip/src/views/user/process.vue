<template>
  <div class="register">
    <store v-if="seltype == 2"></store>
    <headquarters v-else></headquarters>
  </div>
</template>
<script>
import headquarters from './components/headquarters'
import store from './components/store'
import { postSubmit } from '@/api/user.js'
import { getStoreType } from '@/utils/auth'
export default {
  components: { headquarters, store },
  data() {
    return {
      seltype: ''
    }
  },
  created() {
    // console.log(getStoreType())
    this.seltype = getStoreType();
  }
}
</script>
<style lang="less">
.register {
  width: 100%;
  height: 100%;
}
</style>