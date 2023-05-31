<script lang="ts">
import card from "./card.vue";
import Vue, {
  defineComponent,
  computed,
  WritableComputedRef,
  inject,
} from "vue";
import store from "../../store/index";
export default defineComponent({
  components: {
    card,
  },
  setup() {
    const setForm: any = inject("setForm", false);
    const loading = computed(() => store.loadingModal);
    const fields = computed(() => store.fields);
    const actions = computed(() => [
      {
        props: {
          color: "primary",
          icon: "fa-thin fa-backward",
          label: tr.value("isite.cms.returnChanges"),
        },
        action: () => {
          setRevisionForm();
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
    function setRevisionForm() {
      Vue.prototype.$q
        .dialog({
          ok: tr.value("isite.cms.label.yes"),
          message: tr.value("isite.cms.message.returnChanges"),
          cancel: tr.value("isite.cms.label.no"),
          persistent: true,
        })
        .onOk(async () => {
          modalFieldComparison.value = false;
          store.drawerModel = false;
          if (setForm) setForm(revision.value.oldValue);
          store.reset();
        })
        .onCancel(() => {});
    }
    return {
      revision,
      fields,
      tr,
      trd,
      modalFieldComparison,
      actions,
      loading,
      setForm,
      setRevisionForm,
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
    <div class="tw-flex tw-px-8">
        <card
          class="tw-w-1/2"
          :revision="revision.oldValue"
          label="isite.cms.label.previous" 
        />
        <div 
          class="
           tw-flex 
           tw-items-center 
           tw-text-2xl 
           tw-px-4"
        >
          <i 
            class="
             fa-thin 
             fa-backward 
             hover:tw-bg-gray-200
             tw-cursor-pointer
             tw-rounded-md
             tw-p-2
             horver:tw-shadow-lg"
             @click="setRevisionForm"
          >
            <q-tooltip>
              {{ tr('isite.cms.returnChanges') }}
            </q-tooltip>
          </i>
        </div>
        <card
          class="tw-w-1/2"  
          :revision="revision.newValue"
          label="isite.cms.label.today"  
        />
    </div>
  </master-modal>
    
</div></template>
<style>
</style>