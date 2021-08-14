<template>
  <q-dialog v-model="show" class="master-dialog" no-esc-dismiss no-backdrop-dismiss v-on="$listeners">
    <!--Content-->
    <div :id="id || 'masterModalContent'" class="master-dialog__content round relative-position"
         :style="`min-width: ${width}`" v-if="show">
      <!--Header-->
      <div :class="`master-dialog__header text-${color} row justify-between items-center box box-auto-height`">
        <!--Title-->
        <div class="master-dialog__header-title row items-center">
          <q-icon v-if="icon" :name="icon" class="q-mr-sm" size="20px"/>
          <b>{{ title }}</b>
        </div>
        <!--Close Button-->
        <q-btn v-close-popup icon="fas fa-times" round color="blue-grey" unelevated class="btn-small" outline
               v-if="!hideCloseAction"/>
      </div>
      <!--Slot content-->
      <div class="master-dialog__body">
        <slot/>
      </div>
      <!--Actions Content-->
      <div class="master-dialog__actions box box-auto-height" v-if="actions && actions.length">
        <div class="row justify-end q-gutter-sm">
          <q-btn v-for="(btn, keyBtn) in actions" :key="keyBtn" v-bind="{...actionBtnProps, ...(btn.props || {})}"
                 @click="btn.action ? btn.action() : null"/>
        </div>
      </div>
      <!--Loading-->
      <inner-loading :visible="loading"/>
    </div>
  </q-dialog>
</template>
<script>
export default {
  props: {
    value: {type: Boolean, default: false},
    loading: {type: Boolean, default: false},
    color: {type: String, default: 'blue-grey'},
    width: {type: String, default: '400px'},
    title: {type: String},
    icon: {type: String},
    actions: {type: Array},
    id: {type: String},
    hideCloseAction: {type: Boolean, default: false}
  },
  components: {},
  watch: {
    value(newValue, oldValue) {
      if (newValue != oldValue) {
        this.show = this.$clone(newValue)
      }
    },
    show(newValue, oldValue) {
      if (newValue != oldValue) {
        this.$emit('input', this.$clone(newValue))
      }
    }
  },
  mounted() {
    this.$nextTick(function () {
    })
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    actionBtnProps() {
      return {
        rounded: true,
        unelevated: true,
        noCaps: true,
        class: 'btn-small'
      }
    }
  },
  methods: {}
}
</script>
<style lang="stylus">
.master-dialog__content
  background-color $custom-accent-color

  .master-dialog__header
    margin 16px 16px 0 16px

  .master-dialog__body
    margin 16px
    max-height calc(100vh - 240px)
    overflow-y scroll

    @media screen and (min-width: $breakpoint-md)
      margin 16px 0 16px 16px

  .master-dialog__actions
    margin 0 16px 16px 16px

    .q-btn
      .q-icon
        font-size 20px
</style>
