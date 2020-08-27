<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
import '../../../static/fonticon/iconfont.js'
import '../../../static/fonticon/iconfont.css'
export default {
  name: 'icon-svg',
  props: ['icon-class'],
  computed: {
    iconName () {
      return `#icon-${this.iconClass}`
    }
  }
}
</script>
