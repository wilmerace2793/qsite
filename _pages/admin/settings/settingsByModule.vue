<template>
  <div id="pageId">
    Perzonalization page...
  </div>
</template>
<script>
export default {
  props: {},
  components: {},
  watch: {},
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      loading: false,
      data: []
    }
  },
  computed: {},
  methods: {
    init() {
    }
  }
}
</script>
<style lang="stylus">
</style>
