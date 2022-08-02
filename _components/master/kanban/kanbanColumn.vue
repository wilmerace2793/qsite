<template>
  <div class="columnCtn tw-relative tw-rounded-lg tw-shadow">
    <div
      class="
         tw-h-auto
      "
      :class="`cardItemsCtn-${columnData.id}`"
    >
      <div 
        class="
          tw-flex 
          tw-w-full 
          tw-pt-4
          tw-px-4
          tw-rounded-lg"
        :style="{background: columnData.color}"  
        >
        <div class="tw-w-full kanbanName">
            <p 
              class="
                tw-mx-1 
                tw-text-xs 
                tw-whitespace-nowrap 
                tw-font-bold"
                :class="{'tw-text-white': columnData.color}"
              >
                {{ columnData.name }}
            </p>
        </div>
        <div
            v-if="columnData.data.length === 0"
            class="
                tw-text-right 
                tw-w-1/2 
                tw-py-1 
                tw-text-red-500 
                tw-cursor-pointer 
                tw-hidden"
                @click="deleteColumn(columnData.id)"
            >
            <i class="fas fa-trash-alt"></i>
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
  },
  data() {
    return {
      initialheight: null,
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
  },
  methods: {
    deleteColumn(columnId) {
       kanbanStore().deleteColumn(columnId);
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
</style>