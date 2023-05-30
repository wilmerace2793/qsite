<script lang="ts">
import card from "./card.vue";
import Vue, { defineComponent, computed, WritableComputedRef } from "vue";
import store from "../../store/index";
export default defineComponent({
  components: {
    card,
  },
  setup() {
    const loading = computed(() => store.loadingModal);
    const fields = computed(() => store.fields);
    const actions = computed(() => [
      {
        props: {
          color: "primary",
          icon: "fa-light fa-comment",
          label: "Regresar cambio",
        },
        action: () => {
          console.log(revision.value.oldValue);
        },
      },
    ]);
    const tr = computed(() => Vue.prototype.$tr);
    const trd = computed(() => Vue.prototype.$trd);
    const revision = computed(() => {
      return store.revision;
    });
    const modalFieldComparison: WritableComputedRef<boolean> = computed({
      get: (): boolean => store.modalFieldComparison,
      set(value: boolean) {
        store.modalFieldComparison = value;
      },
    });
    return {
      revision,
      fields,
      tr,
      trd,
      modalFieldComparison,
      actions,
      loading,
    };
  },
});
</script>
<template>
    <master-modal
    v-model="modalFieldComparison"
    :persistent="true"
    width="100%"
    :actions="actions"
    :maximized="$q.screen.lt.md"
    :loading="loading"
    @hide="modalFieldComparison = false"
  >
    <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-8">
        <card :revision="revision.oldValue"/>
        <card :revision="revision.newValue"/>
    </div>
  </master-modal>
    
</div></template>
<style scoped></style>