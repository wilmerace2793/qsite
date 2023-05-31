import { ref, computed } from "vue";
import store from './store/index'
import getRevisions from './store/actions/getRevisions'

export default function useRevisions(props = {}) {
    const drawerModel = computed({
      get: () => store.drawerModel,
      set(value: boolean) {
        store.drawerModel = value;
      }
    });
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