<template>
  <div>
    <q-card class="tw-shadow-none">
      <q-card-section class="list-report">
        <q-expansion-item
          v-model="folder.isCollapse"
          bordered
          expand-icon-toggle
          class="tw-shadow-lg tw-bg-white tw-rounded-xl"
          @show="getRelation"
        >
          <template v-slot:header>
            <q-item-section avatar>
              <q-icon name="folder" color="primary" size="2rem"/>
            </q-item-section>
            <q-item-section class="folder-title-drag tw-py-5 f-cursor-grab" @mouseover="showCollapse">
              <q-item-label class="tw-text-xl tw-font-bold" lines="1">{{ folder.name || folder.id }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <div class="row items-center">
                <btn-menu
                      :actions="fieldActions(folder)"
                      :action-data="folder"
                    />
              </div>
            </q-item-section>
          </template>
          <q-list 
            separator 
            class="tw-pt-2 tw-rounded-b-xl"
            v-show="!folder.loading"
          >
             <reportList :folder="folder" />
          </q-list>
          <div
            v-show="folder.loading"
            class="
              tw-bg-gray-100
              tw-h-32
              tw-flex 
              tw-absolute
              tw-inset-0 
              tw-justify-center 
              tw-py-8
              tw-rounded-b-md"
            >
              <q-spinner color="primary" size="3em" />
          </div>
        </q-expansion-item>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import draggable from "vuedraggable"
import reportList from './reportList';
import foldersStore from "./store/foldersStore.js";
export default {
components: {
  reportList,
},
props: {
  folder: {
    type: Object,
    required: true,
  },
},
inject: [
  'getRelationData', 
  'fieldActions',
],
computed: {
  dragReports() {
    return foldersStore().getDragReports();
  },
},
methods: {
  showCollapse() {
     if(this.dragReports) {
      this.getRelation();
      this.folder.isCollapse = true;
    };
  },
  getRelation() {
    if(this.folder.reportList.length === 0) {
      this.getRelationData(this.folder);
    };
  },
}
}
</script>
<style>
.f-cursor-grab {
  cursor: grab;
}
</style>