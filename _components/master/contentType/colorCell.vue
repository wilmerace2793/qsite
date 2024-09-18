<template>
  <div
    v-if="val"
    :style="{ 'background-color': background, 'color': color}"
    v-ripple
  >
    <div class="flex justify-center items-center " style="width: 140px;  height: 36px; padding: 8px;">
      <div class="ellipsis">
        <i v-if="val?.icon" :class="val?.icon"></i>&nbsp;
        {{ val.title }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  props: {
    row: {default: {}},
    col: {default: {}},
    val: {default: {}}
  },
  computed: {
    background(){
      return this.val?.color ? this.val.color : '#000000'
    },
    color(){
      return this.val?.color ? '#ffffff' : '#000000'
    }
  }
})
</script>
<style lang="scss">
</style>
