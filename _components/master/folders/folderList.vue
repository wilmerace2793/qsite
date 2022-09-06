<template>
  <div>
    <q-card class="tw-shadow-none">
      <q-card-section class="list-report">
        <q-expansion-item
          v-model="folder.isCollapse"
          bordered
          expand-icon-toggle
          class="tw-shadow-lg tw-bg-white tw-rounded-xl"
          @show="getRelationData(folder)"
        >
          <template v-slot:header>
            <q-item-section>
              <div class="row items-center "  
                  @mouseover="showCollapse"
              >
                <q-icon name="folder" color="primary" size="2rem" />
                <h5 class="tw-text-xl tw-ml-3 tw-font-bold">
                  {{ folder.title || folder.id }}
                </h5>
              </div>
            </q-item-section>

            <q-item-section side>
              <btn-menu
                  :actions="fieldActions(folder)"
                  :action-data="folder"
              />
            </q-item-section>
          </template>

          <q-list separator class="tw-pt-2 tw-rounded-b-xl">
             <reportList :folder="folder" />
          </q-list>
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
inject: ['getRelationData', 'fieldActions'],
computed: {
  dragReports() {
      return foldersStore().getDragReports();
  },
},
methods: {
  showCollapse() {
     if(this.dragReports) {
      this.getRelationData(this.folder);
      this.folder.isCollapse = true;
    };
  },
}
}
</script>