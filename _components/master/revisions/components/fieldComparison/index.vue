<script lang="ts">
import card from "./card.vue";
import Vue, {
  defineComponent,
  computed,
  WritableComputedRef,
  ref, 
  inject
} from "vue";
import store from "../../store/index";
import updateRevisions from '../../store/actions/updateRevisions'
export default defineComponent({
  components: {
    card,
  },
  setup() {
    const getData: any = inject('getData', false);
    const loading = computed(() => store.loadingModal);
    const fields = computed(() => store.fields);
    const cardList = ref([
      {
        name: 'oldValue',
        label: 'isite.cms.label.previous',
      },
      {
        name: 'newValue',
        label: 'isite.cms.label.today',
      }
    ]);
    const actions = computed(() => [
      {
        props: {
          color: "primary",
          icon: "fa-light fa-send-back",
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
          await updateRevisions(store.revision.oldValue);
          if(getData) await getData(true);
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
      setRevisionForm,
      cardList,
    };
  },
});
</script>
<template>
    <master-modal
    v-model="modalFieldComparison"
    :persistent="true"
    :title="tr('isite.cms.revisionHistory')"
    width="100%"
    :actions="actions"
    :maximized="$q.screen.lt.md"
    :loading="loading"
    @hide="modalFieldComparison = false"
    customPosition
  >
    <div 
      class="
        tw-grid 
        tw-grid-cols-1 
        md:tw-grid-cols-2 
        tw-mx-8
        tw-border tw-rounded-md"
      >
        <card
          v-for="(card, index) in cardList"
          :key="index"
          :revision="revision[card.name]"
          :label="card.label"
          :class="{'tw-border-l tw-border-gray-200': index === 1}" 
        />
    </div>
  </master-modal>
    
</div></template>
<style>
</style>