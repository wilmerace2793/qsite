<template>
  <div v-if="permisionComments.index">
    <q-card class="box tw-rounded-xl tw-h-full">
      <q-card-section>
        <q-list dense class="list-comments">
          <q-item
            class="tw-my-3"
            style="padding: 0px !important"
            v-if="permisionComments.create"
          >
            <q-item-section top avatar>
              <q-avatar size="md" color="grey-4" class="tw-ml-2">
                <img :src="dataBase.avatar" />
              </q-avatar>
            </q-item-section>
            <q-item-section
              v-if="!dataBase.active"
              class="tw-mr-4 tw-cursor-pointer"
            >
              <q-card flat bordered>
                <q-card-section
                  class="tw-py-2 tw-cursor-pointer text-grey-6"
                  v-html="textPlaceholder"
                  @click="activeText()"
                  :title="tr(`isite.cms.label.edit`)"
                />
              </q-card>
            </q-item-section>
            <q-item-section class="bg-grey-1 shadow-1 tw-p-2" v-else>
              <div v-if="!loadingComment">
                  <CKEditor
                    v-model="dataBase.text"
                    :config="editorConfig"
                />
                <div>
                  <dynamic-field 
                    :field="files" 
                    class="tw-py-2"
                  />
                </div>
                <div class="flex justify-between">
                  <div class="tw-mt-2 tw-space-x-2">
                    <q-btn
                      :loading="dataBase.loading"
                      :disable="dataBase.text == ''"
                      @click="addComment()"
                      rounded
                      size="md"
                      :label="tr(`isite.cms.label.save`)"
                      color="primary"
                      no-caps
                    />
                    <q-btn
                      flat
                      size="md"
                      @click="cancelText()"
                      padding="4px 4px"
                      icon="close"
                      color="primary"
                    />
                  </div>
                </div>
              </div>
              <div 
                v-if="loadingComment" 
                class="tw-py-8"
              >
                <q-spinner
                  color="primary"
                  size="3em"
                  :thickness="2"
                  class="tw-mx-auto"
                />
              </div>
            </q-item-section>
          </q-item>
          <q-item v-if="permisionComments.index">
            <q-item-section v-if="!loading">
              <q-timeline class="grey-4">
                <q-timeline-entry
                  v-for="(item, index, itemKey) in comments"
                  :key="itemKey"
                  :icon="item.icon ? item.icon : 'fa-regular fa-comment'"
                  :color="item.color"
                >
                  <h4 
                    class="tw-text-sm" 
                    v-if="item.userProfile"
                  >
                    <strong>
                      {{ item.userProfile.fullName }}
                    </strong>
                    <small v-if="item.updatedAt || item.createdAt">
                      {{ formatDate(item.updatedAt|| item.createdAt) }}
                      <span v-if="item.updatedAt && item.createdAt !== item.updatedAt">
                        ({{ tr(`isite.cms.label.edited`) }})</span
                      >
                    </small>
                  </h4>
                  <CKEditor
                    v-model="item.comment"
                    v-if="item.active"
                  ></CKEditor>
                  <div v-else>
                    <q-card flat bordered>
                      <q-card-section
                        class="tw-py-2 tw-cursor-pointer"
                        v-html="item.comment"
                        @click="activeEdit(item.id)"
                        :title="tr(`isite.cms.label.edit`)"
                        v-if="permisionComments.edit && !Boolean(item.internal)"
                      />
                      <q-card-section
                        class="tw-py-2"
                        v-html="item.comment"
                        v-else
                      />
                    </q-card>
                    <div class="tw-mt-2 tw-text-xs">
                      <q-btn
                        v-if="permisionComments.destroy && !Boolean(item.internal)"
                        round
                        class="tw-bg-red-500 tw-text-white"
                        icon="fa-sharp fa-regular fa-trash"
                        size="sm"
                        @click="deleteComment(item.id)"
                      />
                    </div>
                  </div>
                  <div class="flex justify-between" v-if="item.active">
                    <div class="tw-mt-2 tw-space-x-2">
                      <q-btn
                        :disable="
                          item.comment == '' || item.comment == item.textEdit
                        "
                        :loading="item.loading"
                        @click="updateComment('edit', item.id)"
                        rounded
                        size="md"
                        :label="tr(`isite.cms.label.update`)"
                        color="primary"
                        no-caps
                      />
                      <q-btn
                        flat
                        size="md"
                        @click="updateComment('cancel', item.id)"
                        padding="4px 4px"
                        icon="close"
                        color="primary"
                      >
                        <q-tooltip>{{
                          tr(`isite.cms.label.cancel`)
                        }}</q-tooltip>
                      </q-btn>
                    </div>
                  </div>
                </q-timeline-entry>
              </q-timeline>
            </q-item-section>
            <div v-if="loading" class="tw-my-10">
              <inner-loading :visible="loading"/>
            </div>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import Vue, 
{ defineComponent, computed, ref} 
from "vue";
import CKEditor from "@imagina/qsite/_components/master/ckEditor.vue";
import { 
  apiRouteDefault,
  commentableTypeDefault,
  permissionsCommentsDefault,
} from "@imagina/qsite/_components/master/comments/contracts/comments";
import useComments from './uses/useComments'
export default defineComponent({
   components: { CKEditor },
   props: {
    commentableId: {
      type: Number,
      required: true,
    },
    commentableType: {
      type: String,
      default: () => commentableTypeDefault,
    },
    apiRoute: {
      type: String,
      default: () => apiRouteDefault,
    },
    permisionComments: {
      type: String,
      default: () => permissionsCommentsDefault,
    }
  },
  setup(props) {
    return {...useComments(props)}
  },
});
</script>