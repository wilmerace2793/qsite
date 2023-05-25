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
import { defineComponent, ref } from "vue";
import tableComponent from "./components/tableComponent.vue";
import store from './store/index'
import getRevisions from './store/actions/getRevisions'

export default defineComponent({
  components: {
    tableComponent,
  },
  props: {
    revisionableId: {
      type: Number,
      default: () => 0,
    },
    revisionableType: {
      type: String,
      default: () => '',
    },
  },
  setup(props) {
    const drawerModel = ref(false);
    const drawerWidth = ref("60%");
    function closeModal() {
      drawerModel.value = false;
    }
    async function openModal() {
        drawerModel.value = true;
        await getRevisions();
    }
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