import { computed, ComputedRef } from "vue";
import showRevisions from '../../../store/actions/showRevisions';
import {ActionItem} from '../@Contracts/fieldAccion.contract' 
export default function modelFieldAccion() {
  const fieldAccion: ComputedRef<ActionItem[]>  = computed((): ActionItem[] => [{
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