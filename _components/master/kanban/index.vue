<template>
  <div class="tw-py-2">
    <!--<div class="tw-px-3" v-if="showFunnel">
      <div class="tw-flex">
        <div class="tw-w-3/12">
          <dynamic-field :field="funnel" v-model="funnelSelectedComputed" />
        </div>
        <div class="tw-absolute tw-right-0 kanbanBtnCtn">
          <slot name="pageAction" />
        </div>
      </div>
    </div>-->
    <div :id="`kanbanCtn${uId}`" v-if="checkIfFunnelExists">
      <draggable
        id="columnKanban"
        :list="kanbanColumns"
        :animation="200"
        group="columns"
        ghost-class="ghostCard"
        drag-class="dragCard"
        filter=".ignoreItem"
        :disabled="loading || !dragColumn"
        class="tw-p-3 tw-h-auto tw-flex tw-space-x-4 tw-overflow-x-auto"
        @change="reorderColumns"
      >
        <div v-if="!loading" v-for="(column, index) in kanbanColumns">
          <kanbanColumn
            :key="index"
            :column-data="column"
            :columnIndex="index"
            :totalColumns="kanbanColumns.length"
            :ref="`kanbanColumn-${column.id}`"
            class="
              tw-flex-none tw-space-y-0
              w-h-auto
              tw-bg-gray-100 tw-rounded-lg tw-shadow
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
    <div v-else>
      <i class="fa-regular fa-square-kanban" />
      No has selecionado ningun funnel 
    </div>
    <automationRules 
      ref="automationRules"
      :funnelId="funnelSelectedComputed"
    />
    <formComponent
      ref="formComponent"
      :funnelId="funnelSelectedComputed"
      :filterName="routes.column.filter.name"
    />
  </div>
</template>

<script>
import kanbanColumn from "@imagina/qsite/_components/master/kanban/kanbanColumn.vue";
import kanbanStore from "@imagina/qsite/_components/master/kanban/store/kanbanStore.js";
import automationRules from "./automationRules/index.vue";
import draggable from "vuedraggable";
import formComponent from './modals/form.vue';

