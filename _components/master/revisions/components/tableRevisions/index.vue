<script lang="ts">
import Vue, { defineComponent} from "vue";
import useTableRevisions from '@imagina/qsite/_components/master/revisions/components/tableRevisions/useTableRevisions';

export default defineComponent({
  setup() {
    return { ...useTableRevisions() };
  },
});
</script>
<template>
  <div>
    <q-table
      class="my-sticky-header-table"
      :data="rows.data"
      :columns="tableColumns"
      row-key="name"
      flat
      bordered
      :filter="filter"
      :rows-per-page-options="[0]"
      hide-bottom
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
        @click.prevent="handlePagination"
      />
    </div>
    <inner-loading :visible="loading" />
  </div>
</template>
<style scoped></style>