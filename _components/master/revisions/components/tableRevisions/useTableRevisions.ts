import Vue, { ref, computed, ComputedRef } from "vue";
import store from '../../store/index';
import getRevisions from '../../store/actions/getRevisions';
import modelColumns from '@imagina/qsite/_components/master/revisions/components/tableRevisions/model/columns'
import modelFieldAccion from '@imagina/qsite/_components/master/revisions/components/tableRevisions/model/fieldAccion'
import { TableRevisions } from './@Contracts/tableRevisions.contract';
export default function tableRevisions(): TableRevisions {
    const { tableColumns } = modelColumns();
    const { fieldAccion } = modelFieldAccion();
    const filter = ref<string>("");
    const rows: ComputedRef<any> = computed(() => ({...store.dataTable}));
    const maxPagination: ComputedRef<number> = computed(():number => Math.ceil(rows.value.meta.page.total / rows.value.meta.page.perPage))
    const loading:ComputedRef<boolean> = computed(():boolean => store.loading);
    async function handlePagination(page: number): Promise<void> {
      await getRevisions(page);
    }
    return { 
      tableColumns, 
      rows, 
      filter,
      fieldAccion,
      maxPagination,
      handlePagination,
      loading,
    };
}