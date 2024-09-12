<template>
  <!--pagination-->
  <div>    
  </div>
 
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import controller from 'modules/qsite/_components/master/masterPagination/controller'

export default defineComponent({
  props: {
    pagination: {
      type: Object,
      default: () => ({})
    }
  },
  components: {},
  setup(props, {emit}) {
    return controller(props, emit)
  },
  computed: {
    windowSize() {
      return window.innerWidth >= 500 ? 'desktop' : 'mobile'
    },
  }, 
  methods: {
    showPagination(props) { 
      return this.windowSize == 'desktop' && props.pagesNumber > 1
    }
  },
})
</script>
<style lang="scss">
</style>
