import Vue, { ref, computed } from "vue";
import store from '../../store/index';
import getRevisions from '../../store/actions/getRevisions';
import showRevisions from '../../store/actions/showRevisions';
import modelColumns from '@imagina/qsite/_components/master/revisions/components/tableRevisions/model/columns'
import modelFieldAccion from '@imagina/qsite/_components/master/revisions/components/tableRevisions/model/fieldAccion'

export default function tableRevisions() {
    const { tableColumns } = modelColumns();
    const { fieldAccion } = modelFieldAccion();
    const filter = ref("");
    const rows: any = computed(() => ({...store.dataTable}));
    const maxPagination = computed(() => Math.ceil(rows.value.meta.page.total / rows.value.meta.page.perPage))
    const loading = computed(() => store.loading);
    async function handlePagination(page) {
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