const modelPayload = {
  id: null,
  title: null,
  color: null,
  value: 1,
};
const modelColumn = {
  id: null,
  title: null,
  color: null,
  data: [],
  loading: false,
  page: 1,
  total: 0,
  new: true,
};
export default {
  props: {
    routes: {
      type: Object,
      default: () => ({}),
    },
    heightColumn: {
      type: Number,
      default: () => 235,
    },
    showFunnel: {
      type: Boolean,
      default: () => false,
    },
    funnelId: {
      type: String,
      default: () => null,
    },
    dragColumn: {
      type: Boolean,
      default: () => true,
    },
    disableCrud: {
      type: Boolean,
      default: () => false,
    },
    automation: {
      type: Boolean,
      default: () => false,
    }
  },
  provide() {
    return {
      saveStatusOrdering: this.saveStatusOrdering,
      addKanbanCard: this.addKanbanCard,
      deleteColumn: this.deleteColumn,
      saveColumn: this.saveColumn,
      updateColumn: this.updateColumn,
      setPayloadStatus: this.setPayloadStatus,
      addColumn: this.addColumn,
      heightColumn: this.heightColumn,
      uId: this.uId,
      init: this.init,
      disableCrud: this.disableCrud,
      routes: this.routes,
      automation: this.automation,
      openFormComponentModal: this.openFormComponentModal,
      addCard: this.addCard
    };
  },
  inject:['funnelPageAction'],
  components: {
    kanbanColumn,
    draggable,
    automationRules,
    formComponent,
  },
  data() {
    return {
      routeCreate: {
        name: "qrequestable.main.requestables.create",
      },
      kanbanColumns: [],
      funnelList: [],
      funnelSelected: null,
      loading: false,
      payloadStatus: { ...modelPayload },
      uId: this.$uid(),
    };
  },
  mounted() {
    this.$nextTick(async function () {
        await this.init();
    });
  },
  computed: {
    extraPageActions() {
      return {
          label: "Reglas de automatización",
          props: {
            label: "Reglas de automatización",
            padding: "3px 15px",
          },
          action: this.openAutomationRulesModal,
        };
    },
    funnel() {
      return {
        value: null,
        type: "select",
        props: {
          label: "Funnel",
        },
        loadOptions: {
          apiRoute: this.routes.funnel ? this.routes.funnel.apiRoute : null,
        },
      };
    },
    funnelSelectedComputed: {
      get() {
        return this.funnelSelected;
      },
      set(value) {
        this.setResetPage();
        this.funnelSelected = value;
        this.getColumns();
      },
    },
    checkIfFunnelExists() {
      return (this.funnelId || this.funnelPageAction) ;
    },
  },
  methods: {
    async init() {
      await this.getFunnel();
      await this.getColumns();
    },
    async getFunnel() {
      try {
        if(this.checkIfFunnelExists) {
          this.funnelSelectedComputed = this.funnelPageAction || this.funnelId;
          return;
        }
        /*const route = this.routes.funnel.apiRoute;
        if(!this.routes.funnel) return;
        const response = await this.$crud.index(route);
        const funnel = response.data
          .sort((a, b) => {
            const compare = a.title
              .toLocaleLowerCase()
              .localeCompare(b.title.toLocaleLowerCase());
            return compare === 0 && a.title !== b.title
              ? b.title.localeCompare(a.title)
              : compare;
          })
          .shift();
        this.funnelSelectedComputed = String(funnel.id);*/
      } catch (error) {
        console.log(error);
      }
    },
    setResetPage() {
      this.kanbanColumns.forEach((item) => {
        item.page = 1;
      });
    },
    addColumn() {
      try {
        const counter = `kanban-${state.kanbanColumn.length + 1}`;
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        const column = { ...modelColumn };
        column.id = counter;
        column.color = `#${randomColor}`;
        state.kanbanColumn.splice(index + 1, 0, column);
      } catch (error) {
        console.log(error);
      }
    },
    async reorderColumns() {
      this.reorder("kanbanColumns");
      await this.saveStatusOrdering();
    },
    reorder(type) {
      this[type].forEach((item, index) => {
        item.position = index;
      });
    },
    async getColumns() {
      try {
        if(!this.routes.column) return;
        this.loading = true;
        const route = this.routes.column;
        const parameters = { params: {}, refresh: true };
        parameters.params.include = route.include;
        parameters.params.filter = {
          [route.filter.name]: this.funnelSelected,
        };
        const response = await this.$crud.index(route.apiRoute, parameters);
        const kanbanColumn = this.getKanbanColumns(response.data);
        this.kanbanColumns = kanbanColumn;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.kanbanColumns = [];
        console.log(error);
      }
    },
    getKanbanColumns(data) {
      const kanbanColumn = data.map((item, index) => {
        return {
          id: item.id,
          title: item.title,
          color: item.color,
          data: [],
          page: 1,
          total: 0,
          loading: false,
          new: false,
          position: index,
        };
      });
      kanbanColumn.forEach(async (column) => {
        const kanbanCard = await this.getKanbanCard(column);
        column.data = kanbanCard.data;
        column.loading = false;
        column.total = kanbanCard.total;
      });
      return kanbanColumn;
    },
    async addCard(columnId) {
      const column = this.kanbanColumns.find(item => item.id === columnId);
      if(column) {
        const kanbanCard = await this.getKanbanCard(column);
        column.data = kanbanCard.data;
        column.loading = false;
        column.total = kanbanCard.total;
      }
    },
    async getKanbanCard(column, page = 1) {
      try {
        column.loading = true;
        return await this.getKanbanCardList(column, page);
      } catch (error) {
        column.loading = false;
        console.log(error);
      }
    },
    async getKanbanCardList(column, page) {
      try {
        const nameRoute = this.automation ? 'automation' : 'card';
        if(!this.routes[nameRoute]) {
          return { total: 0, data: [] };
        }
        const route = this.routes[nameRoute];
        const parameters = { params: {}, refresh: true };
        parameters.params.include = route.include;
        parameters.params.filter = { [route.filter.name]: column.id };
        parameters.params.page = page;
        parameters.params.take = 10;
        const response = await this.$crud.index(route.apiRoute, parameters);
        return this.getCardList(response);
      } catch (error) {
        column.loading = false;
        console.log(error);
      }
    },
    getCardList(response) {
      return {
        total: response.meta.page.total,
        data: response.data.map((card) => ({
          title: card.name || `${card.creator.firstName} ${card.creator.lastName}` || card.title,
          type: card.type || null,
          fields: card.fields || [],
          category: card.category || [],
          statusId: card.statusId,
          ...card,
        })),
      };
    },
    async addKanbanCard(column, page) {
      const kanbancolumn = this.kanbanColumns.find(
        (item) => item.id === column.id
      );
      if (kanbancolumn) {
        const kanbanCard = await this.getKanbanCardList(column, page);
        if (kanbanCard.data.length > 0) {
          kanbancolumn.data.push(...kanbanCard.data);
        }
      }
    },
    async saveStatusOrdering() {
      try {
        if(!this.routes.orderStatus) return;
        const route = this.routes.orderStatus;
        const statusId = this.kanbanColumns.map((item) => ({ id: item.id }));
        await this.$crud.create(route.apiRoute, {
          [route.filter.name]: statusId,
        });
      } catch (error) {
        console.log(error);
      }
    },
    addColumn(index) {
      try {
            const counter = `kanban-${this.totalColumns + 1}`;
            const randomColor = Math.floor(Math.random() * 16777215).toString(16);
            const column = { ...modelColumn };
            column.id = counter;
            column.color = `#${randomColor}`;
            this.kanbanColumns.splice(index + 1, 0, column);
        } catch (error) {
            console.log(error);
        }
    },
    async deleteColumn(columnId) {
      try {
        if(!this.routes.column) return;
        const route = this.routes.column;
        const kanbanColumn = this.kanbanColumns.filter(
          (item) => item.id !== columnId
        );
        this.kanbanColumns = kanbanColumn;
        if (!isNaN(columnId)) {
          await this.$crud.delete(route.apiRoute, columnId);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async saveColumn(data) {
      try {
        if(!this.routes.column) return;
        const route = this.routes.column;
        const payloadStatus = {};
        payloadStatus.title = data.title;
        payloadStatus.color = data.color;
        payloadStatus[route.filter.name] = this.funnelSelected;
        return await this.$crud.create(route.apiRoute, payloadStatus);
      } catch (error) {
        console.log(error);
        this.setPayloadStatus();
      }
    },
    async updateColumn(data) {
      try {
        if(!this.routes.column) return;
        const route = this.routes.column;
        const payloadStatus = {};
        payloadStatus.id = data.id;
        payloadStatus.title = data.title;
        payloadStatus.color = data.color;
        payloadStatus[route.filter.name] = this.funnelSelected;
        await this.$crud.update(route.apiRoute, data.id, payloadStatus);
      } catch (error) {
        console.log(error);
        this.setPayloadStatus();
      }
    },
    setPayloadStatus() {
      this.payloadStatus = {
        id: null,
        title: null,
        color: null,
        value: 1,
        [this.routes.column.filter.name]: null,
      };
    },
    openAutomationRulesModal() {
      if(this.$refs.automationRules) this.$refs.automationRules.openModal();
    },
    openFormComponentModal(statusId, title) {
      if(this.$refs.formComponent) this.$refs.formComponent.openModal(statusId, title);
    }
  },
};
</script>

<style>
.kanbanBtnCtn .q-btn {
  border-radius: 10px;
}
</style>