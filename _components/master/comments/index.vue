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
                  :title="$tr(`isite.cms.label.edit`)"
                />
              </q-card>
            </q-item-section>
            <q-item-section class="bg-grey-1 shadow-1 tw-p-2" v-else>
              <CKEditor
                v-model="dataBase.text"
                :config="editorConfig"
              ></CKEditor>
              <div class="flex justify-between">
                <div class="tw-mt-2 tw-space-x-2">
                  <q-btn
                    :loading="dataBase.loading"
                    :disable="dataBase.text == ''"
                    @click="addComment()"
                    rounded
                    size="md"
                    :label="$tr(`isite.cms.label.save`)"
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
            </q-item-section>
          </q-item>
          <q-item v-if="permisionComments.index">
            <q-item-section v-if="!loading">
              <q-timeline class="grey-4">
                <q-timeline-entry
                  v-for="(item, index, itemKey) in comments"
                  :key="itemKey"
                  :avatar="item.userProfile.mainImage"
                >
                  <h4 class="tw-text-sm">
                    <strong>
                      {{ item.userProfile.fullName }}
                    </strong>
                    <small>
                      {{ formatDate(item.updatedAt) }}
                      <span v-if="item.createdAt !== item.updatedAt">
                        ({{ $tr(`isite.cms.label.edited`) }})</span
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
                        :title="$tr(`isite.cms.label.edit`)"
                        v-if="permisionComments.edit"
                      />
                      <q-card-section
                        class="tw-py-2"
                        v-html="item.comment"
                        v-else
                      />
                    </q-card>
                    <p class="tw-mt-2 tw-text-xs">
                      <a
                        v-if="permisionComments.destroy"
                        class="link-delete tw-cursor-pointer"
                        @click="deleteComment(item.id)"
                        >Eliminar</a
                      >
                    </p>
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
                        :label="$tr(`isite.cms.label.update`)"
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
                          $tr(`isite.cms.label.cancel`)
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
import Vue, { defineComponent, computed, ref } from "vue";
import CKEditor from "@imagina/qsite/_components/master/ckEditor.vue";
import { 
  CommentModelContract, 
  EditorConfigContract 
} from "@imagina/qsite/_components/master/comments/contracts/comments";

