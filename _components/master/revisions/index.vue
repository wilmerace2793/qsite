<script lang="ts">
import Vue, { defineComponent, computed } from "vue";
import tableRevisions from "./components/tableRevisions/index.vue";
import useRevisions from './useRevisions'
import fieldComparison from './components/fieldComparison/index.vue'

export default defineComponent({
  components: {
    tableRevisions,
    fieldComparison
  },
  setup() {
    const tr = computed(()=> Vue.prototype.$tr)
    return {...useRevisions(), tr}
  },
});
</script>
<template>
  <div class="review-ctn">
    <master-modal
      v-model="drawerModel"
      width="100%"
      customPosition
      :title="tr('isite.cms.revision')"
      @hide="closeModal"
    >
      <div class="tw-px-4">
        <tableRevisions />
        <fieldComparison />
      </div> 
    </master-modal>
  </div>
</template>

<style></style>