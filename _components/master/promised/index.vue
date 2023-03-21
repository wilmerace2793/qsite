<template>
    <div>
    <span v-if="isLoading">
        <i 
          class="
           fa-duotone 
           fa-spinner-third 
           fa-spin 
           fa-pulse" >
        </i>
    </span>
    <template v-else>
      <slot :data="data"></slot>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import usePromised from '@imagina/qsite/_components/master/promised/usePromised.ts';
export default defineComponent({
    props: {
    isLoading: {
        type: Boolean,
        default: () => false,
    },    
    promise: {
      type: Promise,
      required: true
    }
  },
  setup(props, { slots }) {
    return {
      ...usePromised(props)
    }
  }
})
</script>

<style>

</style>