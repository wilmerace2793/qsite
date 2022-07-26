<template>
  <div
    id="kanbanCtn"
    class="
        tw-p-3 
        tw-h-auto 
        tw-flex 
        tw-space-x-4 
        tw-overflow-x-auto"
  >
    <kanbanColumn
      v-for="(column, index) in kanbanColumns"
      :key="index"
      :column-data="column"
      class="
       tw-flex-none 
       tw-space-y-0 
       w-h-auto
       tw-bg-gray-100"
      :ref="`kanbanColumn-${column.id}`"
    />
  </div>
</template>

<script>
import kanbanColumn from '@imagina/qsite/_components/master/kanban/kanbanColumn.vue';
import kanbanStore from '@imagina/qsite/_components/master/kanban/store/kanbanStore.js';

export default {
    components: {
        kanbanColumn,
    },
    computed: {
        kanbanColumns() {
            return kanbanStore().getKanbanColumn();
        },
    },
    methods: {
        addColumn(){
            kanbanStore().addColumn();
        },
    }
}
</script>

<style>
</style>