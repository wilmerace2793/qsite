<template>
  <master-modal
    v-model="showModal"
    :persistent="true"
    customPosition
    maximized
    @hide="hideModal"
    modalWidthSize="98%"
    title="Administrador de estados"
  >
    <div class="statusCtn">
      <div class="tw-border tw-border-gray-200 tw-rounded-t-md">
        <p class="tw-py-4 tw-px-4">InProgress</p>
        <div>
          <q-btn
            v-if="statusList.inProgress.length === 0"
            round
            color="primary"
            icon="fas fa-plus"
            size="xs"
            class="tw-m-2"
            @click="addStatus(-1, 'inProgress')"
          />
          <draggable
            id="inProgress"
            v-model="statusList.inProgress"
            :animation="200"
            group="data"
            filter=".ignoreItem"
            :force-fallback="true"
            class="tw-flex tw-overflow-x-auto tw-overflow-y-hidden tw-mx-2"
            @end="saveStatusOrdering('inProgress')"
          >
            <statuses
              v-for="(status, index) in statusList.inProgress"
              :key="status.id"
              :status="status"
              class="tw-mb-3"
              :total="statusList.inProgress.length"
              @add="addStatus(index, 'inProgress')"
              @delete="deleteStatus(status.id, 'inProgress')"
              @saveColumn="saveColumn"
              @updateColumn="updateColumn"
            />
          </draggable>
        </div>
      </div>
      <div class="tw-border tw-border-gray-200">
        <p class="tw-py-4 tw-px-4">Failed</p>
        <q-btn
          v-if="statusList.failed.length === 0"
          round
          color="primary"
          icon="fas fa-plus"
          size="xs"
          class="tw-m-2"
          @click="addStatus(-1, 'failed')"
        />
        <div class="tw-flex tw-space-x-5 tw-m-2">
          <div v-for="(status, index) in statusList.failed" :key="status.id">
            <statuses
              :status="status"
              class="tw-w-56"
              :total="statusList.failed.length"
              @add="addStatus(index, 'failed')"
              @delete="deleteStatus(status.id, 'failed')"
              @saveColumn="saveColumn"
              @updateColumn="updateColumn"
            />
          </div>
        </div>
      </div>
      <div class="tw-border tw-border-gray-200 tw-rounded-b-md">
        <p class="tw-py-4 tw-px-4">Success</p>
        <q-btn
          v-if="statusList.success.length === 0"
          round
          color="primary"
          icon="fas fa-plus"
          size="xs"
          class="tw-m-2"
          @click="addStatus(-1, 'success')"
        />
        <div class="tw-flex tw-space-x-5 tw-m-2">
          <div v-for="status, index in statusList.success" :key="status.id">
            <statuses
              :status="status"
              class="tw-w-56"
              :total="statusList.success.length"
              :isAdd="false"
              @add="addStatus(index, 'success')"
              @delete="deleteStatus(status.id, 'success')"
              @saveColumn="saveColumn"
              @updateColumn="updateColumn"
            />
          </div>
        </div>
      </div>
    </div>
  </master-modal>
</template>

<script lang="ts">
import Vue, {
  defineComponent,
  computed,
  inject,
  ref,
  onBeforeUnmount,
} from "vue";
import kanbanStore from "../../store/kanbanStore.js";
import statuses from "../../statuses/index.vue";
import draggable from "vuedraggable";

export default defineComponent({
  components: {
    statuses,
    draggable,
  },
  setup() {
    const statusList: any = ref({
      inProgress: [],
      success: [],
      failed: [],
    });
    const getStatus = inject("getStatus", () => ({ data: [] }));
    const routes: any = inject("routes");
    const saveColumn = inject("saveColumn", false);
    const updateColumn = inject("updateColumn", false);
    const init: any = inject("init", () => false);
    const showModal = computed({
      get: () => kanbanStore().getModalStatus(),
      set: async (value: boolean) => {
        kanbanStore().setModalStatus(value);
        if (value) {
          const response = await getStatus();
          statusList.value = response.data.reduce(
            (result, item) => {
              const status: any = item;
              switch (status.type) {
                case 0:
                  result.inProgress.push(item);
                  break;
                case 1:
                  result.success.push(item);
                  break;
                case 2:
                  result.failed.push(item);
                  break;
                default:
                  break;
              }
              return result;
            },
            { inProgress: [], success: [], failed: [] }
          );
          console.log(statusList.value);
        }
      },
    });
    function addStatus(index, type) {
      try {
        enum Status {
          inProgress = 0, // Por defecto
          success = 1,
          failed = 2,
        }
        const modelColumn = {
          id: null,
          title: null,
          color: null,
          edit: true,
          type: Status[type],
        };

        const counter = `kanban-${statusList.value[type].length + 1}`;
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        const column: any = { ...modelColumn };
        column.id = counter;
        column.color = `#${randomColor}`;
        // @ts-ignore
        console.log(column);
        statusList.value[type].splice(index + 1, 0, column);
      } catch (error) {
        console.log(error);
      }
    }
    async function deleteStatus(id, type) {
      statusList.value[type] = statusList.value[type].filter(
        (item) => item.id !== id
      );
      if (!isNaN(id)) {
        await Vue.prototype.$crud.delete(routes.column.apiRoute, id);
      }
    }

    async function hideModal() {
      showModal.value = false;
      statusList.value = {
        inProgress: [],
        success: [],
        failed: [],
      };
      await init(false, true);
    }

    async function saveStatusOrdering(type) {
      try {
        if (!routes.orderStatus) return;
        const route = routes.orderStatus;
        const statusId = statusList.value[type].map((item) => ({
          id: item.id,
        }));
        Vue.prototype.$crud.create(route.apiRoute, {
          [route.filter.name]: statusId,
        });
      } catch (error) {
        console.log(error);
      }
    }
    onBeforeUnmount(() => {
      hideModal();
    });
    return {
      showModal,
      hideModal,
      statusList,
      addStatus,
      deleteStatus,
      saveStatusOrdering,
      saveColumn,
      updateColumn,
    };
  },
});
</script>

<style>
</style>