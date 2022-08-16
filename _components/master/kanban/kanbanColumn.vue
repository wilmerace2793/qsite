<template>
  <div class="columnCtn tw-relative tw-rounded-lg tw-shadow">
    <div
      class="
         tw-h-auto
      "
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
          tw-z-20"
      >
        <q-spinner
            color="primary"
            size="2em"
        />
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
          hover:tw-ease-in
          hover:tw--translate-y-1"
          v-if="hover"
          @click="addColumn"
        >
          <i 
            class="
              fas 
              fa-plus
              tw-text-gray-400
              tw-drop-shadow-lg" 
          />
      </button>
      <div 
        class="
          tw-flex 
          tw-w-full 
          tw-py-3
          tw-px-4
          tw-rounded-t-lg
          arrowKanbanName"
        :style="{background: columnData.color}"
        >
        <div class="tw-flex tw-w-full kanbanName">
          <div class="tw-w-11/12">
            <p 
              class="
                tw-mx-1 
                tw-text-xs 
                tw-whitespace-nowrap 
                tw-font-bold
                tw-m-0
                tw-truncate"
                :class="{'tw-text-white': columnData.color}"
              >
                {{ columnData.name }}
            </p>
            </div>
            <div class="tw-w-1/12" v-if="columnData.total !== 0"> 
              <p 
                class="
                  tw-font-bold 
                  tw-m-0 
                  tw-text-xs 
                  tw-text-rigth"
                  :class="{'tw-text-white': columnData.color}"
                >{{ columnData.total }}
              </p>
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
          <div 
            class="
              tw-text-center 
              tw-h-5 
              tw-px-2"
          >
            <q-banner 
              inline-actions 
              rounded 
              class="primary"
              v-if="
              columnData.total !== 0 
              && isTotalNumberOfRecords 
              && !loading 
              && !columnData.loading"
            >
                <div>
                  <i class="far fa-grin-beam-sweat tw-text-base"></i>
                </div>
                <div class="tw-font-semibold">
                  Ya te dimos todo
                </div>
            </q-banner>
          </div>
          <div
            :class="`trigger-${columnData.id}`"
            class="
              tw-text-center 
              tw-h-5  
              tw-flex
              tw-justify-center"
          >  
            <q-spinner
                v-if="loading"
                color="primary"
                size="1.3em"
              />
          </div>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import kanbanCard from '@imagina/qsite/_components/master/kanban/kanbanCard.vue';
import kanbanStore from '@imagina/qsite/_components/master/kanban/store/kanbanStore.js';

export default {
  props: {
    columnData: {
      type: Object,
      required: true,
    },
    columnIndex: {
      type: Number,
      required: true,
    }
  },
  mounted() {
    const parent = document.querySelector('#kanbanCtn');
    this.initialheight = `${window.innerHeight - parent.offsetTop - 120}px`;
    window.addEventListener('resize', () => {
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
      observerOptions,
    );
    observer.observe(target);
  },
  data() {
    return {
      initialheight: null,
      loading: false,
      hover: false,
    };
  },
  components: {
    draggable,
    kanbanCard,
  },
  computed: {
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
    }
  },
  methods: {
    addColumn() {
      kanbanStore().addColumn(this.columnIndex);
    },
    deleteColumn(columnId) {
       kanbanStore().deleteColumn(columnId);
    },
     observerCallback(entries) {
      entries.forEach(({ isIntersecting }) => {
        if (isIntersecting) {
          this.infiniteHandler();
        }
      });
    },
    async infiniteHandler() {
      if(!this.columnData.loading) {
        this.loading = true;
        this.columnData.page = this.columnData.page + 1;
        await kanbanStore().addKanbanCard(this.columnData, this.columnData.page);
        this.loading = false;
      }
    },
  }
};
</script>

<style>
.columnCtn {
  width: 350px;
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
</style>