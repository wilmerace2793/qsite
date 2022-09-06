<template>
  <div class="row items-center">
    <q-btn flat round color="tw-gray-300" size="sm" icon="more_vert">
      <q-menu transition-show="jump-down" transition-hide="jump-up">
        <q-list class="list-report-menu">
          <q-item
            clickable
            v-ripple
            v-for="(action, keyAction) in actionsData"
            :key="keyAction"
            v-bind="action.props"
            v-close-popup
            v-if="action.vIf != undefined ? action.vIf : true"
            @click.native="runAction(action)"
          >
            <q-item-section avatar>
              <q-icon :name="action.icon" color="primary" />
            </q-item-section>

            <q-item-section>{{
              action.label || action.tooltip
            }}</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>
<script>
export default {
  props: {
    actions: { default: false },
    actionData: { default: false },
  },
  components: {},
  watch: {},
  mounted() {
    this.$nextTick(function () {});
  },
  data() {
    return {};
  },
  computed: {
    actionsData() {
      return this.actions.map((item) => {
        //Instance item props
        item.props = { tag: "a", key: this.$uid(), clickable: true };

        //Define external redirect
        if (item.toRoute) item.props.href = item.toRoute;

        //Instance vue route redirect
        if (item.route)
          item.props.to = {
            name: item.route,
            params: this.$clone(this.actionData || {}),
          };

        // Formatting all instances
        if (item.format)
          item = { ...item, ...(item.format(this.actionData) || {}) };

        //Return item
        return item;
      });
    },
  },
  methods: {
    //Call custom action
    async runAction(action) {
      //Define action params
      let actionData = this.$clone(this.actionData || {});
      //Check if has action function
      if (action.action) await action.action(actionData);
    },
  },
};
</script>
<style>
.list-report-menu > .q-item {
  @apply tw-px-4 tw-border-b !important;
}
.list-report-menu > .q-item .q-item__section--avatar {
  @apply tw-pr-0 !important;
  min-width: 30px !important;
}
.list-report-menu > .q-item .q-icon {
  color: var(--q-color-primary);
}
</style>
