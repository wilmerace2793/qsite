<template>
  <div class="tw-space-y-2 tw-border tw-border-gray-200 tw-rounded-md tw-p-4">
    <q-btn
      color="primary"
      icon="fa-light fa-plus"
      @click="add"
      size="sm"
      round
      class="tw-ml-4"
    />
    <div>
      <draggable v-model="fields" :animation="200">
        <div
          v-for="(field, keyField) in fields"
          :key="keyField"
          class="row q-col-gutter-md tw-mb-5 tw-border tw-border-gray-200 tw-mx-5 tw-p-3 tw-rounded-md tw-mt-3"
        >
          <div
            v-for="key in Object.keys(field)"
            :key="key"
            :class="defaultField[key].colClass"
          >
            <dynamic-field
              v-model="fields[keyField][key]"
              :field="defaultField[key]"
            />
          </div>
          <div class="tw-w-full tw-text-right">
            <q-btn
              color="red"
              icon="fa-light fa-trash-can"
              size="sm"
              flat
              round
              @click="deleteItem(keyField)"
            />
          </div>
        </div>
      </draggable>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import multiDynamicFieldsController from "../controllers/multiDynamicFields.controller";
import draggable from "vuedraggable";

export default defineComponent({
  components: {
    draggable,
  },
  props: {
    fieldProps: {
      type: Object as any,
      default: () => {},
    },
  },
  setup(props, { emit }) {
    return { ...multiDynamicFieldsController(props, emit) };
  },
});
</script>

<style scoped>
</style>