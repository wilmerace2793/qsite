<template>
    <master-modal
      v-model="show"
      :persistent="true"
      customPosition
      maximized
      @hide="hideModal" 
      modalWidthSize="98%"
    >
      <kanban
        :routes="routeKanban"
        :funnelId="funnelId"
        :heightColumn="170"
      />
    </master-modal>
</template>
<script>
import { TYPE_STORE_AUTOMATION_RULES } from '../constants/constants.js';
export default {
  props: {
    funnelId: {
      type: String,
      default:() => null,
    },
  },
  inject:['init'],
  data() {
    return {
      TYPE_STORE_AUTOMATION_RULES,
      show: false,
    }
  },
  computed: {
    routeKanban() {
      return {
        funnel: {
          apiRoute: "apiRoutes.qrequestable.categories",
        },
        column: {
          filter: {
            name: "categoryId",
          },
          apiRoute: "apiRoutes.qrequestable.statuses",
          include: "category",
        },
        card: {
          filter: {
            name: "statusId",
          },
          apiRoute: "apiRoutes.qrequestable.requestables",
          include: "category,status,fields,files,comments,creator,requestedBy",
        },
        orderStatus: {
          filter: {
            name: "category",
          },
          apiRoute: "apiRoutes.qrequestable.orderStatus",
        },
      };
    },
  },
  methods: {
    hideModal() {
      this.show = false;
      this.init();
    },
    openModal() {
      this.show = true;
    }
  }
};
</script>