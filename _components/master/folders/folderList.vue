<template>
    <div>
      <q-card class="tw-shadow-none">
        <q-card-section class="list-report">
          <q-expansion-item
            v-model="folder.isCollapse"
            bordered
            expand-icon-toggle
            class="tw-shadow-lg tw-bg-white tw-rounded-xl"
          >
            <template v-slot:header>
              <q-item-section>
                <div class="row items-center "  
                    @mouseover="showCollapse"
                >
                  <q-icon name="folder" color="primary" size="2rem" />
                  <h5 class="tw-text-xl tw-ml-3 tw-font-bold">{{ folder.title }}</h5>
                </div>
              </q-item-section>

              <q-item-section side>
                <div class="row items-center">
                  <q-btn
                    flat
                    round
                    color="tw-gray-300"
                    size="sm"
                    icon="more_vert"
                  >
                    <q-menu
                      transition-show="jump-down"
                      transition-hide="jump-up"
                    >
                      <q-list class="list-report-menu">
                        <q-item clickable v-ripple>
                          <q-item-section avatar>
                            <q-icon name="edit" color="primary" />
                          </q-item-section>

                          <q-item-section>Rename 1</q-item-section>
                        </q-item>
                        <q-separator />
                        <q-item clickable v-ripple>
                          <q-item-section avatar>
                            <q-icon name="delete" color="primary" />
                          </q-item-section>

                          <q-item-section>Delete</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </div>
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
  computed: {
    dragReports() {
        return foldersStore().getDragReports();
    },
  },
  methods: {
    showCollapse() {
       if(this.dragReports) this.folder.isCollapse = true;
    },
  }
}
</script>