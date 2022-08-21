<template>
  <div class="columnCtn tw-relative">
    <div
      class="tw-h-auto"
      :class="`cardItemsCtn-${columnData.id}`"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    >
      <div
        v-if="columnData.loading"
        class="
          tw-flex
          tw-justify-center
          tw-absolute
          tw-inset-0
          tw-pt-48
          tw-bg-white
          tw-bg-opacity-75
          tw-z-20
        "
      >
        <q-spinner color="primary" size="2em" />
      </div>
      <button
        class="
          tw-absolute
          tw-right-0
          tw-z-20
          tw-mt-2
          tw--mr-2
          tw-bg-white
          tw-rounded-full
          tw-px-1
          tw-text-center
          tw-shadow-lg
          tw-shadow-gray-500/40
          tw-cursor-pointer
          tw-transition
          tw-duration-150
          tw-ease-out
          hover:tw-ease-in hover:tw--translate-y-1
        "
        v-if="hover"
        @click="addColumn"
      >
        <i class="fas fa-plus tw-text-gray-400 tw-drop-shadow-lg" />
      </button>
      <div
        class="
          tw-flex tw-w-full tw-py-3 tw-px-4 tw-rounded-t-lg
          arrowKanbanName
        "
        @mouseover="arrowKanbanNameHover = true"
        @mouseleave="arrowKanbanNameHover = false"
        :style="{ background: columnData.color }"
      >
        <div class="tw-flex tw-w-full kanbanName">
          <div class="tw-w-11/12">
            <p
              v-if="!columnData.new"
              class="
                tw-mx-1
                tw-text-xs
                tw-whitespace-nowrap
                tw-font-bold
                tw-m-0
                tw-truncate
              "
              :class="{ 'tw-text-white': columnData.color }"
            >
              {{ columnData.name }}
            </p>
            <dynamic-field
              v-else
              :field="inputDynamicField"
              v-model="columnData.name"
              class="tw-pr-3"
              @enter="addColumnName"
            />
          </div>
          <div
            v-if="arrowKanbanNameHover && !columnData.new"
            class="tw-w-1/12 tw-text-xs tw-cursor-pointer"
            :class="{ 'tw-text-white': columnData.color }"
          >
            <q-btn
              flat
              round
              icon="fas fa-pencil-alt"
              size="6px"
              @click="columnData.new = true"
            >
              <q-tooltip> Editar Columna </q-tooltip>
            </q-btn>
          </div>
          <div
            v-if="columnData.new"
            class="tw-flex"
            :class="{ 'tw-text-white': columnData.color }"
          >
            <div>
              <q-btn flat round size="6px">
                <template v-slot:default>
                  <q-icon name="fas fa-fill" class="cursor-pointer">
                    <q-popup-proxy
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-color
                        v-model="columnData.color"
                        no-header-tabs
                        class="my-picker"
                      />
                    </q-popup-proxy>
                  </q-icon>
                  <q-tooltip> Asignar Color </q-tooltip>
                </template>
              </q-btn>
            </div>
            <div>
              <q-btn
                flat
                round
                icon="fas fa-times"
                size="6px"
                @click="deleteColumn"
              >
                <q-tooltip> Eliminar columnas </q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>
      </div>

      <div class="tw-overflow-y-auto tw-overflow-x-hidden tw-mb-4 tw-px-2">
        <draggable
          :id="columnData.id"
          :list="columnData.data"
          :animation="200"
          group="data"
          ghost-class="ghostCard"
          drag-class="dragCard"
          filter=".ignoreItem"
          :style="{ height: computedHeight }"
          :force-fallback="true"
        >
          <kanbanCard
            v-for="(item, index) in columnData.data"
            :key="item.id"
            :cardData="item"
            class="tw-cursor-pointer"
          />
          <div class="tw-text-center tw-h-5 tw-px-2">
            <q-banner
              inline-actions
              rounded
              class="primary"
              v-if="
                columnData.total !== 0 &&
                isTotalNumberOfRecords &&
                !loading &&
                !columnData.loading
              "
            >
              <div>
                <i class="far fa-grin-beam-sweat tw-text-base" />
              </div>
              <div class="tw-font-semibold">Ya te dimos todo</div>
            </q-banner>
          </div>
          <div
            :class="`trigger-${columnData.id}`"
            class="tw-text-center tw-h-5 tw-flex tw-justify-center"
          >
            <q-spinner v-if="loading" color="primary" size="1.3em" />
          </div>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import kanbanCard from "@imagina/qsite/_components/master/kanban/kanbanCard.vue";
