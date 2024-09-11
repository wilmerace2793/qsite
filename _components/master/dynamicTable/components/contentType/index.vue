<template>
  <!--cell content-->
  <div :style="col?.style">
    <!-- custom component -->
    <component
      v-if="component"
      v-show="!isLoading"
      :is="component"
      :col="col"
      :row="row"
      :val="val"
    />
    <!-- default content -->
    <div v-if="!isComponent" v-show="!isLoading" class="ellipsis tw-flex-1 tw-min-w-1"
         @click="onClick({val, col, row})">
      <label v-html="val" :class="{ 'content-type-onclick': isClickeable }"></label>
      <!-- help tootlipt -->
      <q-tooltip>
        <div v-html="col.tooltip || val" />
        <label v-if="isClickeable" class="text-weight-bold">
          {{ $tr('isite.cms.label.clickToAction') }}
        </label>
      </q-tooltip>
    </div>
    <q-skeleton v-if="isLoading" animated type="text" />
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import controller from 'modules/qsite/_components/master/dynamicTable/components/contentType/controller'

export default defineComponent({
  props: {
    col: {default: []},
    row: {default: []}, 
    val: {default: ''}
  },
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
<style lang="scss">
.content-type-onclick {
  color: #2067b0;
  cursor: pointer
}
.content-type-onclick:hover {
  border-bottom: 2px dotted #2067b0;
}
</style>
