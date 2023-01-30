<template>
  <master-modal v-model="show" :persistent="true" customPosition @hide="resetForm"
                :loading="loading" :title="modalTitle" :actions="modalActions">
    <q-form autocorrect="off" autocomplete="off" ref="formContent" @submit="submitData"
            @validation-error="$alert.error($tr('isite.cms.message.formInvalid'))">
      <!--Main-->
      <div class="box box-auto-height q-mb-md">
        <!--Category Id-->
        <dynamic-field v-model="form.categoryId" :field="formFields.category"/>
        <!--Title-->
        <dynamic-field v-model="form.name" :field="formFields.name"/>
        <!--Recipient Type-->
        <dynamic-field v-model="form.recipient" :field="formFields.recipient"
                       v-if="formFields.recipient.vIf" :key="`recipient-${changeKey}`"/>
      </div>
      <!--Run fields-->
      <dynamic-form v-model="form.run" :blocks="formFields.run" no-actions no-reset-with-blocks-update
                    class="q-mb-md" :title="this.$tr('isite.cms.label.run')"/>
      <!--Category fields-->
      <dynamic-form v-model="form.categoryFields" :blocks="formFields.categoryFields" no-actions
                    v-if="formFields.categoryFields" :title="this.$tr('isite.cms.label.setting')"/>
    </q-form>
  </master-modal>
</template>
<script>
export default {
  props: {
    funnelId: {type: String, default: () => null}
  },
  inject: {
    addCard: {
      type: Function,
      default: () => false,
    },
  },
  watch: {
    'form.categoryId'() {
      this.changeKey = this.$uid()
      this.form.recipient = null
      if (this.categorySelected) this.form.name = this.$clone(this.categorySelected.title)
    }
  },
  data() {
    return {
      show: false,
      modalTitle: '',
      loading: false,
      statusId: null,
      categories: [],
      form: {
        categoryId: null,
        name: null,
        recipient: null,
        run: {},
        categoryFields: {},
      },
      changeKey: this.$uid()
    };
  },
  computed: {
    modalActions() {
      return [
        {
          props: {label: this.$tr('isite.cms.label.save'), color: 'green'},
          action: () => this.$refs.formContent.submit()
        },
      ]
    },
    formFields() {
      const categoryFields = this.categorySelected?.formFields || {}

      return {
        category: {
          type : 'treeSelect',
          required: true,
          props: {
            disableBranchNodes: true,
            label: `${this.$tr('isite.cms.label.category')} *`,
            options: this.$array.tree(this.categories)
          }
        },
        name: {
          value: null,
          type: "input",
          required: true,
          props: {
            label: `${this.$tr('isite.cms.form.title')} *`,
            vIf: this.categorySelected ? true : false,
          }
        },
        recipient: {
          type: "select",
          required: true,
          vIf: this.categorySelected?.options?.filterFormFieldType ? true : false,
          props: {
            label: `${this.$tr('isite.cms.label.recipient')} *`
          },
          loadOptions: {
            delayed: () => {
              return new Promise(resolve => {
                this.$crud.get(
                    'apiRoutes.qrequestable.categoriesFormFields',
                    {filter: {type: this.categorySelected?.options?.filterFormFieldType}},
                    {categoryId: this.funnelId}
                ).then(response => resolve(response.data)
                ).catch(error => resolve([]))
              })
            }
          }
        },
        run: [{
          name: 'runForm',
          fields: {
            when: {
              value: null,
              type: 'select',
              required: true,
              colClass: ["inBefore", 'inAfter'].includes(this.form.run.when) ? 'col-12 col-md-6' : 'col-12',
              props: {
                label: this.$tr('isite.cms.label.when'),
                options: [
                  {label: this.$tr('isite.cms.label.currentTime'), value: 'currentTime'},
                  {label: this.$tr('isite.cms.label.exactTime'), value: 'exactTime'},
                  {label: this.$tr('isite.cms.label.inBefore'), value: 'inBefore'},
                  {label: this.$tr('isite.cms.label.inAfter'), value: 'inAfter'},
                ]
              }
            },
            type: {
              value: 'minutes',
              type: 'select',
              required: true,
              props: {
                label: this.$tr('isite.cms.form.type'),
                vIf: ["inBefore", 'inAfter'].includes(this.form.run.when),
                options: [
                  {label: this.$trp('isite.cms.label.hour'), value: 'hours'},
                  {label: this.$trp('isite.cms.label.minute'), value: 'minutes'},
                  {label: this.$trp('isite.cms.label.day'), value: 'days'}
                ]
              }
            },
            value: {
              type: 'input',
              required: true,
              props: {
                vIf: ["inBefore", 'inAfter'].includes(this.form.run.when),
                label: this.$tr('isite.cms.label.time')
              }
            },
            date: {
              value: 'created_at',
              type: 'select',
              required: true,
              props: {
                label: this.$tr('isite.cms.label.field'),
                vIf: ["inBefore", 'inAfter'].includes(this.form.run.when),
                options: [
                  {label: this.$trp('isite.cms.form.createdAt'), value: 'created_at'},
                  {label: this.$trp('isite.cms.form.updatedAt'), value: 'updated_at'}
                ]
              }
            }
          }
        }],
        categoryFields: !Object.values(categoryFields).length ? null : [{
          name: 'categoryFields',
          fields: categoryFields
        }]
      }
    },
    categorySelected() {
      return this.categories.find(category => category.id == this.form.categoryId)
    }
  },
  methods: {
    openModal(statusId, title) {
      this.statusId = statusId;
      this.modalTitle = `${this.$tr('requestable.cms.newRule')} - ${title}`
      this.show = true;
      this.getCategories()
    },
    getCategories() {
      return new Promise(resolve => {
        this.loading = true
        //Request params
        const requestParams = {
          refresh: true,
          params: {
            filter: { statusId: this.statusId, categoryId: this.$filter.values.categoryId}
          }
        }
        //Request
        this.$crud.index('apiRoutes.qrequestable.categoriesRule', requestParams).then(response => {
          this.categories = this.$clone(response.data)
          this.loading = false
        }).catch(error => this.loading = true)
      })
    },
    submitData() {
      this.loading = true
      //Instance the rule data
      var ruleData = {
        categoryRuleId: this.form.categoryId,
        name: this.form.name,
        to: this.form.recipient,
        runType: this.form.run.when,
        runConfig: null,
        statusId: this.statusId,
        ...this.form.categoryFields
      }

      //Validate the runConfig
      if (['exactTime'].includes(this.form.run.when)) {
        ruleData.runConfig = {date: 'created_at'}
      } else if (['inBefore', 'inAfter'].includes(this.form.run.when)) {
        ruleData.runConfig = {
          type: this.form.run.type,
          value: this.form.run.value,
          date: this.form.run.date
        }
      }

      //Request
      this.$crud.create('apiRoutes.qrequestable.automationRule', ruleData).then(response => {
        this.loading = false
        this.addCard(this.statusId)
        this.show = false
      }).catch(error => this.loading = false)
    },
    resetForm() {
      this.form = {
        categoryId: null,
        run: {},
        categoryFields: {},
        to: null
      }
    }
  },
};
</script>
