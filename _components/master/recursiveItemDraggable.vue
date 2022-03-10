<template>
  <div id="recurisveItemDraggable">
    <!-- draggabel container -->
    <draggable
        tag="div"
        v-bind="dragOptions"
        :list="items"
        :group="{ name: 'g1' }">
      <div
          class="drag-group"
          v-for="(item, index) in items"
          :key="item.id">
        <!-- list -->
        <div class="row justify-between items-center q-mb-xs q-mt-xs">
          <!-- name -->
          <div class="col-6 q-py-xs blue-green">
            <q-icon class="cursor-pointer q-px-sm" color="blue-grey" name="fas fa-arrows-alt"/>
            {{ item.title }}
          </div>
          <!-- menu actions -->
          <div class="col-6 text-right q-py-xs relative-position">
            <btn-menu
                v-if="item.actions.length"
                :actions="item.actions"
                :action-data="item"
            />
          </div>
        </div>
        <!-- recursive dragabble -->
        <nestedDraggable
            :class="`${item.children.length} ?: q-mb-xs`"
            :items="item.children"/>
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'nestedDraggable',
  components: {
    draggable,
  },
  props: {
    items: {
      required: true,
      type: Array,
      default: () => []
    },
    deleteApi: {
      type: String
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    },
  },
};
</script>

<style lang="stylus">
#recurisveItemDraggable
  .drag-group
    margin 5px
    cursor move
    display block
    padding 5px
    border lightgray 1px solid
    border-radius $custom-radius
</style>
