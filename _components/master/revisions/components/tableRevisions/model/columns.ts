import Vue, { computed, ComputedRef } from "vue";
import {Column} from '../@Contracts/columns.contract'

export default function modelColumns() {
  const tableColumns: ComputedRef<Column[]> = computed((): Column[] => [
    {
      name: "createdAt",
      required: true,
      label: Vue.prototype.$tr('isite.cms.form.updatedAt'),
      field: "createdAt",
      align: "left",
      format: (val) => (val ? Vue.prototype.$trd(val) : "-"),
    },
    {
      name: "creator",
      align: "left",
      label: Vue.prototype.$tr('isite.cms.form.userName'),
      field: "creator",
      format: (item) => item ? `${item.firstName} ${item.lastName}` : '-'
    },
    {
      name: "key",
      align: "left",
      label: "Request",
      field: "key",
    },
    {
      name: "actions",
      label: Vue.prototype.$tr("isite.cms.form.actions"),
      align: "center",
    },
  ]);

  return {
    tableColumns,
  };
}