<template>
  <master-modal v-model="modal.show" v-bind="modal.props">
    <dynamic-field v-model="field.sectionData" :field="{type : 'json'}"/>
  </master-modal>
</template>
<script>

export default {
  data() {
    return {
      crudId: this.$uid(),
      modal: {
        show: false,
        props: {
          title: 'Edit CRUD Form',
          loading: false,
          actions: [
            {
              action: this.saveCrud,
              props: {
                label: this.$tr('ui.label.save'),
                color: 'green'
              }
            }
          ]
        },
      },
      field: {
        section: 'form',
        data: null,
        sectionData: null
      }
    }
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        apiRoute: 'apiRoutes.qsite.icruds',
        permission: 'isite.organizations',
        create: false,
        read: {
          columns: [
            {name: 'id', label: this.$tr('ui.form.id'), field: 'id', align: 'left'},
            {name: 'entity', label: this.$tr('ui.label.entity'), field: 'entity', align: 'left'},
            {name: 'module', label: this.$tr('ui.label.module'), field: 'module', align: 'left'},
            {
              name: 'createdAt', label: this.$tr('ui.form.createdAt'), field: 'createdAt',
              format: val => val ? this.$trd(val) : '-',
              align: 'left', sortable: true
            },
            {
              name: 'updatedAt', label: this.$tr('ui.form.updatedAt'), field: 'updatedAt',
              format: val => val ? this.$trd(val) : '-',
              align: 'left', sortable: true
            },
            {
              name: 'actions', label: this.$tr('ui.form.actions'), align: 'center'
            },
          ],
          requestParams: {filter: {noTranslate: true}},
          actions: [
            {
              label: 'Edit Form',
              icon: 'fas fa-clipboard-list',
              action: (item) => {
                //Set field params
                this.field = {section: 'form', data: item, sectionData: item.projectCrud.form}
                //Set modal params
                this.modal.show = true
              }
            }
          ]
        },
        update: false,
        delete: false
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  },
  methods: {
    saveCrud() {
      return new Promise((resolve, reject) => {
        this.modal.props.loading = true
        //Set section data on field data
        this.field.data.projectCrud[this.field.section] = this.$clone(this.field.sectionData)

        //request
        this.$crud.update('apiRoutes.qsite.icruds', this.field.data.id, this.field.data).then(response => {
          this.$alert.info({message: this.$tr('ui.message.recordUpdated')})
          this.$root.$emit('crud.data.refresh')
          this.modal.props.loading = false
          this.modal.show = false
          resolve(response.data)
        }).catch(error => {
          this.$alert.error({message: this.$tr('ui.message.recordNoUpdated')})
          this.modal.props.loading = false
          reject(error)
        })
      })
    }
  }
}
</script>