export default defineComponent({
   components: { CKEditor },
   props: {
    requestableId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const commentModel = ref<CommentModelContract>({
    text: "",
    textEdit: "",
    active: false,
    user: "",
    loading: false,
    avatar:
        "https://dev-gestionhc.ozonohosting.com/modules/iprofile/img/default.jpg",
    });
    const route = ref<string>("apiRoutes.qrequestable.comments");
    const tr = ref(Vue.prototype.$tr);
    const comments = ref<any>([]);
    const loading = ref<boolean>(false);
    const permisionComments = computed(() => ({
      create: Vue.prototype.$auth.hasAccess("icomments.comments.create"),
      edit: Vue.prototype.$auth.hasAccess("icomments.comments.edit"),
      index: Vue.prototype.$auth.hasAccess("icomments.comments.index"),
      destroy: Vue.prototype.$auth.hasAccess("icomments.comments.destroy"),
    }));
    const dataBase = ref<any>({ ...commentModel.value });
    const textPlaceholder = ref<string>("Escriba un comentario...");
    const editorConfig = ref<EditorConfigContract>({
        height: 100,
    });
    function formatDate(date: Date): Date {
      return date ? Vue.prototype.$moment(date).format("DD MMM YYYY, h:mm a") : null;
    };
    function activeText(): void {
      dataBase.value.active = true;
      dataBase.value.text = "";
    }
    function cancelText(): void {
      if (dataBase.value.text.length > 0) {
        Vue.prototype.$q
          .dialog({
            ok: "Si",
            message: tr.value(`requestable.cms.message.undoComment`),
            cancel: "No",
            persistent: true,
          })
          .onOk(async () => {
            dataBase.value.active = false;
            dataBase.value.text = "";
          })
          .onCancel(() => {});
      } else {
        dataBase.value.active = false;
      }
    }
    function updateComment(type: string, id: number): void {
      try {
        const comment = comments.value.find((item) => item.id === id);
        if (comment) {
          if (type == "cancel") {
            cancelComment(comment);
          }
          if (type == "edit") {
            if (comment.comment !== comment.textEdit) {
              editComment(id, comment);
            } else {
              cancelComment(comment);
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    function cancelComment(comment): void {
      if (comment.comment !== comment.textEdit) {
        Vue.prototype.$q
          .dialog({
            ok: "Si",
            message: tr.value(`requestable.cms.message.undoComment`),
            cancel: "No",
            persistent: true,
          })
          .onOk(async () => {
            comment.comment = comment.textEdit;
            comment.active = false;
          })
          .onCancel(() => {});
      } else {
        comment.active = false;
      }
    }
    function editComment(id: number, comment: any) {
      try {
        comment.loading = true;
        Vue.prototype.$crud
          .update(route.value, id, { comment: comment.comment })
          .then((response) => {
            const commentUpdate = response.data;
            comment.updatedAt = commentUpdate.updatedAt;
            comment.loading = false;
            comment.active = false;
            comment.edit = false;
            Vue.prototype.$alert.info({
              message: tr.value(`requestable.cms.message.updateComment`),
            });
          })
          .catch((error) => {
            comment.loading = false;
            console.log(error);
            Vue.prototype.$alert.error({
              message: tr.value(`requestable.cms.message.updateNoComment`),
            });
          });
      } catch (error) {
        console.log(error);
      }
    }
    function activeEdit(id: number): void {
      try {
        const comment = comments.value.find((item) => item.id === id);
        if (comment) {
          comment.textEdit = comment.comment;
          comment.active = true;
        }
      } catch (error) {
        console.log(error);
      }
    }
    async function addComment(): Promise<void> {
      try {
        dataBase.value.loading = true;
        const params = {
          commentableType: "Modules\\Requestable\\Entities\\Requestable",
          commentableId: props.requestableId,
          comment: dataBase.value.text,
        };
        await Vue.prototype.$crud.create(route.value, params);
        await getCommentsList(props.requestableId);
        dataBase.value = { ...commentModel };
        await Vue.prototype.$alert.info({
          message: tr.value(`requestable.cms.message.savedComment`),
        });
      } catch (error) {
        console.log(error);
        dataBase.value.loading = false;
        Vue.prototype.$alert.error({
          message: tr.value(`requestable.cms.message.savedNoComment`),
        });
      }
    }
    async function deleteComment(id: number): Promise<void> {
        Vue.prototype.$q
        .dialog({
          ok: tr.value("isite.cms.label.delete"),
          message: tr.value("isite.cms.message.deleteRecord"),
          cancel: true,
          persistent: true,
        })
        .onOk(async () => {
          comments.value.loading = true;
          Vue.prototype.$crud
            .delete(route.value, id)
            .then((response) => {
              comments.value = comments.value.filter(
                (item) => item.id !== id
              );
              Vue.prototype.$alert.info({
                message: tr.value("isite.cms.message.recordDeleted"),
              });
              comments.value.loading = false;
            })
            .catch((error) => {
              console.log(error);
              Vue.prototype.$alert.error({
                message: tr.value("isite.cms.message.recordNoDeleted"),
              });
            });
        })
        .onCancel(() => {});
    }
    function getCommentsList(commentableId: number): void {
      try {
        loading.value = true;
        const params = {
          filter: {
            commentableType: "Modules\\Requestable\\Entities\\Requestable",
            commentableId,
          },
          include: "userProfile",
        };
        Vue.prototype.$crud
          .get(route.value, params)
          .then((response) => {
            const data = response.data;
            comments.value = data.map((item) => ({
              ...item,
              active: false,
              loading: false,
              textEdit: "",
            }));
            loading.value = false;
          })
          .catch((error) => {
            loading.value = false;
            Vue.prototype.$alert.error({ message: "error no actualizo" });
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    }
    return {
      permisionComments,
      tr,
      dataBase,
      activeText,
      cancelText,
      updateComment,
      cancelComment,
      editComment,
      activeEdit,
      addComment,
      deleteComment,
      getCommentsList,
      textPlaceholder,
      editorConfig,
      formatDate,
      comments,
      loading,
    };
  },
});
</script>
