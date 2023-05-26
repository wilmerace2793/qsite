import Vue, { computed } from "vue";
import showRevisions from '../../../store/actions/showRevisions'; 
export default function modelFieldAccion() {
  const fieldAccion = computed(() => [{
    icon: 'fa-light fa-pencil',
    color: 'green',
    label: 'view',
    action: async (item) => {
      await showRevisions(item.id);
    }
  }]);

  return {
    fieldAccion,
  };
}