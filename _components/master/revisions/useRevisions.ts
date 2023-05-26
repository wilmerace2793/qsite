import { ref, onBeforeUnmount } from "vue";

import store from './store/index'
import getRevisions from './store/actions/getRevisions'

export default function useRevisions(props = {}) {
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
}