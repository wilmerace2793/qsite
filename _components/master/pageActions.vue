<template>
  <div id="pageActionscomponent" class="row q-col-gutter-y-sm full-width items-center justify-between">
    <!--Title-->
    <div class="text-h6 text-blue-grey text-weight-bold text-subtitle1 ellipsis">
      <q-icon v-if="icon" :name="icon" size="22px" class="q-mr-sm"/>
      <label v-if="title">{{ title }}</label>
    </div>
    <!--Actions-->
    <div :class="`row q-gutter-${gutter} items-center`">
      <!--Search-->
      <q-input v-model="search" bg-color="white" debounce="800" outlined dense clearable
               :placeholder="$tr('ui.label.search')" class="page-input-search"
               v-if="extraActions && extraActions.includes('search')"
               @input="$emit('search', $clone(search))">
        <template v-slot:append>
          <q-icon name="search"/>
        </template>
      </q-input>
      <!--Button Actions-->
      <div v-for="(btn, keyAction) in actions" :key="keyAction" v-if="btn.vIf != undefined ? btn.vIf : true">
        <q-btn v-bind="{...buttonProps, ...btn.props}" @click="btn.action != undefined ? btn.action() : null">
          <q-tooltip v-if="btn.label">{{ btn.label }}</q-tooltip>
        </q-btn>
      </div>
    </div>
    <!-- Export Component -->
    <master-export v-model="exportParams" ref="exportComponent"/>
  </div>
</template>
<script>
//Components
import masterExport from "@imagina/qsite/_components/master/masterExport"

export default {
  props: {
    title: {type: String},
    icon: {type: String},
    gutter: {type: String, default: 'sm'},
    size: {type: String, default: 'small'},
    extraActions: {type: Array}
  },
  components: {masterExport},
  watch: {},
  mounted() {
    this.$nextTick(function () {
    })
  },
  data() {
    return {
      filter: this.$filter,
      exportParams: false,
      search: null
    }
  },
  computed: {
    //Return params of subHeader
    params() {
      return this.$clone(this.$route.meta.subHeader || {})
    },
    //Button default props
    buttonProps() {
      return {
        round: true,
        dense: true,
        unelevated: true,
        color: "blue-grey",
        class: `btn-${this.size}`,
        outline: true,
        noCaps : true
      }
    },
    //Page Actions
    actions() {
      let response = [
        //Export
        {
          label: this.$tr('ui.label.export'),
          vIf: this.exportParams,
          props: {
            icon: 'fas fa-file-download'
          },
          action: () => this.$refs.exportComponent.showReport()
        },
        //recommendations
        {
          label: this.$trp('ui.label.recommendation'),
          vIf: this.params.recommendations ? true : false,
          props: {
            icon: 'fas fa-hat-wizard'
          },
          action: () => this.$eventBus.$emit('toggleMasterDrawer', 'recommendation')
        },
        //Filter
        {
          label: this.$tr('ui.label.filter'),
          vIf: this.filter.load,
          props: {
            icon: 'fas fa-filter'
          },
          action: () => this.$eventBus.$emit('toggleMasterDrawer', 'filter')
        },
        //Refresh
        {
          label: this.$trp('ui.label.refresh'),
          vIf: this.params.refresh,
          props: {
            icon: 'fas fa-redo'
          },
          action: () => {
            this.$root.$emit('page.data.refresh')
            this.$root.$emit('crud.data.refresh')
            this.$root.$emit('export.data.refresh')
          }
        }
      ]

      //Validate extra actions
      if (this.extraActions) {
        //Prepend actions
        response = [...this.extraActions.filter(action => typeof action != 'string'), ...response]
        //New button action
        if (this.extraActions.includes('new'))
          response.unshift({
            vIf: this.params.create && this.params.hasPermission.create,
            props: {
              label: this.$tr(`ui.label.new`),
              icon: 'fas fa-plus-circle',
              color: 'green',
              round: false,
              rounded: true,
              padding: '3px 15px'
            },
            action: () => this.$emit('new')
          })
      }

      //Response
      return response
    },
  },
  methods: {}
}
</script>
<style lang="stylus">
#pageActionscomponent
  .page-input-search
    .q-field__control, .q-field__control:after, .q-field__control-container, .q-field__append
      min-height 34px
      max-height 34px
</style>
