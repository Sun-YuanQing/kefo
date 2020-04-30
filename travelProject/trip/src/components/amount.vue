<template>
  <span v-if="value || value === 0">
    ￥<span class="big-num">{{Math.floor(value)}}</span>.{{value.toFixed(2).substr(-2, 2)}}
  </span>
</template>

<script>
  export default {
    name: 'amount',
    props: {
      value: {
        type: Number
      }
    }
  }
</script>

<style scoped>
.big-num{
    font-size: 22px;
}
</style>
