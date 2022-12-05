<template>
  <div class="tw-overflow-y-auto">
    <draggable
      :id="folder.id"
      :list="folder.reportList"
      :animation="300"
      group="data"
      ghost-class="ghostCard"
      drag-class="dragCard"
      filter=".ignoreItem"
      :force-fallback="true"
      @start="dragReports = true"
      @end="dragReports = false"
      :style="{ height: heightDrag }"
      :move="move"
      @change="updateList"
    >
      <q-item
        clickable
        v-ripple
        class="tw-py-3 tw-border-b tw-cursor-move"
        v-for="(report, index) in uniqBy(folder.reportList)"
        :key="report.id"
      >
        <q-item-section avatar>
          <q-icon name="drag_handle" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="tw-font-bold" lines="1">{{ report.title || report.id }}</q-item-label>
          <q-item-label caption lines="1">
            {{ report.name || report.description }} 
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn flat round color="tw-gray-300" size="sm" icon="more_vert">
            <q-menu>
              <q-list class="list-report-menu">
                <q-item clickable v-ripple>
                  <q-item-section avatar>
                    <q-icon name="edit" color="primary" />
                  </q-item-section>
                  <q-item-section>Edit</q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                  <q-item-section avatar>
                    <q-icon name="file_copy" color="primary" />
                  </q-item-section>
                  <q-item-section>Duplicate</q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                  <q-item-section avatar>
                    <q-icon name="drive_file_move" color="primary" />
                  </q-item-section>
                  <q-item-section>Move</q-item-section>
                  <q-item-section side>
                    <q-icon name="arrow_right" />
                  </q-item-section>
                  <q-menu anchor="top end" self="top start">
                    <q-list class="list-report-menu">
                      <q-item v-for="n in 3" :key="n" clickable v-ripple>
                        <q-item-section avatar>
                          <q-icon name="folder_open" color="primary" />
                        </q-item-section>
                        <q-item-section>Folder {{ n }}</q-item-section>
                      </q-item>
                      <q-separator />
                      <q-item clickable v-ripple v-close-popup>
                        <q-item-section avatar>
                          <q-icon name="fa-solid fa-plus" color="primary" />
                        </q-item-section>
                        <q-item-section>New Folder</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-item>
                <q-item clickable v-ripple>
                  <q-item-section avatar>
                    <q-icon name="fa-solid fa-plus" color="primary" />
                  </q-item-section>
                  <q-item-section>Add to favourites</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-ripple v-close-popup>
                  <q-item-section avatar>
                    <q-icon name="fa-regular fa-trash-can" color="primary" />
                  </q-item-section>
                  <q-item-section>Delete</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-item-section>
      </q-item>
    </draggable>
    <div
      v-if="!dragReports && folder.reportList.length === 0"
      class="
        tw-py-8 
        tw-text-center 
        tw-text-5xl"
      >
        <div class="fa-light fa-folder-xmark"></div>
        <div class="tw-text-base tw-py-2">
         {{ $tr('isite.cms.message.searchNotFound') }}
        </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import foldersStore from './store/foldersStore.js';
import _ from "lodash";

export default {
  components: {
    draggable,
  },
  props: {
    folder: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      toFolderId: null,
    };
  },
  inject: [
    'updateRelationData',
  ],
  computed: {
    dragReports: {
      get() {
        return foldersStore().getDragReports();
      },
      set(value) {
        foldersStore().setDragReports(value);
      },
    },
    heightDrag() {
      if(this.dragReports && this.folder.reportList.length === 0) {
        return '100px';
      }
      return this.folder.reportList.length <= 5 ? 'auto' : '300px';
    },
  },
  methods: {
    async move(elm) {
      if (elm.from.id === elm.to.id) return;
      const reportList = elm.draggedContext.element;
      reportList.folderId = Number(elm.to.id);
      this.toFolderId = reportList.folderId;
      await this.updateRelationData(reportList);
    },
    uniqBy(data){
      return _.uniqBy(data, 'id');
    },
    updateList() {
      console.log(this.folder, this.toFolderId);
    }
  },
};
</script>

<style>
</style>