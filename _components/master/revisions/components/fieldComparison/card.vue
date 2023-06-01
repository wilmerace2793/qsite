<script lang="ts">
import Vue, { defineComponent, computed } from "vue";
import store from "../../store/index";

export default defineComponent({
  props: {
    revision: {
      type: Object,
      default: {},
    },
    label: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const fields = computed(() => store.fields);
    const revision = computed(() => props.revision);
    const tr = computed(() => Vue.prototype.$tr);
    const trd = computed(() => Vue.prototype.$trd);
    const label = computed(() => props.label);
    return {
      fields,
      revision,
      tr,
      trd,
      label,
    };
  },
});
</script>
<template>
  <div class="tw-border-gray-200 tw-rounded-md">
    <div class="text-center tw-border-b tw-py-4">
      <p>
        {{ tr("isite.cms.label.date") }}:
        <span v-if="revision.createdAt">
          {{ trd(revision.createdAt) }}
        </span>
      </p>
      <p class="tw-text-xl tw-text-center">
        {{ tr(label) }}
      </p>
    </div>
    <div :class="`tw-rounded-lg`">
      <div v-for="(field, keyField, indexField) in fields">
        <dynamic-field
          :key="keyField"
          :id="keyField"
          :field="field"
          v-model="revision[keyField]"
          readOnly
          class="
           hover:tw-opacity-75 
           tw-transition-opacity 
           tw-py-2 
           tw-px-4 
           tw-cursor-pointer 
           tw-h-24"
          :class="[indexField % 2 === 0 ? 'tw-bg-gray-100' : 'tw-bg-white']"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>