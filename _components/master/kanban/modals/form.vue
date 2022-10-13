<template>
  <master-modal
    v-model="show"
    :persistent="true"
    customPosition
    :loading="loading"
    maximized
    @hide="hideModal"
    modalWidthSize="98%"
  >
    <div>
      <div class="relative-position">
        <div class="box box-auto-height q-mb-md">
          <div v-if="funnelForm">
            <dynamic-form
              v-if="formCategory.vIf"
              v-model="form"
              :form-id="formCategory.formId"
              @submit="saveForm()"
            />
          </div>
        </div>
      </div>
    </div>
  </master-modal>
</template>
<script>
export default {
  props: {
    funnelId: {
      type: String,
      default: () => null,
    },
    filterName: {
      type: String,
      default: () => null,
    },
  },
  inject: {
    init: {
      type: Function,
      default: () => false,
    },
    routes: {
      type: Object,
      default: () => {},
    },
    automation: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      show: false,
      funnelForm: null,
      statusId: null,
      form: {},
      loading: false,
    };
  },
  computed: {
    formCategory() {
      return {
        vIf: this.funnelForm && this.funnelForm.form ? true : false,
        formId: this.funnelForm?.form?.id || null,
      };
    },
  },
  methods: {
    hideModal() {
      this.show = false;
      this.resetForm();
    },
    openModal(statusId) {
      this.statusId = statusId;
      const funnel =
        this.$helper.getDynamicSelectList()[this.filterName] || null;
      if (funnel) {
        this.funnelForm = funnel.find((item) => item.id == this.funnelId);
      }
      if(!this.formCategory.vIf) {
        this.$alert.warning({message: 'No existen formulario para esta categoría'})
        return;
      }
      this.show = true;
    },
    async saveForm() {
      try {
        this.loading = true;
        const nameRoute = this.automation ? "automation" : "card";
        if (!this.routes[nameRoute]) return;
        const route = this.routes[nameRoute];
        const form = {
          ...this.form,
          type: this.funnelForm.type,
          statusId: this.statusId,
        };
        await this.$crud.create(route.apiRoute, form);
        this.init();
        this.hideModal();
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },
    resetForm() {
      this.form = {};
    }
  },
};
</script>