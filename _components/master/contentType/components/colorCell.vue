<template>
  <div
    v-if="label"
    :style="{ 'background-color': background, 'color': textColor}"
    v-ripple
  >
    <div class="flex justify-center items-center " style="width: 140px;  height: 36px; padding: 8px;">
      <div class="ellipsis">
        <i v-if="icon" :class="icon"></i>&nbsp;
        {{ label }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  props: {    
    label: {default: null},
    color: {default: null}, 
    icon: {default: null}, 
  },
  computed: {
    background(){
      return this.color ? this.color : '#000000'
    },
    textColor(){
      return this.color ? '#ffffff' : '#000000'
    }
  }
})
</script>
<style lang="scss">
</style>
