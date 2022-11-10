<template>
  <master-modal
    v-model="show"
    :persistent="true"
    customPosition
    :loading="loading"
    maximized
    @hide="hideModal"
    modalWidthSize="70%"
    :title="title"
  >
    <div>
      <q-card class="modal-times tw-mb-5 tw-mr-3 tw-shadow-none">
        <q-card-section class="bg-grey-2 tw-mb-2">
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-md-7">
              Ejecutar:
              <q-btn flat color="primary" no-caps label="Inmediatamente">
                <q-popup-proxy>
                  <q-card class="card-popup">
                    <q-card-section>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Eligendi sunt magni optio nemo soluta harum corrupti
                      possimus quia rem, expedita nisi distinctio vero nulla
                      aspernatur nostrum cupiditate hic a enim?

                      <div>
                        <q-checkbox label="solo horas de trabajo">
                          <q-icon
                            size="8px"
                            name="fa-solid fa-question"
                            color="white"
                          />
                          <q-tooltip>
                            La hora actual se establecerá en el instante en que
                            se ejecute la regla de automatización
                          </q-tooltip>
                        </q-checkbox>
                      </div>
                      <q-btn
                        outline
                        padding="5px 15px"
                        color="primary"
                        label="Seleccionar"
                        dense
                        no-caps
                      />
                    </q-card-section>
                  </q-card>
                </q-popup-proxy>
              </q-btn>
            </div>
            <div class="col-12 col-md-5">
              <q-checkbox
                v-model="right"
                label="después de la regla de automatización anterior"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-section class="bg-grey-2 tw-mb-2">
          Condición:
          <q-btn flat color="primary" no-caps label="Prompt">
            <q-popup-proxy>
              <q-card class="card-popup">
                <q-card-section>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Eligendi sunt magni optio nemo soluta harum corrupti possimus
                  quia rem, expedita nisi distinctio vero nulla aspernatur
                  nostrum cupiditate hic a enim?
                </q-card-section>
              </q-card>
            </q-popup-proxy>
          </q-btn>
        </q-card-section>
        <q-card-section class="bg-grey-2 tw-mb-2"> Etapa de destino: </q-card-section>
        <q-card-section class="bg-grey-2 tw-mb-2"> Modificar en nombre de: </q-card-section>
      </q-card>
    </div>
  </master-modal>
</template>
  <script>
export default {
  data() {
    return {
      show: false,
      loading: false,
      title: null,
      time: ["minutos", "horas", "dias"],
      time2: [
        "Tiempo actual",
        "Fecha actual",
        "Creado el",
        "Última actualización el",
        "Movido el",
      ],
    };
  },
  computed: {},
  methods: {
    hideModal() {
      this.show = false;
    },
    openModal(title = null) {
      this.show = true;
      this.title = "Times"; // title;
    },
  },
};
</script>
<style scoped>
.card-popup {
  max-width: 400px;
}
</style>