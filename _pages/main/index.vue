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
      this.$crud.show('apiRoutes.qgamification.categories', 'home_tour', {refresh : true, params : {include: 'activities', filter : {"markAsCompleted": true, "field" : 'system_name'}}}).then(response => {
        if (!response.data.userCompleted) {
          const steps = response.data.activities.map(step => {
            return {
              icon: step.options.icon,
              title: step.title,
              content: step.description,
              element: step.options.tourElement,
              position: step.options.tourElementPosition
            }
          })
          if (steps.length > 0) this.$tour.showTutorialBySteps(steps);
        }
      })
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
