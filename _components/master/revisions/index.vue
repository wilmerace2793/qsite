<script lang="ts">
import { defineComponent } from "vue";
import tableRevisions from "./components/tableRevisions/index.vue";
import useRevisions from './useRevisions'

export default defineComponent({
  components: {
    tableRevisions,
  },
  setup() {
    return {...useRevisions()}
  },
});
</script>
<template>
  <div class="review-ctn">
    <master-modal
      v-model="drawerModel"
      width="90%"
      customPosition
      title="Revisions"
    >
      <div class="tw-px-4">
        <tableRevisions />
      </div> 
    </master-modal>
  </div>
</template>

<style></style>