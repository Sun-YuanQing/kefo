<template>
  <svg :class="svgClass" :style="{ width: iconSize, height: iconSize }" aria-hidden="true">
    <use :xlink:href="iconName"/>
  </svg>
</template>

<script>
  export default {
    name: 'SvgIcon',
    props: {
      name: {
        type: String,
        required: true
      },
      size: {
        type: [Number, String],
        default: '1em'
      },
      className: {
        type: String,
        default: ''
      }
    },
    computed: {
      iconSize() {
        return typeof this.size === 'number' ? `${this.size}px` : this.size
      },
      iconName() {
        return `#icon-${this.name}`
      },
      svgClass() {
        if (this.className) {
          return 'svg-icon ' + this.className
        } else {
          return 'svg-icon'
        }
      }
    }
  }
</script>

<style scoped>
  .svg-icon {
    margin-right: .2em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
