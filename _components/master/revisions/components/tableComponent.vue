<template>
  <div>
    <q-table
      class="my-sticky-header-table"
      :data="rows.data"
      :columns="columns"
      row-key="name"
      flat
      bordered
      :filter="filter"
      :rows-per-page-options="[0]"
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            <div v-if="col.name === 'actions'">
              <btn-menu :actions="fieldAccion" :action-data="props.row" />
            </div>
            <div v-else>
              {{ col.value }}
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <div class="row justify-center q-mt-md">
      <q-pagination
        v-model="rows.meta.page.currentPage"
        :max="maxPagination"
        size="sm"
        color="blue-grey" 
        active-color="primary"
        max-pages="6" :ellipses="false" 
        :boundary-numbers="false" 
        @input="handlePagination"
      />
    </div>
    <inner-loading :visible="loading" />
  </div>
</template>

<script lang="ts">
import Vue, { defineComponent, ref, computed } from "vue";
import dataModel from "../models/dataModel";
import store from '../store/index';
import getRevisions from '../store/actions/getRevisions'

export default defineComponent({
  setup() {
    const filter = ref("");
    const columns = ref([
        {
            name: "createdAt",
            required: true,
            label: "Update date",
            field: "createdAt",
            align: "left",
        },
        {
            name: "createdBy",
            align: "left",
            label: "Users",
            field: "createdBy",
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
    const rows: any = computed(() => ({...store.dataTable}));
    const maxPagination = computed(() => Math.ceil(rows.value.meta.page.total / rows.value.meta.page.perPage))
    const fieldAccion = ref([{
        icon: 'fa-light fa-pencil',
        color: 'green',
        label: 'view',
        action: (item) => {
          console.log(true)
        }
    }]);
    const loading = computed(() => store.loading);
    async function handlePagination(page) {
      await getRevisions(page);
    }
    return { 
      columns, 
      rows, 
      filter,
      fieldAccion,
      maxPagination,
      handlePagination,
      loading,
    };
  },
});
</script>

<style scoped></style>