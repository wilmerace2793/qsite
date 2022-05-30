<template>
  <div id="pageActionscomponent" class="row q-col-gutter-y-sm full-width items-center justify-between">
    <!--Title-->
    <div :class="`text-h6  text-blue-grey text-weight-bold text-subtitle1 ellipsis title-content`">
      <q-icon v-if="icon" :name="icon" size="22px" class="q-mr-sm"/>
      <label id="titleCrudTable" v-if="title">{{ title }}</label>
    </div>
    <!--Actions-->
    <div :class="`actions-content row q-gutter-${gutter} items-center justify-end items-start`">
      <!--Search-->
      <q-input v-model="search" bg-color="white" rounded outlined dense clearable
               :placeholder="$tr('isite.cms.label.search')" class="page-input-search"
               v-if="extraActions && extraActions.includes('search')"
               @input="$emit('search', $clone(search))">
        <template v-slot:prepend>
          <q-icon name="search"/>
        </template>
      </q-input>
      <!--Button Actions-->
      <div v-for="(btn, keyAction) in actions" :key="keyAction" v-if="btn.vIf != undefined ? btn.vIf : true">
        <!-- if the button is dropdown -->
        <q-btn-dropdown split v-bind="{...buttonProps}" :dropdown-icon="btn.props.icon"
            v-if="btn.type == 'btn-dropdown'" outline
        >
          <q-list>
            <q-item v-for="(item) in btn.items" clickable v-close-popup @click="btn.action != undefined ? btn.action(item.type) : null">
              <q-item-section avatar>
                <q-avatar :icon="item.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ item.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn v-else v-bind="{...buttonProps, ...btn.props}" @click="btn.action != undefined ? btn.action() : null">
          <q-tooltip v-if="btn.label">{{ btn.label }}</q-tooltip>
        </q-btn>
      </div>


    </div>
    <!--Description-->
    <div v-if="description" class="ellipsis-2-lines col-12 description-content">{{ description }}</div>
    <!--Filter data-->
    <div class="col-12" v-if="filter.hasValues">
      <q-separator class="q-mb-sm"/>
      <div class="text-blue-grey ellipsis text-caption">
        <q-icon name="fas fa-exclamation-circle" class="q-mr-xs" color="amber" size="14px"/>
        <b>{{ $trp('isite.cms.label.filter') }}:</b>
        <label v-for="(item, itemKey) in filter.readValues" :key="itemKey" v-if="item.value"
               class="q-ml-xs text-grey-7">
          {{ item.label }} {{ item.value }},
        </label>
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
  beforeDestroy() {
    this.$root.$off('page.data.filter.read')
  },
  props: {
    title: {type: String},
    description: {type: String},
    icon: {type: String},
    gutter: {type: String, default: 'sm'},
    size: {type: String, default: 'small'},
    extraActions: {type: Array},
    excludeActions: {default: false}
  },
  components: {masterExport},
  watch: {},
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      filter: this.$filter,
      exportParams: false,
      search: null,
      filterReadData: {}
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
        round: false,
        rounded: true,
        dense: true,
        unelevated: true,
        color: "primary",
        class: `btn-${this.size}`,
        outline: true,
        noCaps: true,
      }
    },
    //Page Actions
    actions() {
      //Instance excludeActions prop
      let excludeActions = this.$clone(Array.isArray(this.excludeActions) ? this.excludeActions : [])

      let response = [
        //Export
        {
          label: this.$tr('isite.cms.label.export'),
          vIf: (this.exportParams && !excludeActions.includes('export')),
          props: {
            icon: 'fas fa-file-download'
          },
          action: () => this.$refs.exportComponent.showReport()
        },
        //recommendations
        {
          label: this.$trp('isite.cms.label.recommendation'),
          vIf: (this.params.recommendations && !excludeActions.includes('recommendations')) ? true : false,
          props: {
            icon: 'fas fa-hat-wizard'
          },
          action: () => this.$eventBus.$emit('toggleMasterDrawer', 'recommendation')
        },
        //Filter
        {
          label: this.$tr('isite.cms.label.filter'),
          vIf: (this.filter.load && !excludeActions.includes('filter')),
          props: {
            icon: 'fas fa-filter'
          },
          action: () => this.$eventBus.$emit('toggleMasterDrawer', 'filter')
        },
        //Refresh
        {
          label: this.$trp('isite.cms.label.refresh'),
          vIf: (this.params.refresh && !excludeActions.includes('refresh')),
          props: {
            icon: 'fas fa-redo'
          },
          action: this.emitRefresh
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
              label: this.$tr(`isite.cms.label.new`),
              icon: 'fas fa-plus',
              color: "primary",
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
  methods: {
    init() {
      this.$root.$on('page.data.filter.read', (readValues) => {
        this.$set(this.filter, 'readValues', readValues)
      })
    },
    //Emit refresh
    emitRefresh() {
      this.$emit('refresh')
      this.$root.$emit('page.data.refresh')
      this.$root.$emit('crud.data.refresh')
      this.$root.$emit('export.data.refresh')
    }
  }
}
</script>
<style lang="stylus">
#pageActionscomponent
  #titleCrudTable
  .title-content
    @media screen and (max-width: $breakpoint-md)
      text-align center
      width 100%

  .actions-content
    @media screen and (max-width: $breakpoint-md)
      width 100%

  .description-content
    line-height 1
    color $grey-8
    font-size 14px

  .page-input-search
    @media screen and (max-width: $breakpoint-md)
      width 100%

    .q-field__control, .q-field__control:after, .q-field__control-container, .q-field__append
      min-height 34px
      max-height 34px

  .actions-content
    .q-btn-dropdown
      .q-btn-dropdown--current
        display none
      .q-btn-dropdown__arrow-container
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        &[aria-expanded=true]
          .q-icon
            &::before
              content "\f106"

.q-menu
  .q-list
    .q-item
      padding: 3px 10px 3px 3px;
      .q-item__section--avatar
        min-width: 50px;
        padding-right 10px
        color $primary
        i
          font-size 16px
</style>
