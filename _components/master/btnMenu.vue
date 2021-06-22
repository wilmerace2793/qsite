<template>
  <q-btn class="btn-menu-component" color="grey-1" text-color="blue-grey" icon="fas fa-ellipsis-v" round
         unelevated size="sm" style="font-size: 8px; padding: 6px" v-if="actions && actions.length">
    <q-menu max-width="200px" content-class="btn-menu-component__menu" anchor="bottom right" self="top right">
      <q-list dense separator>
        <q-item v-for="(action, keyAction) in actions" :key="keyAction"
                clickable v-close-popup v-if="action.vIf != undefined ? action.vIf : true"
                @click.native="runAction(action)">
          <q-item-section>
            <div class="row items-center text-blue-grey">
              <q-icon :name="action.icon" color="blue-grey" size="16px"/>
              {{ action.label || action.tooltip }}
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>
<script>
export default {
  props: {
    actions: {default: false},
    actionData: {default: false}
  },
  components: {},
  watch: {},
  mounted() {
    this.$nextTick(function () {
    })
  },
  data() {
    return {}
  },
  computed: {},
  methods: {
    //Call custom action
    async runAction(action) {
      //Define action params
      let actionData = this.$clone(this.actionData || {})
      //Check if has action function
      if (action.action) await action.action(actionData)
      //Check if has redirect to route
      if (action.route) this.$router.push({name: action.route, params: actionData})
    },
  }
}
</script>
<style lang="stylus">
.btn-menu-component__menu
  padding 8px
  min-width auto
  border-radius 5px

  .q-list
    min-width 150px

  .q-item
    padding 8px

    .q-icon
      margin-right 10px
</style>
