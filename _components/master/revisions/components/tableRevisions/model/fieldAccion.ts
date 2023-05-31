import { computed, ComputedRef } from "vue";
import showRevisions from '../../../store/actions/showRevisions';
import {ActionItem} from '../@Contracts/fieldAccion.contract' 
export default function modelFieldAccion() {
  const fieldAccion: ComputedRef<ActionItem[]>  = computed((): ActionItem[] => [{
    icon: 'fa-light fa-eye',
    color: 'green',
    label: 'show',
    action: async (item) => {
      await showRevisions(item.id);
    }
  }]);

  return {
    fieldAccion,
  };
}