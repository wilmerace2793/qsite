<template>
  <div class="tw-py-2">
    <div class="tw-px-3">
      <div class="tw-grid tw-grid-cols-2 tw-gap-4">
        <div class="tw-w-1/2">
          <dynamic-field 
            :field="funnel" 
            v-model="funnelSelected"
          />
        </div>
        <div class="tw-text-right kanbanBtnCtn">
          <q-btn color="primary" outline @click="$router.push(routeCreate)">
            <div class="row items-center no-wrap">
              <i class="fas fa-plus"></i>
              <div class="tw-text-center tw-px-1">
                {{ $tr(`isite.cms.label.new`) }}
              </div>
            </div>
          </q-btn>
        </div>
      </div>
    </div>
    <div id="kanbanCtn">
      <draggable
        id="columnKanban"
        :list="kanbanColumns"
        :animation="200"
        group="columns"
        ghost-class="ghostCard"
        drag-class="dragCard"
        filter=".ignoreItem"
        :disabled="loading"
        class="tw-p-3 tw-h-auto tw-flex tw-space-x-4 tw-overflow-x-auto"
        @change="reorderColumns"
      >
        <div v-if="!loading" v-for="(column, index) in kanbanColumns">
          <kanbanColumn
            :key="index"
            :column-data="column"
            :columnIndex="index"
            :ref="`kanbanColumn-${column.id}`"
            class="
              tw-flex-none tw-space-y-0
              w-h-auto
              tw-bg-gray-100 
              tw-rounded-lg 
              tw-shadow
            "
          />
        </div>
        <q-skeleton
          animation="blink"
          height="700px"
          width="450px"
          v-if="loading"
          v-for="(item, index) in 5"
          :key="index"
        />
      </draggable>
    </div>
  </div>
</template>

<script>
import kanbanColumn from "@imagina/qsite/_components/master/kanban/kanbanColumn.vue";
import kanbanStore from "@imagina/qsite/_components/master/kanban/store/kanbanStore.js";
import draggable from "vuedraggable";

export default {
  components: {
    kanbanColumn,
    draggable,
  },
  data() {
    return {
      routeCreate: {
        name: "qrequestable.main.requestables.create",
      },
    };
  },
  mounted() {
    this.$nextTick(function () {
      kanbanStore().getFunnel();
      kanbanStore().getColumns();
    });
  },
  computed: {
    kanbanColumns() {
      return kanbanStore().getKanbanColumn();
    },
    funnel() {
      return {
        value: null,
        type: "select",
        props: {
          label: "Funnel",
        },
        loadOptions: {
          apiRoute: "apiRoutes.qrequestable.categories",
        },
      };
    },
    funnelSelected: {
      get() {
        return kanbanStore().getFunnelSelected();
      },
      set(value) {
        kanbanStore().setResetPage();
        kanbanStore().setFunnelSelected(value);
        kanbanStore().getColumns();
      },
    },
    loading() {
      return kanbanStore().getLoading();
    },
  },
  methods: {
    addColumn() {
      kanbanStore().addColumn();
    },
    async reorderColumns() {
      kanbanStore().reorder('kanbanColumn');
      await kanbanStore().saveStatusOrdering();
    },
  },
};
</script>

<style>
.kanbanBtnCtn .q-btn {
  border-radius: 10px;
}
</style>