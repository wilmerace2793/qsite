<template>
  <div id="testPageId">
    tes page...
    <q-charts />
  </div>
</template>
<script>

export default {
  props: {},
  components: { QCharts },
  watch: {},
  mounted() {
    this.$nextTick(function () {
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
    },
  }
}
</script>
<style lang="stylus">
</style>
