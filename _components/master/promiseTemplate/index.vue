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
import usePromised, { UsePromisedContract } from '@imagina/qsite/_components/master/promiseTemplate/usePromisedTemplate.ts';
export default defineComponent({
    props: {
    isLoading: {
        type: Boolean,
        default: () => false,
    },    
    promise: {
      required: true
    }
  },
  setup(props, { slots }): UsePromisedContract {
    return {
      ...usePromised(props)
    }
  }
})
</script>

<style>

</style>