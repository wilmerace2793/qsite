<template>
<div class="tw-py-2">
  <div class="tw-w-2/5 tw-px-3">
    <dynamic-field :field="funnel" v-model="funnelSelected" />
  </div>
  <div id="kanbanCtn" class="
        tw-p-3 
        tw-h-auto 
        tw-flex 
        tw-space-x-4 
        tw-overflow-x-auto">
    <kanbanColumn 
      v-if="!loading" 
      v-for="(column, index) in kanbanColumns" 
      :key="index" 
      :column-data="column" 
      class="
       tw-flex-none 
       tw-space-y-0 
       w-h-auto
       tw-bg-gray-100" :ref="`kanbanColumn-${column.id}`" />
       <q-skeleton
         animation="blink"
         height="500px" 
         width="450px" 
         v-if="loading"
         v-for="item in 5"
       />
  </div>
</div>
</template>

<script>
import kanbanColumn from '@imagina/qsite/_components/master/kanban/kanbanColumn.vue';
import kanbanStore from '@imagina/qsite/_components/master/kanban/store/kanbanStore.js';

export default {
  components: {
    kanbanColumn,
  },
  mounted() {
    this.$nextTick(function () {
      kanbanStore().getColumns();
      kanbanStore().getFunnel();
    })
  },
  computed: {
    kanbanColumns() {
      return kanbanStore().getKanbanColumn();
    },
    funnel() {
      return {
        value: null,
        type: 'select',
        props: {
          label: 'Funnel',
        },
        loadOptions: {
          apiRoute: 'apiRoutes.qrequestable.categories',
        }
      }
    },
    funnelSelected: {
      get() {
        return kanbanStore().getFunnelSelected();
      },
      set(value) {
        kanbanStore().setFunnelSelected(value)
        kanbanStore().getColumns();
      }
    },
    loading() {
      return kanbanStore().getLoading();
    }
  },
  methods: {
    addColumn() {
      kanbanStore().addColumn();
    },
  }
}
</script>

<style>
</style>