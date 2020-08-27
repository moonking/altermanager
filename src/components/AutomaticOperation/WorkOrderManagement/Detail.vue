<template>
  <div class="detail">
    <LogDetail :detailId="currentId" :source="type"/>
  </div>
</template>
<script>
import LogDetail from './LogDetail'
export default {
  name: 'detail',
  data () {
    return {
      currentId: this.$route.query.logId,
      type: (this.$route.query.type).toString()
    }
  },
  components: {
    LogDetail
  }
}
</script>
<style scoped>

</style>
