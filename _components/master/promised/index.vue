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
import usePromise from '@imagina/qsite/_components/master/promised/usePromise';
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
      ...usePromise(props)
    }
  }
})
</script>

<style>

</style>