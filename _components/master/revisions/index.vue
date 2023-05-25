<template>
  <div class="review-ctn">
    <master-modal
      v-model="drawerModel"
      width="90%"
      customPosition
      title="Revisions"
    >
      <div class="tw-px-4">
        <tableComponent />
      </div> 
    </master-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeUnmount } from "vue";
import tableComponent from "./components/tableComponent.vue";
import store from './store/index'
import getRevisions from './store/actions/getRevisions'

export default defineComponent({
  components: {
    tableComponent,
  },
  setup() {
    const drawerModel = ref(false);
    const drawerWidth = ref("60%");
    function closeModal() {
      drawerModel.value = false;
    }
    async function openModal(revisionableType: string, revisionableId: number) {
        drawerModel.value = true;
        store.revisionableType = revisionableType;
        store.revisionableId = revisionableId;
        await getRevisions();
    }
    onBeforeUnmount(() => {
      store.reset();
    })
    return {
      drawerModel,
      closeModal,
      drawerWidth,
      openModal,
      store,
    };
  },
});
</script>

<style></style>