import Vue, { computed } from "vue";

export default function modelColumns() {
  const tableColumns = computed(() => [
    {
      name: "createdAt",
      required: true,
      label: "Update date",
      field: "createdAt",
      align: "left",
      format: (val) => (val ? Vue.prototype.$trd(val) : "-"),
    },
    {
      name: "creator",
      align: "left",
      label: "Users",
      field: "creator",
      format: (item) => item ? item.fullName : '-'
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