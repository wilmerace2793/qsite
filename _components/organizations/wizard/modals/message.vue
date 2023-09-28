<template>
  <div>
    <master-modal
      v-model="modal.show"
      @hide="resetModal()"
      :loading="modal.loading"
      :title="modal.title"
      persistent
      hideCloseAction
      customClass="wizard-modal"
    >
      <div class="content-modal">
        <div class="tw-text-md md:tw-text-lg text-center tw-font-semibold tw-p-4">
          <p>Has dado el primer paso importante al registrarte, y ahora estamos listos para 
            llevarte a  través de nuestro sencillo
            proceso para personalizar y crear el sitio web perfecto que refleje
              tu visión y objetivos.</p> 
          <p>¡Bienvenid@ y adelante! 👋</p>
        </div>
        <div class="text-center tw-mt-6">
        <q-btn  rounded
                class="tw-text-center"
                no-caps
                color="primary"
                size="md"
                outline
                @click="go()">
          {{ $tr('isite.cms.label.continue') }} 
        </q-btn>
        </div>
      </div>
    </master-modal>
  </div>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      loading: false,
      modal: {
        title: null,
        show: false,
        loading: false,
        user: [],
      },
    };
  },
  provide() {
    return {};
  },
  computed: {},
  methods: {
    //Reset Modal
    resetModal() {
      this.modal = { show: false, loading: false };
    },
    async showModalWizard() {
      this.modal = {
        title: '¡Felicidades por completar el registro de tu cuenta!',
        show: true,
        loading: false,
      };
    },
    go() {
      this.$emit('message');
    }
  },
};
</script>

<style>
.wizard-modal {
  border-radius: 0 !important;
  background: -webkit-linear-gradient(bottom, #fff, #e4e2f2);
}
.wizard-modal .master-dialog__header  {
  justify-content: center !important;
  background: transparent;
  font-size: 18px;
}
.wizard-modal .content-modal p:not(:last-child) {
  margin-bottom: 10px;
}
</style>