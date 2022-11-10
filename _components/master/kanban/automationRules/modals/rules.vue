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
        <div class="modal-rules row q-col-gutter-lg">
          <div class="col-12 col-md-5">
            <!--<dynamic-field v-model="stage" :field="formFields.rulesForms.stage" /> -->
            <q-select
              outlined
              v-model="model"
              :options="formFields.rulesForms.stage.props.options"
              dense
              options-dense
              label="Add automation rule to stage"
            >
              <template v-slot:prepend>
                <q-icon
                  size="xs"
                  name="fa-solid fa-octagon"
                  :color="model.color"
                />
              </template>
            </q-select>
          </div>
          <div class="col-12 tw-p-0"></div>
          <div class="col-12 col-md-5">
            <div class="text-subtitle1 tw-mb-2">
              GRUPO
              <q-badge rounded align="top" color="gray">
                <q-icon size="8px" name="fa-solid fa-question" color="white" />
                <q-tooltip
                  >Automation rules are grouped by their respective
                  function</q-tooltip
                >
              </q-badge>
            </div>
  
            <q-list>
              <q-item
                clickable
                v-ripple
                :active="group.active"
                @click="activeList(group.id, index)"
                class="bg-grey-2 tw-mb-2 tw-rounded-lg"
                v-for="(group, index) in groups"
              >
                <q-item-section avatar>
                  <q-avatar
                    size="30px"
                    color="primary"
                    text-color="white"
                    :icon="group.icon"
                  />
                </q-item-section>
  
                <q-item-section>{{ group.title }}</q-item-section>
                <q-item-section side v-if="group.content.length > 0">
                  <div class="text-grey-8 q-gutter-xs">
                    <q-btn
                      class="gt-xs"
                      size="8px"
                      flat
                      dense
                      round
                      icon="arrow_forward_ios"
                    />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <div class="col-12 col-md-7">
            <div class="text-subtitle1 tw-mb-2">
              AUTOMATION RULES
              <q-badge rounded align="top" color="gray">
                <q-icon size="8px" name="fa-solid fa-question" color="white" />
                <q-tooltip
                  >Automation rules will perform routine duties to help you
                  automate business workflows</q-tooltip
                >
              </q-badge>
            </div>
            <q-tab-panels v-model="tab" animated>
              <q-tab-panel
                class="tw-pl-0"
                :name="`tab-group-${index}`"
                v-for="(group, index) in groups"
              >
                <div v-if="group.content.length > 1">
                  <q-list bordered separator class="tw-rounded-lg tw-mr-1">
                    <q-item
                      class="bg-grey-2 tw-py-3"
                      v-for="(item, index) in group.content"
                    >
                      <q-item-section>
                        <q-item-label lines="1">
                          {{ item.label }}
                        </q-item-label>
                        <q-item-label caption lines="1">
                          {{ item.caption }}
                        </q-item-label>
                      </q-item-section>
  
                      <q-item-section side>
                        <div class="text-grey-8 q-gutter-xs">
                          <q-btn
                            size="12px"
                            push
                            color="primary"
                            rounded
                            label="add"
                            @click="addRules(item.label)"
                          />
                        </div>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
                <div class="text-center tw-px-10" v-else>
                  Este grupo no tiene nada que coincida con tus criterios de
                  búsqueda. Intente cambiar o restablecer el filtro.
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
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
        tab: "uno",
        stage: null,
        model: { label: "Inicio", value: "0", color: "red" },
        groups: [
          {
            id: 1,
            title: "Recent items",
            icon: "undo",
            active: false,
            content: [{}],
          },
          {
            id: 2,
            title: "For employee",
            icon: "people",
            active: false,
            content: [
              {
                label: "Aprobar o rechazar",
                caption: "Creates a task with approve/decline option.",
              },
              {
                label: "Solicitar información",
                caption:
                  "Creates a task that queries the responsible person for additional information.",
              },
            ],
          },
          {
            id: 3,
            title: "Link simple",
            icon: "fa-solid fa-star",
            active: false,
            content: [],
          },
        ],
      };
    },
    computed: {
      formFields() {
        return {
          rulesForms: {
            stage: {
              value: "0",
              type: "select",
              props: {
                label: "Add automation rule to stage",
                icon: "fa-solid fa-octagon",
                options: [
                  { label: "Inicio", value: "0", color: "red" },
                  {
                    label: "Aprobacion del supervisor",
                    value: "1",
                    color: "blue",
                  },
                  {
                    label: "Aprobacion del contador principal",
                    value: "2",
                    color: "yellow",
                  },
                  { label: "Aprobado", value: "3", color: "orange" },
                  { label: "Rechazado", value: "4", color: "black" },
                ],
              },
            },
          },
        };
      },
    },
    methods: {
      activeList(id, i) {
        this.groups.find((item) => (item.active = false));
        const group = this.groups.find((item) => item.id === id);
        group.active = true;
        this.tab = `tab-group-${i}`;
      },
      addRules(title) {
        this.$alert.info({
          message: `Nueva regla "${title}" agregada to stage "${this.model.label}"`,
        });
      },
      hideModal() {
        this.show = false;
      },
      openModal(title = null) {
        this.show = true;
        this.title = "Automatizaciones de reglas"; // title;
      },
    },
  };
  </script>
  <style>
  .modal-rules .q-item__section--avatar {
    min-width: 45px;
  }
  .modal-rules .q-list--bordered {
    border: 1px solid #f5f5f5;
  }
  .modal-rules .q-badge i {
    padding: 3px 0px;
  }
  </style>