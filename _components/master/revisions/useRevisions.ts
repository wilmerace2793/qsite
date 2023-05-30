import { ref } from "vue";

import store from './store/index'
import getRevisions from './store/actions/getRevisions'
import getModulesInfo from './store/actions/getModulesInfo'

export default function useRevisions(props = {}) {
    const drawerModel = ref<boolean>(false);
    const drawerWidth = ref<string>("60%");
    function closeModal(): void {
      drawerModel.value = false;
      store.reset();
    }
    async function openModal(revisionableType: string, revisionableId: number): Promise<void> {
        drawerModel.value = true;
        store.revisionableType = revisionableType;
        store.revisionableId = revisionableId;
        await getRevisions();
    }
    return {
      drawerModel,
      closeModal,
      drawerWidth,
      openModal,
      store,
    };
}