import kanbanStore from "@imagina/qsite/_components/master/kanban/store/kanbanStore.js";

export default {
  props: {
    columnData: {
      type: Object,
      required: true,
    },
    columnIndex: {
      type: Number,
      required: true,
    },
  },
  mounted() {
    const parent = document.querySelector("#kanbanCtn");
    this.initialheight = `${window.innerHeight - parent.offsetTop - 120}px`;
    window.addEventListener("resize", () => {
      setTimeout(() => {
        this.computedHeight = `${
          window.innerHeight - parent.offsetTop - 100
        }px`;
      }, 100);
    });
    // infinite scroll
    const observerOptions = {
      root: document.querySelector(`.cardItemsCtn-${this.columnData.id}`),
    };
    const target = document.querySelector(`.trigger-${this.columnData.id}`);
    const observer = new IntersectionObserver(
      this.observerCallback,
      observerOptions
    );
    observer.observe(target);
  },
  data() {
    return {
      initialheight: null,
      loading: false,
      hover: false,
      arrowKanbanNameHover: false,
    };
  },
  components: {
    draggable,
    kanbanCard,
  },
  computed: {
    inputDynamicField() {
      return kanbanStore().getInputDynamicField();
    },
    computedHeight: {
      get() {
        return this.initialheight;
      },
      set(value) {
        this.initialheight = value;
      },
    },
    isTotalNumberOfRecords() {
      return this.columnData.total === this.columnData.data.length;
    },
  },
  methods: {
    addColumn() {
      kanbanStore().addColumn(this.columnIndex);
    },
    deleteColumn() {
      kanbanStore().deleteColumn(this.columnData.id);
      this.$alert.success({ message: "Se elimino el estado correctamente" });
    },
    observerCallback(entries) {
      entries.forEach(({ isIntersecting }) => {
        if (isIntersecting) {
          this.infiniteHandler();
        }
      });
    },
    async infiniteHandler() {
      if (!this.columnData.loading) {
        this.loading = true;
        this.columnData.page = this.columnData.page + 1;
        await kanbanStore().addKanbanCard(
          this.columnData,
          this.columnData.page
        );
        this.loading = false;
      }
    },
    addColumnName() {
      if (this.columnData.name) {
        this.columnData.new = false;
      }
    },
  },
};
</script>

<style>
.columnCtn {
  width: 280px;
}

.dragCard {
  background: white;
  opacity: 1 !important;
  cursor: grabbing;
}

.ghostCard {
  opacity: 0.5;
  background: #f7fafc;
}

.kanbanName p {
  text-transform: lowercase;
}

.kanbanName p::first-letter {
  text-transform: uppercase;
}

.arrowKanbanName {
  clip-path: polygon(97% 0, 100% 49%, 97% 100%, 0% 100%, 0 100%, 0% 0%);
}
.arrowKanbanName .kanbanName .q-field__focusable-action {
  margin-top: -14px !important;
}
.arrowKanbanName .kanbanName .q-field--dense .q-field__control {
  height: 25px;
  border-radius: 20px !important;
}

.arrowKanbanName .kanbanName .q-field--labeled .q-field__native,
.q-field--labeled .q-field__prefix,
.q-field--labeled .q-field__suffix {
  padding: 0 !important;
}
</style>