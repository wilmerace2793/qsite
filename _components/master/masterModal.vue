<template>
  <q-dialog v-model="show" class="master-dialog" no-esc-dismiss no-backdrop-dismiss v-on="$listeners">
    <!--Content-->
    <div :id="id || 'masterModalContent'" class="master-dialog__content box box-auto-height"
         :style="`min-width: ${width}`" v-if="show">
      <!--Header-->
      <div :class="`master-dialog__header text-${color} row justify-between items-end`">
        <!--Title-->
        <div class="master-dialog__header-title text-subtitle1"><b>{{ title }}</b></div>
        <!--Close Button-->
        <q-btn v-close-popup icon="fas fa-times" round color="red" text-color="white" unelevated size="10px"/>
      </div>
      <!--Separator-->
      <q-separator class="q-my-md"/>
      <!--Slot content-->
      <div class="master-dialog__body q-mb-md">
        <slot/>
      </div>
      <!--Actions Content-->
      <div class="master-dialog__actions" v-if="actions && actions.length">
        <!--Separator-->
        <q-separator class="q-mb-md"/>
        <!--Button Actions-->
        <div class="row justify-end q-gutter-sm">
          <q-btn v-for="(btn, keyBtn) in actions" :key="keyBtn" :label="btn.label" :icon="btn.icon"
                 :color="btn.color" @click="btn.action ? btn.action() : null" rounded unelevated no-caps/>
        </div>
      </div>
    </div>
  </q-dialog>
</template>
<script>
export default {
  props: {
    value: {type: Boolean, default: false},
    color: {type: String, default: 'blue-grey'},
    width: {type: String, default: '400px'},
    title: {type: String},
    actions: {type: Array},
    id: {type: String}
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
  computed: {},
  methods: {}
}
</script>
<style lang="stylus">
.master-dialog__content
  .master-dialog__actions
    .q-btn
      .q-icon
        font-size 20px
</style>
