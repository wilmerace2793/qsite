<template>
  <div id="mainPage">
    <!--index admin-->
    <index-admin v-if="appMode == 'iadmin'"/>
    <!--index panel-->
    <index-panel v-else/>
  </div>
</template>
<script>
//components
import indexAdmin from '@imagina/qsite/_pages/admin/index'
import indexPanel from '@imagina/qsite/_pages/panel/index'

export default {
  props: {},
  components: {indexAdmin, indexPanel},
  watch: {},
  mounted() {
    this.$nextTick(function () {
    })
  },
  data() {
    return {
      appMode: config('app.mode')
    }
  },
  computed: {},
  methods: {}
}
</script>
<style lang="stylus">
</style>
